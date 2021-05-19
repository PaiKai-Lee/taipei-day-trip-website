from flask import Blueprint,jsonify,request
import mysql.connector,json,os

att=Blueprint("att",__name__)

mydb = mysql.connector.connect(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
mycursor = mydb.cursor()

# 旅遊景點API
@att.route("/api/attractions")
def apiAttractions():
    page = request.args.get("page", 0)
    page = int(page)
    keyword = request.args.get("keyword", "")
    start = page*12
    mycursor.execute("SELECT * FROM attraction where name LIKE %s LIMIT %s,%s",
                     (('%'+keyword+'%'), start, 12))
    myresult = mycursor.fetchall()
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
    mycursor.execute("SELECT COUNT(*) FROM attraction")
    num = mycursor.fetchone()[0]
    if attractionId > num:
        return jsonify({"error": True, "message": "自訂錯誤訊息"}), 400

    mycursor.execute("SELECT * FROM attraction where id = %s", (attractionId,))
    myresult = mycursor.fetchall()

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