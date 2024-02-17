import {
    fetchData,
    getAnimeObjectByName,
    getEpisodeInfo,
    getEpisodeNumber,
  } from "./animeDataFunctions.js"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'processInfo':
            processInfo(message, sendResponse);
            return true;

        // Agrega más casos según sea necesario

        default:
            console.warn('Mensaje no reconocido:', message);
    }
});

async function processInfo(message, sendResponse)  {
    const animeObjectsArray = await fetchData();
    const animeObject = getAnimeObjectByName(message.animeName, animeObjectsArray);
    const episode = getEpisodeNumber(message.animeTitle)
    const episodeInfo = getEpisodeInfo(animeObject, episode);
    console.log("LOG:", episodeInfo) 
    sendResponse(episodeInfo);
}