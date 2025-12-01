"""
@author Anish
@description This is the main file to run the backend (updated to use src/db.py + cookie JWT auth)
@date 01/12/2025
@returns nothing
"""

from __future__ import annotations
from typing import Dict, Optional, Tuple, Union, List, Any
from os import getenv
from datetime import timedelta, datetime
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from src.utils import now_mysql
from src.db import (
    # programs
    get_all_programs,
    add_program,
    delete_program,
    # subjects
    get_all_subjects,
    get_subjects_by_program,
    add_subject,
    delete_subject,
    # teachers
    get_all_teachers,
    add_teacher,
    update_teacher,
    delete_teacher,
    # students
    get_all_students,
    get_student_by_login,
    add_student,
    update_student,
    delete_student,
    # subject-teacher mapping
    assign_teacher_to_subject,
    get_teachers_for_subject,
    # schedules
    get_all_schedules,
    add_schedule,
    update_schedule,
    delete_schedule,
    # notices/events/jobs
    get_all_notices,
    add_notice,
    update_notice,
    delete_notice,
    get_all_events,
    add_event,
    update_event,
    delete_event,
    get_all_jobs,
    add_job,
    update_job,
    delete_job,
    # auth helpers
    get_user_by_login_id,
    verify_user,
    generate_login_id,
    # token helpers (blocklist)
    add_token_to_blocklist,
    is_token_revoked,
)

# Application
app: Flask = Flask(__name__)
CORS(app, supports_credentials=True, origins=[getenv("FRONTEND_ORIGIN", "http://localhost:3000")])

# Configurations
load_dotenv()
app.config["HOST"] = getenv("HOST", "")
app.config["PORT"] = getenv("PORT", "8080")
app.config["DEV_ENV"] = getenv("DEV_ENV", "False")

# JWT config (cookies)
app.config["JWT_SECRET_KEY"] = getenv("JWT_SECRET_KEY", "replace-this-secret")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"
app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token_cookie"
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["JWT_COOKIE_SECURE"] = False if str(app.config.get("DEV_ENV", "")).lower() in ("true", "1") else True
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=int(getenv("JWT_ACCESS_MINUTES", "15")))
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=int(getenv("JWT_REFRESH_DAYS", "7")))

jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_headers, jwt_payload) -> bool:
    """
    Called by flask_jwt_extended to check if token is revoked.
    We'll check the token's jti against DB.
    """
    jti = jwt_payload.get("jti")
    if not jti:
        return True
    return is_token_revoked(jti)


# Variables
HOST: str = app.config.get("HOST", "")
PORT: int = int(app.config.get("PORT", "8080"))
DEV_ENV: bool = str(app.config.get("DEV_ENV", "False")).lower() == "true"

# Route return type
FlaskReturn = Union[Response, Tuple[Response, int]]


# -------------------------
# Helper: derive role from login_id prefix
# -------------------------
def role_from_login(login_id: str) -> str:
    """Return 'admin'|'teacher'|'student'|'unknown' from login id prefix."""
    if not login_id or len(login_id) < 2:
        return "unknown"
    prefix = login_id[:2]
    if prefix == "65":
        return "admin"
    if prefix == "70":
        return "teacher"
    if prefix == "83":
        return "student"
    return "unknown"


# -------------------------
# AUTH: login / refresh / logout / me
# -------------------------
@app.post("/auth/login")
def route_login() -> FlaskReturn:
    """
    Login using ONLY login_id + password.
    Returns tokens as HttpOnly cookies (access + refresh). Also returns a safe user payload.
    Body: { login_id, password }
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    login_id: Optional[str] = data.get("login_id")
    password: Optional[str] = data.get("password")

    if not login_id or not password:
        return jsonify({"error": "login_id and password are required"}), 400

    user = verify_user(login_id, password)
    if not user:
        return jsonify({"error": "Invalid login_id or password"}), 401

    role = role_from_login(login_id)
    additional_claims = {"role": role}
    access_token = create_access_token(identity=login_id, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=login_id, additional_claims=additional_claims)

    resp = jsonify({
        "message": "Login successful",
        "user": {
            "login_id": login_id,
            "name": user.get("name"),
            "email": user.get("email"),
            "role": role,
        },
    })

    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@app.post("/auth/refresh")
@jwt_required(refresh=True)
def route_refresh() -> FlaskReturn:
    """
    Use the refresh token cookie to issue a new access token.
    We revoke current refresh token jti and issue new refresh (rotation).
    """
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Invalid refresh token"}), 401

    current_jwt = get_jwt()
    cur_jti = current_jwt.get("jti")
    exp_ts = current_jwt.get("exp")
    exp_dt_str = None
    if exp_ts:
        try:
            exp_dt_str = datetime.utcfromtimestamp(int(exp_ts)).strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            exp_dt_str = None
    if cur_jti:
        add_token_to_blocklist(cur_jti, exp_dt_str)

    role = role_from_login(identity)
    additional_claims = {"role": role}
    new_access = create_access_token(identity=identity, additional_claims=additional_claims)
    new_refresh = create_refresh_token(identity=identity, additional_claims=additional_claims)

    resp = jsonify({"message": "Token refreshed"})
    set_access_cookies(resp, new_access)
    set_refresh_cookies(resp, new_refresh)
    return resp, 200


@app.post("/auth/logout")
@jwt_required(refresh=True)
def route_logout() -> FlaskReturn:
    """
    Logout: revoke current refresh token and unset cookies.
    Requires refresh token cookie.
    """
    jwt_payload = get_jwt()
    jti = jwt_payload.get("jti")
    exp_ts = jwt_payload.get("exp")
    exp_dt_str = None
    if exp_ts:
        try:
            exp_dt_str = datetime.utcfromtimestamp(int(exp_ts)).strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            exp_dt_str = None
    if jti:
        add_token_to_blocklist(jti, exp_dt_str)

    resp = jsonify({"message": "Successfully logged out"})
    unset_jwt_cookies(resp)
    return resp, 200


@app.get("/auth/me")
@jwt_required()
def route_me() -> FlaskReturn:
    """
    Return current user info from access token.
    """
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Not authenticated"}), 401

    user_row = get_user_by_login_id(identity)
    if not user_row:
        return jsonify({"error": "User not found"}), 404

    safe_user = {k: v for k, v in user_row.items() if k != "password"}
    safe_user["role"] = role_from_login(identity)
    return jsonify({"user": safe_user}), 200


# -------------------------
# PROGRAM ROUTES
# -------------------------
@app.get("/programs/all")
def route_get_programs() -> FlaskReturn:
    """Return all programs."""
    rows: List[Dict[str, Any]] = get_all_programs()
    return jsonify(rows), 200


@app.post("/programs/add")
@jwt_required()
def route_add_program() -> FlaskReturn:
    """
    Add a program.
    Expects JSON: { code, name, duration, level, description? }
    Protected: admin only
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    code = data.get("code")
    name = data.get("name")
    duration = data.get("duration")
    level = data.get("level")
    description = data.get("description")

    if not code or not name or not duration or not level:
        return jsonify({"error": "Missing required fields"}), 400

    inserted_id: int = add_program(code, name, duration, level, description)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add program"}), 500

    return jsonify({"message": "Program added", "program_id": inserted_id}), 201


@app.delete("/programs/delete/<int:program_id>")
@jwt_required()
def route_delete_program(program_id: int) -> FlaskReturn:
    """Delete a program by id. Protected: admin only."""
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_program(program_id)
    if affected == 0:
        return jsonify({"message": "Program not found"}), 404
    return jsonify({"message": "Program deleted", "affected_rows": affected}), 200


# -------------------------
# SUBJECT ROUTES
# -------------------------
@app.get("/subjects/all")
def route_get_subjects() -> FlaskReturn:
    """Return all subjects."""
    rows: List[Dict[str, Any]] = get_all_subjects()
    return jsonify(rows), 200


@app.get("/subjects/by-program/<int:program_id>")
def route_get_subjects_by_program(program_id: int) -> FlaskReturn:
    """Return subjects for a specific program."""
    rows: List[Dict[str, Any]] = get_subjects_by_program(program_id)
    return jsonify(rows), 200


@app.post("/subjects/add")
@jwt_required()
def route_add_subject() -> FlaskReturn:
    """
    Add a subject.
    Expects JSON: { program_id, code, name, semester }
    Protected: admin only
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    program_id = data.get("program_id")
    code = data.get("code")
    name = data.get("name")
    semester = data.get("semester")

    if program_id is None or not code or not name or semester is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        program_id_i = int(program_id)
        semester_i = int(semester)
    except (ValueError, TypeError):
        return jsonify({"error": "program_id and semester must be integers"}), 400

    inserted_id: int = add_subject(program_id_i, code, name, semester_i)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add subject"}), 500

    return jsonify({"message": "Subject added", "subject_id": inserted_id}), 201


@app.delete("/subjects/delete/<int:subject_id>")
@jwt_required()
def route_delete_subject(subject_id: int) -> FlaskReturn:
    """Delete a subject. Protected: admin only."""
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_subject(subject_id)
    if affected == 0:
        return jsonify({"message": "Subject not found"}), 404
    return jsonify({"message": "Subject deleted", "affected_rows": affected}), 200


# -------------------------
# TEACHER ROUTES
# -------------------------
@app.get("/teachers/all")
def route_get_teachers() -> FlaskReturn:
    """Return all teachers."""
    rows: List[Dict[str, Any]] = get_all_teachers()
    return jsonify(rows), 200


@app.post("/teachers/add")
@jwt_required()
def route_add_teacher() -> FlaskReturn:
    """
    Add a teacher.
    Expects JSON: { login_id, name, email, password, subject? }
    Protected: admin only
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    login_id = data.get("login_id") or generate_login_id("70")
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    subject = data.get("subject")

    if not login_id or not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    inserted_id: int = add_teacher(login_id, name, email, password, subject)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add teacher"}), 500

    return jsonify({"message": "Teacher added", "teacher_id": inserted_id, "login_id": login_id}), 201


@app.put("/teachers/update/<int:teacher_id>")
@jwt_required()
def route_update_teacher(teacher_id: int) -> FlaskReturn:
    """
    Update teacher fields.
    Expects JSON: { name?, email?, password?, subject? }
    Protected: admin only
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    subject = data.get("subject")

    affected: int = update_teacher(teacher_id, name, email, password, subject)
    return jsonify({"message": "Teacher updated", "affected_rows": affected}), 200


@app.delete("/teachers/delete/<int:teacher_id>")
@jwt_required()
def route_delete_teacher(teacher_id: int) -> FlaskReturn:
    """Delete a teacher. Protected: admin only."""
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_teacher(teacher_id)
    if affected == 0:
        return jsonify({"message": "Teacher not found"}), 404
    return jsonify({"message": "Teacher deleted", "affected_rows": affected}), 200


# -------------------------
# STUDENT ROUTES
# -------------------------
@app.get("/students/all")
def route_get_students() -> FlaskReturn:
    """Return all students."""
    rows: List[Dict[str, Any]] = get_all_students()
    return jsonify(rows), 200


@app.post("/students/add")
@jwt_required()
def route_add_student() -> FlaskReturn:
    """
    Add a student.
    Expects JSON: { login_id?, name, email, password, roll_no?, semester?, program_id? }
    Protected: admin only (or adapt if self-registration allowed)
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    login_id = data.get("login_id") or generate_login_id("83")
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    roll_no = data.get("roll_no")
    semester = data.get("semester")
    program_id = data.get("program_id")

    if not login_id or not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        semester_i = int(semester) if semester is not None else None
        program_id_i = int(program_id) if program_id is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "semester and program_id must be integers"}), 400

    inserted_id: int = add_student(login_id, name, email, password, roll_no, semester_i, program_id_i)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add student"}), 500

    return jsonify({"message": "Student added", "student_id": inserted_id, "login_id": login_id}), 201


@app.put("/students/update/<int:student_id>")
@jwt_required()
def route_update_student(student_id: int) -> FlaskReturn:
    """
    Update a student.
    Expects JSON: { name?, email?, password?, roll_no?, semester?, program_id? }
    Protected: admin only OR student themself (here admin only for simplicity)
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    roll_no = data.get("roll_no")
    semester = data.get("semester")
    program_id = data.get("program_id")

    try:
        semester_i = int(semester) if semester is not None else None
        program_id_i = int(program_id) if program_id is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "semester and program_id must be integers"}), 400

    affected: int = update_student(student_id, name, email, password, roll_no, semester_i, program_id_i)
    return jsonify({"message": "Student updated", "affected_rows": affected}), 200


@app.delete("/students/delete/<int:student_id>")
@jwt_required()
def route_delete_student(student_id: int) -> FlaskReturn:
    """Delete a student. Protected: admin only."""
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_student(student_id)
    if affected == 0:
        return jsonify({"message": "Student not found"}), 404
    return jsonify({"message": "Student deleted", "affected_rows": affected}), 200


# -------------------------
# SUBJECT TEACHER MAPPING
# -------------------------
@app.post("/subject/assign-teacher")
@jwt_required()
def route_assign_teacher_to_subject() -> FlaskReturn:
    """
    Assign a teacher to a subject.
    Expects JSON: { teacher_id, subject_id }
    Protected: admin only
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    teacher_id = data.get("teacher_id")
    subject_id = data.get("subject_id")

    if teacher_id is None or subject_id is None:
        return jsonify({"error": "Missing teacher_id or subject_id"}), 400

    try:
        t_id = int(teacher_id)
        s_id = int(subject_id)
    except (ValueError, TypeError):
        return jsonify({"error": "teacher_id and subject_id must be integers"}), 400

    inserted_id: int = assign_teacher_to_subject(t_id, s_id)
    if inserted_id == -1:
        return jsonify({"error": "Failed to assign teacher"}), 500

    return jsonify({"message": "Teacher assigned", "id": inserted_id}), 201


@app.get("/subject/teachers/<int:subject_id>")
def route_get_teachers_for_subject(subject_id: int) -> FlaskReturn:
    """Get teachers assigned to a subject."""
    rows: List[Dict[str, Any]] = get_teachers_for_subject(subject_id)
    return jsonify(rows), 200


# -------------------------
# SCHEDULE ROUTES
# -------------------------
@app.get("/schedules/all")
def route_get_schedules() -> FlaskReturn:
    """Return all schedules (public)."""
    rows: List[Dict[str, Any]] = get_all_schedules()
    return jsonify(rows), 200


@app.post("/schedule/add")
@jwt_required()
def route_add_schedule() -> FlaskReturn:
    """
    Add schedule entry.
    Expects JSON: { subject_id, teacher_id?, title?, location?, start_time, end_time }
    Protected: teacher/admin
    """
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    subject_id = data.get("subject_id")
    teacher_id = data.get("teacher_id")
    title = data.get("title")
    location = data.get("location")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    if subject_id is None or not start_time or not end_time:
        return jsonify({"error": "Missing required fields (subject_id, start_time, end_time)"}), 400

    try:
        subject_id_i = int(subject_id)
        teacher_id_i = int(teacher_id) if teacher_id is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "subject_id and teacher_id must be integers"}), 400

    inserted_id: int = add_schedule(subject_id_i, teacher_id_i, title or "", location or "", start_time, end_time)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add schedule"}), 500

    return jsonify({"message": "Schedule added", "schedule_id": inserted_id}), 201


@app.put("/schedule/update/<int:schedule_id>")
@jwt_required()
def route_update_schedule(schedule_id: int) -> FlaskReturn:
    """
    Update schedule entry.
    Expects JSON: { subject_id?, teacher_id?, title?, location?, start_time?, end_time? }
    Protected: teacher/admin
    """
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    subject_id = data.get("subject_id")
    teacher_id = data.get("teacher_id")
    title = data.get("title")
    location = data.get("location")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    try:
        subject_id_i = int(subject_id) if subject_id is not None else None
        teacher_id_i = int(teacher_id) if teacher_id is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "subject_id and teacher_id must be integers"}), 400

    affected: int = update_schedule(schedule_id, subject_id_i, teacher_id_i, title, location, start_time, end_time)
    return jsonify({"message": "Schedule updated", "affected_rows": affected}), 200


@app.delete("/schedule/delete/<int:schedule_id>")
@jwt_required()
def route_delete_schedule(schedule_id: int) -> FlaskReturn:
    """Delete a schedule entry. Protected: admin only."""
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_schedule(schedule_id)
    if affected == 0:
        return jsonify({"message": "Schedule not found"}), 404
    return jsonify({"message": "Schedule deleted", "affected_rows": affected}), 200


# -------------------------
# NOTICES / EVENTS / JOB ROUTES
# -------------------------
@app.post("/notice/add")
@jwt_required()
def route_add_notice() -> FlaskReturn:
    """
    Add notice protected: teacher/admin.
    Body: { title, content, posted_by? (optional), created_at? }
    """
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    title = data.get("title")
    content = data.get("content")
    posted_by = data.get("posted_by") or get_jwt_identity()
    created_at = data.get("created_at") or now_mysql()

    if not title or not content or not posted_by:
        return jsonify({"error": "Missing required fields"}), 400

    inserted_id: int = add_notice(title, content, posted_by, created_at)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add notice"}), 500

    return jsonify({"message": "Notice added", "notice_id": inserted_id}), 201


@app.get("/notice/all")
def route_get_notices() -> FlaskReturn:
    """Get all notices (public)."""
    rows: List[Dict[str, Any]] = get_all_notices()
    return jsonify(rows), 200


@app.put("/notice/update/<int:notice_id>")
@jwt_required()
def route_update_notice(notice_id: int) -> FlaskReturn:
    """
    Update notice protected: teacher/admin.
    Body: { title?, content?, posted_by?, created_at? }
    """
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    title = data.get("title")
    content = data.get("content")
    posted_by = data.get("posted_by") or get_jwt_identity()
    created_at = data.get("created_at") or now_mysql()

    affected: int = update_notice(notice_id, title, content, posted_by, created_at)
    return jsonify({"message": "Notice updated", "affected_rows": affected}), 200


@app.delete("/notice/delete/<int:notice_id>")
@jwt_required()
def route_delete_notice(notice_id: int) -> FlaskReturn:
    """Delete notice protected: teacher/admin."""
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_notice(notice_id)
    if affected == 0:
        return jsonify({"message": "Notice not found"}), 404
    return jsonify({"message": "Notice deleted", "affected_rows": affected}), 200


# events
@app.post("/event/add")
@jwt_required()
def route_add_event() -> FlaskReturn:
    """
    Add event protected: teacher/admin.
    Body: { title, content, last_date?, posted_by? }
    """
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    title = data.get("title")
    content = data.get("content")
    last_date = data.get("last_date") or now_mysql()
    posted_by = data.get("posted_by") or get_jwt_identity()

    if not title or not content or not posted_by:
        return jsonify({"error": "Missing fields"}), 400

    inserted_id: int = add_event(title, content, last_date, posted_by)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add event"}), 500

    return jsonify({"message": "Event added", "event_id": inserted_id}), 201


@app.get("/event/all")
def route_get_events() -> FlaskReturn:
    rows: List[Dict[str, Any]] = get_all_events()
    return jsonify(rows), 200


@app.put("/event/update/<int:event_id>")
@jwt_required()
def route_update_event(event_id: int) -> FlaskReturn:
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    title = data.get("title")
    content = data.get("content")
    last_date = data.get("last_date") or now_mysql()
    posted_by = data.get("posted_by") or get_jwt_identity()

    affected: int = update_event(event_id, title, content, last_date, posted_by)
    return jsonify({"message": "Event updated", "affected_rows": affected}), 200


@app.delete("/event/delete/<int:event_id>")
@jwt_required()
def route_delete_event(event_id: int) -> FlaskReturn:
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_event(event_id)
    if affected == 0:
        return jsonify({"message": "Event not found"}), 404
    return jsonify({"message": "Event deleted", "affected_rows": affected}), 200


# jobs
@app.post("/job/add")
@jwt_required()
def route_add_job() -> FlaskReturn:
    """
    Add job protected: teacher/admin.
    Body: { title, description, company, apply_link?, posted_by? }
    """
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description")
    company = data.get("company")
    apply_link = str(data.get("apply_link") or "")
    posted_by = data.get("posted_by") or get_jwt_identity()

    if not title or not description or not company or not posted_by:
        return jsonify({"error": "Missing fields"}), 400

    inserted_id: int = add_job(title, description, company, apply_link, posted_by)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add job"}), 500

    return jsonify({"message": "Job added", "job_id": inserted_id}), 201


@app.get("/job/all")
def route_get_jobs() -> FlaskReturn:
    rows: List[Dict[str, Any]] = get_all_jobs()
    return jsonify(rows), 200


@app.put("/job/update/<int:job_id>")
@jwt_required()
def route_update_job(job_id: int) -> FlaskReturn:
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    data: Dict[str, Any] = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description")
    company = data.get("company")
    apply_link = str(data.get("apply_link") or "")
    posted_by = data.get("posted_by") or get_jwt_identity()

    affected: int = update_job(job_id, title, description, company, apply_link, posted_by)
    return jsonify({"message": "Job updated", "affected_rows": affected}), 200


@app.delete("/job/delete/<int:job_id>")
@jwt_required()
def route_delete_job(job_id: int) -> FlaskReturn:
    claims = get_jwt()
    if claims.get("role") not in ("admin", "teacher"):
        return jsonify({"error": "Forbidden"}), 403

    affected = delete_job(job_id)
    if affected == 0:
        return jsonify({"message": "Job not found"}), 404
    return jsonify({"message": "Job deleted", "affected_rows": affected}), 200


# -------------------------
# AUTH: Register helpers (optional convenience routes)
# -------------------------
@app.post("/auth/register/student")
@jwt_required()
def route_register_student() -> FlaskReturn:
    """
    Admin-only endpoint to register student and auto-generate login_id.
    Body: { name, email, password, roll_no?, semester?, program_id? }
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json(silent=True) or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    roll_no = data.get("roll_no")
    semester = data.get("semester")
    program_id = data.get("program_id")

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        semester_i = int(semester) if semester is not None else None
        program_id_i = int(program_id) if program_id is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "semester and program_id must be integers"}), 400

    login_id = generate_login_id("83")
    if not login_id:
        return jsonify({"error": "Failed to generate login id"}), 500

    inserted_id: int = add_student(login_id, name, email, password, roll_no, semester_i, program_id_i)
    if inserted_id == -1:
        return jsonify({"error": "Failed to register student"}), 500

    return jsonify({"message": "Student registered", "student_id": inserted_id, "login_id": login_id}), 201


@app.post("/auth/register/teacher")
@jwt_required()
def route_register_teacher() -> FlaskReturn:
    """
    Admin-only endpoint to register teacher and auto-generate login_id.
    Body: { name, email, password, subject? }
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json(silent=True) or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    subject = data.get("subject")

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    login_id = generate_login_id("70")
    if not login_id:
        return jsonify({"error": "Failed to generate login id"}), 500

    inserted_id: int = add_teacher(login_id, name, email, password, subject)
    if inserted_id == -1:
        return jsonify({"error": "Failed to register teacher"}), 500

    return jsonify({"message": "Teacher registered", "teacher_id": inserted_id, "login_id": login_id}), 201


# Run the script
if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEV_ENV)
