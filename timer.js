let isGamePaused = true;
let isGameOver = false;
let totalTime = 600;
let etime = 0;

class Player {
    constructor(isTurn) {
        this.isTurn = isTurn;
        this.score = 0;
        this.tloc = [];
        this.time = 60;
    }
}

let blue = new Player(true);
let red = new Player(false);

function toggle() {
    let toggleButton = document.getElementById("toggle");
    if (isGamePaused && !isGameOver) {
        isGamePaused = false;
        toggleButton.textContent = "Pause";
        startTimer();
    } else if (!isGamePaused && !isGameOver) {
        isGamePaused = true;
        toggleButton.textContent = "Play";
        stopTimer();
    }
}

function startTimer() {
    setInterval(() => {
        if (!isGamePaused && totalTime > 0) {
            etime++;
            updateTimers();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(etime);
}

function updateTimers() {
    document.getElementById("Ttimer").textContent = formatTime(totalTime);
    if (blue.isTurn) {
        blue.time--;
        document.getElementById("blueTimer").textContent = formatTime(blue.time);
    } else {
        red.time--;
        document.getElementById("redTimer").textContent = formatTime(red.time);
    }
    totalTime--;
    if (blue.time === 0 || red.time === 0) {
        endGame();
    }
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function endGame() {
    isGameOver = true;
    alert("Game Over");
}

function reset() {
    isGamePaused = true;
    isGameOver = false;
    totalTime = 600;
    blue.time = 60;
    red.time = 60;
    document.getElementById("Ttimer").textContent = "10:00";
    document.getElementById("blueTimer").textContent = "1:00";
    document.getElementById("redTimer").textContent = "1:00";
    document.getElementById("toggle").textContent = "Play";
}