export function fetchData() {
    let animeObjectsArray;
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['cachedAnimeData'], function(result) {
        const animeData = result.cachedAnimeData;
  
        if (animeData){
            animeObjectsArray = animeData.animes;
            resolve(animeObjectsArray);
        }
        
        fetch(chrome.runtime.getURL('infoAnimes.json'))
            .then(response => response.json())
            .then((json) => {
              chrome.storage.local.set({cachedAnimeData: json});
              animeObjectsArray = json.animes;
              resolve(animeObjectsArray);
            })
            .catch(error => reject(error));
      });
    });
}

export function getAnimeObjectByName(animeName, animeObjectsArray) {
    return animeObjectsArray.find(anime => anime.name === animeName);
}

export function getAnimeObjectInArray() {
    return new Promise(function(resolve) {
        const interval = setInterval(function () {
            const animeName = document.querySelector('h4.text--gq6o-').textContent;
            const anime = getAnimeObjectByName(animeName);
            if (anime) {
                clearInterval(interval);
                resolve(anime);
            }
        }, 1000);
    });
}

// Determina el tag y el color del tag EJ: {CANON, GREEN}
export function getEpisodeInfo(anime, episode) {
    let tag = "";
    let color = "";

    switch (true) {
        case anime.canonAnimeEpisodes.includes(episode):
            tag = " ANIME CANON";
            color = "green";
            console.log(`Episodio Anime Canon: ${episode}`);
            break;

        case anime.canonEpisodes.includes(episode):
            tag = " CANON";
            color = "green";
            console.log(`Episodio no relleno: ${episode}`);
            break;

        case anime.fillerEpisodes.includes(episode):
            tag = " RELLENO";
            color = "red";
            console.log(`Episodio de relleno: ${episode}`);
            break;

        case anime.mixedEpisodes.includes(episode):
            tag = " MIXTO";
            color = "orange";
            break;

        default:
            console.log("Número de episodio no encontrado en ninguna categoría.");
    }
    return {tag:tag, color:color}
}

export function getEpisodeNumber(title) {
    let match = title.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

