

async function getH1AndH4Info() {
    const h1Element = await getElement("h1");
    const h4Element = await getElement("h4.text--gq6o-");

    if (h1Element && h4Element) {
        const h1Text = h1Element.innerText;
        const h4Text = h4Element.innerText;

        chrome.runtime.sendMessage({ action: 'processInfo', h1Text, h4Text }, (response) => {
            console.log('Respuesta desde background.js:',  response);

            // Ejecuta la función para establecer el título con la respuesta del background.js
            //setTitle(h1Element, response.tag, response.color);
        });
    }
}

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


function getElement(nameElement) {
    return new Promise(async (resolve) => {
        let element = document.querySelector(nameElement);

        while (!(element)) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // pausa la ejecución por 1seg
            element = document.querySelector(nameElement);
        }

        resolve(element);
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
    const h1 = await getElement("h1");
    const titleText = h1.innerText;
    const episode = getEpisodeNumber(titleText);
    
    if (anime.name && !titleIncludeInformation(titleText)) {
        let info = episodeInfo(anime, episode);
        setTitle(h1, info.tag, info.color);
    }
}

async function main() {
    await getH1AndH4Info();
    
    await fetchData();
    await setInformation();
    intervalId = setInterval(setInformation, 1000);
}  


main();
  
