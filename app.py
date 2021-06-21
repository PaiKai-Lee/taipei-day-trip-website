from flask import *
from api.users import users
from api.att import att
from api.res import res
from api.pay import pay
import os 
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['JSON_SORT_KEYS'] = False
app.secret_key = os.getenv("session_key")

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

#註冊userAPI
app.register_blueprint(users)

#註冊旅遊景點API
app.register_blueprint(att)

# 預定行程API
app.register_blueprint(res)

# 註冊訂單付款API
app.register_blueprint(pay)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
