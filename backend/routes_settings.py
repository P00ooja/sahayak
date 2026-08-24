from fastapi import APIRouter, HTTPException
import google.generativeai as genai
import asyncio
from database import get_connection, dict_factory
from config import GEMINI_API_KEY as DEFAULT_GEMINI_KEY

router = APIRouter(prefix="/api/settings", tags=["settings"])

def _get_setting_from_db(key: str) -> str:
    """Helper to fetch a setting value from SQLite"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM settings WHERE key = ?", (key,))
        row = cursor.fetchone()
        conn.close()
        return row[0] if row else ""
    except Exception:
        return ""

def _set_setting_in_db(key: str, value: str):
    """Helper to upsert a setting value in SQLite"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    """, (key, value))
    conn.commit()
    conn.close()

def get_effective_gemini_key() -> str:
    """Returns the custom Gemini key if set, otherwise fallback to default key"""
    custom_key = _get_setting_from_db("custom_gemini_api_key")
    if custom_key and custom_key.strip():
        return custom_key.strip()
    return DEFAULT_GEMINI_KEY

def _sync_verify_gemini_key(api_key: str) -> bool:
    """Synchronously test if a Gemini API key is valid"""
    if not api_key or not api_key.strip():
        return False
    try:
        genai.configure(api_key=api_key.strip())
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content("Ping", request_options={"timeout": 10})
        return bool(response and response.text)
    except Exception as e:
        print(f"Key verification error: {str(e)}")
        return False

@router.get("")
async def get_settings():
    """Get current settings with key status"""
    custom_key = await asyncio.to_thread(_get_setting_from_db, "custom_gemini_api_key")
    has_custom = bool(custom_key and custom_key.strip())
    
    # Mask API key for UI security
    masked_key = ""
    if has_custom:
        k = custom_key.strip()
        masked_key = k[:4] + "..." + k[-4:] if len(k) > 8 else "****"

    effective_key = get_effective_gemini_key()
    has_effective = bool(effective_key and effective_key.strip() and effective_key != "your_api_key_here")

    return {
        "has_custom_key": has_custom,
        "masked_custom_key": masked_key,
        "has_working_key": has_effective,
        "using_custom_key": has_custom
    }

@router.post("/verify-key")
async def verify_key(data: dict):
    """Verify if a given API key works"""
    api_key = data.get("api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="API key is required")

    is_valid = await asyncio.to_thread(_sync_verify_gemini_key, api_key)
    return {"valid": is_valid}

@router.post("")
async def save_settings(data: dict):
    """Save custom Gemini API key after verification"""
    api_key = data.get("custom_gemini_api_key", "").strip()

    if api_key:
        is_valid = await asyncio.to_thread(_sync_verify_gemini_key, api_key)
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid Gemini API key. Please check your key from Google AI Studio.")
        await asyncio.to_thread(_set_setting_in_db, "custom_gemini_api_key", api_key)
    else:
        # Clear custom key if empty (falls back to default key)
        await asyncio.to_thread(_set_setting_in_db, "custom_gemini_api_key", "")

    return {"status": "saved", "using_custom_key": bool(api_key)}
