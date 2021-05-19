from flask import Blueprint, request, session, jsonify
import mysql.connector
import os
import re

users = Blueprint("users", __name__)

mydb = mysql.connector.connect(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
mycursor = mydb.cursor()

# 使用者API


@users.route("/api/user", methods=["GET", "POST", "PATCH", "DELETE"])
def user():
    # 取得使用者
    if request.method == "GET":
        if "user" in session:
            print("使用者: "+session["user"])
            mycursor.execute(
                "SELECT user_id,name,email FROM users where email = %s", (session["user"],))
            DBuser = mycursor.fetchone()
            return jsonify({"data": {
                "id": DBuser[0],
                "name": DBuser[1],
                "email": DBuser[2]
            }})
        else:
            return jsonify({"data": None})
    # 註冊新帳號
    if request.method == "POST":
        user = request.get_json()["name"]
        user_email = request.get_json()["email"]
        user_password = request.get_json()["password"]
        validation = re.compile(r"[^@]+@[^@]+\.[^@]+")
        if user == "" or user_email == "" or user_password == "":
            return jsonify({"error": True, "message": "註冊資料不可空白"}), 400
        if validation.match(user_email) == None:
            return jsonify({"error": True, "message": "Email格式不正確"}), 400
        mycursor.execute(
            "SELECT email FROM users where email = %s", (user_email,))
        DBuser = mycursor.fetchone()
        if DBuser != None:
            return jsonify({"error": True, "message": "註冊失敗，重複的 Email"}), 400

        sql = ("INSERT INTO users(name,email,password) VALUES (%s,%s,%s)")
        val = (user, user_email, user_password)
        mycursor.execute(sql, val)
        mydb.commit()
        return jsonify({"ok": True}), 200
    # 登入會員
    if request.method == "PATCH":
        user_email = request.get_json()["email"]
        user_password = request.get_json()["password"]
        mycursor.execute(
            "SELECT email,password FROM users where email= %s", (user_email,))
        DBuser = mycursor.fetchone()
        if DBuser == None or user_password != DBuser[1] or user_email != DBuser[0]:
            return jsonify({"error": True, "message": "登入失敗，帳號或密碼錯誤"}), 400
        elif user_password == DBuser[1]:
            session["user"] = user_email
            session.permanent = True
            return jsonify({"ok": True})
        else:
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500

    # 登出帳號
    if request.method == "DELETE":
        print("登出成功")
        session.pop("user", None)
        return jsonify({"ok": True})
