// hash using md5
const ts=Date.now();
const publicKey="5381782feb81c47bcae5333cd94b20e3";
const privateKey="92e40628c8cbef656d21321968a2f6612f799311";
const hash=(CryptoJS.MD5(ts+privateKey+publicKey).toString());

//get favourites from localStorage
let retString = localStorage.getItem("key");
let fav = JSON.parse(retString);
const ul = document.getElementById("list");

//function to clear the list
function clearData(){
    ul.innerHTML='';
}

//function to put up a notification
function Notification(data){
    alert(data);
}

//function to start the loading the favourite page
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

//function to fetch data through API call
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

//Render the favourite page with image
function renderFavpage(element){
    var li = document.createElement("li");
    li.innerHTML=`
        <div class="beFlex">
        <img src="${element.thumbnail.path+'.'+element.thumbnail.extension}" alt="image">
            <div class="name" id="${element.id}">${element.name}</div>
            <i class="fa-solid fa-star fa-xl" id="${element.id}" style="color: #d1b733; margin-top: 18px; margin-right: 20px;"></i>
        </div>
    `;
    ul.appendChild(li);
}

//handle click events
function handleClick(e){
    let target= e.target;
    console.log(target.className);
    if(target.className=='fa-solid fa-star fa-xl'){ //remove the hero when the star is clicked
        var newFav=fav.filter((id)=>{
            return id!=target.id;
        });
        fav=newFav;
        loadFavPage();

    }else if(target.id=='home'){                    //Redirect to home page
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="home.html";

    }else if(target.className=='name'){             //Redirect to favourite page
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="superhero.html?id="+target.id;
    }
}

//start the page
function start(){
    loadFavPage();
    document.addEventListener('click', handleClick);
}

start();