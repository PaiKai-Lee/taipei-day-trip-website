from mysql.connector import pooling
import os
import module.verify as vr
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

class User:
    def getUser(user):
        try:
            connect_pool=pool.get_connection()
            mycursor=connect_pool.cursor()
            mycursor.execute(
                    "SELECT user_id,name,email FROM users where email = %s", (user,))
            res = mycursor.fetchone()
            connect_pool.close()
            return res
        except Exception as e:
            connect_pool.close()
            print(f"取得資料錯誤: {e}")
            return 
    def login(user_email):
        try:
            connect_pool=pool.get_connection()
            mycursor=connect_pool.cursor()
            mycursor.execute(
                "SELECT email,password,salt FROM users where email= %s", (user_email,))
            res = mycursor.fetchone()
            connect_pool.close()
            return res
        except Exception as e:
            connect_pool.close()
            print(f"取得資料錯誤: {e}")
            return 
    def setUser(user, user_email, user_password):
        try:
            connect_pool=pool.get_connection()
            mycursor=connect_pool.cursor()
            mycursor.execute(
                "SELECT email FROM users where email = %s", (user_email,))
            DBuser = mycursor.fetchone()
            if DBuser != None:
                return False
            q=vr.setPassword(user_password)
            password=q["password"]
            salt=q["salt"]
            sql = ("INSERT INTO users(name,email,password,salt) VALUES (%s,%s,%s,%s)")
            val = (user, user_email, password,salt)
            mycursor.execute(sql, val)
            connect_pool.commit()
            connect_pool.close()
            print(f'{user}註冊成功')
            return True
        except Exception as e:
            connect_pool.close()
            print(f"儲存資料錯誤: {e}")
            return 

class Attraction:
    def getAtts(keyword,start):
        try:
            connect_pool=pool.get_connection()
            mycursor = connect_pool.cursor()
            mycursor.execute("SELECT * FROM attraction where name LIKE %s LIMIT %s,%s",
                        (('%'+keyword+'%'), start, 12))
            res = mycursor.fetchall()
            connect_pool.close()
            return res
        except Exception as e:
            connect_pool.close()
            print(f"取得資料錯誤: {e}")
            return 

    def getOneAtt(attractionId):
        try:
            connect_pool=pool.get_connection()
            mycursor = connect_pool.cursor()
            mycursor.execute("SELECT COUNT(*) FROM attraction")
            num = mycursor.fetchone()[0]
            if attractionId > num:
                return False
            mycursor.execute("SELECT * FROM attraction where id = %s", (attractionId,))
            res = mycursor.fetchall()
            connect_pool.close()
            return res
        except Exception as e:
            connect_pool.close()
            print(f"取得資料錯誤: {e}")
            return 

class Order:
    def setPo(email,poNumber,price,prime,attraction_id,po_date,po_time,phone):
        try:
            connect_pool=pool.get_connection()
            mycursor = connect_pool.cursor()
            mycursor.execute("SELECT user_id from users where email=%s",(email,))
            user_id=mycursor.fetchone()[0]
            sql = ("INSERT INTO bookinginfo(po,price,prime,attraction_id,date,time,user_id,phone) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
            val = (poNumber,price,prime,attraction_id,po_date,po_time,user_id,phone)
            mycursor.execute(sql, val)
            connect_pool.commit()
            connect_pool.close()
        except Exception as e:
            connect_pool.close()
            print(f"儲存資料錯誤: {e}")
            return 