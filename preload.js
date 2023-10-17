
const { ipcRenderer } = require('electron')


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
    getWins();
    initCapture();
})

function getWins() {
  const btn  = document.querySelector('#getWins');
  btn.onclick = async () => {
    const inputSources = await ipcRenderer.invoke('getSources')
    createWinSelect(inputSources)
  }
}

function initCapture() {

  document.querySelector('#win-lists').onclick = async (e) => {
    const target = e.target;
    const sourceId = target.getAttribute('data-id');
    console.log('sourceId:', sourceId);

    let constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId
        }
      }
    }

    const stream = await navigator.mediaDevices
      .getUserMedia(constraints);

      handleStream(stream)
  };



}

  function createWinSelect(sources) {
    let html = '';
    try {
      sources.forEach(item => {
        html = html + `<div data-id="${item.id}">${item.name}</div>`;
      });
    }catch(e) {
      console.log(e.message);
    }
    console.log('sources', html);
    document.querySelector('#win-lists').innerHTML = html;
  }



  function handleStream (stream) {
    const tracks = stream.getTracks();
    console.log('tracks length', tracks);
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }