const CATEGORIES = {
    "es":{
        ANIME_CANON: 'Anime Canon',
        CANON: 'Canon',
        FILLER: 'Relleno',
        MIXED: 'Mixto'
    },
    "en":{
        ANIME_CANON: 'Anime Canon',
        CANON: 'Canon',
        FILLER: 'Filler',
        MIXED: 'Mixed'
    },
    "pt":{
        ANIME_CANON: 'Anime Canon',
        CANON: 'Canon',
        FILLER: 'Filler',
        MIXED: 'Misto'
    },
    "fr":{
        ANIME_CANON: 'Anime Canon',
        CANON: 'Canon',
        FILLER: 'Remplissage',
        MIXED: 'Mixte'
    }
}

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
    //languaje use API
    const lang = chrome.i18n.getUILanguage().split('-')[0];
    const validLanguage = CATEGORIES[lang] ? lang : 'en';

    const category = determineCategory(anime, episode,validLanguage);
    const color = getColorForCategory(category.idCategory, userColors);
    return { category, color };
}

function determineCategory(anime, episode,validLanguage) {
    switch (true) {
        case anime.canonAnimeEpisodes.includes(episode):
            return {idCategory:"ANIME_CANON",
                    category:CATEGORIES[validLanguage].ANIME_CANON};
        case anime.canonEpisodes.includes(episode):
            return {idCategory:"CANON",
                    category:CATEGORIES[validLanguage].CANON};
        case anime.fillerEpisodes.includes(episode):
            return {idCategory:"FILLER",
                    category:CATEGORIES[validLanguage].FILLER}
        case anime.mixedEpisodes.includes(episode):
            return {idCategory:"MIXED",
                    category:CATEGORIES[validLanguage].MIXED}
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