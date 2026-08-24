# Prompts for Lesson Planner

LESSON_PLAN_PROMPT_OLLAMA = """You are an experienced, expert teacher creating a structured, practical lesson plan.

TOPIC: {topic}
GRADE LEVEL: Grade {grade_level}
NUMBER OF CLASSES: {number_of_classes}
MINUTES PER CLASS: {minutes_per_class} minutes
TOTAL DURATION: {total_minutes} minutes

Generate a comprehensive, classroom-ready lesson plan divided into exactly {number_of_classes} classes.

CRITICAL INSTRUCTION:
Return ONLY a raw JSON object with NO markdown formatting, NO backticks, and NO extra conversational text.

Required JSON Structure:
{{
  "title": "Lesson Plan: {topic}",
  "grade_level": {grade_level},
  "number_of_classes": {number_of_classes},
  "minutes_per_class": {minutes_per_class},
  "classes": [
    {{
      "class_number": 1,
      "title": "Class 1: Introduction to {topic}",
      "duration_minutes": {minutes_per_class},
      "topics": ["Key Concept 1", "Key Concept 2"],
      "teaching_strategies": ["Interactive Lecture", "Visual Demonstration"],
      "activities": ["Group Discussion", "Guided Practice"],
      "assessment": "Formative Q&A & exit ticket"
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

Include clear learning objectives, engaging student activities, varied teaching strategies, and formative assessment methods for each of the {number_of_classes} classes.

CRITICAL INSTRUCTION:
Return ONLY valid JSON matching this exact structure:

{{
  "title": "Lesson Plan: {topic}",
  "grade_level": {grade_level},
  "number_of_classes": {number_of_classes},
  "minutes_per_class": {minutes_per_class},
  "classes": [
    {{
      "class_number": 1,
      "title": "Class 1: Foundational Concepts of {topic}",
      "duration_minutes": {minutes_per_class},
      "topics": ["Detailed Topic 1", "Detailed Topic 2"],
      "teaching_strategies": ["Inquiry-based learning", "Direct instruction"],
      "activities": ["Hands-on classroom activity", "Peer discussion"],
      "assessment": "Observation checklist and quick quiz"
    }}
  ]
}}
"""
