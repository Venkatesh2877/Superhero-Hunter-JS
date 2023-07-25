const ul = document.getElementById("list");
const searchBox=document.getElementById('search-box');
let searchListContainerlistContainer = document.querySelector(".search-suggstions");
const ts=Date.now();
const publicKey="5381782feb81c47bcae5333cd94b20e3";
const privateKey="92e40628c8cbef656d21321968a2f6612f799311";
const hash=(CryptoJS.MD5(ts+privateKey+publicKey).toString());
var fav=[];

if(localStorage.length>0){
    let retString = localStorage.getItem("key");
    fav = JSON.parse(retString);
}


function clearSearchList(){
    searchListContainerlistContainer.innerHTML='';
}

//search for name that start with value entered in searchbox
async function search(){
    const data=searchBox.value;

    try{
        clearSearchList();
        if(data.length<4){ //>4 make the filter easy
            return;
        }
        const url=`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${data}`;
        const response= await fetch(url);
        const jsonData=await response.json();
        jsonData.data.results.forEach(element => {
            renderSearchSuggestions(element);
        });
    }catch(err){
        console.log(err);
    }

}

//render the search suggestion in form of list
function renderSearchSuggestions(element){
    let data=element.name;
    let div= document.createElement('div');
    div.style.cursor='pointer';
    div.classList.add('autocomplete-items');
    let word = data.substr(0, searchBox.value.length);
    word += data.substr(searchBox.value.length);
    div.innerHTML = `
        <div class="item-container">
            <p class="item" id="${element.id}">${word}</p>
            <i class="fa-solid fa-star fa-sm" id="${element.id}" style="color: #94051a; margin-top: 18px; margin-right: 20px;"></i>
        </div>`;
    searchListContainerlistContainer.appendChild(div);
}


//API to fetch characters
async function loadHomePage(){
    try{
       const url=(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100
       `);
        const response= await fetch(url);
        const jsonData=await response.json();
        jsonData.data.results.forEach(element => {
            renderHomepage(element);
        });
    }catch(err){
        console.log(err);
    }
}

//to render the home page with all the icons
function renderHomepage(element){
    const img=element.thumbnail.path+"."+element.thumbnail.extension;
  var li = document.createElement("li");
  li.innerHTML=`
     
    <div class="beFlex">
    <img src="${element.thumbnail.path+'.'+element.thumbnail.extension}" alt="image">
        <div class="name" id="${element.id}">${element.name}</div>
        <i class="fa-solid fa-star fa-2xl" id="${element.id}" style="color: #94051a; margin-top: 18px; margin-right: 20px;"></i>
    </div>
    `;
 // li.setAttribute("class", "beFlex";
  ul.appendChild(li);
}


//handle click events
function handleClick(e){
    console.log(e.target)
    const target=e.target;
    if(target.className=='item'){
        searchBox.value=target.innerHTML;
        window.location.href="superhero.html?id="+target.id;

    }else if(target.className=='name'){
        window.location.href="superhero.html?id="+target.id;
        //fetchSuperHeroDetails(target.id);


    }else if(target.className=='fa-solid fa-star fa-2xl'){
        if(!fav.includes(target.id)){
            fav.push(target.id);
           target.style.color='#d1b733';
           console.log(fav);
            return;  
        }else{
            var newFav=fav.filter((id)=>{
                return id!=target.id;
            });
            fav=newFav;
            target.style.color='#94051a';
            console.log(fav);
        }   
    }else if(target.id=='favourite'){
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="favourite.html";
    }
}

function start(){
    loadHomePage();
    searchBox.addEventListener("keyup", search);
    document.addEventListener('click', handleClick);
}

start();



