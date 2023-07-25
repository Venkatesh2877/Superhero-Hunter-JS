const ts=Date.now();
const publicKey="5381782feb81c47bcae5333cd94b20e3";
const privateKey="92e40628c8cbef656d21321968a2f6612f799311";
const hash=(CryptoJS.MD5(ts+privateKey+publicKey).toString());

let retString = localStorage.getItem("key");
let fav = JSON.parse(retString);
const ul = document.getElementById("list");


function clearData(){
    ul.innerHTML='';
}

function Notification(data){
    alert(data);
}

async function loadFavPage(){
    clearData();
    if(fav.length==0){
        Notification('no favourities to display');
        return;
    }
    try{
       fav.forEach((id)=>{
        fetchFavHeroDetails(id);
       })
    }catch(err){
        console.log(err);
    }
}

async function fetchFavHeroDetails(id){
    try{
        const url=(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100
        `);
         const response= await fetch(url);
         const jsonData=await response.json();
        renderFavpage(jsonData.data.results[0]);
    }catch(err){
         console.log(err);
    }
}

//to render the favourite page with all the icons
function renderFavpage(element){
    //const img=element.thumbnail.path+"."+element.thumbnail.extension;
  var li = document.createElement("li");
  li.innerHTML=`
     
    <div class="beFlex">
    <img src="${element.thumbnail.path+'.'+element.thumbnail.extension}" alt="image">
        <div class="name" id="${element.id}">${element.name}</div>
        <i class="fa-solid fa-star fa-xl" id="${element.id}" style="color: #d1b733; margin-top: 18px; margin-right: 20px;"></i>
    </div>
    `;
 // li.setAttribute("class", "beFlex";
  ul.appendChild(li);
}

function handleClick(e){
    let target= e.target;
    console.log(target.className);
    if(target.className=='fa-solid fa-star fa-xl'){
        var newFav=fav.filter((id)=>{
            return id!=target.id;
        });
        fav=newFav;
        console.log(fav);
        loadFavPage();
    }else if(target.id=='home'){
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="home.html";
    }else if(target.className=='name'){
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="superhero.html?id="+target.id;
    }
}

loadFavPage();
document.addEventListener('click', handleClick);