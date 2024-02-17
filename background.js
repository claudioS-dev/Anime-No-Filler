import {
    fetchData,
    getAnimeObjectByName,
    getEpisodeInfo,
    getEpisodeNumber,
  } from "./animeDataFunctions.js"

async function loadData(){
    return await fetchData();
}
let animeObjectsArray = loadData();


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'processInfo':
            const animeObject = getAnimeObjectByName(message.animeName, animeObjectsArray);
            const episode = getEpisodeNumber(message.animeTitle)
            const episodeInfo = getEpisodeInfo(animeObject, episode);
            sendResponse(episodeInfo);
            break;

        // Agrega más casos según sea necesario

        default:
            console.warn('Mensaje no reconocido:', message);
    }
});