function getAnimeInfo(episode, animeName) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'processInfo', episode, animeName }, (response) => {
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
    || titleText.includes("FILLER") 
    || titleText.includes("MIXED") 
    || titleText.includes("ANIME CANON");
}

function setTitle(h1Element, category, color) {
    
    if (titleIncludeInformation(h1Element.textContent) ){ 
        return;
    }

    const spanElement = document.createElement("span");
    const categoryFormatted = category.replace("_", " ");

    spanElement.innerText = " "+categoryFormatted;
    h1Element.appendChild(spanElement);
    spanElement.style.color = color;

}

function getEpisodeNumber(title) {
    const match = title.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

async function skipEpisode(currentEpisode) {
    
    const nextButton = document.querySelector("a.playable-card-mini-static__link--UOJQm");
  
    const episodeNumberButton = getEpisodeNumber(nextButton.title);
    
    if (episodeNumberButton > currentEpisode) {
        nextButton.click();
    }
}

async function getButtonStatus(){
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getButtonStatus',}, (response) => {
            resolve(response);
        });
    });
}

function getElementsID(){
    let titleID, subTitleID;
    switch (window.location.hostname) {
        case "www.crunchyroll.com":
            titleID = "h1";
            subTitleID = "h4.text--gq6o-";
            break;
        case "www3.animeflv.net":
            titleID = "h1.Title";
            subTitleID = "h2.SubTitle";
            break;
        default:
            null;
    }
    return {titleID, subTitleID};

}

function getInfo(titleComponent, subTitleComponent){
    let animeName, animeEpisode;
    switch (window.location.hostname) {
        case "www.crunchyroll.com":
            animeName = subTitleComponent.textContent;
            animeEpisode = getEpisodeNumber(titleComponent.textContent)
            break;
        case "www3.animeflv.net":
            animeName = titleComponent.textContent.match(/(.+?) Episodio/)[1];
            animeEpisode = getEpisodeNumber(subTitleComponent.textContent)
            break;
        default:
            return;
    }
    animeName = animeName.toLowerCase();
    return {animeName, animeEpisode}
}

async function setInformation() {
    
    const { titleID, subTitleID } = getElementsID();   
    const titleComponent = await getElementInDOM(titleID);
    const subTitleComponent = await getElementInDOM(subTitleID);
    
    const { animeName, animeEpisode } = getInfo(titleComponent, subTitleComponent);
    const episodeInfo = await getAnimeInfo(animeEpisode, animeName);
    

    if (episodeInfo){
        setTitle(titleComponent, episodeInfo.category, episodeInfo.color);
    }
     
    const buttonStatus = await getButtonStatus();
    if (buttonStatus === true && episodeInfo.category === "FILLER") {
        intervalId = setInterval(skipEpisode, 2000);
        await skipEpisode(animeEpisode);
    }

}

async function main() {
    try {
        intervalId = setInterval(setInformation, 1000);
    } catch (error) {
        console.error("Error in main:", error);
    }
} 

main();