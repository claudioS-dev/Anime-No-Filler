function sendButtonInfo(buttonStatus) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'setButtonInfo', buttonStatus}, (response) => {
            resolve(response);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var toggleSwitch = document.getElementById('ToggleSwitch');
    toggleSwitch.addEventListener('change', async function() {
        await sendButtonInfo(toggleSwitch.checked);
    });
  });