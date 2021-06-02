const Domain = "http://13.115.37.65"
let orders
fetch(Domain + "/api/user")
    .then(function (response) {
        return response.json()
    })
    .then(function (myJson) {
        if (myJson["data"] == null) {
            document.getElementById("logout").style.display = "none";
            document.getElementById("show_login").style.display = "inline-block";
            window.location.href = "/";
        }
        else {
            let user_name = myJson["data"]["name"];
            let user_email = myJson["data"]["email"];
            document.getElementById("logout").style.display = "inline-block";
            document.getElementById("show_login").style.display = "none";
            document.getElementById("user_name").textContent = user_name;
            document.getElementById("booking_name").value = user_name;
            document.getElementById("booking_email").value = user_email;
        }
        fetch(Domain + "/api/booking")
            .then(function (response) {
                return response.json()
            })
            .then(function (myJson) {
                if (myJson["data"] == null) {
                    document.getElementById("booking_info").innerHTML = ""
                    document.getElementById("no_booking").style.display = "block"
                    let footer = document.getElementsByTagName("footer");
                    footer[0].style.height = "100%"
                    document.getElementsByTagName("body")[0].style.overflowY="hidden";
                }
                else {
                    let id = myJson["data"]["attractionId"]["id"];
                    let view_name = myJson["data"]["attractionId"]["name"];
                    let date = myJson["data"]["date"];
                    let time = myJson["data"]["time"];
                    let price = myJson["data"]["price"];
                    let view_address = myJson["data"]["attractionId"]["address"];
                    let image = myJson["data"]["attractionId"]["image"];
                    let img = document.createElement("img");
                    img.src = image;
                    document.getElementById("img_container").appendChild(img);
                    document.getElementById("view_name").textContent = view_name;
                    document.getElementById("date").textContent = date;
                    document.getElementById("time").textContent = time;
                    document.getElementById("price").textContent = "新台幣" + price;
                    document.getElementById("view_address").textContent = view_address;
                    document.getElementById("total").textContent = "新台幣" + price;
                    orders={
                        "price":Number(price),
                        "trip": {
                            "attraction": {
                                "id": Number(id),
                                "name": view_name,
                                "address": view_address,
                                "image": image,
                            },
                            "date": date,
                            "time": time
                        }
                    }
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
//第三方付款
TPDirect.setupSDK(20407, 'app_k2n288ok4GZtSpsO56zulOTRqOmtan7wy7dDipq8E8by1aw6a0SEwpkVUw7V', 'sandbox')
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '30px'

        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});
//金流
document.getElementById("paySubmit").addEventListener("click", (event) => {
    let contact={
        "name":document.getElementById("booking_name").value,
        "email":document.getElementById("booking_email").value
    };
    event.preventDefault()
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資料錯誤')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        console.log(result)
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        contact["phone"]=document.getElementById("booking_phone").value
        fetch(Domain + "/api/orders", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "prime": result.card.prime,
                "order":{
                    "price":orders["price"],
                    "trip":orders["trip"],
                    "contact":contact
                }
            })
        })
        .then((res)=>{
            return res.json()
        })
        .then((myJson)=>{
            let po=myJson["data"]["number"]
            let params = { number: po}
            let url = new URL(Domain + "/thankyou")
            url.search = new URLSearchParams(params).toString()
            if (myJson["data"]["payment"]["status"]===0){
                window.location.href = url;
            }else{
                alert("訂單編號"+po+"付款失敗")
            }
        })
    })
})