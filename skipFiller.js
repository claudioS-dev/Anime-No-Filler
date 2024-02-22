function init() {
    function styleButton(button) {
    button.style.zIndex = '999';
    button.style.color = 'white';
    button.style.position = 'fixed';
    button.style.right = '0';
    button.style.bottom = '80px';
  
    button.style.backgroundColor = '#ec1c24'; 
    button.style.border = 'none';
    button.style.padding = '12px 20px';
    button.style.borderRadius = '5px'; 
    button.style.fontSize = '18px';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.display = 'none';
    button.id = 'skipButton';
  }

  function addButtonSkip(){
    let root = document.getElementById('vilosRoot')
  if (!root) {
    return

    let player = document.getElementById('player0')

    let button = document.createElement('div')
    styleButton(button)
    button.innerHTML = `Saltar Intro<br/>${resp.text}`
  
    button.onclick = () => {
      player.currentTime = resp.interval
    }
  }
  }
  
}