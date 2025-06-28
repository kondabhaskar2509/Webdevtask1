let gamePaused = true;
let gameEnded = false;
let placingPhase = true;
let selectedNode = null;
let clickedNode = null;
let gameTimeLeft = 600;
let elapsedTime = 0;
let isMoving = false;


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
const blue1 = document.getElementById("blue1");
const blue2 = document.getElementById("blue2");
const blue3 = document.getElementById("blue3");
const blue4 = document.getElementById("blue4");
const red1 = document.getElementById("red1");
const red2 = document.getElementById("red2");
const red3 = document.getElementById("red3");
const red4 = document.getElementById("red4");
const text = document.getElementById("text");

let scaleFactor = 900 / circuit.clientHeight;
setInterval(() => {
    scaleFactor = 900 / circuit.clientHeight;
    rect = circuit.getBoundingClientRect();
}, 25);
let outerNodes = [1,2,3,4,5,6];
let innerNodes = [18,17,16,15,14,13];
let nodeData = [
    [1,[2,6,7], [35, 450], [2,3,1]],
    [2,[1,3], [242,93], [2,1]],
    [3,[2,4,9], [656,93], [1,2,1]],
    [4,[3,5], [862,450], [2,1]],
    [5,[4,6,11], [656,805], [1,1,1]],
    [6,[1,5], [242,805], [3,1]],
    [7,[1,8,12], [175,450], [1,5,4]],
    [8,[7,9,17], [313,213], [5,6,1]],
    [9,[3,8,10], [587,213], [1,6,4]],
    [10,[9,11,15], [725,450], [4,5,1]],
    [11,[5,10,12], [587,690], [1,5,6]],
    [12,[7,11,13], [313,690], [4,6,1]],
    [13,[12,14,18], [381,569], [1,8,9]],
    [14,[13,15], [519,568], [8,8]],
    [15,[10,14,16], [587,450], [1,8,9]],
    [16,[15,17], [520,331], [9,8]],
    [17,[8,16,18], [381,331], [1,8,8]],
    [18,[13,17], [313,450], [9,8]]
];

let x = 0;
let y = 0;
let rect = circuit.getBoundingClientRect();

class GamePlayer{
    constructor(activeTurn){
        this.activeTurn = activeTurn;
        this.playerScore = 0;
        this.nodePositions = [];
        this.turnTimeLeft = 30;
        this.allEliminated = false;
    }
}

let blue = new GamePlayer(true);
let red = new GamePlayer(false);


circuit.addEventListener("click", (event)=>{        
        x = event.pageX - rect.left;
        y = event.pageY - rect.top;
        if(!gamePaused && !gameEnded){
            clickedNode = getClickedNode();
            unlockInnerNodes();

            if(red.nodePositions.length == 4 && blue.nodePositions.length == 4){
                placingPhase = false;
            }
            let isValidn = isValidMove(clickedNode);
            if(isValidn == 0){isMoving = false;mover.style.display = "none";}
            else if(isValidn == 1 && !isMoving){
                if(blue.activeTurn && blue.nodePositions.length != 4){
                    blue.nodePositions.push(clickedNode);
                    checkSurrounded();
                    calculateScores();
                    updatePieces();
                    switchPlayer();
                }
                else if(red.activeTurn && red.nodePositions.length != 4){
                    red.nodePositions.push(clickedNode);
                    checkSurrounded();
                    calculateScores();
                    updatePieces();
                    switchPlayer();
                }
            }
            else if(isValidn == 2 && !isMoving){
                selectedNode = clickedNode;
                isMoving = true;
                mover.style.display = "block";
                mover.style.left = ((nodeData[selectedNode-1][2][0]-20)/scaleFactor)+"px";
                mover.style.top = ((nodeData[selectedNode-1][2][1]-20)/scaleFactor)+"px";

            } 
            else if(isValidn == 2 && isMoving){
                selectedNode = clickedNode;
                mover.style.display = "block";
                mover.style.left = ((nodeData[selectedNode-1][2][0]-20)/scaleFactor)+"px";
                mover.style.top = ((nodeData[selectedNode-1][2][1]-20)/scaleFactor)+"px";
            } 
            else if(isValidn==1 && isMoving && nodeData[selectedNode-1][1].includes(clickedNode) && blue.activeTurn){
                blue.nodePositions[blue.nodePositions.indexOf(selectedNode)] = clickedNode;
                isMoving = false;
                mover.style.display = "none";
                checkSurrounded();
                calculateScores();
                updatePieces();
                switchPlayer();
                selectedNode = null;
            }
            else if(isValidn==1 && isMoving && nodeData[selectedNode-1][1].includes(clickedNode) && red.activeTurn){
                red.nodePositions[red.nodePositions.indexOf(selectedNode)] = clickedNode;
                isMoving = false;
                mover.style.display = "none";
                checkSurrounded();
                calculateScores();
                updatePieces();
                switchPlayer();
                selectedNode = null;
            }
            if(red.nodePositions.length == 4 && blue.nodePositions.length == 4){
                placingPhase = false;
            }
            checkSurrounded();
            calculateScores();
            updatePieces();
            if(gameEnded){EndGame();}
            if(isInnerCircleComplete())
                gameEnded = true;
        }
        if(gameEnded){EndGame();}
    });

let gameInterval = null;
function togglePause(){    
    if(!gamePaused && !gameEnded){
        clearInterval(gameInterval);
        gameInterval = null;
        gamePaused = true;
        toggle.value = "PLAY";
        reset.style.display = "block";
    }
    else if(gamePaused && !gameEnded){
        gamePaused = false;
        gameInterval = setInterval(()=>{
        updateTimers();
    },1000);
        toggle.value = "PAUSE";
        reset.style.display = "none";
    }    
}

function resetGame(){
    if(gameInterval != null){
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
    text.innerHTML = "Welcome To Titans's Circuit Game , Hope You Enjoy The Game. </br> Blue Starts The Game"
    bluetimer.style.backgroundColor = "pink";
    bluedata.style.backgroundColor = "pink";
    redtimer.style.backgroundColor = "whitesmoke";
    reddata.style.backgroundColor = "whitesmoke";
    selectedNode, clickedNode = null;
    elapsedTime = 0;
    isMoving = false;
    outerNodes = [1,2,3,4,5,6];
    reset.style.display = "none";
    toggle.src = "imgs/play.png"

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
}

function switchPlayer(){
    if(!gamePaused && blue.activeTurn){
        blue.activeTurn = false;
        red.activeTurn = true;
        blue.turnTimeLeft = 30;
        bluetimer.innerHTML = "0:30";
        bluetimer.style.backgroundColor = "whitesmoke";
        bluedata.style.backgroundColor = "whitesmoke";
        redtimer.style.backgroundColor = "pink";
        reddata.style.backgroundColor = "pink";
        text.innerHTML = "Red's Turn";
    }
    else if(!gamePaused && red.activeTurn){
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


function updateTimers(){
    if(gameTimeLeft > 0 && !gameEnded){
        gameTimeLeft -= 1;
        if(blue.activeTurn){
            blue.turnTimeLeft -= 1;
            if(blue.turnTimeLeft > 0){
                bluetimer.innerHTML = "0:" + blue.turnTimeLeft.toString().padStart(2, "0");
            } else {
                gameEnded = true;
                EndGame();
            }
        }
        if(red.activeTurn){
            red.turnTimeLeft -= 1;
            if(red.turnTimeLeft > 0){
                redtimer.innerHTML = "0:" + red.turnTimeLeft.toString().padStart(2, "0");
            } else {
                gameEnded = true;
                EndGame();
            }
        }
        gametimer.innerHTML = (Math.floor(gameTimeLeft/60)).toString().padStart(2,"0") + ":" + (gameTimeLeft % 60).toString().padStart(2,"0");
    } else {
        gameEnded = true;
        EndGame();
    }
}

function getClickedNode(){
    let clickX = 0; 
    let clickY = 0;
    clickX = x*scaleFactor;
    clickY = y*scaleFactor;

    for(let node of nodeData){
        let dist = (node[2][0]-clickX)**2 + (node[2][1]-clickY)**2;
        if(dist <= 900){
            return node[0];
        }
    }
    return 0;
}

function updatePieces(){
    if(blue.nodePositions.length > 0){
        if(blue.nodePositions[0] == 0){blue1.style.display = "none";}
        else{
            blue1.style.display = "block";
            blue1.style.left = ((nodeData[blue.nodePositions[0]-1][2][0]-17) / scaleFactor).toString()+"px";
            blue1.style.top = ((nodeData[blue.nodePositions[0]-1][2][1]-17) / scaleFactor).toString()+"px";
        }
    }
    if(blue.nodePositions.length > 1){
        if(blue.nodePositions[1] == 0){blue2.style.display = "none";}
        else{
            blue2.style.display = "block";
            blue2.style.left = ((nodeData[blue.nodePositions[1]-1][2][0]-17) / scaleFactor).toString()+"px";
            blue2.style.top = ((nodeData[blue.nodePositions[1]-1][2][1]-17) / scaleFactor).toString()+"px";
        }
        if(blue.nodePositions.length > 2){
            if(blue.nodePositions[2] == 0){blue3.style.display = "none";}
            else{
                blue3.style.display = "block";
                blue3.style.left = ((nodeData[blue.nodePositions[2]-1][2][0]-17) / scaleFactor).toString()+"px";
                blue3.style.top = ((nodeData[blue.nodePositions[2]-1][2][1]-17) / scaleFactor).toString()+"px";
            }
            if(blue.nodePositions.length > 3){
                if(blue.nodePositions[3] == 0){blue4.style.display = "none";}
                else{
                    blue4.style.display = "block";
                    blue4.style.left = ((nodeData[blue.nodePositions[3]-1][2][0]-17) / scaleFactor).toString()+"px";
                    blue4.style.top = ((nodeData[blue.nodePositions[3]-1][2][1]-17) / scaleFactor).toString()+"px";
                }
            }
        }
    }
    if(red.nodePositions.length > 0){
        if(red.nodePositions[0] == 0){red1.style.display = "none";}
        else{
            red1.style.display = "block";
            red1.style.left = ((nodeData[red.nodePositions[0]-1][2][0]-17) / scaleFactor).toString()+"px";
            red1.style.top = ((nodeData[red.nodePositions[0]-1][2][1]-17) / scaleFactor).toString()+"px";
        }
    }
    if(red.nodePositions.length > 1){
        if(red.nodePositions[1] == 0){red2.style.display = "none";}
        else{
            red2.style.display = "block";
            red2.style.left = ((nodeData[red.nodePositions[1]-1][2][0]-17) / scaleFactor).toString()+"px";
            red2.style.top = ((nodeData[red.nodePositions[1]-1][2][1]-17) / scaleFactor).toString()+"px";
        }
        if(red.nodePositions.length > 2){
            if(red.nodePositions[2] == 0){red3.style.display = "none";}
            else{
                red3.style.display = "block";
                red3.style.left = ((nodeData[red.nodePositions[2]-1][2][0]-17) / scaleFactor).toString()+"px";
                red3.style.top = ((nodeData[red.nodePositions[2]-1][2][1]-17) / scaleFactor).toString()+"px";
            }
            if(red.nodePositions.length > 3){
                if(red.nodePositions[3] == 0){red4.style.display = "none";}
                else{
                    red4.style.display = "block";
                    red4.style.left = ((nodeData[red.nodePositions[3]-1][2][0]-17) / scaleFactor).toString()+"px";
                    red4.style.top = ((nodeData[red.nodePositions[3]-1][2][1]-17) / scaleFactor).toString()+"px";
                }
            }
        }
    }
}

function isValidMove(clickedNode){
    if(clickedNode == 0){return 0;}
    if(!outerNodes.includes(clickedNode)){return 0;}
    if(blue.activeTurn){
        for(let i of blue.nodePositions){
            if(i == clickedNode)
                return 2;
        }
        for(let i of red.nodePositions){
            if(i == clickedNode)
                return 0;
        }
    }
    if(red.activeTurn){
        for(let i of red.nodePositions){
            if(i == clickedNode)
                return 2;
        }
        for(let i of blue.nodePositions){
            if(i == clickedNode)
                return 0;
        }
    }
    for(let i of outerNodes){
            if(i == clickedNode)
                return 1;
        }
}

function checkSurrounded(){
    let surrounded = true;
    for(let i of blue.nodePositions){
        if(i !=0){
            for(let j of nodeData[i-1][1]){
            if(!red.nodePositions.includes(j) && j!=0)
                surrounded = false;
        }
        }
        if(surrounded){
            blue.nodePositions[blue.nodePositions.indexOf(i)] = 0;
        }
        else{surrounded = true;}
    }
    surrounded = true;
    for(let i of red.nodePositions){
        if(i!=0){
            for(let j of nodeData[i-1][1]){
            if(!blue.nodePositions.includes(j)&&j!=0)
                surrounded = false;
        }
        }
        if(surrounded){
            red.nodePositions[red.nodePositions.indexOf(i)] = 0;
        }
        else{surrounded = true;}
    }
}

function calculateScores(){
    let redr = [];
    let blur = [];
    blue.playerScore = 0;
    red.playerScore = 0;

    for(let i of blue.nodePositions){
        if(i != 0){blur.push(i);}
    }
    if(blur.length < 2 && !placingPhase){gameEnded = true; blue.allEliminated = true;}
    else{
        for(let i of blur){
            for(let j of blur){
                if(nodeData[i-1][1].includes(j)){
                    blue.playerScore += (nodeData[i-1][3][nodeData[i-1][1].indexOf(j)]);
                }
            }
        }
        if(blue.playerScore != 0){blue.playerScore /= 2;}
    }

    for(let i of red.nodePositions){
        if(i != 0){redr.push(i);}
    }
    if(redr.length < 2 && !placingPhase){gameEnded = true; red.allEliminated = true;}
    else{
        for(let i of redr){
            for(let j of redr){
                if(nodeData[i-1][1].includes(j)){
                    red.playerScore += (nodeData[i-1][3][nodeData[i-1][1].indexOf(j)]);
                }
            }
        }
        if(red.playerScore != 0){red.playerScore /= 2;}
    }
    if(gameEnded)
        EndGame();

    redscore.innerHTML = + red.playerScore;
    bluescore.innerHTML = + blue.playerScore;
}

function isInnerCircleComplete(){
    let loc = (blue.nodePositions).concat(red.nodePositions);
    let flag = true;
    for(let i of innerNodes){
        if(!loc.includes(i))
            flag = false;
    }
    return flag;
}

function EndGame(){
    gameTimeLeft = 0;
    if(blue.turnTimeLeft <= 0 || blue.allEliminated){
        redWon();
    }
    else if(red.turnTimeLeft <= 0 || red.allEliminated){
        blueWon();
    }
    else if(blue.playerScore >= red.playerScore){
        blueWon();
    }
    else{
        redWon();
    }
    reset.style.display = "block";
    gametimer.innerHTML = "--:--";
    bluetimer.innerHTML = "-:--";
    redtimer.innerHTML = "-:--";
}

function blueWon(){
    text.innerHTML = "Blue Wins The Game! " ;
}
    

function redWon(){
    text.innerHTML = "Red Wins The Game!" ;
}

function unlockInnerNodes(){
    let ol = [1,2,3,4,5,6];
    let ml = [7,8,9,10,11,12];
    let il = [13,14,15,16,17,18];
    let lf = true;

    let local = blue.nodePositions.concat(red.nodePositions);
    for(let i of ol){
        if(!local.includes(i)){lf = false;}
    }
    if(lf){outerNodes = ol.concat(ml);}
    lf = true;
    for(let i of ml){
        if(!local.includes(i))
            lf = false;
    }
    if(lf){outerNodes = (ol.concat(ml)).concat(il);}
}

reset.addEventListener("click", resetGame);
toggle.addEventListener("click", togglePause);
reset();