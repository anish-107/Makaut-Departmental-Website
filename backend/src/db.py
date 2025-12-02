"""
@author Anish
@description Database helpers for the college system (programs/subjects/people/schedules)
@date 01/12/2025
@returns nothing
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, cast
from os import getenv
from dotenv import load_dotenv
from datetime import datetime 
import pymysql
import pymysql.cursors

load_dotenv()

DB_HOST: str = getenv("DB_HOST", "127.0.0.1")
DB_PORT: int = int(getenv("DB_PORT", "3306"))
DB_NAME: str = getenv("DB_NAME", "college_db")
DB_USER: str = getenv("DB_USER", "root")
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
# ID generator (login_id)
# -------------------------
def generate_login_id(prefix: str) -> Optional[str]:
    """
    Generate a new login id using id_counter table.
    prefix must be '65' (admin), '70' (teacher), or '83' (student).
    Returns the new login_id string (prefix + zero-padded number) or None on error.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            # Lock the row for this prefix
            cur.execute("SELECT last_no FROM id_counter WHERE prefix=%s FOR UPDATE", (prefix,))
            row = cast(Optional[Dict[str, Any]], cur.fetchone())

            if row is None:
                # Row missing — create it and re-select
                cur.execute("INSERT INTO id_counter (prefix, last_no) VALUES (%s, 0)", (prefix,))
                # re-query the row (still under the transaction)
                cur.execute("SELECT last_no FROM id_counter WHERE prefix=%s FOR UPDATE", (prefix,))
                row = cast(Optional[Dict[str, Any]], cur.fetchone())

            # Defensive: ensure we have a numeric last_no
            last_no_val: Optional[Any] = None
            if row is not None:
                # row may be a dict-like result; use .get to avoid KeyError
                last_no_val = row.get("last_no") if isinstance(row, dict) else None

            if last_no_val is None:
                last_no = 0
            else:
                try:
                    last_no = int(last_no_val)
                except (ValueError, TypeError):
                    last_no = 0

            next_no = last_no + 1

            cur.execute("UPDATE id_counter SET last_no=%s WHERE prefix=%s", (next_no, prefix))
            conn.commit()

            login_id = f"{prefix}{str(next_no).zfill(6)}"
            return login_id

    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] generate_login_id:", exc)
        return None

    finally:
        if conn:
            conn.close()



# ============================================================
# PROGRAMS (formerly courses)
# ============================================================

def get_all_programs() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT program_id, code, name, duration, level, description FROM programs ORDER BY program_id DESC")
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_all_programs:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def add_program(code: str, name: str, duration: str, level: str, description: Optional[str]) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO programs (code, name, duration, level, description) VALUES (%s, %s, %s, %s, %s)",
                (code, name, duration, level, description),
            )
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_program:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


def delete_program(program_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM programs WHERE program_id=%s", (program_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_program:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ============================================================
# SUBJECTS
# ============================================================

def get_all_subjects() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT subject_id, program_id, code, name, semester FROM subjects ORDER BY subject_id DESC")
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_all_subjects:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def get_subjects_by_program(program_id: int) -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT subject_id, program_id, code, name, semester FROM subjects WHERE program_id=%s ORDER BY semester, subject_id",
                (program_id,),
            )
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_subjects_by_program:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def add_subject(program_id: int, code: str, name: str, semester: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO subjects (program_id, code, name, semester) VALUES (%s, %s, %s, %s)",
                (program_id, code, name, semester),
            )
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_subject:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


def delete_subject(subject_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM subjects WHERE subject_id=%s", (subject_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_subject:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ============================================================
# ADMINS
# ============================================================

def get_admin_by_login(login_id: str) -> Optional[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT admin_id, login_id, name, email, password FROM admins WHERE login_id=%s LIMIT 1", (login_id,))
            return cast(Optional[Dict[str, Any]], cur.fetchone())
        
    except Exception as exc:
        print("[ERROR] get_admin_by_login:", exc)
        return None
    
    finally:
        if conn:
            conn.close()


def add_admin(login_id: str, name: str, email: str, password: str) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("INSERT INTO admins (login_id, name, email, password) VALUES (%s, %s, %s, %s)", (login_id, name, email, password))
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_admin:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


# ============================================================
# TEACHERS
# ============================================================

def get_all_teachers() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT teacher_id, login_id, name, email, subject FROM teachers ORDER BY teacher_id DESC")
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_all_teachers:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def get_teacher_by_login(login_id: str) -> Optional[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT teacher_id, login_id, name, email, subject FROM teachers WHERE login_id=%s LIMIT 1", (login_id,))
            return cast(Optional[Dict[str, Any]], cur.fetchone())
        
    except Exception as exc:
        print("[ERROR] get_teacher_by_login:", exc)
        return None
    
    finally:
        if conn:
            conn.close()


def add_teacher(login_id: str, name: str, email: str, password: str, subject: Optional[str]) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO teachers (login_id, name, email, password, subject) VALUES (%s, %s, %s, %s, %s)",
                (login_id, name, email, password, subject),
            )
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_teacher:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


def update_teacher(teacher_id: int, name: Optional[str], email: Optional[str], password: Optional[str], subject: Optional[str]) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE teachers
                SET name = COALESCE(%s, name),
                    email = COALESCE(%s, email),
                    password = COALESCE(%s, password),
                    subject = COALESCE(%s, subject)
                WHERE teacher_id=%s
            """
            cur.execute(sql, (name, email, password, subject, teacher_id))
            conn.commit()
            return cur.rowcount
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_teacher:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


def delete_teacher(teacher_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM teachers WHERE teacher_id=%s", (teacher_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_teacher:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ============================================================
# STUDENTS
# ============================================================

def get_all_students() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT student_id, login_id, name, email, roll_no, semester, program_id FROM students ORDER BY student_id DESC")
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_all_students:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def get_student_by_login(login_id: str) -> Optional[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT student_id, login_id, name, email, roll_no, semester, program_id FROM students WHERE login_id=%s LIMIT 1", (login_id,))
            return cast(Optional[Dict[str, Any]], cur.fetchone())
        
    except Exception as exc:
        print("[ERROR] get_student_by_login:", exc)
        return None
    
    finally:
        if conn:
            conn.close()


def add_student(login_id: str, name: str, email: str, password: str, roll_no: Optional[str], semester: Optional[int], program_id: Optional[int]) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO students (login_id, name, email, password, roll_no, semester, program_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (login_id, name, email, password, roll_no, semester, program_id),
            )
            conn.commit()
            return int(cur.lastrowid or -1)
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_student:", exc)
        return -1
    
    finally:
        if conn:
            conn.close()


def update_student(
    student_id: int,
    name: Optional[str],
    email: Optional[str],
    password: Optional[str],
    roll_no: Optional[str],
    semester: Optional[int],
    program_id: Optional[int],
) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE students
                SET name = COALESCE(%s, name),
                    email = COALESCE(%s, email),
                    password = COALESCE(%s, password),
                    roll_no = COALESCE(%s, roll_no),
                    semester = COALESCE(%s, semester),
                    program_id = COALESCE(%s, program_id)
                WHERE student_id=%s
            """
            cur.execute(sql, (name, email, password, roll_no, semester, program_id, student_id))
            conn.commit()
            return cur.rowcount
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_student:", exc)
        return 0
    finally:
        if conn:
            conn.close()



def delete_student(student_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM students WHERE student_id=%s", (student_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_student:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ============================================================
# SUBJECT - TEACHER MAPPING
# ============================================================

# -------------------------
# SUBJECT TEACHER MAPPING
# -------------------------

def assign_teacher_to_subject(teacher_id: int, subject_id: int) -> int:
    """
    Insert mapping (teacher_id, subject_id).
    If already exists, it won't create a duplicate.
    Returns new id or existing id.
    """
    sql = """
        INSERT INTO subject_teachers (teacher_id, subject_id)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE
            teacher_id = VALUES(teacher_id),
            subject_id = VALUES(subject_id)
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (teacher_id, subject_id))
            conn.commit()
            return int(cur.lastrowid or 0)
    except Exception as e:
        print("[ERROR] assign_teacher_to_subject:", e)
        conn.rollback()
        return -1
    finally:
        conn.close()


def get_teachers_for_subject(subject_id: int) -> List[Dict[str, Any]]:
    sql = """
        SELECT st.id,
               t.teacher_id, t.login_id, t.name, t.email, t.subject,
               s.subject_id, s.code AS subject_code, s.name AS subject_name
        FROM subject_teachers st
        JOIN teachers t ON t.teacher_id = st.teacher_id
        JOIN subjects s ON s.subject_id = st.subject_id
        WHERE st.subject_id = %s
    """
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute(sql, (subject_id,))
            return list(cur.fetchall())
    finally:
        conn.close()



# ============================================================
# SCHEDULES
# ============================================================

def add_schedule(
    program_id: int,
    semester: int,
    image_url: str,
    title: Optional[str],
    uploaded_by: str,
) -> int:
    sql = """
        INSERT INTO schedules
          (program_id, semester, image_url, title, uploaded_by)
        VALUES (%s, %s, %s, %s, %s)
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (program_id, semester, image_url, title, uploaded_by))
            conn.commit()
            return int(cur.lastrowid)
    except Exception as e:
        print("[ERROR] add_schedule:", e)
        conn.rollback()
        return -1
    finally:
        conn.close()


def get_schedules_by_program_sem(program_id: int, semester: int) -> List[Dict[str, Any]]:
    sql = """
        SELECT s.schedule_id, s.program_id, s.semester, s.image_url,
               s.title, s.uploaded_by, s.created_at,
               p.code AS program_code, p.name AS program_name
        FROM schedules s
        JOIN programs p ON p.program_id = s.program_id
        WHERE s.program_id = %s AND s.semester = %s
        ORDER BY s.created_at DESC
    """
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute(sql, (program_id, semester))
            return list(cur.fetchall())
    finally:
        conn.close()


def get_all_schedules() -> List[Dict[str, Any]]:
    sql = """
        SELECT s.schedule_id, s.program_id, s.semester, s.image_url,
               s.title, s.uploaded_by, s.created_at,
               p.code AS program_code, p.name AS program_name
        FROM schedules s
        JOIN programs p ON p.program_id = s.program_id
        ORDER BY s.created_at DESC
    """
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute(sql)
            return list(cur.fetchall())
    finally:
        conn.close()


def delete_schedule(schedule_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM schedules WHERE schedule_id=%s", (schedule_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_schedule:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ======================
# NOTICES
# ======================

def get_all_notices() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT notice_id, title, content, created_at, posted_by FROM notices ORDER BY notice_id DESC")
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_all_notices:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def add_notice(title: str, content: str, posted_by: str, created_at: Optional[str] = None) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            if created_at:
                cur.execute("INSERT INTO notices (title, content, created_at, posted_by) VALUES (%s, %s, %s, %s)", (title, content, created_at, posted_by))
            else:
                cur.execute("INSERT INTO notices (title, content, posted_by) VALUES (%s, %s, %s)", (title, content, posted_by))
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


def update_notice(notice_id: int, title: Optional[str], content: Optional[str], posted_by: Optional[str], created_at: Optional[str] = None) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE notices
                SET title = COALESCE(%s, title),
                    content = COALESCE(%s, content),
                    posted_by = COALESCE(%s, posted_by),
                    created_at = COALESCE(%s, created_at)
                WHERE notice_id=%s
            """
            cur.execute(sql, (title, content, posted_by, created_at, notice_id))
            conn.commit()
            return cur.rowcount
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_notice:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


def delete_notice(notice_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM notices WHERE notice_id=%s", (notice_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_notice:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ======================
# EVENTS
# ======================

def get_all_events() -> List[Dict[str, Any]]:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT event_id, title, content, last_date, posted_by, created_at FROM events ORDER BY event_id DESC")
            return cast(List[Dict[str, Any]], cur.fetchall())
        
    except Exception as exc:
        print("[ERROR] get_all_events:", exc)
        return []
    
    finally:
        if conn:
            conn.close()


def add_event(title: str, content: str, last_date: str, posted_by: str) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("INSERT INTO events (title, content, last_date, posted_by) VALUES (%s, %s, %s, %s)", (title, content, last_date, posted_by))
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


def update_event(event_id: int, title: Optional[str], content: Optional[str], last_date: Optional[str], posted_by: Optional[str]) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            sql = """
                UPDATE events
                SET title = COALESCE(%s, title),
                    content = COALESCE(%s, content),
                    last_date = COALESCE(%s, last_date),
                    posted_by = COALESCE(%s, posted_by)
                WHERE event_id=%s
            """
            cur.execute(sql, (title, content, last_date, posted_by, event_id))
            conn.commit()
            return cur.rowcount
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] update_event:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


def delete_event(event_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM events WHERE event_id=%s", (event_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_event:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ======================
# JOBS
# ======================

# -------------------------
# JOBS
# -------------------------

def get_all_jobs() -> List[Dict[str, Any]]:
    sql = """
        SELECT job_id, title, description, company, apply_link,
               last_date, posted_by, created_at
        FROM job_updates
        ORDER BY created_at DESC
    """
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute(sql)
            rows = cur.fetchall()
            return list(rows)
    finally:
        conn.close()


def add_job(
    title: str,
    description: str,
    company: str,
    apply_link: str,
    last_date: Optional[str],
    posted_by: str,
) -> int:
    """
    last_date should be 'YYYY-MM-DD' string or None.
    """
    sql = """
        INSERT INTO job_updates
          (title, description, company, apply_link, last_date, posted_by)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (title, description, company, apply_link, last_date, posted_by))
            conn.commit()
            return int(cur.lastrowid)
    except Exception as e:
        print("[ERROR] add_job:", e)
        conn.rollback()
        return -1
    finally:
        conn.close()


def update_job(
    job_id: int,
    title: Optional[str],
    description: Optional[str],
    company: Optional[str],
    apply_link: Optional[str],
    last_date: Optional[str],
    posted_by: Optional[str],
) -> int:
    """
    Update fields if provided. last_date: 'YYYY-MM-DD' or None (keeps existing if None)
    """
    # build dynamic SQL so we don't overwrite with NULL unless we want to
    fields = []
    params: List[Any] = []

    if title is not None:
        fields.append("title = %s")
        params.append(title)
    if description is not None:
        fields.append("description = %s")
        params.append(description)
    if company is not None:
        fields.append("company = %s")
        params.append(company)
    if apply_link is not None:
        fields.append("apply_link = %s")
        params.append(apply_link)
    if last_date is not None:
        fields.append("last_date = %s")
        params.append(last_date)
    if posted_by is not None:
        fields.append("posted_by = %s")
        params.append(posted_by)

    if not fields:
        return 0

    sql = f"""
        UPDATE job_updates
        SET {", ".join(fields)}
        WHERE job_id = %s
    """
    params.append(job_id)

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            conn.commit()
            return int(cur.rowcount)
    except Exception as e:
        print("[ERROR] update_job:", e)
        conn.rollback()
        return -1
    finally:
        conn.close()



def delete_job(job_id: int) -> int:
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM job_updates WHERE job_id=%s", (job_id,))
            affected = cur.rowcount
            conn.commit()
            return affected
        
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] delete_job:", exc)
        return 0
    
    finally:
        if conn:
            conn.close()


# ============================================================
# AUTH (login_id only)
# ============================================================

def get_user_by_login_id(login_id: str) -> Optional[Dict[str, Any]]:
    """
    Return the user row for login. Checks admins, teachers, students in that order.
    """
    prefix = login_id[:2]
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            if prefix == "65":
                cur.execute("SELECT admin_id, login_id, name, email, password FROM admins WHERE login_id=%s LIMIT 1", (login_id,))
                return cast(Optional[Dict[str, Any]], cur.fetchone())
            elif prefix == "70":
                cur.execute("SELECT teacher_id, login_id, name, email, password, subject FROM teachers WHERE login_id=%s LIMIT 1", (login_id,))
                return cast(Optional[Dict[str, Any]], cur.fetchone())
            elif prefix == "83":
                cur.execute("SELECT student_id, login_id, name, email, password, roll_no, semester, program_id FROM students WHERE login_id=%s LIMIT 1", (login_id,))
                return cast(Optional[Dict[str, Any]], cur.fetchone())
            else:
                return None
            
    except Exception as exc:
        print("[ERROR] get_user_by_login_id:", exc)
        return None
    
    finally:
        if conn:
            conn.close()


def verify_user(login_id: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Verify a login_id and password. Returns full row dict if OK, else None.
    Passwords are plain-text in this simple setup (replace with bcrypt in production).
    """
    user = get_user_by_login_id(login_id)
    if not user:
        return None
    if user.get("password") == password:
        return user
    return None


def add_token_to_blocklist(jti: str, expires_at: Optional[str] = None) -> bool:
    """
    Insert a refresh token jti into blocklist.
    expires_at: optional datetime string (MySQL DATETIME) when token naturally expires.
    Returns True on success.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO token_blocklist (jti, expires_at) VALUES (%s, %s)",
                (jti, expires_at),
            )
            conn.commit()
            return True
    except Exception as exc:
        if conn:
            conn.rollback()
        print("[ERROR] add_token_to_blocklist:", exc)
        return False
    finally:
        if conn:
            conn.close()


def is_token_revoked(jti: str) -> bool:
    """
    Check if a token jti is in the blocklist.
    Returns True if revoked.
    """
    conn: Optional[pymysql.connections.Connection] = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM token_blocklist WHERE jti=%s LIMIT 1", (jti,))
            row = cur.fetchone()
            return row is not None
    except Exception as exc:
        print("[ERROR] is_token_revoked:", exc)
        # safer to treat token as revoked on DB error
        return True
    finally:
        if conn:
            conn.close()