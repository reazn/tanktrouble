const Server = require("socket.io").Server;
const { customAlphabet } = require("nanoid");
const { gameLoop, initGame, newPlayer } = require("./game");

const newId = customAlphabet("23456789ABCDEFGHJKLPQSTUVXYZ", 4);

const state = {};
const rooms = {};

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.on("connection", client => {

    //Create game
    client.on("newGame", () => {
        let roomName = newId();

        rooms[client.id] = roomName;
        client.emit("gameCode", roomName);

        state[roomName] = initGame();
        Object.assign(state[roomName].players, { [client.id]: newPlayer() });
        client.join(roomName);
        client.emit("init", client.id);

        startInterval(roomName);
    });

    //Join
    client.on("joinGame", (roomName) => {
        roomName = roomName.toUpperCase();
        const room = io.sockets.adapter.rooms.get(roomName);
        console.log("Someone joined: ", roomName);

        let numClients = 0;

        if (room) {
            numClients = room.size;
        }

        if (numClients === 0) {
            client.emit("unknownGame");
            return;

        } else if (numClients > 9) {
            client.emit("tooManyPlayers");
            return;
        }

        rooms[client.id] = roomName;
        Object.assign(state[roomName].players, { [client.id]: newPlayer() });
        client.join(roomName);
        client.emit("gameCode", roomName)
        client.emit("init", client.id);
    });

    //Leave
    client.on("disconnect", () => {
        if (state[rooms[client.id]]) {
            delete state[rooms[client.id]].players[client.id];
            delete rooms[client.id];
        }
    });


    //Keypress
    client.on("keydown", handleKeyPress);
    client.on("keyup", handleKeyPress);

    function handleKeyPress(keys) {

        if (!state[rooms[client.id]]) return;

        let player = state[rooms[client.id]].players[client.id];

        //Move forward and backwards
        if (keys.includes("w")) {
            player.movement.vel = 2;
        } else if (keys.includes("s")) {
            player.movement.vel = -2;
        } else {
            player.movement.vel = 0;
        }

        //Rotate tank
        if (keys.includes("d")) {
            player.movement.rot = 3 * Math.PI / 180;
        } else if (keys.includes("a")) {
            player.movement.rot = -3 * Math.PI / 180;
        } else {
            player.movement.rot = 0 * Math.PI / 180;
        }

        //Shoot bullet
        if (keys.includes(" ")) {
            console.log("shoot bullet");
        } else {
        }
    }
})

function startInterval(roomId) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomId]);

        if (!winner) {
            emitGameState(roomId, state[roomId]);
        } else {
            emitGameOver(roomId, winner);
            state[roomId] = null;
            clearInterval(intervalId);
        }
    }, 1000 / 60)
}

function emitGameState(roomId, state) {
    io.sockets.in(roomId).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomId, winner) {
    io.sockets.in(roomId).emit("gameOver", JSON.stringify({ winner }));
}

console.log("Starting server");
io.listen(3000);