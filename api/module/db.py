from mysql.connector import pooling
import os

pool=pooling.MySQLConnectionPool(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
