import sqlite3
import os
from datetime import datetime

DB_PATH = "sahayak.db"

def init_db():
    """Initialize database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Chats table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id TEXT PRIMARY KEY,
            title TEXT,
            is_saved BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Ensure is_saved column exists for existing DBs
    try:
        cursor.execute("ALTER TABLE chats ADD COLUMN is_saved BOOLEAN DEFAULT 0")
    except sqlite3.OperationalError:
        pass

    
    # Messages table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            chat_id TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            offline BOOLEAN,
            model TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats(id)
        )
    """)

    # Settings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Lesson Plans table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS lesson_plans (
            id TEXT PRIMARY KEY,
            topic TEXT NOT NULL,
            grade_level INTEGER NOT NULL,
            number_of_classes INTEGER NOT NULL,
            minutes_per_class INTEGER NOT NULL,
            language TEXT DEFAULT 'en',
            original_plan TEXT NOT NULL,
            current_plan TEXT NOT NULL,
            model TEXT,
            offline BOOLEAN,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()


def get_connection():
    """Get database connection"""
    return sqlite3.connect(DB_PATH)

def dict_factory(cursor, row):
    """Convert database row to dict"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d