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
            resolve(json.animes);
        } catch (error) {
            reject(error);
        }
    });
}

function getLocalData() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['cachedAnimeData'], (result) => {
            const animeData = result.cachedAnimeData;

            if (!animeData) {
                resolve(null); 
            }

            resolve(animeData.animes);
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

export function getEpisodeInfo(anime, episode, userColors = {}) {
    const category = determineCategory(anime, episode);
    const color = getColorForCategory(category, userColors);
    return { category, color };
}

function determineCategory(anime, episode) {
    switch (true) {
        case anime.canonAnimeEpisodes.includes(episode):
            return 'ANIME_CANON';
        case anime.canonEpisodes.includes(episode):
            return 'CANON';
        case anime.fillerEpisodes.includes(episode):
            return 'RELLENO';
        case anime.mixedEpisodes.includes(episode):
            return 'MIXTO';
        default:
            return;
    }
}

function getColorForCategory(category, userColors) {
    return userColors[category] || getDefaultColors()[category] || '';
}

function getDefaultColors() {
    return {
        ANIME_CANON: 'blue',
        CANON: 'green',
        RELLENO: 'red',
        MIXTO: 'orange'
    };
}

export function getEpisodeNumber(title) {
    let match = title.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}


