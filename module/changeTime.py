import time

def timeCompare(date):
    now=time.time()
    nowd=time.localtime(now)
    timeString = time.strftime("%Y-%m-%d", nowd)
    timeStruct=time.strptime(timeString,"%Y-%m-%d")
    now=int(time.mktime(timeStruct))

    booking_struct=time.strptime(date,"%Y-%m-%d")
    booking_time=int(time.mktime(booking_struct))
    res = booking_time-now
    return res
    