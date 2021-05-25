from re import T
from flask import Blueprint,jsonify,request,session
import requests as rq,json,random
from datetime import datetime, timezone, timedelta
import mysql.connector
import os

sers = Blueprint("users", __name__)

mydb = mysql.connector.connect(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
mycursor = mydb.cursor()


pay=Blueprint("pay",__name__)

@pay.route("/api/orders",methods=["POST"])
def order():
    if "user" not in session:
        return jsonify({"error":True,"message":"未登入系統"}),403
    tz=timezone(timedelta(hours=+8))
    dt=datetime.now(tz)
    x=random.randint(1000,9999)
    # 時間+亂數產生訂單號碼
    poNumber=int(dt.strftime("%y"+"%U"+"%d"+"%H"+"%M"+"%S")+str(x))
    # 紀錄此PO付款狀態
    session[poNumber]=False

    data=request.get_json()
    sql = ("INSERT INTO booking(po,bookingInfo) VALUES (%s,%s)")
    val = (poNumber,json.dumps(data))
    mycursor.execute(sql, val)
    mydb.commit()

    # Tappay API
    url=" https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    data={
    "prime": data["prime"],
    "partner_key": "partner_i1u6QGYklQKVkuqxj6Lb9v647YQosB3OnjuwRPwwSLnYNBXhzBWRHLoS",
    "merchant_id": "Kai9888_CTBC",
    "details":data["order"]["trip"]["attraction"]["name"],
    "amount": data["order"]["price"],
    "order_number":poNumber,
    "cardholder": {
        "phone_number": data["order"]["contact"]["phone"],
        "name": data["order"]["contact"]["name"],
        "email": data["order"]["contact"]["email"],
        "zip_code": "",
        "address": "",
        "national_id": ""
    },
    "remember": True
    }
    r=rq.post(url,headers={
        "Content-Type":"application/json",
        "x-api-key":"partner_i1u6QGYklQKVkuqxj6Lb9v647YQosB3OnjuwRPwwSLnYNBXhzBWRHLoS"},
        data=json.dumps(data)
        )
    res=r.json()
    if res["status"]==0:
        # 交易成功之PO狀態
        session[res["order_number"]]=True
        return jsonify({
            "data":{
                "number":res["order_number"],
                "payment":{
                    "status":0,
                    "message":"付款成功"
                }
            }
        })
    else:
        return jsonify({
            "data":{
                "number":res["order_number"],
                "payment":{
                    "status":res["status"],
                    "message":"付款失敗"
                }
            }
        })

@pay.route("/api/order/<orderNumber>")
def getOrder():
    
    return jsonify()