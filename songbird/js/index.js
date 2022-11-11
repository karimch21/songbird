import birdsData from '../assets/bd/birds.js'
let welcomeBlock = document.querySelector('.welcome-block');
let welcomeBlockInner = document.querySelector('.welcome-block__inner');
let promoVideo = document.querySelector('.promo__video');
let promo = document.querySelector('.promo');

function addActiveClass(welcomeBlock, welcomeBlockInner) {
    welcomeBlock.classList.add('welcome-block_active')
    welcomeBlockInner.classList.add('welcome-block__inner_active')
    promo.classList.add('promo_active')
}


promoVideo.addEventListener('timeupdate', () => {
    let currentTime = promoVideo.currentTime;
    let totalTime = promoVideo.duration;
    if (currentTime === totalTime) {
        promoVideo.pause()
        addActiveClass(welcomeBlock, welcomeBlockInner)
    }
})