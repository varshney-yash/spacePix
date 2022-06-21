const resultsNav=document.getElementById('resultsNav');
const favouritesNav=document.getElementById('favouritesNav');
const imagesContainer=document.querySelector('.images-container');
const saveConfirm=document.querySelector('.save-confirm');
const loader=document.querySelector('.loader');


// NASA APOD API
const cnt=10;
const apiURL=`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=${cnt}`;

let res=[]; //array
let favs={}; //object

function showContent(page){
    window.scrollTo({top:0,behavior:'instant'});
    loader.classList.add('hidden');
    if(page==='results'){
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    } else{
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    // loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArr= page==='results' ? res : Object.values(favs);
    currentArr.forEach((res) =>{
        // Card Container
        const card=document.createElement('div');
        card.classList.add('card');
        // Link
        const link=document.createElement('a');
        link.href= res.hdurl;
        link.title="View in HD";
        link.target='_blank';
        // Image
        const img=document.createElement('img');
        img.src=res.url;
        img.alt='SPACE PIC OF THE DAY';
        img.loading='lazy';
        img.classList.add('card-img-top');
        // Card Body
        const cardBody=document.createElement('div');
        cardBody.classList.add('card-body');
        // Title
        const cardTitle=document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent=res.title;
        // Save Text
        const saveText=document.createElement('p');
        saveText.classList.add('clickable');
        if(page==='results'){
            saveText.textContent='Add to favourites';
            saveText.setAttribute('onclick',`saveFavourite('${res.url}')`);
        }
        else{
            saveText.textContent='Remove';
            saveText.setAttribute('onclick',`removeFavourite('${res.url}')`);
        }
        // Card Text
        const cardText=document.createElement('p');
        cardText.textContent=res.explanation;
        // Footer
        const footer=document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date=document.createElement('strong');
        date.textContent=res.date;
        // Copyright
        const cprRes=res.copyright===undefined ? '' : res.copyright;
        const cpr=document.createElement('span');
        cpr.textContent=` ${cprRes}©`;
        // Append
        footer.append(date, cpr);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(img);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
        // console.log(card);
    });
}


function updateDOM(page){
    // Get favs from localStorage
    if(localStorage.getItem('favpix')){
        favs=JSON.parse(localStorage.getItem('favpix'));
        
    }
    imagesContainer.textContent='';
    createDOMNodes(page);
    showContent(page);
}

// asynchronous fetch request to get images from api
async function getPix(){
    // loader
    loader.classList.remove('hidden');
    try{
        const response=await fetch(apiURL);
        res=await response.json(); // convert response to json and pass into res array
        // res.sort();
        // console.log(res);
        updateDOM('results');
    } catch(error){
        // catch error here
        console.log(error);
    }
}

// Save functionality

function saveFavourite(itemURL){
    // loop through res array to select fav
    res.forEach((item)=>{
        if(item.url.includes(itemURL) && !favs[itemURL]){
            favs[itemURL]=item;
            // console.log(favs);
            // Save confirmation pop-up
            saveConfirm.hidden=false;
            setTimeout(()=>{
                saveConfirm.hidden=true;
            },2000); 
            // set favs in local storage
            localStorage.setItem('favpix',JSON.stringify(favs));
        }
    });
    // console.log(itemURL);
}

function removeFavourite(itemURL){
    if(favs[itemURL]){
        delete favs[itemURL];
        localStorage.setItem('favpix',JSON.stringify(favs));
        updateDOM('favs');
    }
}


// On Load
getPix();
