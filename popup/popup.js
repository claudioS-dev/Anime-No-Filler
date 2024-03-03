function getStoredState(keyName) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keyName, function(result) {
            const storedState = result[keyName];
            if (storedState === undefined) {
                reject(new Error(`Failed to retrieve the state for key: ${keyName}.`));
            }
            resolve(storedState);
        });
    });
}


function setCacheData(dataName, dataSave) {
    const dataToSave = { [dataName]: dataSave };
    chrome.storage.local.set(dataToSave);
}

function modifyInfoPopup(imagePopUp){
    
}

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

const karrusel = document.querySelector(".karrusel");

let isDragStart = false, prevPageX, prevScrollLeft;

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX;
    prevScrollLeft = karrusel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragStart) return;
    e.preventDefault();
    let positionDiff = e.pageX - prevPageX;
    karrusel.scrollLeft = prevScrollLeft - positionDiff;
    console.log(e.pageX);
}

const dragStop = () =>{
    isDragStart = false;
}

karrusel.addEventListener("mousedown", dragStart);
karrusel.addEventListener("mousemove", dragging);
karrusel.addEventListener("mouseup", dragStop);
karrusel.addEventListener("mouseleave", dragStop);

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


