function init() {
    fetch("http://127.0.0.1:3000/api/attraction/1")
        .then(function(response){
            return response.json();
        })
        .then(function(myJson){
            // 抓出資料
            let id=myJson["data"]["id"];
            let title = myJson["data"]["name"];
            let mrt=myJson["data"]["mrt"];
            let cat=myJson["data"]["category"];
            let desc=myJson["data"]["description"];
            let address=myJson["data"]["address"];
            let transport=myJson["data"]["transport"];
            let photos=myJson["data"]["images"];
            // 放入資料
            let side_info=document.getElementById("side_info");
            let form_title=document.createElement("h3");
            form_title.textContent=title;
            let cat_mrt=document.createElement("p");
            cat_mrt.textContent=cat+"at"+mrt;
            side_info.appendChild(form_title);
            side_info.appendChild(cat_mrt);
            // 景點資料
            let view_info=document.getElementById("view_info");
            let info=document.createElement("p");
            info.textContent=desc;
            view_info.appendChild(info);
            // 景點地址
            let view_address=document.getElementById("view_address");
            let address_info=document.createElement("p");
            address_info.textContent=address;
            view_address.appendChild(address_info);
            // 交通方式
            let transportation=document.getElementById("transportation");
            let transportation_info=document.createElement("p");
            transportation_info.textContent=transport;
            transportation.appendChild(transportation_info);
            //圖片
            // for(let i=0;i<photos.length;i++){
            //     let 
            // }


        });

    // 照片更換
    let next_photo = document.getElementById("next");
    let prev_photo = document.getElementById("prev");
    let i = 0;
    let view = "img" + i.toString();
    document.getElementById(view).style.display="block"
    next_photo.addEventListener("click", () => {
        console.log(view);
        document.getElementById(view).style.display = "none";
        if (i<2){
            i=i+1;
        }else{
            i=0;
        }
        view = "img" + i.toString();
        document.getElementById(view).style.display = "block";
    });
    prev_photo.addEventListener("click",()=>{
        console.log(view);
        document.getElementById(view).style.display = "none";
        if (i>0){
            i=i-1;
        }else{
            i=2;
        }
        view = "img" + i.toString();
        document.getElementById(view).style.display = "block";
    });
    // 費用變換
    document.getElementById("morning").addEventListener("click",()=>{
        let money=document.getElementById("money");
        money.textContent="新台幣2000";
    });
    document.getElementById("afternoon").addEventListener("click",()=>{
        let money=document.getElementById("money");
        money.textContent="新台幣2500";
    })
};