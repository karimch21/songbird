import birdGuessed, { appendBirdsList, birdGuessing, Player } from '../quiz/index.js'
let gameItemsBox = document.querySelector('.game');
let scoreBlock = document.querySelector('.score span');
let btnNext = document.querySelector('.btn-next');
let gameCount = 0;
let score = 0;
let totalScore = 0;
let penaltyPoints = 0;
let audioPlayer = new Player();
let riddleBlockMinute = 0;
let riddleBlockSeconds = 0;
let gameBlockMinute = 0;
let gameBlockSeconds = 0;
let totalSeconds = 0;
let totalMinute = 0;
let birdActiveCount = 0;
console.log(audioPlayer)

window.addEventListener('load', () => {
  appendSoundIndication();
});

gameItemsBox.addEventListener('click', (e) => {
  gameClickHandler(e);
});
btnNext.addEventListener('click', jumpNextQuestion)

function gameClickHandler(e) {
  let gameItem = e.target.closest('.game__item');
  if (gameItem) {
    let gameItemId = gameItem.dataset.id - 1;
    let bird = birdGuessed[gameCount][gameItemId];
    let birdCard = createCardBird(bird);
    console.log(bird, gameCount)
    appendBirdCard(birdCard);
    addHandlersGameAudioElements()
    checkGuessedBird(bird, gameItem);
  }
}

function createCardBird(bird) {
  let birdCard = `
  
          <div class="game__bird-promo">
            <div class="game__bird-box">
              <img src="${bird.image}" alt="" class="game__bird-img">
            </div>
            <div class="game__bird-content">
              <div class="game__bird-title">
                ${bird.name}
              </div>
              <div class="game__bird-title game__bird-title_en">
                ${bird.species}
              </div>

              <div class="game__audio-box audio-wrapper-disabled">
              <div class="game__audio-wrap singing">
                <label for="game__audio" class="audio__box">
                  <audio src="${bird.audio}" class="game__audio"></audio>
                </label>
              <div class="game__audio-info singing__box">
                <button class="game__audio-play play-btn">
                  <svg class="game__play-img play-img" viewBox="-200 0 1200 1000">
                    <path fill="#00bc8c" d="M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z">
                    </path>
                  </svg>
                </button>

                  <div class="singing__inner-box">
                    <input type="range" id="game__audio" class="game__audio-track singing-track" min="0" value="0" max="10">
                    <div class="game__volume-wrap singing__volume-wrap">
                      <input type="range" class="game__volume singing__volume">
                    </div>
                  </div>
                </div>

                <div class="singing__time game__time-box">
                  <span class="game__time game__current-time singing__current-time">00:00</span>
                  <span class="game__time game__total-time singing__total-time">00:00</span>
                </div>

              </div>
            </div>


            </div>
          </div>
          <p class="game__bird-text">
            ${bird.description}
          </p>
       
  `
  return birdCard;
}

function appendBirdCard(cardBird) {
  let gameBirdInfo = document.querySelector('.game__bird-info');
  if (!gameBirdInfo) return
  gameBirdInfo.innerHTML = cardBird;
}
function scoring() {
  let allGameItem = document.querySelectorAll('.game__item_err');
  let gameItemActive = document.querySelector('.game__item_active');
  birdActiveCount++;
  if (birdActiveCount <= 1) {
    if (allGameItem.length === 6) {
      scoreBlock.textContent = 0;
    }
    else {
      totalScore += 5 - allGameItem.length
      scoreBlock.textContent = totalScore
    }
  }
}
function checkGuessedBird(bird, gameItem) {
  let soundIndiocationCorrect = document.querySelector('.sound-indication_correct');
  let soundIndiocationError = document.querySelector('.sound-indication_error');

  if (bird.guess) {
    appendInfoGuessedBirdCard(bird)
    addActiveClassBirdItem(gameItem)
    scoring()
    moveNextLevel()
    playSoundIndication(soundIndiocationCorrect)
  }
  else {
    addErrorClassBirdItem(gameItem)
    playSoundIndication(soundIndiocationError)
  }
}
function addErrorClassBirdItem(birdItem) {
  let allGameItem = document.querySelectorAll('.game__item');
  let flag = false;
  for (let item of allGameItem) {
    if (item.classList.contains('game__item_active')) {
      flag = true;
    }
  }
  if (!flag) {
    birdItem.classList.add('game__item_err')
  }
}

function addActiveClassBirdItem(birdItem) {
  let allGameItem = document.querySelectorAll('.game__item');
  if (!allGameItem) return

  birdItem.classList.add('game__item_active')
}

function appendInfoGuessedBirdCard(bird) {
  let riddleTitle = document.querySelector('.riddle__title');
  let riddleImg = document.querySelector('.riddle__img');
  riddleTitle.textContent = bird.name;
  riddleImg.src = bird.image;
}

function moveNextLevel() {
  deleteClassDisabled()
}

function deleteClassDisabled() {
  btnNext.classList.remove('btn-next_disabled');

}

function jumpNextQuestion() {
  if (!btnNext.classList.contains('btn-next_disabled')) {
    if (gameCount == birdGuessed.length - 1) return
    gameCount++;
    updateContent()
    btnNext.classList.add('btn-next_disabled')
  }
}

function updateContent() {
  birdActiveCount = 0;
  birdGuessing(birdGuessed, gameCount);
  appendBirdsList(birdGuessed, gameCount);
  showCurrentNameQuestion()
  clearCardBird()
  updateRiddleAudioTime();
  returnRiddleBlockDefaultView();
  updateRiddleAudio()
}

function showCurrentNameQuestion() {
  let questions = document.querySelectorAll('.pagination__item');
  questions.forEach(quest => {
    quest.classList.remove('pagination__item_active');
  });
  questions[gameCount].classList.add('pagination__item_active');
}

function clearCardBird() {
  let gameBirdInfo = document.querySelector('.game__bird-info');
  if (!gameBirdInfo) return
  let gameBirdPlug = document.createElement('p');
  gameBirdPlug.classList.add('game__bird-plug');
  gameBirdPlug.textContent = 'Послушайте плеер. Выберите птицу из списка'
  gameBirdInfo.innerHTML = '';
  gameBirdInfo.appendChild(gameBirdPlug);
}

function returnRiddleBlockDefaultView() {
  let riddle = document.querySelector('.riddle');
  if (!riddle) return
  riddle.innerHTML = `
    <div class="riddle__inner">
          <div class="riddle__img-box">
            <img src="../../assets/image/nonameBird.jpg" alt="" class="riddle__img">
          </div>
          <div class="riddle__info">
            <div class="riddle__title">
              ******
            </div>
            <div class="riddle__audio-box riddle-audio-wrapper-disabled">
              <div class="riddle__audio-wrap singing">
                <label for="riddle__audio" class="audio__box">
                  <audio src="" class="riddle__audio"></audio>
                </label>
                <div class="riddle__audio-info singing__box">
                  <button class="riddle__audio-play play-btn">
                    <svg class="riddle__play-img play-img" viewBox="-200 0 1200 1000">
                      <path fill="#00bc8c"
                        d="M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z">
                      </path>
                    </svg>
                  </button>
                  <div class="singing__inner-box">
                    <input type="range" id="riddle__audio" class="riddle__audio-track singing-track" min="0" value="0"
                      max="10">
                    <div class="riddle__volume-wrap singing__volume-wrap"><input type="range"
                        class="riddle__volume singing__volume">
                    </div>
                  </div>
                </div>
                <div class="singing__time">
                  <span class="riddle__current-time singing__current-time">00:00</span>
                  <span class="riddle__total-time singing__total-time">00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;

}

function updateRiddleAudio() {
  let riddleAudio = document.querySelector('.riddle__audio');
  let riddleBtnPlay = document.querySelector('.riddle__audio-play');
  let riddleAudioDecorated = audioPlayer.defeniteAudioDecorated(riddleAudio);
  let riddleBoxCurrentTime = document.querySelector('.riddle__current-time');
  let riddleBoxTotalTime = document.querySelector('.riddle__total-time');

  if (!riddleAudio) return
  riddleAudio.addEventListener('canplay', () => {
    audioPlayer.riddleOffLoaderAduio()
    let audioDecorated = audioPlayer.defeniteAudioDecorated(riddleAudio);
    audioDecorated.max = Math.ceil(riddleAudio.duration);
    updateTotalTimeRiddleAudio(riddleAudio, document.querySelector('.riddle__total-time'))
  });
  audioPlayer.addAudioSingingGuessBird(riddleAudio, birdGuessed, gameCount)

  riddleBtnPlay.addEventListener('click', (e) => {
    audioPlayer.switchPlaySinginBird(riddleAudio, riddleBtnPlay)
  })

  riddleAudioDecorated.addEventListener('input', () => {
    let audioDecorated = audioPlayer.defeniteAudioDecorated(riddleAudio);
    audioPlayer.movingRiddleAudioDecorated(riddleAudio, audioDecorated)
  })

  riddleAudio.addEventListener('timeupdate', (e) => {
    audioPlayer.playSinginBirdHandler(riddleAudio)
    audioPlayer.showRiddleAudioCurrentTime(riddleAudio, riddleBlockMinute, riddleBlockSeconds, totalMinute, totalSeconds, riddleBoxCurrentTime, riddleBoxTotalTime)
  });

  riddleAudio.addEventListener('ended', () => {
    audioPlayer.endAudioHandler(riddleBtnPlay)
  });
  console.log(riddleAudio.currentTime, riddleBlockMinute, riddleBlockSeconds)
}

function updateRiddleAudioTime() {
  let audio = document.querySelector('.riddle__audio');
  if (!audio) return
  audio.currentTime = 0;
  riddleBlockMinute = 0
  riddleBlockSeconds = 0
  totalSeconds = 0;
  totalMinute = 0;
}

function updateTotalTimeRiddleAudio(audio, elemTotalTime) {
  if (!elemTotalTime) return
  let totalMinute = Math.floor(audio.duration / 60);
  let totalSeconds = Math.ceil(((audio.duration / 60) - totalMinute) * 60);
  if (!audio.duration) return
  elemTotalTime.textContent = `${('0' + totalMinute).slice(-2)}:${('0' + totalSeconds).slice(-2)}`;
}

function addHandlersGameAudioElements() {
  let btnPlay = document.querySelector('.game__audio-play');
  let audio = document.querySelector('.game__audio');
  let gameBoxCurrentTime = document.querySelector('.game__current-time');
  let gameBoxTotalTime = document.querySelector('.game__total-time');
  let gameAudioDecorated = audioPlayer.defeniteAudioDecorated(audio);
  console.log(gameBoxCurrentTime, gameBoxTotalTime)
  if (!audio && btnPlay) return
  btnPlay.addEventListener('click', () => {
    gamePlayBtnHanlder(audio, btnPlay)
  });
  audio.addEventListener('timeupdate', (e) => {
    audioPlayer.playSinginBirdHandler(audio)
    audioPlayer.showRiddleAudioCurrentTime(audio, gameBlockMinute, gameBlockSeconds, totalMinute, totalSeconds, gameBoxCurrentTime, gameBoxTotalTime)
  });
  gameAudioDecorated.addEventListener('input', () => {
    audioPlayer.movingRiddleAudioDecorated(audio, gameAudioDecorated)
  })
  audio.addEventListener('canplay', () => {
    const audioWrapper = document.querySelector('.game__audio-box');
    audioPlayer.riddleOffLoaderAduio(audioWrapper)
    let audioDecorated = audioPlayer.defeniteAudioDecorated(audio);
    audioDecorated.max = Math.ceil(audio.duration)
  });
  audio.addEventListener('ended', () => {
    audioPlayer.endAudioHandler(btnPlay)
  });
}

function gamePlayBtnHanlder(audio, btnPlay) {
  console.log(45678)
  audioPlayer.switchPlaySinginBird(audio, btnPlay);
}

function createSoundIndicationError() {
  let soundIndiocation = document.createElement('audio');
  soundIndiocation.classList.add('sound-indication', 'sound-indication_error');
  soundIndiocation.src = '../../assets/audio/error.mp3';
  return soundIndiocation;
}

function createSoundIndicationCorrect() {
  let soundIndiocation = document.createElement('audio');
  soundIndiocation.classList.add('sound-indication', 'sound-indication_correct');
  soundIndiocation.src = '../../assets/audio/right.mp3';
  return soundIndiocation;
}

function appendSoundIndication() {
  let soundIndiocationCorrect = createSoundIndicationCorrect();
  let soundIndiocationError = createSoundIndicationError();
  document.body.appendChild(soundIndiocationCorrect);
  document.body.appendChild(soundIndiocationError);
}

function playSoundIndication(soundIndiocation) {
  if (!soundIndiocation) return
  if (soundIndiocation.paused) {
    soundIndiocation.play();
  }
  else {
    soundIndiocation.pause();
    soundIndiocation.currentTime = 0;
    soundIndiocation.play();
  }
}
