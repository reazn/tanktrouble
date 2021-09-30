function initGame() {
    const state = {
        players: {},
        item: {
            x: 30,
            y: 250,
        },
        bullets: [{}]
    }
    return state;
}

function newPlayer() {
    return {
        pos: {
            x: Math.floor(Math.random() * (800 - 45)),
            y: Math.floor(Math.random() * (800 - 45)),
        },
        rot: Math.floor(Math.random() * 360),
        movement: {
            pos: {
                x: 0,
                y: 0,
            },
            vel: 0,
            rot: 0,
        },
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        inv: {
            default: true,
            shotgun: false
        }
    }
}

function gameLoop(state) {
    if (!state) return;

    for (let num = 0; num < Object.keys(state.players).length; num++) {

        let player = Object.values(state.players)[num];

        //Movement
        player.pos.y += player.movement.vel * Math.sin(player.rot);
        player.pos.x += player.movement.vel * Math.cos(player.rot);

        player.rot += player.movement.rot;

        //Edge of map collision
        if (player.pos.x < 0) {
            player.pos.x = 0;
        }

        if (player.pos.x > 800 - 45) {
            player.pos.x = 800 - 45;
        }

        if (player.pos.y < 0) {
            player.pos.y = 0;
        }

        if (player.pos.y > 800 - 45) {
            player.pos.y = 800 - 45;
        }

        //Item pickup collision
        if (player.pos.x + 40 >= state.item.x &&
            player.pos.x <= state.item.x + 25 &&
            player.pos.y + 40 >= state.item.y &&
            player.pos.y <= state.item.y + 25) {
            randomItem(state);
        }

        //Bullet collisions
        if (player.shooting) {

        }

    };
    return false;
}

function randomItem(state) {
    item = {
        x: Math.floor(Math.random() * (800 - 25)),
        y: Math.floor(Math.random() * (800 - 25)),
    };

    state.item = item;
}

module.exports = { initGame, gameLoop, newPlayer };