export function fetchData() {
    return new Promise(async (resolve, reject) => {
        try {
            const json = await fetchRemoteData();
            resolve(json.animes);
        } catch (error) {
            reject(error);
        }
    });
}

function fetchRemoteData() {
    return fetch(chrome.runtime.getURL('infoAnimes.json'))
        .then((response) => response.json());
}

export function getAnimeObjectByName(animeName, animeObjectsArray) {
    if (animeObjectsArray === undefined || animeName === undefined) {
        return null;
    }
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
            return 'FILLER';
        case anime.mixedEpisodes.includes(episode):
            return 'MIXED';
        default:
            return;
    }
}

function getColorForCategory(category, userColors) {
    return userColors[category] || getDefaultColors()[category] || '';
}

function getDefaultColors() {
    return {
        ANIME_CANON: 'green',
        CANON: 'green',
        FILLER: 'red',
        MIXED: 'orange'
    };
}