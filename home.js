const ul = document.getElementById("list");
const searchBox=document.getElementById('search-box');
let searchListContainerlistContainer = document.querySelector(".search-suggestions");

// hash using md5
const ts=Date.now();
const publicKey="5381782feb81c47bcae5333cd94b20e3";
const privateKey="92e40628c8cbef656d21321968a2f6612f799311";
const hash=(CryptoJS.MD5(ts+privateKey+publicKey).toString());


var fav=[];

//Condition to check if the localStorage has any data stored(favourite)
if(localStorage.length>0){
    let retString = localStorage.getItem("key");
    fav = JSON.parse(retString);
}

//CODE FOR SEARCHES

//function to clear the search-suggestions
function clearSearchList(){
    searchListContainerlistContainer.innerHTML='';
}

//search for name that start with value entered in searchbox
async function search(){
    const data=searchBox.value;

    try{
        clearSearchList();
        if(data.length<2){ //>2 make the filter easy
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
    console.log('hello');
    let color='#94051a';
    if(fav.includes(String(element.id))){
        color = '#d1b733';
    }

    div.innerHTML = `
        <div class="item-container">
            <p class="item" id="${element.id}">${word}</p>
            <i class="fa-solid fa-star fa-sm" id="${element.id}" style="color: ${color}; margin-top: 18px; margin-right: 20px;"></i>
        </div>`;
    searchListContainerlistContainer.appendChild(div);
}


//CODE TO GET DATA AND RENDER THE HOME PAGE

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

//to render the home page with all the images
function renderHomepage(element){
    let color='#94051a';
    if(fav.includes(String(element.id))){
        color = '#d1b733';
    }

    const img=element.thumbnail.path+"."+element.thumbnail.extension;
    var li = document.createElement("li");
    li.innerHTML=` 
        <div class="beFlex">
        <img src="${element.thumbnail.path+'.'+element.thumbnail.extension}" alt="image">
            <div class="name" id="${element.id}">${element.name}</div>
            <i class="fa-solid fa-star fa-sm" id="${element.id}" style="color: ${color}; margin-top: 18px; margin-right: 20px;"></i>
        </div>
    `;
    ul.appendChild(li);
}

//handle click events
function handleClick(e){
    const target=e.target;
    if(target.className=='item'){  
        searchBox.value=target.innerHTML;
        window.location.href="superhero.html?id="+target.id; //redirect to superhero page when searched hero is selected

    }else if(target.className=='name'){
        window.location.href="superhero.html?id="+target.id; //redirect to superhero page when listed hero is selected

    }else if(target.className=='fa-solid fa-star fa-sm'){ //added to favourite list when start is clicked
        if(!fav.includes(target.id)){
            fav.push(target.id);
            target.style.color='#d1b733';
            console.log(fav);
            return;  
        }else{
            var newFav=fav.filter((id)=>{ //remove from favourite list when start is clicked again
                return id!=target.id;
            });
            fav=newFav;
            target.style.color='#94051a';
            console.log(fav);
        }   
    }else if(target.id=='favourite'){ //render favourite page when clicked on favourite button
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="favourite.html";
    }
}

//start the page
function start(){
    loadHomePage();
    searchBox.addEventListener("keyup", search);
    document.addEventListener('click', handleClick);
}

start();



