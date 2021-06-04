from flask import Blueprint,jsonify,request,session
import requests as rq,json,random
from datetime import datetime, timezone, timedelta
import os,re
from dotenv import load_dotenv
import module.db as db

# DBpool=pooling.MySQLConnectionPool(
#     host="localhost",
#     user=os.environ.get('DB_USER'),
#     password=os.environ.get("DB_PASSWORD"),
#     database="taipeiweb"
# )
DBpool=db.pool

# 載入partner_key
load_dotenv()
partner_key=os.getenv("partner_key")

pay=Blueprint("pay",__name__)

@pay.route("/api/orders",methods=["POST"])
def order():
    if "user" not in session:
        return jsonify({"error":True,"message":"未登入系統"}),403
    data=request.get_json()
    contact_info=data["order"]["contact"]
    if contact_info["name"] == "" or contact_info["email"]=="" or contact_info["phone"] == "":
        return jsonify({
            "error":True,
            "message":"聯絡資訊不完整"
        }),400
    validation = re.compile(r"[^@]+@[^@]+\.[^@]+")
    if validation.match(contact_info["email"]) == None:
        return jsonify({"error": True, "message": "Email格式不正確"}), 400
    tz=timezone(timedelta(hours=+8))
    dt=datetime.now(tz)
    x=random.randint(1000,9999)
    # 時間+亂數產生訂單號碼
    poNumber=int(dt.strftime("%y"+"%U"+"%d"+"%H"+"%M"+"%S")+str(x))
    # 紀錄此PO付款狀態
    session[poNumber]="未付款"

    connect_pool=DBpool.get_connection()
    mycursor = connect_pool.cursor()
    sql = ("INSERT INTO booking(po,bookingInfo) VALUES (%s,%s)")
    val = (poNumber,json.dumps(data))
    mycursor.execute(sql, val)
    connect_pool.commit()
    connect_pool.close()
    # Tappay API
    url=" https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    info={
    "prime": data["prime"],
    "partner_key": partner_key,
    "merchant_id": "Kai9888_NCCC",
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
        "x-api-key":partner_key},
        data=json.dumps(info)
        )
    res=r.json()
    if res["status"]==0:
        # 交易成功之PO狀態
        session[res["order_number"]]="已付款"
        session.pop("booking_data",None)
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
                "number":poNumber,
                "payment":{
                    "status":res["status"],
                    "message":"付款失敗"
                }
            }
        })

@pay.route("/api/order/<orderNumber>")
def getOrder():
    
    return jsonify()