export function initGame() {
    return {
        players: {},
        bullets: [],
        item: {
            x: Math.floor(Math.random() * (800 - 25)),
            y: Math.floor(Math.random() * (800 - 25)),
        },
        deaths: 0
    }
}

export function newPlayer() {
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
        weapon: "normal",
        color: "#000000".replace(/0/g, () => { return (~~(Math.random() * 16)).toString(16) }),
        ammo: 5,
        shoot: false,
        dead: false,
        wins: 0
    }
}

export function newBullet(player) {
    return {
        x: (player.pos.x + 20) + 45 * Math.cos(player.rot),
        y: (player.pos.y + 24) + 45 * Math.sin(player.rot),
        rot: player.rot,
        xVel: player.weapon == "laser" ? 10 : 4,
        yVel: player.weapon == "laser" ? 10 : 4,
        bounces: 0,
        weapon: player.weapon
    }
}


export function randomItem(state) {
    let item = {
        x: Math.floor(Math.random() * (800 - 25)),
        y: Math.floor(Math.random() * (800 - 25)),
    };

    state.item = item;
}

export function gameLoop(state) {
    if (!state) return;

    let player;

    //Players
    for (let num = 0; num < Object.keys(state.players).length; num++) {

        player = Object.values(state.players)[num];

        //Bullets
        for (let bul = 0; bul < state.bullets.length; bul++) {

            let bullet = state.bullets[bul]

            bullet.x += bullet.xVel / Object.values(state.players).length * Math.cos(bullet.rot);
            bullet.y += bullet.yVel / Object.values(state.players).length * Math.sin(bullet.rot);

            //Edge of map collision
            if (bullet.x <= 0 || bullet.x >= 800) {
                bullet.xVel = -bullet.xVel;
                bullet.bounces++;
            }

            if (bullet.y <= 0 || bullet.y >= 800) {
                bullet.yVel = -bullet.yVel;
                bullet.bounces++;
            }

            //Bullet-player collisions
            if (player.pos.x + 40 >= bullet.x &&
                player.pos.x <= bullet.x + 5 &&
                player.pos.y + 40 >= bullet.y &&
                player.pos.y <= bullet.y + 5) {

                if (player.dead) continue;
                state.deaths += 1;
                player.dead = true;
                state.bullets.splice([bul], 1)
            }

            if (bullet.bounces == 3) state.bullets.splice([bul], 1);
        }

        //Movement
        player.pos.x += player.movement.vel * Math.cos(player.rot);
        player.pos.y += player.movement.vel * Math.sin(player.rot);

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
            player.ammo = 5;
            randomItem(state);
        }

        if (!player.dead && Object.keys(state.players).length > 1) {
            if (state.deaths >= Object.keys(state.players).length - 1) {
                player.wins++;
                return Object.keys(state.players)[num];
            }
        }

        if (player.dead && Object.keys(state.players).length == 1) {
            return Object.keys(state.players)[num];
        }

    };

    return false;
}