let gamePaused = true;
let gameEnded = false;
let placingPhase = true;
let selectedNode = null;
let clickedNode = null;
let gameTimeLeft = 600;
let elapsedTime = 0;
let isMoving = false;

let scaleFactor = 900 / circuit.clientHeight;
setInterval(() => {
  scaleFactor = 900 / circuit.clientHeight;
  rect = circuit.getBoundingClientRect();
  if (!gamePaused && !gameEnded) {
    elapsedTime += 0.025;
  }
}, 25);
let outerNodes = [1, 2, 3, 4, 5, 6];
let innerNodes = [18, 17, 16, 15, 14, 13];
let nodeData = [
  [1, [2, 6, 7], [35, 450], [2, 3, 1]],
  [2, [1, 3], [242, 93], [2, 1]],
  [3, [2, 4, 9], [656, 93], [1, 2, 1]],
  [4, [3, 5], [862, 450], [2, 1]],
  [5, [4, 6, 11], [656, 805], [1, 1, 1]],
  [6, [1, 5], [242, 805], [3, 1]],
  [7, [1, 8, 12], [175, 450], [1, 5, 4]],
  [8, [7, 9, 17], [313, 213], [5, 6, 1]],
  [9, [3, 8, 10], [587, 213], [1, 6, 4]],
  [10, [9, 11, 15], [725, 450], [4, 5, 1]],
  [11, [5, 10, 12], [587, 690], [1, 5, 6]],
  [12, [7, 11, 13], [313, 690], [4, 6, 1]],
  [13, [12, 14, 18], [381, 569], [1, 8, 9]],
  [14, [13, 15], [519, 568], [8, 8]],
  [15, [10, 14, 16], [587, 450], [1, 8, 9]],
  [16, [15, 17], [520, 331], [9, 8]],
  [17, [8, 16, 18], [381, 331], [1, 8, 8]],
  [18, [13, 17], [313, 450], [9, 8]],
];

class GamePlayer {
  constructor(activeTurn) {
    this.activeTurn = activeTurn;
    this.playerScore = 0;
    this.nodePositions = [];
    this.turnTimeLeft = 30;
    this.allEliminated = false;
  }
}

let blue = new GamePlayer(true);
let red = new GamePlayer(false);

let moveHistory = [];
let redoStack = [];

function recordMove() {
  // Save a deep copy of the current game state
  const state = {
    bluePositions: [...blue.nodePositions],
    redPositions: [...red.nodePositions],
    blueTurn: blue.activeTurn,
    redTurn: red.activeTurn,
    placingPhase: placingPhase,
    gameEnded: gameEnded,
    gamePaused: gamePaused,
    selectedNode: selectedNode,
    clickedNode: clickedNode,
  };
  moveHistory.push(state);
  // Clear redo stack on new move
  redoStack = [];
}

function restoreState(state) {
  blue.nodePositions = [...state.bluePositions];
  red.nodePositions = [...state.redPositions];
  blue.activeTurn = state.blueTurn;
  red.activeTurn = state.redTurn;
  placingPhase = state.placingPhase;
  gameEnded = state.gameEnded;
  gamePaused = state.gamePaused;
  selectedNode = state.selectedNode;
  clickedNode = state.clickedNode;
}

function undoMove() {
  if (moveHistory.length > 1) {
    const currentState = moveHistory.pop();
    redoStack.push(currentState);
    const prevState = moveHistory[moveHistory.length - 1];
    restoreState(prevState);
    // Update UI accordingly
    calculateScores();
    updatePieces();
    updateTimers();
    text.innerHTML = blue.activeTurn ? "Blue's Turn" : "Red's Turn";
  }
}

function redoMove() {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    moveHistory.push(nextState);
    restoreState(nextState);
    // Update UI accordingly
    calculateScores();
    updatePieces();
    updateTimers();
    text.innerHTML = blue.activeTurn ? "Blue's Turn" : "Red's Turn";
  }
}

function isValidMove(clickedNode) {
  if (clickedNode == 0) {
    return 0;
  }
  if (!outerNodes.includes(clickedNode)) {
    return 0;
  }
  if (blue.activeTurn) {
    for (let i of blue.nodePositions) {
      if (i == clickedNode) return 2;
    }
    for (let i of red.nodePositions) {
      if (i == clickedNode) return 0;
    }
  }
  if (red.activeTurn) {
    for (let i of red.nodePositions) {
      if (i == clickedNode) return 2;
    }
    for (let i of blue.nodePositions) {
      if (i == clickedNode) return 0;
    }
  }
  for (let i of outerNodes) {
    if (i == clickedNode) return 1;
  }
}

function checkSurrounded() {
  for (let i of blue.nodePositions) {
    let surrounded = true;
    if (i != 0) {
      for (let j of nodeData[i - 1][1]) {
        if (!red.nodePositions.includes(j) && j != 0) surrounded = false;
      }
      if (surrounded) {
        blue.nodePositions[blue.nodePositions.indexOf(i)] = 0;
        playPopSound();
      }
    }
  }
  
  for (let i of red.nodePositions) {
    let surrounded = true;
    if (i != 0) {
      for (let j of nodeData[i - 1][1]) {
        if (!blue.nodePositions.includes(j) && j != 0) surrounded = false;
      }
      if (surrounded) {
        red.nodePositions[red.nodePositions.indexOf(i)] = 0;
        playPopSound();
      }
    }
  }
}

function calculateScores() {
  let redr = [];
  let blur = [];
  blue.playerScore = 0;
  red.playerScore = 0;

  for (let i of blue.nodePositions) {
    if (i != 0) {
      blur.push(i);
    }
  }
  if (blur.length < 2 && !placingPhase) {
    gameEnded = true;
    blue.allEliminated = true;
  } else {
    for (let i of blur) {
      for (let j of blur) {
        if (nodeData[i - 1][1].includes(j)) {
          blue.playerScore += nodeData[i - 1][3][nodeData[i - 1][1].indexOf(j)];
        }
      }
    }
    if (blue.playerScore != 0) {
      blue.playerScore /= 2;
    }
  }

  for (let i of red.nodePositions) {
    if (i != 0) {
      redr.push(i);
    }
  }
  if (redr.length < 2 && !placingPhase) {
    gameEnded = true;
    red.allEliminated = true;
  } else {
    for (let i of redr) {
      for (let j of redr) {
        if (nodeData[i - 1][1].includes(j)) {
          red.playerScore += nodeData[i - 1][3][nodeData[i - 1][1].indexOf(j)];
        }
      }
    }
    if (red.playerScore != 0) {
      red.playerScore /= 2;
    }
  }
  if (gameEnded) EndGame();

  redscore.innerHTML = +red.playerScore;
  bluescore.innerHTML = +blue.playerScore;
}

function isInnerCircleComplete() {
  let loc = blue.nodePositions.concat(red.nodePositions);
  let flag = true;
  for (let i of innerNodes) {
    if (!loc.includes(i)) flag = false;
  }
  return flag;
}

function EndGame() {
  gameTimeLeft = 0;
  if (blue.turnTimeLeft <= 0 || blue.allEliminated) {
    redWon();
  } else if (red.turnTimeLeft <= 0 || red.allEliminated) {
    blueWon();
  } else if (blue.playerScore >= red.playerScore) {
    blueWon();
  } else {
  redWon();
  }
  reset.style.display = "block";
  gametimer.innerHTML = "--:--";
  bluetimer.innerHTML = "-:--";
  redtimer.innerHTML = "-:--";
  
  // Save game result to leaderboard
  saveGameResult(blue.playerScore, red.playerScore, elapsedTime);
  
  // Display leaderboard
  displayLeaderboard();
}

function blueWon() {
  text.innerHTML = "Blue Wins The Game! ";
}

function redWon() {
  text.innerHTML = "Red Wins The Game!";
}

function unlockInnerNodes() {
  let ol = [1, 2, 3, 4, 5, 6];
  let ml = [7, 8, 9, 10, 11, 12];
  let il = [13, 14, 15, 16, 17, 18];
  let lf = true;

  let local = blue.nodePositions.concat(red.nodePositions);
  for (let i of ol) {
    if (!local.includes(i)) {
      lf = false;
    }
  }
  if (lf) {
    outerNodes = ol.concat(ml);
  }
  lf = true;
  for (let i of ml) {
    if (!local.includes(i)) lf = false;
  }
  if (lf) {
    outerNodes = ol.concat(ml).concat(il);
  }
}