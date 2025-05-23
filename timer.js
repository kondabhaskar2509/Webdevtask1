let isGamePaused = true;
let isGameOver = false;
let isPlacementPhase = true;
let tempVar = null;
let n = null;
let totalTime = 600;
let etime = 0;
let move = false;
const image = document.getElementById("gameMap");
let sizingRatio = 844 / image.clientHeight;
let ulkdnodes = [1,2,3,4,5,6];
let inner = [18,17,16,15,14,13];
let nodes = [
    [1,[2,6,7], [33, 422], [2,3,1]],
    [2,[1,3], [227,87], [2,1]],
    [3,[2,4,9], [616,87], [1,2,1]],
    [4,[3,5], [809,422], [2,1]],
    [5,[4,6,11], [615,757], [1,1,1]],
    [6,[1,5], [227,757], [3,1]],
    [7,[1,8,12], [164,422], [1,5,4]],
    [8,[7,9,17], [293,200], [5,6,1]],
    [9,[3,8,10], [551,200], [1,6,4]],
    [10,[9,11,15], [680,422], [4,5,1]],
    [11,[5,10,12], [551,646], [1,5,6]],
    [12,[7,11,13], [293,646], [4,6,1]],
    [13,[12,14,18], [357,535], [1,8,9]],
    [14,[13,15], [486,534], [8,8]],
    [15,[10,14,16], [551,422], [1,8,9]],
    [16,[15,17], [488,311], [9,8]],
    [17,[8,16,18], [357,311], [1,8,8]],
    [18,[13,17], [293,422], [9,8]]
];
let x = 0;
let y = 0;
const rect = image.getBoundingClientRect();

class Player{
    constructor(isTurn){
        this.isTurn = isTurn;
        this.score = 0;
        this.tloc = [];
        this.time = 60;
        this.all0 = false;
    }
}

let blue = new Player(true);
let red = new Player(false);

image.addEventListener("click", (event)=>{        
        x = event.pageX - rect.left;
        y = event.pageY - rect.top;
        if(!isGamePaused && !isGameOver){
            n = whichNode();
            extendMap();

            if(red.tloc.length == 4 && blue.tloc.length == 4){
                isPlacementPhase = false;
            }
            let isValidn = isnValid(n);
            if(isValidn == 0){move = false;document.getElementById("selector").style.display = "none";}
            else if(isValidn == 1 && !move){
                if(blue.isTurn && blue.tloc.length != 4){
                    blue.tloc.push(n);
                    allTitansInGame();
                    score();
                    placeTitan();
                    swapTurn();
                }
                else if(red.isTurn && red.tloc.length != 4){
                    red.tloc.push(n);
                    allTitansInGame();
                    score();
                    placeTitan();
                    swapTurn();
                }
            }
            else if(isValidn == 2 && !move){
                tempVar = n;
                move = true;
                document.getElementById("selector").style.display = "block";
                document.getElementById("selector").style.left = ((nodes[tempVar-1][2][0]-20)/sizingRatio)+"px";
                document.getElementById("selector").style.top = ((nodes[tempVar-1][2][1]-20)/sizingRatio)+"px";

            } 
            else if(isValidn == 2 && move){
                tempVar = n;
                document.getElementById("selector").style.display = "block";
                document.getElementById("selector").style.left = ((nodes[tempVar-1][2][0]-20)/sizingRatio)+"px";
                document.getElementById("selector").style.top = ((nodes[tempVar-1][2][1]-20)/sizingRatio)+"px";
            } 
            else if(isValidn==1 && move && nodes[tempVar-1][1].includes(n) && blue.isTurn){
                blue.tloc[blue.tloc.indexOf(tempVar)] = n;
                move = false;
                document.getElementById("selector").style.display = "none";
                allTitansInGame();
                score();
                placeTitan();
                swapTurn();
                tempVar = null;
            }
            else if(isValidn==1 && move && nodes[tempVar-1][1].includes(n) && red.isTurn){
                red.tloc[red.tloc.indexOf(tempVar)] = n;
                move = false;
                document.getElementById("selector").style.display = "none";
                allTitansInGame();
                score();
                placeTitan();
                swapTurn();
                tempVar = null;
            }
            if(red.tloc.length == 4 && blue.tloc.length == 4){
                isPlacementPhase = false;
            }
            allTitansInGame();
            score();
            placeTitan();
            if(isGameOver){EndGame();}
            if(isInnerCirc())
                isGameOver = true;
        }
        if(isGameOver){EndGame();}
    });

let t = null;
function toggle(){    
    if(!isGamePaused && !isGameOver){
        clearInterval(t);
        t = null;
        isGamePaused = true;
        document.getElementById("toggle").src = "imgs/play.png";
        document.getElementById("reset").style.display = "block";
    }
    else if(isGamePaused && !isGameOver){
        isGamePaused = false;
        t = setInterval(()=>{
        etime += 1;
        updateTime();
    },1000);
        document.getElementById("toggle").src = "imgs/pause.png";
        document.getElementById("reset").style.display = "none";
    }    
}

function reset(){
    if(t != null){
        clearInterval(t);
        t = null;
    }
    blue = new Player(true);
    red = new Player(false);
    isPlacementPhase = true;
    isGameOver = false;
    isGamePaused = true;
    totalTime = 600;
    document.getElementById("rc").style.display = "none";
    document.getElementById("bc").style.display = "none";
    document.getElementById("redTimer").innerHTML = "1:00";
    document.getElementById("blueTimer").innerHTML = "1:00";
    document.getElementById("rs").innerHTML = "+0";
    document.getElementById("bs").innerHTML = "+0";
    document.getElementById("blueTimer").style.backgroundColor = "#bfff0f";
    document.getElementById("blue").style.border = "1px solid #bfff0f";
    document.getElementById("blueInfo").style.backgroundColor = "#bfff0f";
    document.getElementById("redTimer").style.backgroundColor = "whitesmoke";
    document.getElementById("red").style.border = "1px solid rgba(237, 51, 38, 0.8)";
    document.getElementById("redInfo").style.backgroundColor = "whitesmoke";
    tempVar, n = null;
    etime = 0;
    move = false;
    ulkdnodes = [1,2,3,4,5,6];
    document.getElementById("reset").style.display = "none";
    document.getElementById("toggle").src = "imgs/play.png"

    document.getElementById("blueTitan1").style.display = "none";
    document.getElementById("blueTitan2").style.display = "none";
    document.getElementById("blueTitan3").style.display = "none";
    document.getElementById("blueTitan4").style.display = "none";
    document.getElementById("redTitan1").style.display = "none";
    document.getElementById("redTitan2").style.display = "none";
    document.getElementById("redTitan3").style.display = "none";
    document.getElementById("redTitan4").style.display = "none";
    document.getElementById("selector").style.display = "none";

    totalTime = 600;
    document.getElementById("Ttimer").innerHTML = "10:00";
}

function swapTurn(){
    if(!isGamePaused && blue.isTurn){
        blue.isTurn = false;
        red.isTurn = true;
        blue.time = 60;
        document.getElementById("blueTimer").innerHTML = "1:00";
        document.getElementById("blueTimer").style.backgroundColor = "whitesmoke";
        document.getElementById("blue").style.border = "1px solid rgba(7, 27, 87, 0.914)";
        document.getElementById("blueInfo").style.backgroundColor = "whitesmoke";
        document.getElementById("redTimer").style.backgroundColor = "#bfff0f";
        document.getElementById("red").style.border = "1px solid #bfff0f";
        document.getElementById("redInfo").style.backgroundColor = "#bfff0f";
    }
    else if(!isGamePaused && red.isTurn){
        red.isTurn = false;
        blue.isTurn = true;
        red.time = 60;
        document.getElementById("redTimer").innerHTML = "1:00";
        document.getElementById("blueTimer").style.backgroundColor = "#bfff0f";
        document.getElementById("blue").style.border = "1px solid #bfff0f";
        document.getElementById("blueInfo").style.backgroundColor = "#bfff0f";
        document.getElementById("redTimer").style.backgroundColor = "whitesmoke";
        document.getElementById("red").style.border = "1px solid rgba(237, 51, 38, 0.8)";
        document.getElementById("redInfo").style.backgroundColor = "whitesmoke";
    }
}

function updateTime(){
    if(totalTime > 1){
        if(blue.isTurn && !isGameOver){
            blue.time -= etime;
            totalTime -= etime;
            if(blue.time > 0){
                document.getElementById("blueTimer").innerHTML = (Math.floor(blue.time/60)).toString().padStart(1,"0")+":"+((blue.time - Math.floor(blue.time/60) * 60)).toString().padStart(2,"0");
                document.getElementById("Ttimer").innerHTML = (Math.floor(totalTime/60)).toString().padStart(2,"0")+":"+(totalTime - Math.floor(totalTime/60)*60).toString().padStart(2,"0");
                etime = 0;
            }
            else{
                isGameOver = true;
                EndGame();
            }
        }
        if(red.isTurn && !isGameOver){
            red.time -= etime;
            totalTime -= etime;
            if(red.time > 0){
                document.getElementById("redTimer").innerHTML = (Math.floor(red.time/60)).toString().padStart(1,"0")+":"+((red.time - Math.floor(red.time/60) * 60)).toString().padStart(2,"0");
                document.getElementById("Ttimer").innerHTML = (Math.floor(totalTime/60)).toString().padStart(2,"0")+":"+(totalTime - Math.floor(totalTime/60)*60).toString().padStart(2,"0");
                etime = 0;
            }
            else{
                isGameOver = true;
                EndGame();
            }
        }
    } else{isGameOver = true; EndGame();}
}

function whichNode(){
    let ax = 0; 
    let ay = 0;
    ax = x*sizingRatio;
    ay = y*sizingRatio;

    for(let node of nodes){
        let dist = (node[2][0]-ax)**2 + (node[2][1]-ay)**2;
        if(dist <= 900){
            return node[0];
        }
    }
    return 0;
}

function placeTitan(){
    const blueTitan1 = document.getElementById("blueTitan1");
    const blueTitan2 = document.getElementById("blueTitan2");
    const blueTitan3 = document.getElementById("blueTitan3");
    const blueTitan4 = document.getElementById("blueTitan4");
    const redTitan1 = document.getElementById("redTitan1");
    const redTitan2 = document.getElementById("redTitan2");
    const redTitan3 = document.getElementById("redTitan3");
    const redTitan4 = document.getElementById("redTitan4");

    if(blue.tloc.length > 0){
        if(blue.tloc[0] == 0){blueTitan1.style.display = "none";}
        else{
            blueTitan1.style.display = "block";
            blueTitan1.style.left = ((nodes[blue.tloc[0]-1][2][0]-17) / sizingRatio).toString()+"px";
            blueTitan1.style.top = ((nodes[blue.tloc[0]-1][2][1]-17) / sizingRatio).toString()+"px";
        }
    }
    if(blue.tloc.length > 1){
        if(blue.tloc[1] == 0){blueTitan2.style.display = "none";}
        else{
            blueTitan2.style.display = "block";
            blueTitan2.style.left = ((nodes[blue.tloc[1]-1][2][0]-17) / sizingRatio).toString()+"px";
            blueTitan2.style.top = ((nodes[blue.tloc[1]-1][2][1]-17) / sizingRatio).toString()+"px";
        }
        if(blue.tloc.length > 2){
            if(blue.tloc[2] == 0){blueTitan3.style.display = "none";}
            else{
                blueTitan3.style.display = "block";
                blueTitan3.style.left = ((nodes[blue.tloc[2]-1][2][0]-17) / sizingRatio).toString()+"px";
                blueTitan3.style.top = ((nodes[blue.tloc[2]-1][2][1]-17) / sizingRatio).toString()+"px";
            }
            if(blue.tloc.length > 3){
                if(blue.tloc[3] == 0){blueTitan4.style.display = "none";}
                else{
                    blueTitan4.style.display = "block";
                    blueTitan4.style.left = ((nodes[blue.tloc[3]-1][2][0]-17) / sizingRatio).toString()+"px";
                    blueTitan4.style.top = ((nodes[blue.tloc[3]-1][2][1]-17) / sizingRatio).toString()+"px";
                }
            }
        }
    }
    if(red.tloc.length > 0){
        if(red.tloc[0] == 0){redTitan1.style.display = "none";}
        else{
            redTitan1.style.display = "block";
            redTitan1.style.left = ((nodes[red.tloc[0]-1][2][0]-17) / sizingRatio).toString()+"px";
            redTitan1.style.top = ((nodes[red.tloc[0]-1][2][1]-17) / sizingRatio).toString()+"px";
        }
    }
    if(red.tloc.length > 1){
        if(red.tloc[1] == 0){redTitan2.style.display = "none";}
        else{
            redTitan2.style.display = "block";
            redTitan2.style.left = ((nodes[red.tloc[1]-1][2][0]-17) / sizingRatio).toString()+"px";
            redTitan2.style.top = ((nodes[red.tloc[1]-1][2][1]-17) / sizingRatio).toString()+"px";
        }
        if(red.tloc.length > 2){
            if(red.tloc[2] == 0){redTitan3.style.display = "none";}
            else{
                redTitan3.style.display = "block";
                redTitan3.style.left = ((nodes[red.tloc[2]-1][2][0]-17) / sizingRatio).toString()+"px";
                redTitan3.style.top = ((nodes[red.tloc[2]-1][2][1]-17) / sizingRatio).toString()+"px";
            }
            if(red.tloc.length > 3){
                if(red.tloc[3] == 0){redTitan4.style.display = "none";}
                else{
                    redTitan4.style.display = "block";
                    redTitan4.style.left = ((nodes[red.tloc[3]-1][2][0]-17) / sizingRatio).toString()+"px";
                    redTitan4.style.top = ((nodes[red.tloc[3]-1][2][1]-17) / sizingRatio).toString()+"px";
                }
            }
        }
    }
}

function isnValid(n){
    if(n == 0){return 0;}
    if(!ulkdnodes.includes(n)){return 0;}
    if(blue.isTurn){
        for(let i of blue.tloc){
            if(i == n)
                return 2;
        }
        for(let i of red.tloc){
            if(i == n)
                return 0;
        }
    }
    if(red.isTurn){
        for(let i of red.tloc){
            if(i == n)
                return 2;
        }
        for(let i of blue.tloc){
            if(i == n)
                return 0;
        }
    }
    for(let i of ulkdnodes){
            if(i == n)
                return 1;
        }
}

function allTitansInGame(){
    let surrounded = true;
    for(let i of blue.tloc){
        if(i !=0){
            for(let j of nodes[i-1][1]){
            if(!red.tloc.includes(j) && j!=0)
                surrounded = false;
        }
        }
        if(surrounded){
            blue.tloc[blue.tloc.indexOf(i)] = 0;
        }
        else{surrounded = true;}
    }
    surrounded = true;
    for(let i of red.tloc){
        if(i!=0){
            for(let j of nodes[i-1][1]){
            if(!blue.tloc.includes(j)&&j!=0)
                surrounded = false;
        }
        }
        if(surrounded){
            red.tloc[red.tloc.indexOf(i)] = 0;
        }
        else{surrounded = true;}
    }
}

function score(){
    let redr = [];
    let blur = [];
    blue.score = 0;
    red.score = 0;

    for(let i of blue.tloc){
        if(i != 0){blur.push(i);}
    }
    if(blur.length < 2 && !isPlacementPhase){isGameOver = true; blue.all0 = true;}
    else{
        for(let i of blur){
            for(let j of blur){
                if(nodes[i-1][1].includes(j)){
                    blue.score += (nodes[i-1][3][nodes[i-1][1].indexOf(j)]);
                }
            }
        }
        if(blue.score != 0){blue.score /= 2;}
    }

    for(let i of red.tloc){
        if(i != 0){redr.push(i);}
    }
    if(redr.length < 2 && !isPlacementPhase){isGameOver = true; red.all0 = true;}
    else{
        for(let i of redr){
            for(let j of redr){
                if(nodes[i-1][1].includes(j)){
                    red.score += (nodes[i-1][3][nodes[i-1][1].indexOf(j)]);
                }
            }
        }
        if(red.score != 0){red.score /= 2;}
    }
    if(isGameOver)
        EndGame();

    document.getElementById("rs").innerHTML = "+" + red.score;
    document.getElementById("bs").innerHTML = "+" + blue.score;
}

function isInnerCirc(){
    let loc = (blue.tloc).concat(red.tloc);
    let flag = true;
    for(let i of inner){
        if(!loc.includes(i))
            flag = false;
    }
    return flag;
}

function EndGame(){
    totalTime = 0;
    if(blue.time <= 0 || blue.all0){
        redWon();
    }
    else if(red.time <= 0 || red.all0){
        blueWon();
    }
    else if(blue.score >= red.score){
        blueWon();
    }
    else{
        redWon();
    }
    document.getElementById("reset").style.display = "block";
    document.getElementById("Ttimer").innerHTML = "--:--";
    document.getElementById("blueTimer").innerHTML = "-:--";
    document.getElementById("redTimer").innerHTML = "-:--";
}

function blueWon(){
    document.getElementById("bc").style.display = "block";
    document.getElementById("blueTimer").style.backgroundColor = "#fcef38";
    document.getElementById("blueInfo").style.backgroundColor = "#fcef38";
    document.getElementById("redTimer").style.backgroundColor = "whitesmoke";
    document.getElementById("redInfo").style.backgroundColor = "whitesmoke";   
    document.getElementById("red").style.border = "1px solid rgba(237, 51, 38, 0.8)";
    document.getElementById("blue").style.border = "1px solid #fcef38"; 
}

function redWon(){
    document.getElementById("rc").style.display = "block";
    document.getElementById("blueTimer").style.backgroundColor = "whitesmoke";
    document.getElementById("blueInfo").style.backgroundColor = "whitesmoke";
    document.getElementById("redTimer").style.backgroundColor = "#fcef38";
    document.getElementById("redInfo").style.backgroundColor = "#fcef38";
    document.getElementById("blue").style.border = "1px solid rgba(7, 27, 87, 0.914)";
    document.getElementById("red").style.border = "1px solid #fcef38";
}

function extendMap(){
    let ol = [1,2,3,4,5,6];
    let ml = [7,8,9,10,11,12];
    let il = [13,14,15,16,17,18];
    let lf = true;

    let local = blue.tloc.concat(red.tloc);
    for(let i of ol){
        if(!local.includes(i)){lf = false;}
    }
    if(lf){ulkdnodes = ol.concat(ml);}
    lf = true;
    for(let i of ml){
        if(!local.includes(i))
            lf = false;
    }
    if(lf){ulkdnodes = (ol.concat(ml)).concat(il);}
}