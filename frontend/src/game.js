const io = require("socket.io-client");
// const socket = io("https://reazn.me"); //Prod
const socket = io("http://localhost:3000"); //Dev

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

gameCodeText.addEventListener("click", () => {
    navigator.clipboard.writeText(gameCodeText.innerText);
})

newGameButton.addEventListener("click", newGame);
joinGameButton.addEventListener("click", joinGame);

let canvas, ctx, playerNumber;
let gameActive = false;

function newGame(event) {
    socket.emit("newGame");
    init()
}

function joinGame() {
    const gameCode = gameCodeInput.value;
    socket.emit("joinGame", gameCode);
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
            keyMap.push(event.key.toLowerCase());
        }

        socket.emit("keydown", keyMap);
    });

    document.addEventListener("keyup", (event) => {
        if (keyMap.includes(event.key.toLowerCase())) {
            keyMap.splice(keyMap.indexOf(event.key.toLowerCase()), 1);
        }

        socket.emit("keyup", keyMap);
    });
    gameActive = true;
}

function draw(state) {
    //Canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Item
    const item = state.item;
    ctx.fillStyle = "#8d41fe";
    ctx.fillRect(item.x, item.y, 25, 25);

    //Player
    for (let num = 0; num < Object.keys(state.players).length; num++) {
        let player = Object.values(state.players)[num];
        drawPlayer(player, player.color);
    }
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
    ctx.rotate(playerState.rot);
    ctx.fillRect(-tankLength / 2, -tankWidth / 2, tankLength, tankWidth);
    ctx.rect(-tankLength * -0.1, -tankWidth / 2 + gunWidth, gunLength, gunWidth);
    ctx.stroke()
    ctx.fill();
    ctx.restore();
}

// function bullet(playerState) {
//     ctx.beginPath()
//     ctx.arc(playerState.pos.x, playerState.pos.x, 10, 0, 2 * Math.PI, false)
//     ctx.fillStyle = "black"
//     ctx.fill()
// }

function handleInit(number) {
    playerNumber = number;
    console.log(number);
}

function handleGameState(gameState) {
    if (!gameActive) return;
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => draw(gameState));
}

function handleGameOver(data) {
    if (!gameActive) return;
    data = JSON.parse(data);

    if (data.winner === playerNumber) {
        alert("you won!");
    } else {
        alert("you lost lmao");
    }
    gameActive = false;
}

function handleGameCode(gameCode) {
    gameCodeText.innerText = gameCode;
}

function handleUnknownGame() {
    reset();
    alert("Error, unknown game");
}

function handleTooManyPlayers() {
    reset();;
    alert("Game already in progress");
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeInput.innerText = "";
    coverScreen.style.display = "block"; //show game screen
    gameScreen.style.display = "none"; //hide join options screen

}