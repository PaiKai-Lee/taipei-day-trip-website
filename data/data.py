import json
import mysql.connector
import os 

mydb=mysql.connector.connect(
    host="localhost",
    user=os.environ.get('DB_USER'),
    password=os.environ.get("DB_PASSWORD"),
    database="taipeiweb"
)
mycursor=mydb.cursor()


# with open ("taipei-attractions.json","r",encoding="utf-8") as f:
#    result=f.read()
# data=json.loads(result)
# for dataDic in data["result"]["results"] :
#     name=dataDic["stitle"]
#     mrt=dataDic["MRT"]
#     category=dataDic["CAT2"]
#     description=dataDic["xbody"]
#     address=dataDic["address"]
#     transport=dataDic["info"]
#     latitude=dataDic["latitude"]
#     longitude=dataDic["longitude"]
#     images=dataDic["file"]
#     imagesList=images.split("http://")
#     photoList=["http://"+photos for photos in imagesList if photos != ""]
#     photoList=[i for i in photoList if "mp3" not in i]  #過濾掉mp3檔
#     photoList=[i for i in photoList if "gif" not in i]  #過濾掉gif檔
#     photoList=[i for i in photoList if "flv" not in i]  #過濾掉flv檔
#     val=(name,category,description,address,transport,mrt,latitude,longitude,json.dumps(photoList))
#     mycursor.execute("INSERT INTO attraction (name,category,description,address,transport,mrt,latitude,longitude,images) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",val)
#     mydb.commit()