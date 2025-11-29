'''
@author Anish
@description This is the main file which has utility functions
@date 29/11/2025
@returns nothing
'''

from datetime import datetime

def now_mysql() -> str:
    """Return current timestamp formatted for MySQL: YYYY-MM-DD HH:MM:SS"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")