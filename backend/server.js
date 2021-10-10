const { Server } = require("socket.io");
const { customAlphabet } = require("nanoid");
const { gameLoop, initGame, newPlayer, newBullet, randomItem } = require("./game");

//Create random game code
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

        let numClients = 0;

        if (room) {
            numClients = room.size;
        }

        if (numClients === 0) {
            client.emit("unknownGame");
            return;

        } else if (numClients >= 8) {
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

            // for (var key in state[rooms[client.id]].players) {
            //     if (state[rooms[client.id]].players.hasOwnProperty(key)) {
            //         return delete state[rooms[client.id]];
            //     }
            // }

            delete state[rooms[client.id]].players[client.id];
            delete rooms[client.id];
        }
    });

    //Keypress
    client.on("keypress", handleKeyPress);

    function handleKeyPress(keys) {

        if (!state[rooms[client.id]]) return;

        let player = state[rooms[client.id]].players[client.id];

        //Undead - for development
        if (keys.includes("#")) {
            player.dead = false;
            if (!state[rooms[client.id]].deaths == 0) {
                state[rooms[client.id]].deaths--;
            }
        }

        if (player.dead) return;

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
            player.movement.rot = 0;
        }

        //Shoot bullet
        if (keys.includes(" ")) {

            if (!player.ammo <= 0) {

                if (player.shoot) return;

                player.shoot = true;

                state[rooms[client.id]].bullets.push(newBullet(player));
                player.ammo--;

                setTimeout(() => {
                    player.shoot = false;
                }, 150)

            }
        }

    }
})

function startInterval(roomId) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomId]);

        emitGameState(roomId, state[roomId]);

        if (winner) {
            clearInterval(intervalId);
            resetGame(state[roomId]);

            setTimeout(() => {
                startInterval(roomId);
            }, 1000)
        }
    }, 1000 / 60)
}

function resetGame(roomId) {

    //Game
    roomId.bullets = [];
    randomItem(roomId);
    roomId.deaths = 0;

    //Players
    for (let num = 0; num < Object.keys(roomId.players).length; num++) {
        player = Object.values(roomId.players)[num];
        player.dead = false;
        player.pos = {
            x: Math.floor(Math.random() * (800 - 45)),
            y: Math.floor(Math.random() * (800 - 45))
        }
        player.rot = Math.floor(Math.random() * 360);
        player.ammo = 5;
    }
}

function emitGameState(roomId, state) {
    io.sockets.in(roomId).emit("gameState", JSON.stringify(state));
}

console.log("Starting server");
io.listen(3000);