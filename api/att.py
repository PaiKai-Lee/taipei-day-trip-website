from flask import Blueprint,jsonify,request
import json
from module.db import Attraction

att=Blueprint("att",__name__)

# 旅遊景點API
@att.route("/api/attractions")
def apiAttractions():
    page = request.args.get("page", 0)
    page = int(page)
    keyword = request.args.get("keyword", "")
    start = page*12
    myresult = Attraction.getAtts(keyword,start)
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
    myresult=Attraction.getOneAtt(attractionId)
    if myresult==False:
        return jsonify({"error": True, "message": "自訂錯誤訊息"}), 400
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