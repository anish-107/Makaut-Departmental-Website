'''
@author Anish
@description This is the main file to run the backend
@date 29/11/2025
@returns nothing
'''

# Imports
from __future__ import annotations
from flask import Flask, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv
from typing import Dict, Optional, Tuple, Union, List
from os import getenv

# Application
app : Flask = Flask(__name__)
CORS(app)


# Configurations
load_dotenv()
app.config["HOST"] = getenv("HOST")
app.config["PORT"] = getenv("PORT")
app.config["DEV_ENV"] = getenv("DEV_ENV")


# Variables
HOST : str = app.config.get("HOST", "127.0.0.1")
PORT : int = int(app.config.get("PORT", "8080"))
DEV_ENV: bool = app.config.get("DEV_ENV", "False").lower() == "true"



# Route return type
FlaskReturn = Union[Response, Tuple[Response, int]]


# Methods
def members() -> List[str]:
    members : List[str] = ["Rupam", "Antika", "Neelofer", "Anish", "Dibyasmita", "Sayan", "Deep", "Barnik"]
    
    return members


# Routes
@app.route('/')
def index() -> FlaskReturn:
    data : Dict[str, List[str]] = {
        "members" : members()
    }

    return jsonify(data)


# Run the script
if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEV_ENV)