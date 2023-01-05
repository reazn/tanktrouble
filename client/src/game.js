import io from "socket.io-client";
import "./game.scss";

const socket = io("https://reazn.dev"); // Prod
// const socket = io("http://localhost:3000"); // Dev

const coverScreen = document.getElementById("coverScreen"); // Join options
const gameScreen = document.getElementById("gameScreen"); // Game screen
const newGameButton = document.getElementById("newGame"); // Create game
const gameCodeInput = document.getElementById("gameCode"); // Game Code input
const joinGameButton = document.getElementById("joinGame"); // Join game
const gameCodeText = document.getElementById("gameCodeText"); // Game code
const tooltip = document.getElementById("tooltip"); // Game code

let canvas, ctx;

// Copy code to clipboard
gameCodeText.addEventListener("click", () => {
    navigator.clipboard.writeText(gameCodeText.innerText);
    tooltip.style.visibility = "visible";
    setTimeout(() => {
        tooltip.style.visibility = "hidden";
    }, 1000)
})

// Create Game button
newGameButton.addEventListener("click", () => {
    socket.emit("newGame");
    init()
});

// Join Game button
joinGameButton.addEventListener("click", () => {
    const gameCode = gameCodeInput.value;
    socket.emit("joinGame", gameCode);
    init()
});

function init() {
    coverScreen.style.display = "none"; // hide join options screen
    gameScreen.style.display = "block"; // show game screen

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = canvas.height = 800;

    let keyMap = []

    // Send keypress to server
    document.addEventListener("keydown", (event) => {
        if (event.key == " " && event.target == document.body) event.preventDefault();
        if (event.repeat) return;
        if (!keyMap.includes(event.key)) {
            keyMap.push(event.key.toLowerCase());
        }

        socket.emit("keypress", keyMap);
    });

    document.addEventListener("keyup", (event) => {
        if (event.repeat) return;
        if (keyMap.includes(event.key.toLowerCase())) {
            keyMap.splice(keyMap.indexOf(event.key.toLowerCase()), 1);
        }

        socket.emit("keypress", keyMap);
    });
}

let tag = document.createElement("div")

function draw(state) {
    tag.replaceChildren()

    // Canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Item
    item(state.item)

    // Player
    for (let num = 0; num < Object.keys(state.players).length; num++) {
        let player = Object.values(state.players)[num];

        playerInfo(player);

        if (!player.dead) {
            drawPlayer(player);
        }
    }

    // Bullets
    for (let bul = 0; bul < state.bullets.length; bul++) {
        drawBullet(state.bullets[bul]);
    }
}

const itemWidth = 25;
const itemHeight = 25;

function item(item) {
    ctx.save();
    ctx.stokeStyle = "black"
    ctx.strokeRect(item.x, item.y, itemWidth, itemHeight);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(item.x + itemWidth / 2, item.y + itemHeight / 3.4, itemWidth / 5, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(item.x + itemWidth / 3.4, item.y + itemHeight / 1.4, itemWidth / 5, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(item.x + itemWidth / 1.4, item.y + itemHeight / 1.4, itemWidth / 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
}

function playerInfo(player) {
    let playerTag = document.createElement("div");
    let color = document.createElement("div");
    let ammo = document.createElement("div");
    let wins = document.createElement("div");
    let ammoCount = document.createElement("div");

    ammo.setAttribute("class", "ammo");

    for (let a = 0; a <= player.ammo; a++) {
        ammo.appendChild(ammoCount.cloneNode(true));
        ammoCount.setAttribute("class", "ammo-count")
    }

    color.setAttribute("class", "color");
    color.style.backgroundColor = player.color;
    color.innerText = player.dead ? "X" : "";

    wins.setAttribute("class", "wins");
    wins.innerText = player.wins;

    playerTag.setAttribute("class", "player")
    tag.append(playerTag)
    playerTag.append(color, ammo, wins);
    document.getElementById("players").appendChild(tag);
}


const tankWidth = 40;
const tankLength = tankWidth * 1.2;
const gunWidth = tankWidth / 4;
const gunLength = tankLength / 1.8;

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.save();
    ctx.beginPath();
    ctx.translate(player.pos.x + tankLength / 2, player.pos.y + tankWidth / 2);
    ctx.rotate(player.rot);
    ctx.fillRect(-tankLength / 2, -tankWidth / 2, tankLength, tankWidth);
    ctx.rect(-tankLength * -0.1, -gunWidth / 2, gunLength, gunWidth);
    ctx.arc(0, 0, 13, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

function drawBullet(bullet) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI, false);

    ctx.fillStyle = "black";
    ctx.fill();
}

socket.on("gameState", (gameState) => {
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => draw(gameState));
});

socket.on("gameCode", (gameCode) => {
    gameCodeText.innerText = gameCode;
});

socket.on("unknownGame", () => {
    reset();
    alert("Error, unknown game");
});

socket.on("tooManyPlayers", () => {
    reset();
    alert("Game already in progress");
});

function reset() {
    gameCodeInput.value = "";
    gameCodeInput.innerText = "";
    coverScreen.style.display = "block"; // show game screen
    gameScreen.style.display = "none"; // hide join options screen

}