import birdGuessed, { appendBirdsList, birdGuessing } from '../quiz/index.js'
let gameItemsBox = document.querySelector('.game');
let scoreBlock = document.querySelector('.score span');
let btnNext = document.querySelector('.btn-next');
let gameCount = 0;
let score = 0;
let totalScore = 0;
let penaltyPoints = 0;

gameItemsBox.addEventListener('click', (e) => {
  gameClickHandler(e);
});

btnNext.addEventListener('click', jumpNextQuestion)

console.log(birdGuessed)
// window.addEventListener('load', () =>{
//   appendBirdsList(birdGuessed)
// })

function gameClickHandler(e) {
  let gameItem = e.target.closest('.game__item');
  if (gameItem) {
    let gameItemId = gameItem.dataset.id - 1;
    let bird = birdGuessed[gameCount][gameItemId];
    let birdCard = createCardBird(bird);
    console.log(bird)
    appendBirdCard(birdCard)
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
              <div class="game__audio-info singing__box">
                <button class="game__audio-play play-btn">
                  <svg class="game__play-img play-img" viewBox="-200 0 1200 1000">
                    <path fill="#00bc8c" d="M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z">
                    </path>
                  </svg>
                </button>
                <div class="singing__inner-box">
                  <input type="range" class="game__audio-track singing-track">
                  <div class="game__volume-wrap singing__volume-wrap"><input type="range" class="game__volume singing__volume">
                  </div>
                </div>
              </div>
              <div class="singing__time game__time-box">
                <span class="game__time game__current-time singing__current-time">00:00</span>
                <span class="game__time game__total-time singing__total-time">00:00</span>
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

  if (allGameItem.length === 6) {
    scoreBlock.textContent = 0;
  }
  else {
    scoreBlock.textContent = 5 - allGameItem.length
  }
}
function checkGuessedBird(bird, gameItem) {
  if (bird.guess) {
    appendInfoGuessedBirdCard(bird)
    addActiveClassBirdItem(gameItem)
    scoring()
    moveNextLevel()
  }
  else {
    addErrorClassBirdItem(gameItem)
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
  if (gameCount == birdGuessed.length - 1) return
  gameCount++;
}

function jumpNextQuestion() {
  if (!btnNext.classList.contains('btn-next_disabled')) {
    updateContent()
    btnNext.classList.add('btn-next_disabled')
  }
}

function updateContent() {
  console.log(gameCount)
  birdGuessing(birdGuessed, gameCount);
  appendBirdsList(birdGuessed, gameCount);
  showCurrentNameQuestion()
}

function showCurrentNameQuestion() {
  let questions = document.querySelectorAll('.pagination__item');
  questions.forEach(quest => {
    quest.classList.remove('pagination__item_active');
  });
  questions[gameCount].classList.add('pagination__item_active');
}