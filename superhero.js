const ts=Date.now();
const publicKey="5381782feb81c47bcae5333cd94b20e3";
const privateKey="92e40628c8cbef656d21321968a2f6612f799311";
const hash=(CryptoJS.MD5(ts+privateKey+publicKey).toString());
let retString = localStorage.getItem("key");
let fav = JSON.parse(retString);


const superheroPhoto= document.getElementById('photo');
const superheroDescription=document.getElementById('description');
const superheroComics=document.getElementById('comics');
const superheroEvents=document.getElementById('events');
const superheroSeries=document.getElementById('series');
const superheroStories=document.getElementById('stories');
const superheroName=document.getElementById('name');
const i=document.getElementsByTagName('i');


//get the id of the superhero
let paramString=window.location.search;
let id= paramString.slice(4);

//call function to fetch 
fetchSuperHeroDetails();

//API to get super hero detail
async function fetchSuperHeroDetails(){
    try{
        const url=(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100
        `);
         const response= await fetch(url);
         const jsonData=await response.json();
         renderSuperHeroPage(jsonData.data.results);
    }catch(err){
         console.log(err);
    }
}

function renderSuperHeroPage(data){
    const img=data[0].thumbnail.path+"."+data[0].thumbnail.extension;
    var div = document.createElement("div");
    div.innerHTML=`
    <img src="${img}" alt="image">
    </div>
    `;
    div.setAttribute("class", "photo");
    superheroPhoto.appendChild(div);

    i[0].id= data[0].id;

    if(fav.includes(String(data[0].id))){
        i[0].style.color='#d1b733';
    }else{
        i[0].style.color='#94051a';
    }

    superheroDescription.innerHTML=data[0].description;//add description to html
    superheroName.innerHTML=data[0].name;// add name to html

    //add comics to html
    const comicsList = data[0].comics.items.map(element=>element.name);
    const addComicsList= addToString(comicsList);
    superheroComics.innerHTML= addComicsList;


    //add events 
    const eventList= data[0].events.items.map(element=>element.name);
    const addEventList= addToString(eventList);
    superheroEvents.innerHTML= addEventList;

    //add sereis
    const seriesList= data[0].series.items.map(element=>element.name);
    const addSeriesList= addToString(seriesList);
    superheroSeries.innerHTML= addSeriesList;


    //add stories
    const storiesList= data[0].stories.items.map(element=>element.name);
    const addStoriesList= addToString(storiesList);
    superheroStories.innerHTML= addStoriesList;

}

//function to add comics list to 
function addToString(List){
    let string=' " '+ List[0] + ' " ';
    for(let i=1;i<List.length;i++){
        string= string + ', ' + ' " '+ List[i] + ' " ';
    }
   return string;
}
function handleClick(e){
    let target= e.target;
    console.log(target.id);
    if(target.id=='home'){
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="home.html";

    }else if(target.id=='favourite'){
        var string = JSON.stringify(fav);
        localStorage.setItem("key", string);
        window.location.href="favourite.html";

    }else if(target.className=='fa-solid fa-star'){
        console.log(fav.includes(target.id));
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
    }
}

document.addEventListener('click', handleClick);

