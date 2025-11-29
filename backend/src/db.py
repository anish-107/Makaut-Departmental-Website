'''
@author Anish
@description This is the main file to connect and interact with db
@date 29/11/2025
@returns nothing
'''

from __future__ import annotations
from typing import Any, Dict, List, Optional, Tuple, Union, cast
from os import getenv
from dotenv import load_dotenv
import pymysql

load_dotenv()

DB_HOST: str = getenv("DB_HOST", "127.0.0.1")
DB_PORT: int = int(getenv("DB_PORT", "3306"))
DB_NAME: str = getenv("DB_NAME", "")
DB_USER: str = getenv("DB_USER", "")
DB_PASSWORD: str = getenv("DB_PASSWORD", "")


# -------------------------
# Connection helper
# -------------------------
def get_connection() -> pymysql.connections.Connection:
    """
    Return a new pymysql Connection using DictCursor so fetches produce dicts.
    Caller is responsible for closing the connection.
    """
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,  
    )


# -------------------------
# Notices : CRUD helpers for 'notices' table (table name: notices)
# -------------------------

# Get all enteries
def get_all_notices() -> List[Dict[str, Any]]:
    """
    Simple wrapper used by your current app.py: SELECT * FROM notices;
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM notices ORDER BY notice_id DESC;")
            raw_rows = cur.fetchall() 
            rows : List[Dict[str, Any]] = cast(List[Dict[str, Any]], raw_rows)
            return rows
        
    except Exception as exc:
        print("[ERROR] fetch_all_notices:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


# Add Enteries
def add_notice(title: str, content: str, created_at: str, posted_by: int) -> int:
    """
    Insert a notice into 'notices' table.
    Returns the inserted notice_id (lastrowid) or -1 on failure.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = "INSERT INTO notices (title, content, created_at, posted_by) VALUES (%s, %s, %s, %s)"
            cur.execute(sql, (title, content, created_at, posted_by))
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_notice:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


# Update Enteries
def update_notice(notice_id: int, title: str, content: str, created_at: str, posted_by: int) -> int:
    """
    Update a notice. Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE notices
                SET title=%s, content=%s, created_at=%s, posted_by=%s
                WHERE notice_id=%s
            """
            cur.execute(sql, (title, content, created_at, posted_by, notice_id))
            affected = cur.rowcount
            conn.commit()
            return int(affected)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_notice:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# Delete Enteries
def delete_notice(notice_id: int) -> int:
    """
    Delete a notice. Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM notice WHERE notice_id=%s", (notice_id,))
            affected = cur.rowcount
            conn.commit()
            return int(affected)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_notice:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# -------------------------
# Events : CRUD helpers for 'events' table (table name: events)
# -------------------------

# Get Enteries
def get_all_events() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM event ORDER BY event_id DESC")
            raw_rows = cur.fetchall() 
            rows : List[Dict[str, Any]] = cast(List[Dict[str, Any]], raw_rows)
            return rows
        
    except Exception as exc:
        print("[ERROR] get_all_events:", exc)
        return []
    
    finally:
        if conn:
            conn.close()

# Add Enteries
def add_event(title: str, description: str, event_date: str, posted_by: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = "INSERT INTO events (title, description, event_date, posted_by) VALUES (%s, %s, %s, %s, %s)"
            cur.execute(sql, (title, description, event_date, posted_by))
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_event:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


# Update Enteries
def update_event(event_id: int, title: str, description: str, event_date: str, posted_by: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE events
                SET title=%s, description=%s, event_date=%s, posted_by=%s
                WHERE event_id=%s
            """
            cur.execute(sql, (title, description, event_date, posted_by, event_id))
            affected = cur.rowcount
            conn.commit()
            return int(affected)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_event:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# Delete Enteries
def delete_event(event_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM events WHERE event_id=%s", (event_id,))
            affected = cur.rowcount
            conn.commit()
            return int(affected)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_event:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# -------------------------
# Jobs : CRUD helpers for 'job_updates' table (table name: job_updates)
# -------------------------

# Get Enteries
def get_all_jobs() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM job_updates ORDER BY job_id DESC")
            raw_rows = cur.fetchall() 
            rows : List[Dict[str, Any]] = cast(List[Dict[str, Any]], raw_rows)
            return rows
        
    except Exception as exc:
        print("[ERROR] get_all_jobs:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


# Add Enteries
def add_job(title: str, description: str, posted_at: str, posted_by: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = "INSERT INTO job_updates (title, description, posted_at, posted_by) VALUES (%s, %s, %s, %s)"
            cur.execute(sql, (title, description, posted_at, posted_by))
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_job:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


# Update Enteries
def update_job(job_id: int, title: str, description: str, posted_at: str, posted_by: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE job_updates
                SET title=%s, description=%s, posted_at=%s, posted_by=%s
                WHERE job_id=%s
            """
            cur.execute(sql, (title, description, posted_at, posted_by, job_id))
            affected = cur.rowcount
            conn.commit()
            return int(affected)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_job:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()

# Delete Enteries
def delete_job(job_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM job WHERE job_id=%s", (job_id,))
            affected = cur.rowcount
            conn.commit()
            return int(affected)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_job:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()

