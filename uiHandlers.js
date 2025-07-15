const circuit = document.getElementById("circuit");
const mover = document.getElementById("mover");
const reset = document.getElementById("reset");
const toggle = document.getElementById("toggle");
const bluetimer = document.getElementById("bluetimer");
const redtimer = document.getElementById("redtimer");
const gametimer = document.getElementById("gametimer");
const bluedata = document.getElementById("bluedata");
const reddata = document.getElementById("reddata");
const redscore = document.getElementById("redscore");
const bluescore = document.getElementById("bluescore");
const redHighScore = document.getElementById("redHighScore");
const blueHighScore = document.getElementById("blueHighScore");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const moveHistoryList = document.getElementById("moveHistoryList");
const blue1 = document.getElementById("blue1");
const blue2 = document.getElementById("blue2");
const blue3 = document.getElementById("blue3");
const blue4 = document.getElementById("blue4");
const red1 = document.getElementById("red1");
const red2 = document.getElementById("red2");
const red3 = document.getElementById("red3");
const red4 = document.getElementById("red4");
const text = document.getElementById("text");

let x = 0;
let y = 0;
let rect = circuit.getBoundingClientRect();

window.addEventListener("DOMContentLoaded", () => {
  if (redHighScore) redHighScore.textContent = parseInt(localStorage.getItem("redHighScore")) || 0 ;
  if (blueHighScore) blueHighScore.textContent = parseInt(localStorage.getItem("blueHighScore")) || 0;
});

circuit.addEventListener("click", (event) => {
  x = event.pageX - rect.left;
  y = event.pageY - rect.top;
  if (!gamePaused && !gameEnded) {
    clickedNode = getClickedNode();
    unlockInnerNodes();

    if (red.nodePositions.length == 4 && blue.nodePositions.length == 4) {
      placingPhase = false;
    }
    let isValidn = isValidMove(clickedNode);
    if (isValidn == 0) {
      isMoving = false;
      mover.style.display = "none";
    } else if (isValidn == 1 && !isMoving) {
      if (blue.activeTurn && blue.nodePositions.length != 4) {
        blue.nodePositions.push(clickedNode);
        checkSurrounded();
        calculateScores();
        updatePieces();
        recordMove(null, clickedNode);
        playMoveSound();
        switchPlayer();
      } else if (red.activeTurn && red.nodePositions.length != 4) {
        red.nodePositions.push(clickedNode);
        checkSurrounded();
        calculateScores();
        updatePieces();
        recordMove(null, clickedNode);
        playMoveSound();
        switchPlayer();
      }
    } else if (isValidn == 2 && !isMoving) {
      selectedNode = clickedNode;
      isMoving = true;
      mover.style.display = "block";
      mover.style.left =
        (nodeData[selectedNode - 1][2][0] - 20) / scaleFactor + "px";
      mover.style.top =
        (nodeData[selectedNode - 1][2][1] - 20) / scaleFactor + "px";
    } else if (isValidn == 2 && isMoving) {
      selectedNode = clickedNode;
      mover.style.display = "block";
      mover.style.left =
        (nodeData[selectedNode - 1][2][0] - 20) / scaleFactor + "px";
      mover.style.top =
        (nodeData[selectedNode - 1][2][1] - 20) / scaleFactor + "px";
    } else if (
      isValidn == 1 &&
      isMoving &&
      nodeData[selectedNode - 1][1].includes(clickedNode) &&
      blue.activeTurn
    ) {
      blue.nodePositions[blue.nodePositions.indexOf(selectedNode)] =
        clickedNode;
      isMoving = false;
      mover.style.display = "none";
      checkSurrounded();
      calculateScores();
      updatePieces();
      recordMove(selectedNode, clickedNode);
      playMoveSound();
      switchPlayer();
      selectedNode = null;
    } else if (
      isValidn == 1 &&
      isMoving &&
      nodeData[selectedNode - 1][1].includes(clickedNode) &&
      red.activeTurn
    ) {
      red.nodePositions[red.nodePositions.indexOf(selectedNode)] = clickedNode;
      isMoving = false;
      mover.style.display = "none";
      checkSurrounded();
      calculateScores();
      updatePieces();
      recordMove(selectedNode, clickedNode);
      playMoveSound();
      switchPlayer();
      selectedNode = null;
    }
    if (red.nodePositions.length == 4 && blue.nodePositions.length == 4) {
      placingPhase = false;
    }
    checkSurrounded();
    calculateScores();
    updatePieces();
    if (gameEnded) {
      EndGame();
    }
    if (isInnerCircleComplete()) gameEnded = true;
  }
  if (gameEnded) {
    EndGame();
  }
});

let gameInterval = null;
function togglePause() {
  if (!gamePaused && !gameEnded) {
    clearInterval(gameInterval);
    gameInterval = null;
    gamePaused = true;
    toggle.value = "PLAY";
    reset.style.display = "block";
  } else if (gamePaused && !gameEnded) {
    gamePaused = false;
    gameInterval = setInterval(() => {
      updateTimers();
    }, 1000);
    toggle.value = "PAUSE";
    reset.style.display = "none";
  }
}

function resetGame() {
  const currentRed = parseInt(redscore.innerHTML);
  const currentBlue = parseInt(bluescore.innerHTML);
  let redHighScore = parseInt(localStorage.getItem("redHighScore"));
  let blueHighScore = parseInt(localStorage.getItem("blueHighScore"));

  if (currentRed > redHighScore) {
    redHighScore = currentRed;
    localStorage.setItem("redHighScore", redHighScore);
  }
  if (currentBlue > blueHighScore) {
    blueHighScore = currentBlue;
    localStorage.setItem("blueHighScore", blueHighScore);
  }

  if (redHighScore) redHighScore.textContent = redHighScore;
  if (blueHighScore) blueHighScore.textContent = blueHighScore;

  moveHistory = [];
  redoStack = [];
  const moveHistoryList = document.getElementById("moveHistoryList");
  if (moveHistoryList) {
    moveHistoryList.innerHTML = "";
  }

  if (gameInterval != null) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
  blue = new GamePlayer(true);
  red = new GamePlayer(false);
  placingPhase = true;
  gameEnded = false;
  gamePaused = true;
  gameTimeLeft = 600;
  redtimer.innerHTML = "0:30";
  bluetimer.innerHTML = "0:30";
  redscore.innerHTML = "0";
  bluescore.innerHTML = "0";
  text.innerHTML =
    "Welcome To Titans's Circuit Game , Hope You Enjoy The Game. </br> Blue Starts The Game";
  bluetimer.style.backgroundColor = "pink";
  bluedata.style.backgroundColor = "pink";
  redtimer.style.backgroundColor = "whitesmoke";
  reddata.style.backgroundColor = "whitesmoke";
  selectedNode, (clickedNode = null);
  elapsedTime = 0;
  isMoving = false;
  outerNodes = [1, 2, 3, 4, 5, 6];
  reset.style.display = "none";
  toggle.value = "PLAY";
  toggle.style.display = "block";
  blue1.style.display = "none";
  blue2.style.display = "none";
  blue3.style.display = "none";
  blue4.style.display = "none";
  red1.style.display = "none";
  red2.style.display = "none";
  red3.style.display = "none";
  red4.style.display = "none";
  mover.style.display = "none";

  gameTimeLeft = 600;
  gametimer.innerHTML = "10:00";
  window.location.reload();
}

function switchPlayer() {
  if (!gamePaused && blue.activeTurn) {
    blue.activeTurn = false;
    red.activeTurn = true;
    blue.turnTimeLeft = 30;
    bluetimer.innerHTML = "0:30";
    bluetimer.style.backgroundColor = "whitesmoke";
    bluedata.style.backgroundColor = "whitesmoke";
    redtimer.style.backgroundColor = "pink";
    reddata.style.backgroundColor = "pink";
    text.innerHTML = "Red's Turn";
  } else if (!gamePaused && red.activeTurn) {
    red.activeTurn = false;
    blue.activeTurn = true;
    red.turnTimeLeft = 30;
    redtimer.innerHTML = "0:30";
    bluetimer.style.backgroundColor = "pink";
    bluedata.style.backgroundColor = "pink";
    redtimer.style.backgroundColor = "whitesmoke";
    reddata.style.backgroundColor = "whitesmoke";
    text.innerHTML = "Blue's Turn";
  }
}

function updateTimers() {
  if (gameTimeLeft > 0 && !gameEnded) {
    gameTimeLeft -= 1;
    if (blue.activeTurn) {
      blue.turnTimeLeft -= 1;
      if (blue.turnTimeLeft > 0) {
        bluetimer.innerHTML =
          "0:" + blue.turnTimeLeft.toString().padStart(2, "0");
      } else {
        gameEnded = true;
        EndGame();
      }
    }
    if (red.activeTurn) {
      red.turnTimeLeft -= 1;
      if (red.turnTimeLeft > 0) {
        redtimer.innerHTML =
          "0:" + red.turnTimeLeft.toString().padStart(2, "0");
      } else {
        gameEnded = true;
        EndGame();
      }
    }
    gametimer.innerHTML =
      Math.floor(gameTimeLeft / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      (gameTimeLeft % 60).toString().padStart(2, "0");
  } else {
    gameEnded = true;
    EndGame();
  }
}

function getClickedNode() {
  let clickX = 0;
  let clickY = 0;
  clickX = x * scaleFactor;
  clickY = y * scaleFactor;

  for (let node of nodeData) {
    let dist = (node[2][0] - clickX) ** 2 + (node[2][1] - clickY) ** 2;
    if (dist <= 900) {
      return node[0];
    }
  }
  return 0;
}

function updatePieces() {
  const pieces = [
    { elem: blue1, pos: blue.nodePositions[0] },
    { elem: blue2, pos: blue.nodePositions[1] },
    { elem: blue3, pos: blue.nodePositions[2] },
    { elem: blue4, pos: blue.nodePositions[3] },
    { elem: red1, pos: red.nodePositions[0] },
    { elem: red2, pos: red.nodePositions[1] },
    { elem: red3, pos: red.nodePositions[2] },
    { elem: red4, pos: red.nodePositions[3] },
  ];

  pieces.forEach(({ elem, pos }) => {
    if (pos === undefined || pos === 0) {
      elem.style.display = "none";
    } else {
      elem.style.display = "block";
      const left = (nodeData[pos - 1][2][0] - 17) / scaleFactor;
      const top = (nodeData[pos - 1][2][1] - 17) / scaleFactor;
      // pieces movement animation
      elem.style.transition = "left 0.5s ease, top 0.5s ease";
      elem.style.left = left + "px";
      elem.style.top = top + "px";
    }
  });
}

reset.addEventListener("click", resetGame);
toggle.addEventListener("click", togglePause);


// audio controls
const moveSound = new Audio("click.wav");
const popSound = new Audio("pop.wav");

function playMoveSound() {
  if (!gamePaused && !gameEnded) {
    moveSound.currentTime = 0;
    moveSound.play();
  }
}
function playPopSound() {
  popSound.currentTime = 0;
  popSound.play();
}
window.playPopSound = playPopSound;

undoButton.addEventListener("click", () => {
  undoMove();
});

redoButton.addEventListener("click", () => {
  redoMove();
});

//move history recording and displaying
function updateMoveHistory() {
  moveHistoryList.innerHTML = "";
  if (moveHistory.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Game reset.";
    moveHistoryList.appendChild(li);
    return;
  }
  for (let i = 0; i < moveHistory.length; i++) {
    const state = moveHistory[i];
    let moveText = `Move ${i + 1}: ${state.blueTurn ? "Blue" : "Red"}`;
    if (state.sourceNode && state.targetNode) {
      let sourceName = state.sourceNode
        ? nodeData[state.sourceNode - 1][4]
        : state.sourceNode;
      let targetName = state.targetNode
        ? nodeData[state.targetNode - 1][4]
        : state.targetNode;
      moveText += ` - ${sourceName} to ${targetName}`;
    } else if (state.targetNode) {
      let targetName = nodeData[state.targetNode - 1][4];
      moveText += ` - Placed at ${targetName}`;
    } else {
      moveText += " - Placed";
    }
    const li = document.createElement("li");
    li.textContent = moveText;
    moveHistoryList.appendChild(li);
  }
}

const originalRecordMove = recordMove;
recordMove = function (sourceNode, targetNode) {
  originalRecordMove.apply(this, arguments);
  updateMoveHistory();
};


