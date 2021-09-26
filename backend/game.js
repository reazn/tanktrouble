
function initGame() {
    const state = createGameState();
    randomItem(state);
    return state;
}

function createGameState() {
    return {
        players: [{
            pos: {
                x: 200,
                y: 200
            },
            rot: 125,
            movement: {
                vel: 0,
                pos: {
                    x: 0,
                    y: 0,
                },
                rot: 0,
            },
            inv: {
                default: true,
                shotgun: false
            }
        },
        {
            pos: {
                x: 600,
                y: 600
            },
            rot: 25,
            movement: {
                vel: 0,
                pos: {
                    x: 0,
                    y: 0,
                },
                rot: 0,
            },
            inv: {
                default: true,
                shotgun: false
            }
        }],
        item: {
            x: 30,
            y: 250
        },
    }
}

function gameLoop(state) {
    if (!state) return;

    //Player one
    const playerOne = state.players[0];

    playerOne.pos.y += playerOne.movement.vel * Math.sin(playerOne.rot);
    playerOne.pos.x += playerOne.movement.vel * Math.cos(playerOne.rot);

    playerOne.rot += playerOne.movement.rot;


    //if player goes out of bounds
    //Temp collision
    if (playerOne.pos.x < 0) {
        playerOne.pos.x = 0;
    }

    if (playerOne.pos.x > 800 - 45) {
        playerOne.pos.x = 800 - 45;
    }

    if (playerOne.pos.y < 0) {
        playerOne.pos.y = 0;
    }

    if (playerOne.pos.y > 800 - 45) {
        playerOne.pos.y = 800 - 45;
    }


    ///////////////////////////////////////////////
    //Player two

    // Temp duplicate code

    const playerTwo = state.players[1];


    playerTwo.pos.y += playerTwo.movement.vel * Math.sin(playerTwo.rot);
    playerTwo.pos.x += playerTwo.movement.vel * Math.cos(playerTwo.rot);

    playerTwo.rot += playerTwo.movement.rot;


    //if player goes out of bounds
    //Temp collision
    if (playerTwo.pos.x < 0) {
        playerTwo.pos.x = 0;
    }

    if (playerTwo.pos.x > 800 - 45) {
        playerTwo.pos.x = 800 - 45;
    }

    if (playerTwo.pos.y < 0) {
        playerTwo.pos.y = 0;
    }

    if (playerTwo.pos.y > 800 - 45) {
        playerTwo.pos.y = 800 - 45;
    }


    // // TODO make it work
    // console.log(state.item.x, state.item.y, playerOne.pos.x, playerOne.pos.y)
    // if (state.item.x >= playerOne.pos.x && state.item.x >= playerOne.pos.x
    // && state.item.y >= playerOne.pos.y && state.item.y >= playerOne.pos.y) {
    // randomItem(state)
    // }

    return false;
}

function randomItem(state) {
    item = {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 800),
    };

    state.item = item;
}

module.exports = { initGame, gameLoop };