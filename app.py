from flask import *
import mysql.connector
import json
import os
import re


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False
app.secret_key=os.environ.get("session_key")

mydb=mysql.connector.connect(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
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
            "images":json.loads(information[9])
       	})
	print("內容數量: "+str(len(myresult)))
	if len(myresult)/12 == 1:
		nextPage=page+1
	else:
		nextPage=None
	final={
		"nextPage":nextPage,
		"data":data
	}
	return jsonify(final)

@app.route("/api/attraction/<int:attractionId>")
def apiAttraction(attractionId):
	mycursor.execute("SELECT COUNT(*) FROM attraction")
	num=mycursor.fetchone()[0]
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
			"images":json.loads(information[9])
		}
	return jsonify({"data":data})

#使用者API
@app.route("/api/user",methods=["GET","POST","PATCH","DELETE"])
def user():
	# 取得使用者
	if request.method == "GET":
		if "user" in session:
			print("使用者: "+session["user"])
			mycursor.execute("SELECT user_id,name,email FROM users where email = %s",(session["user"],))
			DBuser=mycursor.fetchone() 
			return jsonify({"data":{
				"id":DBuser[0],
				"name":DBuser[1],
				"email":DBuser[2]
			}})
		else:
			return jsonify({"data":None})
	#註冊新帳號
	if request.method == "POST":  
		user=request.get_json()["name"]
		user_email=request.get_json()["email"]
		user_password=request.get_json()["password"]
		validation=re.compile(r"[^@]+@[^@]+\.[^@]+")
		if user=="" or user_email=="" or user_password=="":
			return jsonify({"error":True,"message":"註冊資料不可空白"}),400
		if validation.match(user_email)==None:
			return jsonify({"error":True,"message":"Email格式不正確"}),400
		mycursor.execute("SELECT email FROM users where email = %s",(user_email,))
		DBuser=mycursor.fetchone() 
		if DBuser != None:
			return jsonify({"error":True,"message":"註冊失敗，重複的 Email"}),400

		sql=("INSERT INTO users(name,email,password) VALUES (%s,%s,%s)")
		val=(user,user_email,user_password)
		mycursor.execute(sql,val) 
		mydb.commit()
		return jsonify({"ok":True}),200  
	#登入會員
	if request.method == "PATCH":
		user_email=request.get_json()["email"]
		user_password=request.get_json()["password"]
		mycursor.execute("SELECT email,password FROM users where email= %s",(user_email,))
		DBuser=mycursor.fetchone() 
		if DBuser==None or user_password != DBuser[1] or user_email != DBuser[0]:
			return jsonify({"error":True,"message":"登入失敗，帳號或密碼錯誤"})
		elif user_password==DBuser[1]:
			session["user"]=user_email
			session.permanent=True
			return jsonify({"ok":True})
		else:
			return jsonify({"error":True,"message":"伺服器內部錯誤"}),500
	# 登出帳號
	if request.method=="DELETE":
		print("登出成功")
		session.pop("user",None)
		return jsonify({"ok":True})
		


		
		



if __name__=="__main__":
	app.run(host="0.0.0.0",port=3000,debug=True)