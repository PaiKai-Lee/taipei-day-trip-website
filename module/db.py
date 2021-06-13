from mysql.connector import pooling
import os
from dotenv import load_dotenv
load_dotenv()
pool=pooling.MySQLConnectionPool(
    host="localhost",
    user=os.getenv('DB_USER'),
    password=os.getenv("DB_PASSWORD"),
    database="taipeiweb"
)
