function getAnimeInfo(animeTitle, animeName) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'processInfo', animeTitle, animeName }, (response) => {
            resolve(response);
        });
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

function titleIncludeInformation(titleText) {
    return titleText.includes("CANON") 
    || titleText.includes("RELLENO") 
    || titleText.includes("MIXTO") 
    || titleText.includes("ANIME CANON");
}

function setTitle(h1Element, tag, color) {
    
    if (titleIncludeInformation(h1Element.textContent) ){ 
        return;
    }

    let spanElement = document.createElement("span");

    spanElement.innerText = tag;
    h1Element.appendChild(spanElement);
    spanElement.style.color = color;

}

async function setInformation() {
    
    const h1Element = await getElementInDOM("h1");
    const h4Element = await getElementInDOM("h4.text--gq6o-");
    
    const animeTitle = h1Element.textContent;
    const animeName = h4Element.textContent;

    let episodeInfo;
    
    episodeInfo = await getAnimeInfo(animeTitle, animeName);
    if (episodeInfo){
        setTitle(h1Element, episodeInfo.tag, episodeInfo.color);
    }
    
}

async function main() {
    await setInformation();
    intervalId = setInterval(setInformation, 1000);
} 

main();
  
