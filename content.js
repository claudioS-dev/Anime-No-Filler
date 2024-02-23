function getAnimeInfo(animeTitle, animeName) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'processInfo', animeTitle, animeName }, (response) => {
            resolve(response);
        });
    });
}
//test
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

    let spanElement = document.createElement("span");

    spanElement.innerText = " "+category;
    h1Element.appendChild(spanElement);
    spanElement.style.color = color;

}

function getEpisodeNumber(title) {
    let match = title.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

async function skipEpisode(animeTitle) {
    
    const nextButton = await getElementInDOM("a.playable-card-mini-static__link--UOJQm");
    const thisEpisode = getEpisodeNumber(animeTitle);
    const episodeNumberButton = getEpisodeNumber(nextButton.title);
    
    if (episodeNumberButton > thisEpisode) {
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

async function setInformation() {
    
    const h1Element = await getElementInDOM("h1");
    const h4Element = await getElementInDOM("h4.text--gq6o-");
    
    const animeTitle = h1Element.textContent;
    const animeName = h4Element.textContent;
    const episodeInfo = await getAnimeInfo(animeTitle, animeName);

    if (episodeInfo){
        setTitle(h1Element, episodeInfo.category, episodeInfo.color);
    }

    const buttonStatus = await getButtonStatus();
    if (buttonStatus === true && episodeInfo.category === "FILLER") {
        intervalId = setInterval(skipEpisode, 2000);
        await skipEpisode(animeTitle);
    }

}

async function main() {
    try {
        await setInformation();
        intervalId = setInterval(setInformation, 1000);
    } catch (error) {
        console.error("Error in main:", error);
    }
} 

main();