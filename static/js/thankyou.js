const Domain = "http://13.115.37.65"
fetch(Domain + "/api/user")
    .then(function (response) {
        return response.json()
    })
    .then(function (myJson) {
        if (myJson["data"] == null) {
            document.getElementById("logout").style.display = "none";
            document.getElementById("show_login").style.display = "inline-block";
            window.location.href = "/";
        }else{
            document.getElementById("logout").style.display = "inline-block";
            document.getElementById("show_login").style.display = "none";
        }
        const urlParams = new URLSearchParams(window.location.search);
        const poNumber = urlParams.get('number');
        document.getElementById("po").textContent=poNumber;
    })

//回首頁
document.getElementById("home").addEventListener("click",()=>{
    location.href="/"
})
let footer = document.getElementsByTagName("footer");
footer[0].style.height = "100%"
document.getElementsByTagName("body")[0].style.overflowY="hidden";
