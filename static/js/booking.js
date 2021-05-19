let Domain = "http://127.0.0.1:3000"
window.onload = () => {
    fetch(Domain + "/api/user")
        .then(function (response) {
            return response.json()
        })
        .then(function (myJson) {
            console.log(myJson)
            if (myJson["data"] == null) {
                document.getElementById("logout").style.display = "none";
                document.getElementById("show_login").style.display = "inline-block";
                window.location.href="/";
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
                        document.getElementById("booking_info").innerHTML=""
                        document.getElementById("no_booking").style.display="block"
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


    //彈出式對話框
    let show_login = document.getElementById("show_login");
    show_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "block";
        document.getElementById("layer").style.display = "block";
        let login_status = document.getElementById("login-status");
        let status = document.getElementById("status");
        login_status.textContent = "";
        status.textContent = "";
    });
    let close_login = document.querySelectorAll(".close");
    close_login.forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById("login-dialog").style.display = "none";
            document.getElementById("signup-dialog").style.display = "none";
            document.getElementById("layer").style.display = "none";
        });
    });
    let go_to_signup = document.getElementById("goToSignup");
    go_to_signup.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "none";
        document.getElementById("signup-dialog").style.display = "block";
        let status = document.getElementById("status");
        status.textContent = "";
    });
    let go_to_login = document.getElementById("goToLogin");
    go_to_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "block";
        document.getElementById("signup-dialog").style.display = "none";
        let login_status = document.getElementById("login-status")
        login_status.textContent = "";
    });
    //登入會員
    document.getElementById("login-btn").addEventListener("click", () => {
        let login_email = document.getElementById("login-email");
        let login_password = document.getElementById("login-password");
        fetch(Domain + "/api/user", {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": login_email.value,
                "password": login_password.value
            })
        })
            .then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json()
            })
            .then(function (myJson) {
                console.log(myJson)
                let status = document.getElementById("login-status")
                status.style.color = "green";
                status.textContent = "登入成功";
                setTimeout(() => { history.go(0); }, 1000);
                document.getElementById("logout").style.display = "inline-block";
                document.getElementById("show_login").style.display = "none";
            })
            .catch(function (error) {
                console.log(error)
                return error.json()
                    .then(function (errJson) {
                        let status = document.getElementById("login-status")
                        status.style.color = "red";
                        status.textContent = errJson["message"];
                    })
            })
    });
    // 註冊新帳號
    document.getElementById("signup-btn").addEventListener("click", () => {
        let signup_user = document.getElementById("signup-user");
        let signup_email = document.getElementById("signup-email");
        let signup_password = document.getElementById("signup-password");
        fetch(Domain + "/api/user", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": signup_user.value,
                "email": signup_email.value,
                "password": signup_password.value
            })
        })
            .then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(function () {
                let status = document.getElementById("status")
                status.style.color = "green";
                status.textContent = "註冊成功";
                console.log("成功")
            })
            .catch(function (error) {
                console.log(error)
                return error.json()
                    .then(function (errJson) {
                        let status = document.getElementById("status")
                        status.style.color = "red";
                        status.textContent = errJson["message"];
                    })
            })
    })
    // 登出會員
    document.getElementById("logout").addEventListener("click", () => {
        fetch(Domain + "/api/user", {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (response) {
                return response.json()
            })
            .then(function () {
                document.getElementById("logout").style.display = "none"
                document.getElementById("show_login").style.display = "inline-block"
                history.go(0);
            })
    })
    //刪除預定資料
    document.getElementById("delete").addEventListener("click",()=>{
        fetch(Domain+"/api/booking",{
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(function(response){
            return response.json()
        })
        .then(function(){
            history.go(0);
        })
    })
}