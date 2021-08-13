//彈出式對話框
let show_login = document.getElementById("show_login");
show_login.addEventListener("click", () => {
    //跳出登入對話
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
    fetch("/api/user", {
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
            let status = document.getElementById("login-status")
            status.style.color = "green";
            status.textContent = "登入成功";
            setTimeout(() => { history.go(0); }, 1000);
            document.getElementById("logout").style.display = "inline-block";
            document.getElementById("show_login").style.display = "none";
        })
        .catch(function (error) {
            console.error(error)
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
    fetch("/api/user", {
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
            signup_user.value = ""
            signup_email.value = ""
            signup_password.value =""
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
    fetch("/api/user", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (myJson) {
            document.getElementById("logout").style.display = "none"
            document.getElementById("show_login").style.display = "inline-block"
            history.go(0);
        })
})
//導覽列預定行程
document.getElementById("booking_page").addEventListener("click", () => {
    fetch("/api/user")
        .then(function (response) {
            return response.json()
        })
        .then(function (myJson) {
            if (myJson["data"] == null) {
                //跳出登入對話
                document.getElementById("login-dialog").style.display = "block";
                document.getElementById("layer").style.display = "block";
                let login_status = document.getElementById("login-status");
                let status = document.getElementById("status");
                login_status.textContent = "";
                status.textContent = "";
            }
            else {
                window.location.href = "/booking"
            }
        })
})