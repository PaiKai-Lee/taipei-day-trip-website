import hashlib
from datetime import datetime
def setPassword(user):
    m=hashlib.sha256()
    salt=datetime.now().strftime("%f")+datetime.now().strftime("%a")
    res=f"{user}{salt}"
    m.update(res.encode("utf-8"))
    print(m.hexdigest())
    res={"password":m.hexdigest(),"salt":salt}
    return res


def verifyPassword(user,passdata,salt):
    m=hashlib.sha256()
    res=f"{user}{salt}"
    m.update(res.encode("utf-8"))
    res=m.hexdigest()
    if res==passdata:
        return True
    else:
        return False

