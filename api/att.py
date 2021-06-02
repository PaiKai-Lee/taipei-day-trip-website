from flask import Blueprint,jsonify,request
import mysql.connector,json,os
from mysql.connector import connect, pooling

att=Blueprint("att",__name__)

DBpool=pooling.MySQLConnectionPool(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
# 旅遊景點API
@att.route("/api/attractions")
def apiAttractions():
    connect_pool=DBpool.get_connection()
    mycursor = connect_pool.cursor()
    page = request.args.get("page", 0)
    page = int(page)
    keyword = request.args.get("keyword", "")
    start = page*12
    mycursor.execute("SELECT * FROM attraction where name LIKE %s LIMIT %s,%s",
                     (('%'+keyword+'%'), start, 12))
    myresult = mycursor.fetchall()
    connect_pool.close()
    if len(myresult) == 0:
        return jsonify({"error": True, "message": "自訂錯誤訊息"}), 500
    data = []
    for information in myresult:
        data.append({
            "id": information[0],
            "name": information[1],
            "category": information[2],
            "description": information[3],
            "address": information[4],
            "transport": information[5],
            "mrt": information[6],
            "latitude": information[7],
            "longitude": information[8],
            "images": json.loads(information[9])
        })
    print("內容數量: "+str(len(myresult)))
    if len(myresult)/12 == 1:
        nextPage = page+1
    else:
        nextPage = None
    final = {
        "nextPage": nextPage,
        "data": data
    }
    return jsonify(final)


@att.route("/api/attraction/<int:attractionId>")
def apiAttraction(attractionId):
    connect_pool=DBpool.get_connection()
    mycursor = connect_pool.cursor()
    mycursor.execute("SELECT COUNT(*) FROM attraction")
    num = mycursor.fetchone()[0]
    if attractionId > num:
        return jsonify({"error": True, "message": "自訂錯誤訊息"}), 400

    mycursor.execute("SELECT * FROM attraction where id = %s", (attractionId,))
    myresult = mycursor.fetchall()
    connect_pool.close()
    if len(myresult) == 0:
        return jsonify({"error": True, "message": "自訂錯誤訊息"}), 500
    for information in myresult:
        data = {
            "id": information[0],
            "name": information[1],
            "category": information[2],
            "description": information[3],
            "address": information[4],
            "transport": information[5],
            "mrt": information[6],
            "latitude": information[7],
            "longitude": information[8],
            "images": json.loads(information[9])
        }
    return jsonify({"data": data})