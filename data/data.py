import requests as rq 
import json
import mysql.connector

mydb=mysql.connector.connect(
    host="localhost",
    user="root",
    password="abcd1234",
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
#     photoList=[] 
#     for photos in imagesList:
#         if photos != "":
#             photoList.append(photos)
#     val=(name,category,description,address,transport,mrt,latitude,longitude,str(photoList))
#     mycursor.execute("INSERT INTO attraction (name,category,description,address,transport,mrt,latitude,longitude,images) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",val)
#     mydb.commit()
    

