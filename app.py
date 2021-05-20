from flask import *
import mysql.connector,json,os
from api.users import users
from api.att import att
from api.res import res

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['JSON_SORT_KEYS'] = False
app.secret_key = os.environ.get("session_key")

# mydb = mysql.connector.connect(
#     host="localhost",
#     user=os.environ.get('DB_USER'),
#     password=os.environ.get("DB_PASSWORD"),
#     database="taipeiweb"
# )
# mycursor = mydb.cursor()


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

@app.route("/test")
def test():
    return render_template("test.html")

#註冊userAPI
app.register_blueprint(users)

#註冊旅遊景點API
app.register_blueprint(att)

# 預定行程API
app.register_blueprint(res)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
