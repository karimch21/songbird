import birdsData from '../../assets/bd/birds.js'
const gameElement = document.querySelector('.game');
const riddleAudio = document.querySelector('.riddle__audio');
const riddleBtnPlay = document.querySelector('.riddle__audio-play');
let riddleBoxCurrentTime = document.querySelector('.riddle__current-time');
let riddleBoxTotalTime = document.querySelector('.riddle__total-time');
let riddleVolume = document.querySelector('.riddle__volume');
let gameCount = 0;
let riddleBlockMinute = 0;
let riddleBlockSeconds = 0;
let totalSeconds = 0;
let totalMinute = 0;
let birdGuessed = birdGuessing(birdsData, gameCount);
class Player {
  addAudioSingingGuessBird(riddleAudio, birdsData, gameCount) {
    if (!riddleAudio) return
    birdsData[gameCount].forEach(bird => {
      if (bird.guess) {
        riddleAudio.src = bird.audio;
      }
    });
  }
  riddleOffLoaderAduio(audioWrapper) {
    if (!audioWrapper) return
    audioWrapper.classList.add('audio-wrapper-disabled_off')
  }
  switchPlaySinginBird(audio, btnPlay) {
    btnPlay.classList.toggle('play-btn_pause');
    if (btnPlay.classList.contains('play-btn_pause') && audio.paused) {
      this.playSinginBird(audio, btnPlay)
      this.setIconPlayAudio(btnPlay)
    } else {
      this.stopSinginBird(audio)
      this.setIconPauseAudio(btnPlay)
    }
  }
  setIconPlayAudio(btnPlay) {
    btnPlay.innerHTML = '<svg class="riddle__play-img play-img" viewBox="0 0 47.607 47.607"><path fill="#00bc8c" d="M17.991 40.976a6.631 6.631 0 01-13.262 0V6.631a6.631 6.631 0 0113.262 0v34.345zM42.877 40.976a6.631 6.631 0 01-13.262 0V6.631a6.631 6.631 0 0113.262 0v34.345z"></path></svg>'
  }
  setIconPauseAudio(btnPlay) {
    btnPlay.innerHTML = '<svg class="riddle__play-img play-img" viewBox="-200 0 1200 1000"><path fill="#00bc8c" d="M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z"></path></svg>'
  }
  playSinginBird(audio, btnPlay) {
    audio.play()
  }
  movingRiddleAudioDecorated(audio, audioDecorated) {
    audio.currentTime = audioDecorated.value;
    audioDecorated.value = audioDecorated.value;
  }
  endAudioHandler(btnPlay) {
    btnPlay.classList.remove('play-btn_pause')
    this.setIconPauseAudio(btnPlay)
  }
  defeniteAudioDecorated(audio) {
    let audioBox = audio.parentElement;
    if (!audioBox && !audioBox.hasAttribute('for')) return
    let audioBoxLink = audioBox.getAttribute('for')
    let audioDecorated = document.querySelector(`#${audioBoxLink}`);
    if (!audioDecorated) return
    return audioDecorated;
  }
  playSinginBirdHandler(audio) {
    let audioDecorated = this.defeniteAudioDecorated(audio);
    let currentTime = Math.ceil(audio.currentTime);
    audioDecorated.value = currentTime;
  }
  stopSinginBird(audio) {
    audio.pause()
  }
  showRiddleAudioCurrentTime(audio, riddleBlockMinute, riddleBlockSeconds, totalMinute, totalSeconds, boxCurrentTime, boxTotalTime) {
    if (!boxCurrentTime && !boxTotalTime) return

    riddleBlockMinute = Math.floor(audio.currentTime / 60)
    riddleBlockSeconds = Math.ceil(((audio.currentTime / 60) - riddleBlockMinute) * 60)
    if (audio.duration) {
      totalMinute = Math.floor(audio.duration / 60);
      totalSeconds = Math.ceil(((audio.duration / 60) - totalMinute) * 60);
    }
    else {
      totalMinute = 0
      totalSeconds = 0
    }

    boxTotalTime.textContent = `${('0' + totalMinute).slice(-2)}:${('0' + totalSeconds).slice(-2)}`;
    boxCurrentTime.textContent = `${('0' + riddleBlockMinute).slice(-2)}:${('0' + riddleBlockSeconds).slice(-2)}`
  }
  settingVolume(audio, songVolume) {
    if (!audio && !songVolume) return
    audio.volume = (songVolume / 100).toFixed(1);
  }
}
let riddleAudioPlayer = new Player();
let riddleAudioDecorated = riddleAudioPlayer.defeniteAudioDecorated(riddleAudio);

export { birdGuessed as default, appendBirdsList, birdGuessing, Player }

window.addEventListener('load', windowLoadHandler);


function windowLoadHandler() {
  appendBirdsList(birdsData, gameCount)
  riddleAudioPlayer.addAudioSingingGuessBird(riddleAudio, birdGuessed, gameCount);
  riddleBtnPlay.addEventListener('click', (e) => {
    riddleAudioPlayer.switchPlaySinginBird(riddleAudio, riddleBtnPlay)
  })
  riddleAudioDecorated.addEventListener('input', () => {
    let audioDecorated = riddleAudioPlayer.defeniteAudioDecorated(riddleAudio);
    riddleAudioPlayer.movingRiddleAudioDecorated(riddleAudio, audioDecorated)
  })
  riddleAudio.addEventListener('loadedmetadata', () => {
    const audioWrapper = document.querySelector('.riddle__audio-box');
    riddleAudioPlayer.riddleOffLoaderAduio(audioWrapper)
    let audioDecorated = riddleAudioPlayer.defeniteAudioDecorated(riddleAudio);
    audioDecorated.max = Math.ceil(riddleAudio.duration)
  });
  riddleAudio.addEventListener('timeupdate', (e) => {
    riddleAudioPlayer.playSinginBirdHandler(riddleAudio)
    riddleAudioPlayer.showRiddleAudioCurrentTime(riddleAudio, riddleBlockMinute, riddleBlockSeconds, totalMinute, totalSeconds, riddleBoxCurrentTime, riddleBoxTotalTime)
  });
  riddleAudio.addEventListener('ended', () => {
    riddleAudioPlayer.endAudioHandler(riddleBtnPlay)
  });
  riddleVolume.addEventListener('input', changeRiddleVolume);
}

function birdGuessing(birdsData, gameCount) {
  birdsData[gameCount].forEach(birds => {
    birds.guess = false;
  });
  let randomNum = generateRandomNum(0, birdsData[gameCount].length - 1);
  birdsData[gameCount][randomNum].guess = true;
  return birdsData
}

function generateRandomNum(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function createListBirds(birdsData) {
  let birdsList = document.createDocumentFragment();
  for (let i = 0; i < birdsData.length; i++) {
    let bird = birdsData[i];

    let birdItem = document.createElement('li');
    let birdName = document.createElement('span');

    birdItem.classList.add('game__item');
    birdName.classList.add('game__item-text');

    birdItem.dataset.id = bird.id;
    birdName.textContent = bird.name;
    birdItem.appendChild(birdName);
    birdsList.appendChild(birdItem);
  }
  return birdsList;
}

function appendBirdsList(birdsData, gameCount) {
  clearBirdsListItems()
  let birdsListItems = document.querySelector('.game__items');
  let birdsItem = createListBirds(birdsData[gameCount]);
  if (!birdsListItems) return;
  birdsListItems.appendChild(birdsItem);
}

function clearBirdsListItems() {
  let birdsListItems = document.querySelector('.game__items');
  if (!birdsListItems) return;
  birdsListItems.innerHTML = '';
}

function changeRiddleVolume() {
  if (!riddleVolume) return
  let songVolume = riddleVolume.value;
  riddleAudioPlayer.settingVolume(riddleAudio, songVolume);
}


console.log(`
Вёрстка, дизайн, UI всех трёх страниц приложения +60

-Стартовая страница приложения (вёрстка адаптивная - проверяется на ширине от 1920рх до 360рх) +20
-Страница викторины (вёрстка адаптивная - проверяется на ширине от 1920рх до 360рх) +30
-Страница с результатами (вёрстка адаптивная - проверяется на ширине от 1920рх до 360рх) +10

Аудиоплеер +30
-у кастомного аудиоплеера из предыдущего пункта есть регулятор громкости звука +30


Верхняя панель страницы викторины +20

-правильное отображение счета игры +10
-текущий вопрос выделяется стилем +10


Блок с вопросом +20

-подстановка дефолтного изображения и замена названия птицы на символы (***), пока игрок не выберет правильный ответ +10
-при выборе правильного ответа в блоке с вопросом отображается изображение и название загаданной птицы +10


Блок с вариантами ответов (названия птиц) +60

-цветовая индикация правильного/неправильного ответа в виде индикаторов разного цвета рядом с названием птицы: +10
-звуковая индикация правильного/неправильного ответа: +30
-при выборе правильного или неправильного ответа издаются разные звуковые сигналы: +10
-при выборе неправильного ответа проигрывание аудиоплеера не должно останавливаться: +10
-при выборе правильно ответа проигрывание аудиоплеера должно остановиться: +10
-при клике по названию птицы в блоке с описанием птицы отображается информацию о ней: +10
-если правильный ответ уже дан, возможность просматривать описания птиц при клике по вариантам ответов остаётся, цвет индикаторов при этом не изменяется: +10


Блок с описанием птицы: +30

-пока игрок не кликнул по названию птицы из списка, в блоке выводится короткий текст с предложением послушать плеер и выбрать название птицы, чей голос прозвучал +10
-при клике по названию птицы из списка, в блоке с описанием птицы появляется актуальная информация о ней +20
Информация о птице включает:
изображение
название (на русском и на латыни)
аудиоплеер с записью голоса
дополнительное описание птицы.


Кнопка перехода к следующему вопросу +30

-пока не выбран правильный ответ, кнопка не активна, нет возможности перейти к следующему заданию. Активное и неактивное состояние кнопки визуально отличаются, например, активная кнопка имеет зеленый, не активная - серый цвет +10
-после правильного ответа на последний вопрос игрок переходит к странице с результатами викторины +10
-страница с результатами содержит количество набранных баллов и кнопку с предложением сыграть ещё раз (!или уведомление об окончании игры, если набрано максимальное количество баллов) +10


Итого: 250;
`)