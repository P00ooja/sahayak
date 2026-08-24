# Prompts for Lesson Planner

LESSON_PLAN_PROMPT_OLLAMA = """You are an experienced, expert teacher creating a structured, highly specific lesson plan.

TOPIC: {topic}
GRADE LEVEL: Grade {grade_level}
NUMBER OF CLASSES: {number_of_classes}
MINUTES PER CLASS: {minutes_per_class} minutes
TOTAL DURATION: {total_minutes} minutes

Generate a comprehensive, classroom-ready lesson plan divided into exactly {number_of_classes} classes.

CRITICAL RULES:
1. Provide ACTUAL, SPECIFIC topic descriptions, concepts, and names for "{topic}". 
2. NEVER use generic placeholders like "Key Concept 1", "Key Concept 2", "Topic 1", or "Overview".
3. Write realistic classroom activities and teaching strategies tailored directly to Grade {grade_level} students learning "{topic}".
4. Return ONLY a raw JSON object with NO markdown formatting, NO backticks, and NO extra conversational text.

Required JSON Structure:
{{
  "title": "Lesson Plan: {topic}",
  "grade_level": {grade_level},
  "number_of_classes": {number_of_classes},
  "minutes_per_class": {minutes_per_class},
  "classes": [
    {{
      "class_number": 1,
      "title": "Class 1: Introduction & Core Principles",
      "duration_minutes": {minutes_per_class},
      "topics": ["Specific Concept Name A", "Specific Concept Name B"],
      "teaching_strategies": ["Interactive Lecture", "Visual Demonstration"],
      "activities": ["Classroom Experiment / Exercise", "Guided Problem Solving"],
      "assessment": "Formative Q&A & Exit Ticket"
    }}
  ]
}}
"""

LESSON_PLAN_PROMPT_GEMINI = """You are an expert curriculum designer and master educator creating a detailed, pedagogically rich lesson plan.

TOPIC: {topic}
GRADE LEVEL: Grade {grade_level}
NUMBER OF CLASSES: {number_of_classes}
MINUTES PER CLASS: {minutes_per_class} minutes
TOTAL TIME: {total_minutes} minutes

CRITICAL RULES:
1. Provide actual, specific curriculum concepts and topic descriptions for "{topic}". Do NOT use generic placeholders like "Key Concept 1".
2. Include clear learning objectives, engaging student activities, varied teaching strategies, and formative assessment methods for each of the {number_of_classes} classes.
3. Return ONLY valid JSON matching this exact structure:

{{
  "title": "Lesson Plan: {topic}",
  "grade_level": {grade_level},
  "number_of_classes": {number_of_classes},
  "minutes_per_class": {minutes_per_class},
  "classes": [
    {{
      "class_number": 1,
      "title": "Class 1: Foundational Concepts",
      "duration_minutes": {minutes_per_class},
      "topics": ["Specific Concept Name 1", "Specific Concept Name 2"],
      "teaching_strategies": ["Inquiry-based learning", "Direct instruction"],
      "activities": ["Hands-on classroom activity", "Peer discussion"],
      "assessment": "Observation checklist and quick quiz"
    }}
  ]
}}
"""
