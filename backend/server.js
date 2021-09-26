const Server = require("socket.io").Server;
const { customAlphabet } = require("nanoid");
const { gameLoop, initGame } = require("./game");

const newId = customAlphabet("23456789ABCDEFGHJKLPQSTUVXYZ", 4)

const state = {};
const rooms = {};

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.on("connect", client => {

    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    function handleNewGame() {
        let roomName = newId();

        rooms[client.id] = roomName;
        client.emit("gameCode", roomName)

        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit("init", 1)
        console.log(rooms)
    }

    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms.get(roomName);
        console.log(room)

        let numClients = 0;
        if (room) {
            numClients = room.size;
        }

        if (numClients === 0) {
            client.emit("unknownGame");
            return;

        } else if (numClients > 1) {
            client.emit("tooManyPlayers");
            return;
        }

        rooms[client.id] = roomName;
        client.join(roomName);
        client.number = 2;
        client.emit("init", 2);

        startInterval(roomName);
    }

    client.on("keydown", handleKeyPress);
    client.on("keyup", handleKeyPress);

    function handleKeyPress(keys) {
        const roomName = rooms[client.id]

        if (!roomName) {
            return;
        }

        //Move forward and backwards
        if (keys.includes("w")) {
            state[roomName].players[client.number - 1].movement.vel = 2;
            // state.player.movement.vel = 2;
        } else if (keys.includes("s")) {
            state[roomName].players[client.number - 1].movement.vel = -2;
        } else {
            state[roomName].players[client.number - 1].movement.vel = 0;
        }

        //Rotate tank
        if (keys.includes("d")) {
            state[roomName].players[client.number - 1].movement.rot = 3 * Math.PI / 180;
            // state.player.movement.rot = 3 * Math.PI / 180;
        } else if (keys.includes("a")) {
            state[roomName].players[client.number - 1].movement.rot = -3 * Math.PI / 180;
        } else {
            state[roomName].players[client.number - 1].movement.rot = 0 * Math.PI / 180;
        }

        //Shoot round
        if (keys.includes(" ")) {
            console.log("spacebar");
        }
    }
})

function startInterval(roomId) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomId]);

        if (!winner) {
            emitGameState(roomId, state[roomId])
        } else {
            emitGameOver(roomId, winner)
            state[roomId] = null;
            clearInterval(intervalId);
        }
    }, 1000 / 60)
}

function emitGameState(roomId, state) {
    io.sockets.in(roomId).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomId, winner) {
    io.sockets.in(roomId).emit("gameOver", JSON.stringify({ winner }))
}

io.listen(3000);