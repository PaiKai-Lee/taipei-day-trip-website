let Domain = "http://13.115.37.65:3000"
fetch(Domain + "/api/user")
    .then(function (response) {
        return response.json()
    })
    .then(function (myJson) {
        console.log(myJson)
        if (myJson["data"] == null) {
            document.getElementById("logout").style.display = "none";
            document.getElementById("show_login").style.display = "inline-block";
            window.location.href = "/";
        }
        else {
            let user_name = myJson["data"]["name"]
            let user_email = myJson["data"]["email"]
            document.getElementById("logout").style.display = "inline-block";
            document.getElementById("show_login").style.display = "none";
            document.getElementById("user_name").textContent = user_name;
            document.getElementById("booking_name").value = user_name;
            document.getElementById("booking_email").value = user_email;
        }
        return fetch(Domain + "/api/booking")
            .then(function (response) {
                return response.json()
            })
            .then(function (myJson) {
                if (myJson["data"] == null) {
                    document.getElementById("booking_info").innerHTML = ""
                    document.getElementById("no_booking").style.display = "block"
                    let footer = document.getElementsByTagName("footer");
                    footer[0].style.height="80%"
                }
                else {
                    let view_name = myJson["data"]["attractionId"]["name"];
                    let date = myJson["data"]["date"];
                    let time = myJson["data"]["time"];
                    let price = myJson["data"]["price"];
                    let view_address = myJson["data"]["attractionId"]["address"];
                    let img = document.createElement("img");
                    img.src = myJson["data"]["attractionId"]["image"]
                    document.getElementById("img_container").appendChild(img);
                    document.getElementById("view_name").textContent = view_name;
                    document.getElementById("date").textContent = date;
                    document.getElementById("time").textContent = time;
                    document.getElementById("price").textContent = "新台幣" + price;
                    document.getElementById("view_address").textContent = view_address;
                    document.getElementById("total").textContent = "新台幣" + price;
                }
            })
    })
//刪除預定資料
document.getElementById("delete").addEventListener("click", () => {
    fetch(Domain + "/api/booking", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function () {
            history.go(0);
        })
})