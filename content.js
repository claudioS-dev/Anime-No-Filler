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

function getNextEpisodeID(siteElementsID, site) {
    return siteElementsID[site]?.nextEpisodeID || null;
}

async function skipEpisode(currentEpisode, siteElementsID, site) {
    const nextEpisodeID = getNextEpisodeID(siteElementsID, site);
    const nextButton = document.querySelector(nextEpisodeID);
    if (site != "www.crunchyroll.com") {
        nextButton.click()
        return;
    }
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

function getTitleID(siteElementsID, site) {
    return siteElementsID[site]?.titleID || null;
}

function getSubTitleID(siteElementsID, site) {
    return siteElementsID[site]?.subTitleID || null;
}

function getNameAndEpisode(titleComponent, subTitleComponent, site){
    let animeName, animeEpisode;
    switch (site) {
        case "www.crunchyroll.com":
            animeEpisode = getEpisodeNumber(titleComponent.textContent)
            animeName = subTitleComponent.textContent;
            break;
        case "www3.animeflv.net":
            animeEpisode = getEpisodeNumber(subTitleComponent.textContent)
            animeName = titleComponent.textContent.match(/(.+?) Episodio/)[1];
            break;
        default:
            return;
    }
    animeName = animeName.toLowerCase();
    return {animeEpisode, animeName}
}

async function main(siteElementsID) {
    const site = window.location.hostname;
    
    const titleID = getTitleID(siteElementsID, site);
    const subTitleID = getSubTitleID(siteElementsID, site);

    const titleComponent = await getElementInDOM(titleID);
    const subTitleComponent = await getElementInDOM(subTitleID);
    
    const {animeEpisode, animeName} = getNameAndEpisode(titleComponent, subTitleComponent, site);
    
    const episodeInfo = await getAnimeInfo(animeEpisode, animeName);
    if (episodeInfo){
        setTitle(titleComponent, episodeInfo.category, episodeInfo.color);
    }
     
    //const buttonStatus = await getButtonStatus();
    const buttonStatus = true;
    if (buttonStatus === true && episodeInfo.category === "FILLER") {
        intervalId = setInterval(skipEpisode, 2000);
        await skipEpisode(animeEpisode, siteElementsID, site);
    }

}

async function init() {
    try {
        const siteElementsID = {
            "www.crunchyroll.com": { titleID: "h1", subTitleID: "h4.text--gq6o-", nextEpisodeID: "a.playable-card-mini-static__link--UOJQm" },
            "www3.animeflv.net": { titleID: "h1.Title", subTitleID: "h2.SubTitle", nextEpisodeID: "a.CapNvNx.fa-chevron-right" },
            
        };
        intervalId = setInterval(() => main(siteElementsID), 1000);
    } catch (error) {
        console.error("Error in main:", error);
    }
} 

init();