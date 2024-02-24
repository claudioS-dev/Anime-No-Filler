function getButtonStatus(){
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getButtonStatus',}, (response) => {
            resolve(response);
        });
    });
}

function sendButtonInfo(buttonStatus) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'setButtonInfo', buttonStatus}, (response) => {
            resolve(response);
        });
    });
}

var toggleSwitch = document.getElementById('ToggleSwitch');
document.addEventListener('DOMContentLoaded', async function() {
    toggleSwitch.checked = await getButtonStatus();
});
document.addEventListener('DOMContentLoaded', function() {
    toggleSwitch.addEventListener('change', async function() {
        toggleSwitch.checked = await sendButtonInfo(toggleSwitch.checked);
    });
});

