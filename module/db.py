from mysql.connector import pooling
import os
from dotenv import load_dotenv
load_dotenv(override=True)
pool=pooling.MySQLConnectionPool(
    pool_name="taipeiewb",
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    port=3306,
    password=os.getenv("DB_PASSWORD"),
    database="taipeiweb"
)
