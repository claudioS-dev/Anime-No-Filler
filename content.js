async function getAnimeInfo(animeTitle, animeName) {
    chrome.runtime.sendMessage({ action: 'processInfo', animeTitle: animeTitle, animeName: animeName }, 
    (response) => {
        console.log('Respuesta desde background.js:',  response);
        return response;
        
    });
}

function getElementInDOM(nameElement) {
    return new Promise(async (resolve) => {
        let element = document.querySelector(nameElement);

        while (!(element)) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // pausa la ejecución por 1seg
            element = document.querySelector(nameElement);
        }

        resolve(element);
    });
}

function setTitle(h1Element, tag, color) {

    const animeName = document.querySelector('h4.text--gq6o-').textContent
    if (!getAnimeObjectByName(animeName)) return; // se asegura que el anime este en la lista de animes antes de cambiar el titulo

    let spanElement = document.createElement("span");

    spanElement.innerText = tag;
    h1Element.appendChild(spanElement);
    spanElement.style.color = color;

}

function titleIncludeInformation(titleText) {
    return titleText.includes("CANON") 
    || titleText.includes("RELLENO") 
    || titleText.includes("MIXTO") 
    || titleText.includes("ANIME CANON");
}


async function setInformation() {
    
    const h1Element = await getElementInDOM("h1");
    const h4Element = await getElementInDOM("h4.text--gq6o-");
    
    const animeTitle = h1Element.textContent;
    const animeName = h4Element.textContent;

    let episodeInfo;
    
    if (animeName && !titleIncludeInformation(animeTitle)) {
        episodeInfo = await getAnimeInfo(animeTitle, animeName);
        setTitle(h1Element, episodeInfo.tag, episodeInfo.color);
    }
}

async function main() {
    await setInformation();
    intervalId = setInterval(setInformation, 1000);
}  


main();
  
