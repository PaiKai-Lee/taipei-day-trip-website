// 載入資料函式
let add_content = (item_len, myJson) => {
    for (i = 0; i < item_len; i++) {
        let view_id=myJson["data"][i]["id"].toString();
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
        let image_link=document.createElement("a")
        let attraction_url="http://13.115.37.65:3000/api/attraction/"+view_id;
        image_link.href=attraction_url;

        
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
function init() {
    fetch('http://13.115.37.65:3000/api/attractions')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            nextPage = myJson["nextPage"];
            let item_len = myJson["data"].length;
            add_content(item_len, myJson);
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
        let url = new URL("http://13.115.37.65:3000/api/attractions")
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
    })
    let close_login = document.getElementById("login-close");
    close_login.addEventListener("click", () => {
        document.getElementById("login-dialog").style.display = "none"
    })

}
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
            let url = new URL("http://13.115.37.65:3000/api/attractions")
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