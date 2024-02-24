import {
    fetchData,
    getAnimeObjectByName,
    getEpisodeInfo,
} from "./animeDataFunctions.js"


// carga el array de animes
let animeObjectsArray;
fetchData().then((data) => {
    animeObjectsArray = data;
});

let buttonStatus = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'processInfo':
            processInfo(message, sendResponse);
            return true;
        case 'setButtonInfo':
            buttonStatus = message.buttonStatus;
            sendResponse(buttonStatus);
            return true;
        case 'getButtonStatus':
            sendResponse(buttonStatus);
            return true;

        default:
            console.warn('Mensaje no reconocido:', message);
    }
});

async function processInfo({ animeName, episode }, sendResponse) {
    try {
        const animeObject = getAnimeObjectByName(animeName, animeObjectsArray);
        const episodeInfo = getEpisodeInfo(animeObject, episode);
        sendResponse(episodeInfo);
    } catch (error) {
        console.error('Error al procesar la información:', error);
    }
}