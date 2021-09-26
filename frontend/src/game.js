const io = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownGame", handleUnknownGame);
socket.on("tooManyPlayers", handleTooManyPlayers);


const coverScreen = document.getElementById("coverScreen"); //join options
const gameScreen = document.getElementById("gameScreen"); //game screen
const newGameButton = document.getElementById("newGame"); //Create game
const gameCodeInput = document.getElementById("gameCode"); //Game Code input
const joinGameButton = document.getElementById("joinGame"); //Join game
const gameCodeText = document.getElementById("gameCodeText"); //Join game

newGameButton.addEventListener("click", newGame);
joinGameButton.addEventListener("click", joinGame);

let canvas, ctx, playerNumber;
let gameActive = false;

function newGame() {
    socket.emit("newGame")
    init()
}

function joinGame() {
    const gameCode = gameCodeInput.value;
    socket.emit("joinGame", gameCode)
    init()
}

function init() {
    coverScreen.style.display = "none"; //hide join options screen
    gameScreen.style.display = "block"; //show game screen

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = canvas.height = 800;

    let keyMap = []

    document.addEventListener("keydown", (event) => {
        if (!keyMap.includes(event.key)) {
            keyMap.push(event.key);
        }

        socket.emit("keydown", keyMap);
    });

    document.addEventListener("keyup", (event) => {
        if (keyMap.includes(event.key)) {
            keyMap.splice(keyMap.indexOf(event.key), 1);
        }

        socket.emit("keyup", keyMap);
    });
    gameActive = true;
}


function draw(state) {
    //Canvas
    ctx.fillStyle = "#cdcdcd";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //Item
    const item = state.item;

    ctx.fillStyle = "#8d41fe"
    ctx.fillRect(item.x, item.y, 25, 25)
    // ctx.clearRect(0, 0, windowWidth, windowHeight);

    drawPlayer(state.players[0], "#d02425");
    drawPlayer(state.players[1], "#5562e9");
}

const tankWidth = 40;
const tankLength = tankWidth * 1.2;
const gunWidth = tankWidth / 3;
const gunLength = tankLength / 1.8;

function drawPlayer(playerState, color) {
    ctx.fillStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.translate(playerState.pos.x + tankLength / 2, playerState.pos.y + tankWidth / 2);
    ctx.rotate(playerState.rot)
    ctx.fillRect(-tankLength / 2, -tankWidth / 2, tankLength, tankWidth);
    ctx.rect(-tankLength * -0.1, -tankWidth / 2 + gunWidth, gunLength, gunWidth);
    ctx.stroke()
    ctx.fill();
    ctx.restore();

}

function handleInit(number) {
    playerNumber = number;
    console.log(number);
}

function handleGameState(gameState) {
    if (!gameActive) return;
    gameState = JSON.parse(gameState)
    requestAnimationFrame(() => draw(gameState));
}

function handleGameOver(data) {
    if (!gameActive) return;
    data = JSON.parse(data);

    if (data.winner === playerNumber) {
        alert("you won!")
    } else {
        alert("you lost lmao")
    }
    gameActive = false;
}

function handleGameCode(gameCode) {
    gameCodeText.innerText = gameCode;
}

function handleUnknownGame() {
    reset();
    alert("Error, unknown game")
}

function handleTooManyPlayers() {
    reset();
    alert("Game already in progress")
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeInput.innerText = "";
    coverScreen.style.display = "block"; //show game screen
    gameScreen.style.display = "none"; //hide join options screen

}

























// canvas.width = 1000;
// canvas.height = 800;

// let gameFrame = 0;


// window.addEventListener("keydown");
// // window.addEventListener("keyup", );

// class Player {
//     constructor() {
//         this.x = canvas.width;
//         this.y = canvas.height;
//         this.spriteWidth = 40;
//         this.spriteHeight = 50
//     }
//     update() {
//     }
// }


















// let canvas = document.getElementById("canvas");
// let ctx = canvas.getContext("2d");

// //event listener
// window.addEventListener("keydown", onKeyDown, false);
// window.addEventListener("keyup", onKeyUp, false);

// function onKeyDown(event) {
//     let keyCode = event.keyCode;
//     switch (keyCode) {
//         case 68: //d
//             keyD = true;
//             break;
//         case 83: //s
//             keyS = true;
//             break;
//         case 65: //a
//             keyA = true;
//             break;
//         case 87: //w
//             keyW = true;
//             break;
//     }
// }

// function onKeyUp(event) {
//     let keyCode = event.keyCode;

//     switch (keyCode) {
//         case 68: //d
//             keyD = false;
//             break;
//         case 83: //s
//             keyS = false;
//             break;
//         case 65: //a
//             keyA = false;
//             break;
//         case 87: //w
//             keyW = false;
//             break;
//     }
// }


// let x = 100;
// let y = 100;

// let rotation = 0;

// let keyW = false;
// let keyA = false;
// let keyS = false;
// let keyD = false;

// //main animation function
// function draw() {

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "blue";
//     ctx.fillRect(x, y, 100, 100);
//     // ctx.translate(x + 0.5 * 100, y + 0.5 * 100);

//     // ctx.rect(tickX + 100 / 2, tickY + 100 / 2);

//     if (keyD == true) {
//         // x += 2;
//         ctx.translate(-x * 0.5, -y * 0.5);
//         ctx.rotate((Math.PI / 180) * 2)
//         ctx.translate(x * 0.5, y * 0.5);
//     }
//     if (keyS == true) {
//         y += 2;
//     }
//     if (keyA == true) {
//         x -= 2;
//         // ctx.translate(x + 0.5 * 100, y + 0.5 * 100);
//         // ctx.rotate(-(Math.PI / 180) * 2)
//         // ctx.translate(-(x + 0.5 * 100), -(y + 0.5 * 100));
//     }
//     if (keyW == true) {
//         y -= 2;
//     }
//     window.requestAnimationFrame(draw);
// }
// window.requestAnimationFrame(draw);














// context.canvas.height = 400;
// context.canvas.width = 1220;

// // Start the frame count at 1
// let frameCount = 1;
// // Set the number of obstacles to match the current "level"
// let obCount = frameCount;
// // Create a collection to hold the generated x coordinates
// const obXCoors = [];

// const square = {

//     height: 32,
//     jumping: true,
//     width: 32,
//     x: 0,
//     xVelocity: 0,
//     y: 0,
//     yVelocity: 0

// };

// // Create the obstacles for each frame
// const nextFrame = () => {
//     // increase the frame / "level" count
//     frameCount++;

//     for (let i = 0; i < obCount; i++) {
//         // Randomly generate the x coordinate for the top corner start of the triangles
//         obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
//         obXCoors.push(obXCoor);
//     }

// }

// const controller = {

//     left: false,
//     right: false,
//     up: false,
//     keyListener: function (event) {

//         let key_state = (event.type == "keydown") ? true : false;

//         switch (event.keyCode) {

//             case 37:// left key
//                 controller.left = key_state;
//                 break;
//             case 38:// up key
//                 controller.up = key_state;
//                 break;
//             case 39:// right key
//                 controller.right = key_state;
//                 break;

//         }

//     }

// };

// const loop = function () {

//     if (controller.up && square.jumping == false) {

//         square.yVelocity -= 20;
//         square.jumping = false;

//     }

//     if (controller.left) {

//         square.xVelocity -= 0.5;

//     }

//     if (controller.right) {

//         square.xVelocity += 0.5;

//     }

//     square.yVelocity += 1.5;// gravity
//     square.x += square.xVelocity;
//     square.y += square.yVelocity;
//     square.xVelocity *= 0.9;// friction
//     square.yVelocity *= 0.9;// friction

//     // if square is falling below floor line
//     if (square.y > 386 - 16 - 32) {

//         square.jumping = false;
//         square.y = 386 - 16 - 32;
//         square.yVelocity = 0;

//     }

//     // if square is going off the left of the screen
//     if (square.x < -20) {

//         square.x = 1220;

//     } else if (square.x > 1220) {// if square goes past right boundary

//         square.x = -20;
//         nextFrame();

//     }
//     // Creates the backdrop for each frame
//     context.fillStyle = "#201A23";
//     context.fillRect(0, 0, 1220, 400); // x, y, width, height


//     // Creates and fills the cube for each frame
//     context.fillStyle = "#8DAA9D"; // hex for cube color
//     context.beginPath();
//     context.rect(square.x, square.y, square.width, square.height);
//     context.fill();


//     // Create the obstacles for each frame
//     // Set the standard obstacle height
//     const height = 200 * Math.cos(Math.PI / 6);

//     context.fillStyle = "#FBF5F3"; // hex for triangle color
//     obXCoors.forEach((obXCoor) => {
//         context.beginPath();

//         context.moveTo(obXCoor, 385); // x = random, y = coor. on "ground"
//         context.lineTo(obXCoor + 20, 385); // x = ^random + 20, y = coor. on "ground"
//         context.lineTo(obXCoor + 10, 510 - height); // x = ^random + 10, y = peak of triangle

//         context.closePath();
//         context.fill();
//     })


//     // Creates the "ground" for each frame
//     context.strokeStyle = "#2E2532";
//     context.lineWidth = 30;
//     context.beginPath();
//     context.moveTo(0, 385);
//     context.lineTo(1220, 385);
//     context.stroke();

//     // call update when the browser is ready to draw again
//     window.requestAnimationFrame(loop);

// };

// window.addEventListener("keydown", controller.keyListener)
// window.addEventListener("keyup", controller.keyListener);
// window.requestAnimationFrame(loop);