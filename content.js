let animeObjectsArray;
function fetchData() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['cachedAnimeData'], function(result) {
        const animeData = result.cachedAnimeData;
  
        if (animeData){
            animeObjectsArray = animeData.animes;
            resolve();
        }
        fetch(chrome.runtime.getURL('infoAnimes.json'))
            .then(response => response.json())
            .then((json) => {
              chrome.storage.local.set({cachedAnimeData: json});
              animeObjectsArray = json.animes;
              resolve();
            })
            .catch(error => reject(error));

      });
    });
  }




function getAnimeObjectByName(animeName) {
    return animeObjectsArray.find(anime => anime.name === animeName);
}

function getAnimeObjectInArray() {
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


function getH1Title() {
    return new Promise(async (resolve) => {
        let h1Element = document.querySelector("h1");

        while (!(h1Element)) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // pausa la ejecución por 1seg
            h1Element = document.querySelector("h1");
        }

        resolve(h1Element);
    });
}


// Determina el tag y el color del tag EJ: {CANON, GREEN}
function episodeInfo(anime, episode) {
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


function setTitle(h1Element, tag, color) {

    const animeName = document.querySelector('h4.text--gq6o-').textContent
    if (!getAnimeObjectByName(animeName)) return; // se asegura que el anime este en la lista de animes antes de cambiar el titulo

    let spanElement = document.createElement("span");

    spanElement.innerText = tag;
    h1Element.appendChild(spanElement);
    spanElement.style.color = color;

}

function getEpisodeNumber(title) {
    let match = title.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}



function titleIncludeInformation(titleText) {
    return titleText.includes("CANON") 
    || titleText.includes("RELLENO") 
    || titleText.includes("MIXTO") 
    || titleText.includes("ANIME CANON");
}

async function setInformation() {
    const anime = await getAnimeObjectInArray();
    const h1 = await getH1Title();
    const titleText = h1.innerText;
    const episode = getEpisodeNumber(titleText);
    
    if (anime.name && !titleIncludeInformation(titleText)) {
        let info = episodeInfo(anime, episode);
        setTitle(h1, info.tag, info.color);
    }
}

// Ejecuta la función inicialmente.
async function main() {
    try {
        await fetchData();
        await setInformation();
    } catch (error) {
        console.error("Error en la ejecución de main:", error);
    }
}

async function waitForPageLoad() {
    while (!document.querySelector('h1')) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

async function runMainLoop() {
    await waitForPageLoad();
    await main();
    intervalId = setInterval(setInformation, 1000);
}

runMainLoop();



  
