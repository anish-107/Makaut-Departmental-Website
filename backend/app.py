'''
@author Anish
@description This is the main file to run the backend (updated to use src/db.py)
@date 29/11/2025
@returns nothing
'''

from __future__ import annotations
from typing import Dict, Optional, Tuple, Union, List, Any
from os import getenv
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
from src.utils import now_mysql
from src.db import (
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
    get_user_by_email,
    add_user,
    verify_user,
)


# Application
app: Flask = Flask(__name__)
CORS(app)


# Configurations
load_dotenv()
app.config["HOST"] = getenv("HOST")
app.config["PORT"] = getenv("PORT")
app.config["DEV_ENV"] = getenv("DEV_ENV")


# Variables
HOST: str = app.config.get("HOST", "")
PORT: int = int(app.config.get("PORT", "8080"))
DEV_ENV: bool = app.config.get("DEV_ENV", "False").lower() == "true"


# Route return type
FlaskReturn = Union[Response, Tuple[Response, int]]


# -------------------------
# NOTICE ROUTES
# -------------------------

@app.post("/notice/add")
def route_add_notice() -> FlaskReturn:
    """
    Add a new notice to the database.
    Expects JSON: { title, content, posted_by, created_at? }
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    title: Optional[str] = data.get("title")
    content: Optional[str] = data.get("content")
    created_at: Optional[str] = data.get("created_at") or now_mysql()
    posted_by_raw = data.get("posted_by")

    if not title or not content or posted_by_raw is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        posted_by: int = int(posted_by_raw)
    except (ValueError, TypeError):
        return jsonify({"error": "posted_by must be an integer"}), 400

    # add_notice signature: add_notice(title, content, posted_by, created_at=None)
    inserted_id: int = add_notice(title, content, posted_by, created_at)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add notice"}), 500

    return jsonify({"message": "Notice added", "notice_id": inserted_id}), 201


@app.put("/notice/update/<int:notice_id>")
def route_update_notice(notice_id: int) -> FlaskReturn:
    """
    Update an existing notice.
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    title: Optional[str] = data.get("title")
    content: Optional[str] = data.get("content")
    created_at: Optional[str] = data.get("created_at") or now_mysql()
    posted_by_raw = data.get("posted_by")

    if not title or not content or posted_by_raw is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        posted_by: int = int(posted_by_raw)
    except (ValueError, TypeError):
        return jsonify({"error": "posted_by must be an integer"}), 400

    # update_notice signature: update_notice(notice_id, title, content, posted_by, created_at=None)
    affected: int = update_notice(notice_id, title, content, posted_by, created_at)
    return jsonify({"message": "Notice updated", "affected_rows": affected})


@app.delete("/notice/delete/<int:notice_id>")
def route_delete_notice(notice_id: int) -> FlaskReturn:
    """
    Delete a notice by ID.
    """
    affected: int = delete_notice(notice_id)
    if affected == 0:
        return jsonify({"message": "Notice not found"}), 404

    return jsonify({"message": "Notice deleted", "affected_rows": affected})


@app.get("/notice/all")
def route_get_notices() -> FlaskReturn:
    """
    Get all notices sorted by newest first.
    """
    rows: List[Dict[str, Any]] = get_all_notices()
    return jsonify(rows), 200


# -------------------------
# EVENT ROUTES
# -------------------------

@app.post("/event/add")
def route_add_event() -> FlaskReturn:
    """
    Add a new event.
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    title: Optional[str] = data.get("title")
    description: Optional[str] = data.get("description")
    event_date: str = data.get("event_date") or now_mysql()
    end_date: str = data.get("end_date") or event_date
    posted_by_raw = data.get("posted_by")

    if not title or not description or posted_by_raw is None:
        return jsonify({"error": "Missing fields"}), 400

    try:
        posted_by: int = int(posted_by_raw)
    except (ValueError, TypeError):
        return jsonify({"error": "posted_by must be an integer"}), 400

    # add_event signature: add_event(title, description, event_date, end_date, posted_by)
    inserted_id: int = add_event(title, description, event_date, end_date, posted_by)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add event"}), 500

    return jsonify({"message": "Event added", "event_id": inserted_id}), 201


@app.put("/event/update/<int:event_id>")
def route_update_event(event_id: int) -> FlaskReturn:
    """
    Update an event entry.
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    title = data.get("title")
    description = data.get("description")
    event_date = data.get("event_date") or now_mysql()
    end_date = data.get("end_date") or event_date
    posted_by_raw = data.get("posted_by")

    if not title or not description or posted_by_raw is None:
        return jsonify({"error": "Missing fields"}), 400

    try:
        posted_by: int = int(posted_by_raw)
    except (ValueError, TypeError):
        return jsonify({"error": "posted_by must be an integer"}), 400

    # update_event signature:
    # update_event(event_id, title, description, event_date, end_date, posted_by)
    affected: int = update_event(event_id, title, description, event_date, end_date, posted_by)
    return jsonify({"message": "Event updated", "affected_rows": affected})


@app.delete("/event/delete/<int:event_id>")
def route_delete_event(event_id: int) -> FlaskReturn:
    """
    Delete an event.
    """
    affected: int = delete_event(event_id)
    if affected == 0:
        return jsonify({"message": "Event not found"}), 404

    return jsonify({"message": "Event deleted", "affected_rows": affected})


@app.get("/event/all")
def route_get_events() -> FlaskReturn:
    """
    Return all events.
    """
    rows: List[Dict[str, Any]] = get_all_events()
    return jsonify(rows), 200


# -------------------------
# JOB ROUTES
# -------------------------

@app.post("/job/add")
def route_add_job() -> FlaskReturn:
    """
    Add a new job posting.
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    title = data.get("title")
    description = data.get("description")
    # db.add_job expects `valid_till` as third parameter
    valid_till: str = data.get("valid_till") or now_mysql()
    posted_by_raw = data.get("posted_by")

    if not title or not description or posted_by_raw is None:
        return jsonify({"error": "Missing fields"}), 400

    try:
        posted_by: int = int(posted_by_raw)
    except (ValueError, TypeError):
        return jsonify({"error": "posted_by must be an integer"}), 400

    # add_job(title, description, valid_till, posted_by)
    inserted_id = add_job(title, description, valid_till, posted_by)
    if inserted_id == -1:
        return jsonify({"error": "Failed to add job"}), 500

    return jsonify({"message": "Job added", "job_id": inserted_id}), 201


@app.put("/job/update/<int:job_id>")
def route_update_job(job_id: int) -> FlaskReturn:
    """
    Update an existing job entry.
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    raw_title = data.get("title")
    raw_description = data.get("description")
    raw_valid_till = data.get("valid_till")
    raw_posted_by = data.get("posted_by")

    if raw_title is None or raw_description is None or raw_posted_by is None:
        return jsonify({"error": "Missing required fields: title, description, posted_by"}), 400

    title: str = str(raw_title)
    description: str = str(raw_description)
    valid_till: str = str(raw_valid_till) if raw_valid_till else now_mysql()
    try:
        posted_by: int = int(raw_posted_by)
    except (ValueError, TypeError):
        return jsonify({"error": "posted_by must be an integer"}), 400

    # update_job(job_id, title, description, valid_till, posted_by)
    affected: int = update_job(job_id, title, description, valid_till, posted_by)

    return jsonify({"message": "Job updated", "affected_rows": affected})


@app.delete("/job/delete/<int:job_id>")
def route_delete_job(job_id: int) -> FlaskReturn:
    """
    Delete a job by ID.
    """
    affected = delete_job(job_id)
    if affected == 0:
        return jsonify({"message": "Job not found"}), 404

    return jsonify({"message": "Job deleted", "affected_rows": affected})


@app.get("/job/all")
def route_get_jobs() -> FlaskReturn:
    """
    Get all job updates.
    """
    rows = get_all_jobs()
    return jsonify(rows), 200

# -------------------------
# AUTH ROUTES
# -------------------------

@app.post("/auth/register")
def route_register() -> FlaskReturn:
    """
    Register a new user.
    Expects JSON: { reg_no?, name, email, password, role?, status? }
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    reg_no: Optional[str] = data.get("reg_no")
    name: Optional[str] = data.get("name")
    email: Optional[str] = data.get("email")
    password: Optional[str] = data.get("password")
    role: Optional[str] = data.get("role")
    status: Optional[str] = data.get("status")

    # Required fields
    if not name or not email or not password:
        return jsonify({"error": "All fields (name, email, password) are required"}), 400

    # Check existing user
    existing = get_user_by_email(email)
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    # Insert new user
    inserted_id: int = add_user(reg_no, password, name, email, role, status)
    if inserted_id == -1:
        return jsonify({"error": "Failed to register user"}), 500

    return jsonify({"message": "Registration successful", "user_id": inserted_id}), 201


@app.post("/auth/login")
def route_login() -> FlaskReturn:
    """
    Login endpoint.
    Expects JSON: { email, password }
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    email: Optional[str] = data.get("email")
    password: Optional[str] = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = verify_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Build safe returned user payload (avoid sending password)
    safe_user: Dict[str, Any] = {
        "user_id": user.get("user_id"),
        "reg_no": user.get("reg_no"),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "status": user.get("status"),
    }

    return jsonify({"message": "Login successful", "user": safe_user}), 200


# Run the script
if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEV_ENV)
