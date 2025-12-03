''' utils.py
@author Anish
@description This is the main file which has utility functions
@date 29/11/2025
@returns nothing
'''

# Imports
from datetime import datetime

# Constants
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# Methods
def now_mysql() -> str:
    """Return current timestamp formatted for MySQL: YYYY-MM-DD HH:MM:SS"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def allowed_file(filename: str) -> bool:
    '''Returns if the given filename is allowed or not'''
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
