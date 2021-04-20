from flask import *
import mysql.connector
import json


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False

mydb=mysql.connector.connect(
    host="localhost",
    user="root",
    password="abcd1234",
    database="taipeiweb"
)
mycursor=mydb.cursor()

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

#旅遊景點API
@app.route("/api/attractions")
def apiAttractions():
	page=request.args.get("page",0)
	page=int(page)
	keyword=request.args.get("keyword","")
	start=page*12
	mycursor.execute("SELECT * FROM attraction where name LIKE %s LIMIT %s,%s",(('%'+keyword+'%'),start,12)) 
	myresult=mycursor.fetchall()
	if len(myresult)==0:
		return jsonify({"error":True,"message":"自訂錯誤訊息"}),500
	data=[]
	for information in myresult:
		data.append({
            "id":information[0],
            "name":information[1],
            "category":information[2],
            "description":information[3],
            "address":information[4],
            "transport":information[5],
            "mrt":information[6],
            "latitude":information[7],
            "longitude":information[8],
            "images":information[9]
       	})
	final={
		"nextPage":page+1,
		"data":data
	}
	return jsonify(final)

@app.route("/api/attraction/<int:attractionId>")
def apiAttraction(attractionId):
	mycursor.execute("SELECT COUNT(*) FROM attraction")
	num=mycursor.fetchone()[0]
	print(num)
	if attractionId > num:
		return jsonify({"error":True,"message":"自訂錯誤訊息"}),400
	mycursor.execute("SELECT * FROM attraction where id = %s",(attractionId,))
	myresult=mycursor.fetchall()
	if len(myresult)==0:
		return jsonify({"error":True,"message":"自訂錯誤訊息"}),500
	for information in myresult:
		data={
			"id":information[0],
			"name":information[1],
			"category":information[2],
			"description":information[3],
			"address":information[4],
			"transport":information[5],
			"mrt":information[6],
			"latitude":information[7],
			"longitude":information[8],
			"images":information[9]
		}
	return jsonify({"data":data})
	
if __name__=="__main__":
	app.run(port=3000)