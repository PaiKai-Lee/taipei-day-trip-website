let Domain = "http://13.115.37.65:3000"
// 照片更換切換函式
let change_img = () => {
    let next_photo = document.getElementById("next");
    let prev_photo = document.getElementById("prev");
    let images = document.getElementsByClassName("photos")
    let image_num = images.length
    let radio = document.getElementsByName("radio_img");
    let i = 0;
    let show_image = (n = 0) => {
        images[n].style.display = "block"
    }
    let close_image = (n) => {
        images[n].style.display = "none"
    }
    let show_radio = (n = 0) => {
        radio[n].checked = true;
    }
    show_image();
    show_radio();
    // 上,下張圖點擊事件
    next_photo.addEventListener("click", () => {
        for (let j = 0; j < image_num; j++) {
            close_image(j);
        }
        i++;
        if (i > image_num - 1) {
            i = 0;
        }
        show_image(i);
        show_radio(i);
    });
    prev_photo.addEventListener("click", () => {
        for (let j = 0; j < image_num; j++) {
            close_image(j);
        }
        i--;
        if (i < 0) {
            i = image_num - 1;
        }
        show_image(i);
        show_radio(i);
    });
    //radio點選圖
    for (let x = 0; x < image_num; x++) {
        radio[x].addEventListener("click", () => {
            for (let j = 0; j < image_num; j++) {
                close_image(j);
            }
            show_image(x);
            i = x;//i = 當下圖片
        });
    };
};

// Ajax載入
window.onload = () => {
    let url_path = window.location.pathname;
    id = url_path.split("/")[2];
    url = Domain + "/api/attraction/" + id

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            // 抓出資料
            let id = myJson["data"]["id"];
            let title = myJson["data"]["name"];
            let mrt = myJson["data"]["mrt"];
            let cat = myJson["data"]["category"];
            let desc = myJson["data"]["description"];
            let address = myJson["data"]["address"];
            let transport = myJson["data"]["transport"];
            let photos = myJson["data"]["images"];
            // 放入資料
            let side_info = document.getElementById("side_info");
            let form_title = document.createElement("h3");
            form_title.textContent = title;
            let cat_mrt = document.createElement("p");
            cat_mrt.textContent = cat + "at" + mrt;
            side_info.appendChild(form_title);
            side_info.appendChild(cat_mrt);
            // 景點資料
            let view_info = document.getElementById("view_info");
            let info = document.createElement("p");
            info.textContent = desc;
            view_info.appendChild(info);
            // 景點地址
            let view_address = document.getElementById("view_address");
            let address_info = document.createElement("p");
            address_info.textContent = address;
            view_address.appendChild(address_info);
            // 交通方式
            let transportation = document.getElementById("transportation");
            let transportation_info = document.createElement("p");
            transportation_info.textContent = transport;
            transportation.appendChild(transportation_info);
            //圖片
            let image_cotainer = document.getElementById("slider");
            let radio_container = document.getElementById("slider_radio");
            for (let i = 0; i < photos.length; i++) {
                let radio = document.createElement("input");
                radio.type = "radio"; radio.name = "radio_img"; radio.id = "r" + i
                let label_radio = document.createElement("label");
                label_radio.htmlFor = "r" + i.toString(); label_radio.className = "label_radio";
                radio_container.appendChild(radio);
                radio_container.appendChild(label_radio);

                let img_div = document.createElement("div");
                img_div.className = "photos"
                let img = document.createElement("img");
                img.src = photos[i];
                img_div.appendChild(img);
                image_cotainer.appendChild(img_div);
            };
        })
        .then(function () {
            change_img();
            return fetch(Domain + '/api/user')
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    if (myJson["data"] == null) {
                        document.getElementById("logout").style.display = "none";
                        document.getElementById("show_login").style.display = "inline-block";
                    }
                    else {
                        document.getElementById("logout").style.display = "inline-block";
                        document.getElementById("show_login").style.display = "none";
                    }
                });
        });

    // 費用變換
    document.getElementById("morning").addEventListener("click", () => {
        let money = document.getElementById("money");
        money.textContent = "新台幣2000";
    });
    document.getElementById("afternoon").addEventListener("click", () => {
        let money = document.getElementById("money");
        money.textContent = "新台幣2500";
    })
    //
    //彈出式對話框
    let show_login = document.getElementById("show_login");
    show_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "block";
        document.getElementById("layer").style.display="block";
        let login_status=document.getElementById("login-status");
        let status=document.getElementById("status");
        login_status.textContent="";
        status.textContent="";
    });
    let close_login = document.querySelectorAll(".close");
    close_login.forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById("login-dialog").style.display = "none";
            document.getElementById("signup-dialog").style.display = "none";
            document.getElementById("layer").style.display="none";
        });
    });
    let go_to_signup = document.getElementById("goToSignup");
    go_to_signup.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "none";
        document.getElementById("signup-dialog").style.display = "block";
        let status=document.getElementById("status");
        status.textContent="";
    });
    let go_to_login = document.getElementById("goToLogin");
    go_to_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "block";
        document.getElementById("signup-dialog").style.display = "none";
        let login_status=document.getElementById("login-status")
        login_status.textContent="";
    });
    //登入會員
    document.getElementById("login-btn").addEventListener("click", () => {
        let login_email = document.getElementById("login-email");
        let login_password = document.getElementById("login-password");
        fetch(Domain + "/api/user",{
            method:"PATCH",
            headers:{ 'Content-Type': 'application/json' },
            body:JSON.stringify({
                "email":login_email.value,
                "password":login_password.value
            })
        })
        .then(function(response){
            return response.json()
        })
        .then(function(myJson){
            console.log(myJson)
            let status=document.getElementById("login-status")
            status.style.color="green";
            status.textContent="登入成功";
            setTimeout(()=>{history.go(0);},1000);
            document.getElementById("logout").style.display="inline-block";
            document.getElementById("show_login").style.display="none";
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
                if (!response.ok){
                    throw response
                }
                return response.json();
            })
            .then(function () {
                let status=document.getElementById("status")
                status.style.color="green";
                status.textContent="註冊成功";
            })
            .catch(function(error){
                return error.json()
            })
            .then(function(errJson){
                let status=document.getElementById("status")
                status.style.color="red";
                status.textContent=errJson["message"];
            })

    })
    // 登出會員
    document.getElementById("logout").addEventListener("click",()=>{
        fetch(Domain + "/api/user",{
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(function(response){
            return response.json()
        })
        .then(function(myJson){
            document.getElementById("logout").style.display="none"
            document.getElementById("show_login").style.display="inline-block"
            history.go(0);
        })
    })
};