function getStoredState(keyName) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keyName, function(result) {
            const storedState = result[keyName];
            if (!storedState) {
                resolve(null);
            }
            resolve(storedState);
        });
    });
}


function setCacheData(dataName, dataSave) {
    const dataToSave = { [dataName]: dataSave };
    chrome.storage.local.set(dataToSave);
}

async function modifyInfoPopup(){
    const animeName = await getStoredState("animeName")
    const animeEpisode = await getStoredState("animeEpisode")
    const headerElement = document.querySelector('.header');
    const titleAnime = document.getElementsByClassName('anime-title')[0];

    const changeBackgroundImage = (animeName, imageName) => {
        headerElement.style.background = `url("../images/fp/${imageName}")`;
        headerElement.style.backgroundSize = 'cover';
        headerElement.style.backgroundRepeat = 'no-repeat';
        headerElement.style.backgroundPosition = 'center';
        titleAnime.innerText = `${animeName}`;
        if (animeName !== "Portada"){
            titleAnime.innerText = titleAnime.innerText + ` ${animeEpisode}`
        }
        console.log(titleAnime.innerText.length)
        if (titleAnime.innerText.length > 18){
            console.log("estoy pasando")
            titleAnime.style.top = '160px';
        }

    }

    console.log(animeName)
    switch (animeName) {
        case "one piece": 
            changeBackgroundImage("One Piece", "op.webp");
            break;
        case "naruto":
            changeBackgroundImage("Naruto", "naruto.webp");
            break;
        case "black clover":
            changeBackgroundImage("Black Clover", "BC.jwebp");
            break;
        case "bleach":
            changeBackgroundImage("Bleach", "bleach.webp");
            break;
        case "naruto shippuden":
            changeBackgroundImage("Naruto shippuden", "narutosh.webp");
            break;
        case "boruto: naruto next generations":
            changeBackgroundImage("Boruto: Naruto Next Generations", "boruto.webp");
            break;
        default:
            changeBackgroundImage("Portada", "Portada.webp");

    }
    
}

modifyInfoPopup()
var toggleSwitch = document.getElementById('ToggleSwitch');
document.addEventListener('DOMContentLoaded', async function() {
    const buttonStatus = await getStoredState("skipButtonState");
    toggleSwitch.checked = buttonStatus;
});
document.addEventListener('DOMContentLoaded', function() {
    toggleSwitch.addEventListener('change', async function() {
        setCacheData("skipButtonState",toggleSwitch.checked);
    });
});

const carousel = document.querySelector(".carousel");

let isDragStart = false, prevPageX, prevScrollLeft;

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragStart) return;
    e.preventDefault();
    let positionDiff = e.pageX - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    console.log(e.pageX);
}

const dragStop = () =>{
    isDragStart = false;
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);

function removeScrollbar(){
    const styleElement = document.createElement('style');
    styleElement.id = 'remove-scroll-style';
    styleElement.textContent =
        'html::-webkit-scrollbar{display:none !important}' +
        'body::-webkit-scrollbar{display:none !important}';
    document.getElementsByTagName('body')[0].appendChild(styleElement);
}   
removeScrollbar()

/*En caso de que se quiera restaurar la scrollbar utilizar
$('#remove-scroll-style').remove();*/


