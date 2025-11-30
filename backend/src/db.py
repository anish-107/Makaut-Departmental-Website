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
    Fetch all notices ordered by newest first.
    Returns a list of dictionaries.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            sql = """
                SELECT notice_id, title, content, created_at, posted_by
                FROM notices
                ORDER BY notice_id DESC
            """
            cur.execute(sql)
            rows = cast(List[Dict[str, Any]], cur.fetchall())
            return rows

    except Exception as exc:
        print("[ERROR] get_all_notices:", exc)
        return []

    finally:
        if conn:
            conn.close()


# Add Enteries
def add_notice(
    title: str,
    content: str,
    posted_by: int,
    created_at: Optional[str] = None
) -> int:
    """
    Insert a notice into the 'notices' table.
    Returns inserted notice_id or -1 on failure.

    created_at is optional because the old API autogen’d timestamp.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:

            # created_at may be auto timestamp in DB, so insert conditionally
            if created_at:
                sql = """
                    INSERT INTO notices (title, content, posted_by, created_at)
                    VALUES (%s, %s, %s, %s)
                """
                params = (title, content, posted_by, created_at)
            else:
                sql = """
                    INSERT INTO notices (title, content, posted_by)
                    VALUES (%s, %s, %s)
                """
                params = (title, content, posted_by)

            cur.execute(sql, params)
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
def update_notice(
    notice_id: int,
    title: Optional[str],
    content: Optional[str],
    posted_by: Optional[int],
    created_at: Optional[str] = None
) -> int:
    """
    Update notice. Fields may be None -> ignored (COALESCE keeps current value).
    Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE notices
                SET 
                    title = COALESCE(%s, title),
                    content = COALESCE(%s, content),
                    posted_by = COALESCE(%s, posted_by),
                    created_at = COALESCE(%s, created_at)
                WHERE notice_id = %s
            """
            cur.execute(sql, (title, content, posted_by, created_at, notice_id))
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
    Delete a notice by ID.
    Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = "DELETE FROM notices WHERE notice_id=%s"
            cur.execute(sql, (notice_id,))
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
    """
    Fetch all events ordered by newest first.
    Returns a list of dictionaries.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            sql = """
                SELECT event_id, title, description, event_date, end_date, posted_by
                FROM events
                ORDER BY event_id DESC
            """
            cur.execute(sql)
            rows = cast(List[Dict[str, Any]], cur.fetchall())
            return rows

    except Exception as exc:
        print("[ERROR] get_all_events:", exc)
        return []

    finally:
        if conn:
            conn.close()

# Add Enteries
def add_event(title: str, description: str, event_date: str, end_date: str, posted_by: int) -> int:
    """
    Insert a new event and return its ID.
    Returns -1 on error.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                INSERT INTO events (title, description, event_date, end_date, posted_by)
                VALUES (%s, %s, %s, %s, %s)
            """
            cur.execute(sql, (title, description, event_date, end_date, posted_by))
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
def update_event(
    event_id: int,
    title: Optional[str],
    description: Optional[str],
    event_date: Optional[str],
    end_date: Optional[str],
    posted_by: Optional[int]
) -> int:
    """
    Update an event. Fields may be None (ignored via COALESCE).
    Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE events
                SET 
                    title = COALESCE(%s, title),
                    description = COALESCE(%s, description),
                    event_date = COALESCE(%s, event_date),
                    end_date = COALESCE(%s, end_date),
                    posted_by = COALESCE(%s, posted_by)
                WHERE event_id = %s
            """
            cur.execute(sql, (title, description, event_date, end_date, posted_by, event_id))
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
    """
    Delete an event by ID.
    Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = "DELETE FROM events WHERE event_id=%s"
            cur.execute(sql, (event_id,))
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
    """
    Fetch all job updates ordered by newest first.
    Returns a list of dictionaries.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            sql = """
                SELECT job_id, title, description, valid_till, posted_by
                FROM job_updates
                ORDER BY job_id DESC
            """
            cur.execute(sql)
            rows = cast(List[Dict[str, Any]], cur.fetchall())
            return rows

    except Exception as exc:
        print("[ERROR] get_all_jobs:", exc)
        return []

    finally:
        if conn:
            conn.close()


# Add Enteries
def add_job(
    title: str,
    description: str,
    valid_till: str,
    posted_by: int
) -> int:
    """
    Insert a job update into the 'job_updates' table.
    Returns inserted job_id or -1 on failure.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                INSERT INTO job_updates (title, description, valid_till, posted_by)
                VALUES (%s, %s, %s, %s)
            """
            params = (title, description, valid_till, posted_by)

            cur.execute(sql, params)
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
def update_job(
    job_id: int,
    title: Optional[str],
    description: Optional[str],
    valid_till: Optional[str],
    posted_by: Optional[int]
) -> int:
    """
    Update a job update entry.
    Fields may be None → COALESCE keeps existing values.
    Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE job_updates
                SET 
                    title = COALESCE(%s, title),
                    description = COALESCE(%s, description),
                    valid_till = COALESCE(%s, valid_till),
                    posted_by = COALESCE(%s, posted_by)
                WHERE job_id = %s
            """

            cur.execute(sql, (title, description, valid_till, posted_by, job_id))
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
    """
    Delete a job update by ID.
    Returns number of affected rows.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:

            sql = "DELETE FROM job_updates WHERE job_id=%s"
            cur.execute(sql, (job_id,))
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


# -------------------------
# Authentication : Login Register Helpers, CRUD helpers for users table
# -------------------------

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """
    Fetch a single user by email. Returns a dict or None.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            sql = "SELECT * FROM users WHERE email=%s LIMIT 1"
            cur.execute(sql, (email,))
            row = cur.fetchone()
            return cast(Optional[Dict[str, Any]], row)

    except Exception as exc:
        print("[ERROR] get_user_by_email:", exc)
        return None

    finally:
        if conn:
            conn.close()


def add_user(
    reg_no: Optional[str],
    password: str,
    name: str,
    email: str,
    role: Optional[str] = None,
    status: Optional[str] = None
) -> int:
    """
    Insert a new user into users table.
    Returns inserted user_id (lastrowid) or -1 on failure.
    NOTE: This currently stores plaintext passwords to match existing logic.
    Strongly consider hashing passwords (bcrypt) before storing.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                INSERT INTO users (reg_no, password, name, email, role, status)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            params = (reg_no, password, name, email, role, status)
            cur.execute(sql, params)
            conn.commit()
            return int(cur.lastrowid or -1)

    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_user:", exc)
        return -1

    finally:
        if conn:
            conn.close()


def verify_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Verify user credentials.
    Returns the user dict on success (password match), otherwise None.
    Keeps password-check logic plain-text to match existing behavior.
    """
    user = get_user_by_email(email)
    if not user:
        return None

    if user.get("password") == password:
        return user
    return None