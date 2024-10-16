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

function setTitle(titleElement, category, color) {
    
    if (document.querySelector('[name="spanTAG"]')) { 
        return;
    }
    const spanElement = document.createElement("span");
    const categoryFormatted = category.replace("_", " ");
    spanElement.innerText = " " + categoryFormatted;
    spanElement.style.backgroundColor = color;
    spanElement.style.padding = '6px';
    spanElement.style.marginBottom = '20px';
    spanElement.style.borderRadius = '6px';
    spanElement.style.textAlign = 'center';
    spanElement.style.color = 'white';
    spanElement.style.fontFamily = 'Arial';
    spanElement.style.fontSize = '12px';
    spanElement.style.display = 'inline-block';
    spanElement.setAttribute("name", "spanTAG");
    titleElement.parentNode.insertBefore(spanElement, titleElement);
}



function getEpisodeNumber(title) {
    const match = title.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

function getNextEpisodeID(siteElementsID, site) {
    return siteElementsID[site]?.nextEpisodeID || null;
}

function skipEpisode(currentEpisode, siteElementsID, site) {
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

function getStoredState(keyName) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keyName, function(result) {
            const storedState = result[keyName];
            if (!storedState) {
                resolve(null)
            }
            resolve(storedState);
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
            animeEpisode = getEpisodeNumber(titleComponent.textContent);
            animeName = subTitleComponent.textContent;
            break;
        case "www3.animeflv.net":
            animeEpisode = getEpisodeNumber(subTitleComponent.textContent);
            animeName = titleComponent.textContent.match(/(.+?) Episodio/)[1];
            break;
        case "9animetv.to":
            animeEpisode = titleComponent.querySelector('#cm-episode-number').textContent;
            animeName = subTitleComponent.textContent;
            break;
        case "animevision.masterstreet.cl":
            animeName = titleComponent.textContent.split("-")[0].trim();
            animeEpisode = subTitleComponent.textContent.match(/(\d+)/)[1];
            break;
        default:
            return;
    }
    animeName = animeName.toLowerCase();
    animeEpisode = parseInt(animeEpisode);
    return {animeEpisode, animeName}
}

function removeSpanTAG(){
    const spanTAG = document.querySelector('[name="spanTAG"]');
    if (spanTAG) {spanTAG.remove();}
}

function skipMinute(time){
    let player = document.getElementById('player0')
    player.currentTime = time
}

function setCacheData(dataName, dataSave) {
    const dataToSave = { [dataName]: dataSave };
    chrome.storage.local.set(dataToSave);
}

async function main(siteElementsID) {
    const site = window.location.hostname;

    const titleID = getTitleID(siteElementsID, site);
    const subTitleID = getSubTitleID(siteElementsID, site);
    
    const titleComponent = await getElementInDOM(titleID);
    const subTitleComponent = await getElementInDOM(subTitleID);

    const {animeEpisode, animeName} = getNameAndEpisode(titleComponent, subTitleComponent, site);

    const oldAnimeEpisode = await getStoredState("animeEpisode");
    if (oldAnimeEpisode && oldAnimeEpisode != animeEpisode){
        removeSpanTAG();
    }

    //const startTime = performance.now();
    const {category:nextCategory} = await getAnimeInfo(animeEpisode+1, animeName)
    const {category, color, imgURL} = await getAnimeInfo(animeEpisode, animeName);
    //const {preCategory, preColor } = await getAnimeInfo(animeEpisode-1, animeName)

    //const endTime = performance.now();
    //console.log("Time to get anime info:", endTime - startTime);
    setCacheData("animeName", animeName)
    setCacheData("animeEpisode",animeEpisode)
    setCacheData("animeImgURL", imgURL)

    if (category && color){
        setTitle(titleComponent, category.category, color);
    }

    const buttonStatus = await getStoredState('skipButtonState');
    
    if (!buttonStatus){
        return;
    }

    if (category.idCategory != "FILLER"){
        return;
    }

    //intervalId = setInterval(skipEpisode, 2000);
    skipEpisode(animeEpisode, siteElementsID, site);
    if (nextCategory.idCategory != "FILLER" && site == "www.crunchyroll.com"){
        window.location.reload();
        console.log("reload")   
    }   
    

    
    console.log("preCategory", preCategory)
    console.log(typeof animeEpisode)
    

    /* const startAnime = 800;
    const reproductor = await getElementInDOM('#player0');
    const currentMinute = reproductor.currentTime;
    console.log("test", currentMinute)
    if (currentMinute < startAnime){
        skipMinute(startAnime)
     }*/


}

async function init() {
    try {
        const siteElementsID = {
            "www.crunchyroll.com": { titleID: "h1", subTitleID: "h4.text--gq6o-", nextEpisodeID: "a.playable-card-mini-static__link--UOJQm" },
            "www3.animeflv.net": { titleID: "h1.Title", subTitleID: "h2.SubTitle", nextEpisodeID: "a.CapNvNx.fa-chevron-right" },
            "9animetv.to": { titleID: 'a.btn.btn-sm.btn-comment-tab[data-type="episode"]', subTitleID: "h2.film-name", nextEpisodeID: "a.btn.btn-sm.btn-next" },
            "animevision.masterstreet.cl": {titleID: "h1.lang-name", subTitleID: "h4.episodes-display", nextEpisodeID: "button.next-button"},
        };
        intervalId = setInterval(() => main(siteElementsID), 1000);
    } catch (error) {
        console.error("Error in main:", error);
    }
} 

init();