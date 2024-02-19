import {
    fetchData,
    getAnimeObjectByName,
    getEpisodeInfo,
    getEpisodeNumber,
} from "./animeDataFunctions.js"

// carga el array de animes
let animeObjectsArray;
fetchData().then((data) => {
    animeObjectsArray = data;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'processInfo':
            processInfo(message, sendResponse);
            return true;

        default:
            console.warn('Mensaje no reconocido:', message);
    }
});

async function processInfo({ animeName, animeTitle }, sendResponse) {
    try {
        const animeObject = getAnimeObjectByName(animeName, animeObjectsArray);
        const episode = getEpisodeNumber(animeTitle);
        const episodeInfo = getEpisodeInfo(animeObject, episode);
        sendResponse(episodeInfo);
    } catch (error) {
        console.error('Error al procesar la información:', error);
    }
}
