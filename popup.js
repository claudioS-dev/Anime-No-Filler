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
async function main(){

    var toggleSwitch = document.getElementById('ToggleSwitch');
    var status = await getButtonStatus();
 
    toggleSwitch.checked = status;

    document.addEventListener('DOMContentLoaded', function() {
        toggleSwitch.addEventListener('change', async function() {
            await sendButtonInfo(toggleSwitch.checked);
        });
    });
}

//main()
