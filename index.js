const controls = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
const playerInitialPos = { x: 185, y: 550 };

const player = { speed: 5, x: 185, y: 550 };

let gameOver = false;
let started = false;
let gameInterval;

let numberOfBolts = 0;
let numberOfObsticles = 0;
let batteryLevel = 100;
let currentPoints = 0;

const obsticleTypes = ['oil', 'barrel'];

const bounds = document.querySelector('.gamearea').getBoundingClientRect();

const startScreen = document.getElementById('start');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

const sprites = document.querySelector('.sprites');
const car = document.querySelector('.car');
const batteryFill = document.querySelector('.batter-fill');
const batteryText = document.querySelector('.batter-text');
const pointsText = document.querySelector('.points');
const road = document.querySelector('.road');

window.addEventListener('keydown', ev => {
    if (ev.keyCode === 32 && !started) start();

    controls[ev.key] = true;
});

window.addEventListener('keyup', ev => {
    controls[ev.key] = false;
});

function moveCar() {
    if (controls.ArrowRight && player.x < (bounds.width - 80)) player.x = player.x + player.speed;
    if (controls.ArrowLeft && player.x > 0) player.x = player.x - player.speed;
    if (controls.ArrowUp && player.y > 0) player.y = player.y - player.speed;
    if (controls.ArrowDown && player.y < (bounds.height - 160)) player.y = player.y + player.speed;

    car.style.left = `${player.x}px`;
    car.style.top = `${player.y}px`;
};

function checkCollisionWithPlayer(item) {
    const carBounds = document.querySelector('.car').getBoundingClientRect();
    const itemBounds = item.getBoundingClientRect();

    return !(
        carBounds.bottom < itemBounds.top ||
        carBounds.top > itemBounds.bottom ||
        carBounds.right < itemBounds.left ||
        carBounds.left > itemBounds.right
    );
}

function removeBolt(bolt) {
    sprites.removeChild(bolt);
    --numberOfBolts;
}

function removeObsticle(obsticle) {
    sprites.removeChild(obsticle);
    --numberOfObsticles;
}

function moveBolts() {
    const bolts = document.querySelectorAll('.bolt');

    bolts.forEach(bolt => {
        bolt.y = bolt.y + 4;

        if (bolt.y > bounds.height) return removeBolt(bolt);

        bolt.style.top = `${bolt.y}px`;

        const collision = checkCollisionWithPlayer(bolt);

        if (collision) {
            removeBolt(bolt);
            increaseBattery(3);
        }
    });
}

function moveObsticle() {
    const obsticles = document.querySelectorAll('.obsticle');

    obsticles.forEach(obsticle => {
        obsticle.y = obsticle.y + 4;

        if (obsticle.y > bounds.height) return removeObsticle(obsticle);

        obsticle.style.top = `${obsticle.y}px`;

        const collision = checkCollisionWithPlayer(obsticle);

        if (collision) gameOver = true;
    });
}

function addBolt() {
    if (numberOfBolts > 1) return;

    const d = Math.random();

    if (d < 0.2) {
        ++numberOfBolts;

        const bolt = document.createElement('div')

        bolt.className = 'bolt';

        bolt.y = 30;
        bolt.x = Math.floor(Math.random() * (bounds.width - 30));

        bolt.style.top = `${bolt.y}px`;
        bolt.style.left = `${bolt.x}px`;

        sprites.prepend(bolt);
    }
}

function addObsticle() {
    if (numberOfObsticles > 3) return;

    const d = Math.random();

    if (d < 0.7) {
        ++numberOfObsticles;

        const obsticle = document.createElement('div')

        const type = obsticleTypes[Math.floor(Math.random() * obsticleTypes.length)];

        obsticle.className = `obsticle ${type}`;

        obsticle.y = 30;
        obsticle.x = Math.floor(Math.random() * (bounds.width - 30));

        obsticle.style.top = `${obsticle.y}px`;
        obsticle.style.left = `${obsticle.x}px`;

        sprites.prepend(obsticle);
    }
}

function reduceBattery() {
    batteryLevel -= 1;

    if (batteryLevel < 1) gameOver = true;

    batteryFill.style.height = `${batteryLevel}%`;
    batteryText.innerHTML = `${batteryLevel}%`;
}

function increaseBattery(increase) {
    batteryLevel = Math.min(batteryLevel + increase, 100);

    batteryFill.style.height = `${batteryLevel}%`;
    batteryText.innerHTML = `${batteryLevel}%`;
}

function playArea() {
    if (gameOver) return onGameOver();

    moveCar();
    moveBolts();
    moveObsticle();

    window.requestAnimationFrame(playArea);
}

function addPoints() {
    currentPoints += 10;

    pointsText.innerHTML = `${currentPoints}`.padStart(6, '0');
}

function onStart() {
    gameOver = false;
    started = true;

    numberOfBolts = 0;
    numberOfObsticles = 0;
    batteryLevel = 100;
    currentPoints = 0;

    pointsText.innerHTML = `${currentPoints}`.padStart(6, '0');
    batteryFill.style.height = `${batteryLevel}%`;
    batteryText.innerHTML = `${batteryLevel}%`;

    road.classList.add('animated');

    gameOverScreen.hidden = true;
    startScreen.hidden = true;

    document.querySelectorAll('.bolt').forEach(item => {
        sprites.removeChild(item);
    });

    document.querySelectorAll('.obsticle').forEach(item => {
        sprites.removeChild(item);
    });

    player.x = playerInitialPos.x;
    player.y = playerInitialPos.y;

    car.style.left = `${player.x}px`;
    car.style.top = `${player.y}px`; 
}

function onGameOver() {
    gameOver = true;
    started = false;

    finalScore.innerHTML = `${currentPoints}`.padStart(6, '0');
    gameOverScreen.hidden = false;

    road.classList.remove('animated');
}

function start() {
    onStart();

    gameInterval = setInterval(() => {
        if (gameOver) return clearInterval(gameInterval);

        addBolt();
        addObsticle();
        reduceBattery();
        addPoints();
    }, 1000);

    window.requestAnimationFrame(playArea);
}

// start();