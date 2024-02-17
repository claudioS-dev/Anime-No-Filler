console.log("TEST")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'processInfo':
            let info = handleProcessInfo(message, sendResponse);
            sendResponse(info);
            break;

        // Agrega más casos según sea necesario

        default:
            console.warn('Mensaje no reconocido:', message);
    }
});

function handleProcessInfo(message, sendResponse) {
    // Aquí puedes ejecutar las funciones que necesitan la información de h1 y h4
    const h1Text = message.h1Text;
    const h4Text = message.h4Text;

    return "RESPUESTA: ";

}