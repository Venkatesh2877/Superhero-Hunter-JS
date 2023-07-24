const ul = document.getElementById("list");
const searchBox=document.getElementById('search-box');
let searchListContainerlistContainer = document.querySelector(".search-suggstions");
const ts=Date.now();
const publicKey="5381782feb81c47bcae5333cd94b20e3";
const privateKey="92e40628c8cbef656d21321968a2f6612f799311";
const hash=(CryptoJS.MD5(ts+privateKey+publicKey).toString());


function clearSearchList(){
    searchListContainerlistContainer.innerHTML='';
}

async function search(){
    const data=searchBox.value;

    try{
        clearSearchList();
        if(data.length<4){
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

function renderSearchSuggestions(element){
    let data=element.name;
    let div= document.createElement('div');
    div.style.cursor='pointer';
    div.classList.add('autocomplete-items');
    let word = data.substr(0, searchBox.value.length);
    word += data.substr(searchBox.value.length);
    div.innerHTML = `<p class="item" id="${element.id}">${word}</p>`;
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
    </div>
    `;
  li.setAttribute("class", "beFlex");
  ul.appendChild(li);
}

//handle click events
function handleClick(e){
    console.log(e.target)
    const target=e.target;
    if(target.className=='item'){
        searchBox.value=target.innerHTML;
        window.location.href="superhero.html";
    }else if(target.className=='name'){
        window.location.href="superhero.html";
    }
}

function start(){
    loadHomePage();
    searchBox.addEventListener("keyup", search);
    document.addEventListener('click', handleClick);
}

start();
