export function fetchData() {
    return new Promise(async (resolve, reject) => {
        const localData = await getLocalData();

        if (localData) {
            resolve(localData);
            return;
        }

        try {
            const json = await fetchRemoteData();
            saveLocalData(json);
            resolve(json);
        } catch (error) {
            reject(error);
        }
    });
}

function getLocalData() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['cachedAnimeData'], (result) => {
            const animeData = result.cachedAnimeData;
            if (animeData) {
                resolve(animeData.animes);
            } else {
                resolve(null);
            }
        });
    });
}

function fetchRemoteData() {
    return fetch(chrome.runtime.getURL('infoAnimes.json'))
        .then((response) => response.json());
}

function saveLocalData(json) {
    chrome.storage.local.set({ cachedAnimeData: json });
}


export function getAnimeObjectByName(animeName, animeObjectsArray) {
    return animeObjectsArray.find(anime => anime.name === animeName);
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

