from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
import json
from database import get_connection, dict_factory
from ai_router import is_internet_available
from lesson_planner_ai import generate_lesson_plan_ai

router = APIRouter(prefix="/api/lesson-planner", tags=["lesson-planner"])

def prune_old_lesson_plans(conn, max_unsaved: int = 15):
    """Prune unsaved lesson plans beyond the 15 most recent"""
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id FROM lesson_plans 
            WHERE is_saved = 0 OR is_saved IS NULL
            ORDER BY updated_at DESC
            LIMIT -1 OFFSET ?
        """, (max_unsaved,))
        old_plans = cursor.fetchall()
        
        for row in old_plans:
            old_id = row[0] if isinstance(row, tuple) else row.get("id")
            cursor.execute("DELETE FROM lesson_plans WHERE id = ?", (old_id,))
        conn.commit()
    except Exception as e:
        print(f"Error pruning lesson plans: {e}")

@router.post("/generate")
async def generate_lesson_plan(data: dict):
    """Generate a new lesson plan using Gemini or Ollama"""
    try:
        topic = data.get("topic", "").strip()
        grade_level = int(data.get("grade_level", 5))
        number_of_classes = int(data.get("number_of_classes", 5))
        minutes_per_class = int(data.get("minutes_per_class", 45))
        language = data.get("language", "en")
        
        if not topic:
            raise HTTPException(status_code=400, detail="Topic is required")

        import asyncio
        from ai_router import is_internet_available
        net_status = await asyncio.to_thread(is_internet_available)

        ai_res = await generate_lesson_plan_ai(topic, grade_level, number_of_classes, minutes_per_class, net_status)
        lesson_plan = ai_res["lesson_plan"]
        model_used = ai_res["model"]
        offline_mode = ai_res["offline"]
        
        lesson_plan_id = str(uuid.uuid4())
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO lesson_plans 
               (id, topic, grade_level, number_of_classes, minutes_per_class, 
                language, original_plan, current_plan, model, offline, is_saved)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)""",
            (lesson_plan_id, topic, grade_level, number_of_classes, minutes_per_class,
             language, json.dumps(lesson_plan), json.dumps(lesson_plan), 
             model_used, offline_mode)
        )
        prune_old_lesson_plans(conn, max_unsaved=15)
        conn.commit()
        conn.close()
        
        return {
            "lesson_plan_id": lesson_plan_id,
            "topic": topic,
            "grade_level": grade_level,
            "number_of_classes": number_of_classes,
            "minutes_per_class": minutes_per_class,
            "lesson_plan": lesson_plan,
            "model": model_used,
            "offline": offline_mode,
            "is_saved": False,
            "created_at": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_lesson_plan_history():
    """Get all saved lesson plans ordered by pinned first, then updated time"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, topic, grade_level, number_of_classes, minutes_per_class, model, offline, is_saved, created_at, updated_at FROM lesson_plans ORDER BY is_saved DESC, updated_at DESC"
        )
        plans = cursor.fetchall()
        conn.close()
        return {"lesson_plans": plans}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{lesson_plan_id}/toggle-save")
async def toggle_save_lesson_plan(lesson_plan_id: str):
    """Toggle saved/pinned status of a lesson plan"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute("SELECT is_saved FROM lesson_plans WHERE id = ?", (lesson_plan_id,))
        plan = cursor.fetchone()
        if not plan:
            raise HTTPException(status_code=404, detail="Lesson plan not found")
        
        current_saved = plan[0] if isinstance(plan, tuple) else plan.get("is_saved", 0)
        new_saved = 0 if current_saved else 1
        
        cursor.execute("UPDATE lesson_plans SET is_saved = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_saved, lesson_plan_id))
        conn.commit()
        conn.close()
        
        return {"lesson_plan_id": lesson_plan_id, "is_saved": bool(new_saved)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{lesson_plan_id}")
async def get_lesson_plan(lesson_plan_id: str):
    """Get a specific lesson plan by ID"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lesson_plans WHERE id = ?", (lesson_plan_id,))
        plan = cursor.fetchone()
        conn.close()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Lesson plan not found")
            
        plan["original_plan"] = json.loads(plan["original_plan"])
        plan["current_plan"] = json.loads(plan["current_plan"])
        plan["is_saved"] = bool(plan.get("is_saved", 0))
        return plan
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{lesson_plan_id}")
async def update_lesson_plan(lesson_plan_id: str, data: dict):
    """Update a specific class within a lesson plan"""
    try:
        class_number = int(data.get("class_number"))
        updated_content = data.get("updated_content")
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT current_plan FROM lesson_plans WHERE id = ?", (lesson_plan_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Lesson plan not found")
            
        current_plan = json.loads(row[0])
        for cls in current_plan.get("classes", []):
            if cls.get("class_number") == class_number:
                cls.update(updated_content)
                break
                
        cursor.execute(
            "UPDATE lesson_plans SET current_plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (json.dumps(current_plan), lesson_plan_id)
        )
        conn.commit()
        conn.close()
        
        return {"status": "updated", "lesson_plan_id": lesson_plan_id, "current_plan": current_plan}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{lesson_plan_id}")
async def delete_lesson_plan(lesson_plan_id: str):
    """Delete a lesson plan"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM lesson_plans WHERE id = ?", (lesson_plan_id,))
        conn.commit()
        conn.close()
        return {"status": "deleted", "lesson_plan_id": lesson_plan_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

