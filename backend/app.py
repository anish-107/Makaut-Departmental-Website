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


# Methods
def members() -> List[str]:
    '''
    Test Function Remove Later
    '''
    members: List[str] = ["Rupam", "Antika", "Neelofer", "Anish", "Dibyasmita", "Sayan", "Deep", "Barnik"]
    return members


# Routes
@app.route('/', methods=["GET"])
def index() -> FlaskReturn:
    '''
    Test Route Remove Later
    '''
    data: Dict[str, List[str]] = {
        "members": members()
    }
    return jsonify(data)


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
    created_at: str = data.get("created_at") or now_mysql()
    posted_by: Optional[int] = data.get("posted_by")

    if not title or not content or posted_by is None:
        return jsonify({"error": "Missing required fields"}), 400

    inserted_id: int = add_notice(title, content, created_at, int(posted_by))
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
    created_at: str = data.get("created_at") or now_mysql()
    posted_by: Optional[int] = data.get("posted_by")

    if not title or not content or posted_by is None:
        return jsonify({"error": "Missing required fields"}), 400

    affected: int = update_notice(notice_id, title, content, created_at, int(posted_by))
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
    posted_by: Optional[int] = data.get("posted_by")

    if not title or not description or posted_by is None:
        return jsonify({"error": "Missing fields"}), 400

    inserted_id: int = add_event(title, description, event_date, int(posted_by))
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
    posted_by = data.get("posted_by")

    if not title or not description or posted_by is None:
        return jsonify({"error": "Missing fields"}), 400

    affected: int = update_event(event_id, title, description, event_date, int(posted_by))
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
    posted_at = data.get("posted_at") or now_mysql()
    posted_by = data.get("posted_by")

    if not title or not description or posted_by is None:
        return jsonify({"error": "Missing fields"}), 400

    inserted_id = add_job(title, description, posted_at, int(posted_by))
    return jsonify({"message": "Job added", "job_id": inserted_id}), 201


@app.put("/job/update/<int:job_id>")
def route_update_job(job_id: int) -> FlaskReturn:
    """
    Update an existing job entry.
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}

    raw_title = data.get("title")
    raw_description = data.get("description")
    raw_posted_at = data.get("posted_at")
    raw_posted_by = data.get("posted_by")

    if raw_title is None or raw_description is None or raw_posted_by is None:
        return jsonify({"error": "Missing required fields: title, description, posted_by"}), 400

    title: str = str(raw_title)
    description: str = str(raw_description)
    posted_at: str = str(raw_posted_at) if raw_posted_at else now_mysql()
    posted_by: int = int(raw_posted_by)

    affected: int = update_job(job_id, title, description, posted_at, posted_by)

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


# Run the script
if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEV_ENV)
