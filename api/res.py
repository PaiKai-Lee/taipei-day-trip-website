import re
import mysql.connector,os
from flask import Blueprint, json,request,session,jsonify

res=Blueprint("res",__name__)

mydb = mysql.connector.connect(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
mycursor = mydb.cursor()

@res.route("/api/booking",methods=["GET","POST","DELETE"])
def book():
    if request.method=="GET":
        if "user" not in session:
            return jsonify({"error":True,"message":"未登入系統"}),403
        if "booking_data" not in session:
            return jsonify({"data":None})
        return jsonify({"data":session["booking_data"]})
    if request.method=="POST":
        id=request.get_json()["attractionId"]
        booking_date=request.get_json()["date"]
        time_period=request.get_json()["time"]
        price=request.get_json()["price"]
        mycursor.execute("SELECT name,address,images FROM attraction where id = %s", (id,))
        myresult = mycursor.fetchone()
        if "user" not in session:
            return jsonify({"error":True,"message":"未登入系統"}),403
        if myresult == None:
            return jsonify({"error":True,"message":"無景點資料"}),400
        booking_data={
            "attractionId":{
                "id":id,
                "name":myresult[0],
                "address":myresult[1],
                "image":json.loads(myresult[2])[0],
            },
            "date":booking_date,
            "time":time_period,
            "price":price
        }
        session["booking_data"]=booking_data
        return jsonify({"ok":True})
 

    if request.method=="DELETE":
        if "user" not in session:
            return jsonify({"error":True,"message":"未登入系統"}),403
        session.pop("booking_data",None)
        return jsonify({"ok":True})