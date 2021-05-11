let Domain = "http://127.0.0.1:3000"
// 載入資料函式
let add_content = (item_len, myJson) => {
    for (i = 0; i < item_len; i++) {
        let view_id = myJson["data"][i]["id"].toString();
        let title = myJson["data"][i]["name"];
        let mrt = myJson["data"][i]["mrt"];
        let cat = myJson["data"][i]["category"];
        let photo = myJson["data"][i]["images"][0]
        let content_wrap = document.getElementById("content_wrap");
        let div_container = document.createElement("div");
        let div_cat = document.createElement("div");
        div_container.className = "container";
        let container_image = document.createElement("img");
        container_image.src = photo;
        container_image.className = "item";
        let image_name = document.createElement("p");
        image_name.textContent = title;
        let p_mrt = document.createElement("p");
        p_mrt.textContent = mrt;
        let p_cat = document.createElement("p");
        p_cat.textContent = cat;
        image_name.className = "cat1";
        div_cat.className = "cat";
        let image_link = document.createElement("a")
        let attraction_url = Domain + "/attraction/" + view_id;
        image_link.href = attraction_url;


        image_link.appendChild(container_image)
        content_wrap.appendChild(div_container);
        div_container.appendChild(image_link);
        div_container.appendChild(image_name);
        div_container.appendChild(div_cat);
        div_cat.appendChild(p_mrt);
        div_cat.appendChild(p_cat);
    };
}
let nextPage = 0;
let keyword = "";
// load事件
window.onload = () => {
    fetch(Domain + '/api/attractions')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            nextPage = myJson["nextPage"];
            let item_len = myJson["data"].length;
            add_content(item_len, myJson);
            return fetch(Domain + '/api/user')
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    console.log(myJson)
                });
        });

    // 景點查詢
    let search_btn = document.getElementById("search_btn");
    let view_name = document.getElementById("view_name");
    search_btn.addEventListener("click", function (e) {
        nextPage = 0;
        let content_wrap = document.getElementById("content_wrap");
        content_wrap.innerHTML = "";
        keyword = view_name.value;
        let params = { page: nextPage, keyword: keyword }
        let url = new URL(Domain + "/api/attractions")
        url.search = new URLSearchParams(params).toString();
        fetch(url)
            .then(function (response) {
                console.log(response.status);
                if (response.status != 200) {
                    let view_error = document.createElement("p")
                    view_error.textContent = "查無相關內容"
                    content_wrap.appendChild(view_error)
                }
                return response.json();
            })
            .then(function (myJson) {
                nextPage = myJson["nextPage"];
                let item_len = myJson["data"].length;
                add_content(item_len, myJson);
                console.log(nextPage);
            });
    });
    //彈出式對話框
    let show_login = document.getElementById("show_login");
    show_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "block"
        document.getElementById("layer").style.display="block"
    });
    let close_login = document.querySelectorAll(".close");
    close_login.forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById("login-dialog").style.display = "none"
            document.getElementById("signup-dialog").style.display = "none"
            document.getElementById("layer").style.display="none"
            
        });
    });
    let go_to_signup = document.getElementById("goToSignup");
    go_to_signup.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "none"
        document.getElementById("signup-dialog").style.display = "block"
        let status=document.getElementById("status")
        status.textContent="";
    });
    let go_to_login = document.getElementById("goToLogin");
    go_to_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "block"
        document.getElementById("signup-dialog").style.display = "none"
    });

    document.getElementById("login-btn").addEventListener("click", () => {
        let login_email = document.getElementById("login-email");
        let login_password = document.getElementById("login-password");

    })
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
            .then(function (myJson) {
                let status=document.getElementById("status")
                status.style.color="green";
                status.textContent="註冊成功";
            })
            .catch(function(error){
                return error.json()
            })
            .then(function(errJson){
                console.log(errJson["error"],errJson["message"])
            })

    })
};

//debounce function
let debounce = (fn, delay) => {
    let timeoutID;
    return (...args) => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
// infinite scroll & laoding nextpage
window.addEventListener("scroll", debounce(e => {
    let scrolled = window.scrollY;
    let screen_h = document.documentElement.clientHeight;
    let total_h = document.documentElement.scrollHeight;
    let load_trigger = (total_h - screen_h) * 0.95

    if (scrolled > load_trigger) {
        if (nextPage != null) {
            let params = { page: nextPage, keyword: keyword }
            let url = new URL(Domain + "/api/attractions")
            url.search = new URLSearchParams(params).toString()
            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    nextPage = myJson["nextPage"];
                    let item_len = myJson["data"].length;
                    add_content(item_len, myJson);
                });
        };
    }
}, 300));