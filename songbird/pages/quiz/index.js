import birdsData from '../../assets/bd/birds.js'
const gameElement = document.querySelector('.game');
const riddleAudio = document.querySelector('.riddle__audio');
const riddleBtnPlay = document.querySelector('.riddle__audio-play');
let riddleAudioDecorated = defeniteAudioDecorated(riddleAudio);
let gameCount = 0;

window.addEventListener('load', windowLoadHandler);
riddleBtnPlay.addEventListener('click', (e) => {
  switchPlaySinginBird(riddleAudio, riddleBtnPlay)
})
riddleAudioDecorated.addEventListener('input', () => {
  let audioDecorated = defeniteAudioDecorated(riddleAudio);
  movingRiddleAudioDecorated(riddleAudio, audioDecorated)
})
birdGuessing(birdsData)

function windowLoadHandler() {
  appendBirdsList()
  addAudioSingingGuessBird(riddleAudio, birdsData)
}

console.log(birdsData)

function birdGuessing(birdsData) {
  birdsData[gameCount].forEach(birds => {
    birds.guess = false;
  });
  let randomNum = generateRandomNum(0, birdsData[gameCount].length - 1);
  birdsData[gameCount][randomNum].guess = true;
}

function generateRandomNum(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function createListBirds() {
  let birdsList = document.createDocumentFragment();
  for (let i = 0; i < birdsData[gameCount].length; i++) {
    let bird = birdsData[gameCount][i];

    let birdItem = document.createElement('li');
    let birdName = document.createElement('span');

    birdItem.classList.add('game__item');
    birdName.classList.add('game__item-text');

    birdName.textContent = bird.name;
    birdItem.appendChild(birdName);
    birdsList.appendChild(birdItem);
  }
  return birdsList;
}

function appendBirdsList() {
  clearBirdsListItems()
  let birdsListItems = document.querySelector('.game__items');
  let birdsItem = createListBirds();
  if (!birdsListItems) return;
  birdsListItems.appendChild(birdsItem);
}

function clearBirdsListItems() {
  let birdsListItems = document.querySelector('.game__items');
  if (!birdsListItems) return;
  birdsListItems.innerHTML = '';
}

function addAudioSingingGuessBird(riddleAudio, birdsData) {
  if (!riddleAudio) return
  birdsData[gameCount].forEach(bird => {
    if (bird.guess) {
      riddleAudio.src = bird.audio;

      riddleAudio.addEventListener('canplay', () => {
        riddleOffLoaderAduio()
        let audioDecorated = defeniteAudioDecorated(riddleAudio);
        audioDecorated.max = Math.ceil(riddleAudio.duration)
      })
    }
  });
}

function riddleOffLoaderAduio() {
  const audioWrapper = document.querySelector('.riddle-audio-wrapper-disabled');
  if (!audioWrapper) return
  audioWrapper.classList.add('riddle-audio-wrapper-disabled_off')
}

function switchPlaySinginBird(audio, btnPlay) {

  btnPlay.classList.toggle('play-btn_pause');
  if (btnPlay.classList.contains('play-btn_pause') && audio.paused) {
    console.log('click')
    playSinginBird(audio, btnPlay)
    playAudioHandler(btnPlay)
  } else {
    console.log('c')
    stopSinginBird(audio)
    pauseAudioHandler(btnPlay)
  }
}

function playAudioHandler(btnPlay) {
  btnPlay.innerHTML = '<svg viewBox="0 0 47.607 47.607"><path fill="#00bc8c" d="M17.991 40.976a6.631 6.631 0 01-13.262 0V6.631a6.631 6.631 0 0113.262 0v34.345zM42.877 40.976a6.631 6.631 0 01-13.262 0V6.631a6.631 6.631 0 0113.262 0v34.345z"></path></svg>'
}

function pauseAudioHandler(btnPlay) {
  btnPlay.innerHTML = '<svg viewBox="-200 0 1200 1000"><path fill="#00bc8c" d="M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z"></path></svg>'
}

function playSinginBird(audio, btnPlay) {
  audio.play()

  audio.addEventListener('timeupdate', (e) => {
    playSinginBirdHandler(audio)
  });

  audio.addEventListener('ended', () => {
    endAudioHandler(btnPlay)
  });
}

function movingRiddleAudioDecorated(audio, audioDecorated) {
  console.log(audioDecorated.value)
  console.log(audio)
  audio.currentTime = audioDecorated.value;
  console.log(audio.currentTime)
  audioDecorated.value = audioDecorated.value;
}

function endAudioHandler(btnPlay) {
  btnPlay.classList.remove('play-btn_pause')
  pauseAudioHandler(btnPlay)

}

function defeniteAudioDecorated(audio) {
  let audioBox = audio.parentElement;
  if (!audioBox && !audioBox.hasAttribute('for')) return
  let audioBoxLink = audioBox.getAttribute('for')
  let audioDecorated = document.querySelector(`#${audioBoxLink}`);
  if (!audioDecorated) return
  return audioDecorated;
}

function playSinginBirdHandler(audio) {
  let audioDecorated = defeniteAudioDecorated(audio);
  let currentTime = Math.ceil(audio.currentTime);
  console.log(currentTime)
  audioDecorated.value = currentTime;
  audioDecorated.max = Math.ceil(audio.duration);
}

function stopSinginBird(audio) {
  audio.pause()
}
