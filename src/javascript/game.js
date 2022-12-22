// ---------- Title ----------

// comments

/**
 * Gameplay description
 */

// ---------- Variables declaration ----------

let inGame = false;
let activePlayer;

//const btnStart = document.querySelector('#btnStart') declared in newGame.js

const p1Side = document.querySelector("#playerOneSide");
const p2Side = document.querySelector("#playerTwoSide");
const btnRoll = document.querySelector("#roll");
const btnHold = document.querySelector("#hold");
const dices = document.querySelectorAll("#dice>img");

const player1 = {
    globalN: Number(document.querySelector("#p1-global").innerHTML),
    currentN: Number(document.querySelector("#p1-current").innerHTML),
    global: document.querySelector("#p1-global"),
    current: document.querySelector("#p1-current"),
    name: "player1",
    pseudo: document.querySelector("#p1-pseudo"),
    cpu: null,
};
const player2 = {
    globalN: Number(document.querySelector("#p2-global").innerHTML),
    currentN: Number(document.querySelector("#p2-current").innerHTML),
    global: document.querySelector("#p2-global"),
    current: document.querySelector("#p2-current"),
    name: "player2",
    pseudo: document.querySelector("#p2-pseudo"),
    cpu: null,
};
let formSettings = null;
let cpuRoundCompt = null;

// ---------- Listener ----------

btnStart.addEventListener("click", () => {
    // settings recovery
    formSettings = {
        player1: {
            pseudo: pseudo1.value,
            cpu: playerOneType.value === "cpu" ? true : false,
        },
        player2: {
            pseudo: pseudo2.value,
            cpu: playerTwoType.value === "cpu" ? true : false,
        },
    };

    // alert if a game is already in progress, before lose score
    inGame ? alertNewGame(formSettings) : newGame(formSettings);
});

// ---------- Gameplay functions ----------

/**
 * New game is starting
 *  */
// create a new game
function newGame(formSettings) {
    inGame = true;

    // settings display
    player1.pseudo.innerHTML = formSettings.player1.pseudo;
    player2.pseudo.innerHTML = formSettings.player2.pseudo;
    // settings add to player
    player1.cpu = formSettings.player1.cpu;
    player2.cpu = formSettings.player2.cpu;

    // before create a new game all score is reset
    player1.globalN = 0;
    player1.currentN = 0;
    player2.globalN = 0;
    player2.currentN = 0;
    player1.global.innerHTML = 0;
    player1.current.innerHTML = 0;
    player2.global.innerHTML = 0;
    player2.current.innerHTML = 0;

    // set random player to start
    getRandomNumber(1, 2) === 1 ? round(player1) : round(player2);
}

/**
 * New round for same or new active player
 * */
// new round with current active player
async function round(player) {
    // reset and set active player
    activePlayer = player;

    p1Side.classList.remove("active");
    p2Side.classList.remove("active");

    if (activePlayer === player1) {
        p1Side.classList.add("active");
    } else if (activePlayer === player2) {
        p2Side.classList.add("active");
    }

    // set btn state: active or not
    // // roll btn (inactive if the score allows the player to win)
    if (activePlayer.globalN + activePlayer.currentN < 100) {
        btnRoll.classList.remove("disabled");
        btnRoll.disabled = false;
    } else {
        btnRoll.classList.add("disabled");
        btnRoll.disabled = true;
    }

    // // hold btn (inactive if the player's score is zero)
    if (activePlayer.currentN === 0) {
        btnHold.classList.add("disabled");
        btnHold.disabled = true;
    } else {
        btnHold.classList.remove("disabled");
        btnHold.disabled = false;
    }

    // check if player is Computer or not?
    if (activePlayer.cpu) {
        /**
         * CPU player, automatique round
         */

        // initialise cpu round counter
        if (cpuRoundCompt === null) {
            cpuRoundCompt = getRandomNumber(1, 5);
        }

        if (
            cpuRoundCompt > 0 &&
            activePlayer.globalN + activePlayer.currentN < 100
        ) {
            setTimeout(() => {
                roll();
            }, 1000);
            cpuRoundCompt--;
        } else {
            setTimeout(() => {
                hold();
            }, 1000);
            cpuRoundCompt = null;
        }
    } else {
        /**
         * Human player, command is expected
         */
        // listener btn
        btnRoll.addEventListener("click", roll, { once: true });
        btnHold.addEventListener("click", hold, { once: true });
    }
}

// switch player before start new round with
function switchPlayer(activePlayer) {
    activePlayer === player1
        ? (activePlayer = player2)
        : (activePlayer = player1);

    round(activePlayer);
}

// ---------- Commande functions ----------

// roll the dice and ammend score
function roll() {
    if (gamePause.pause) {
        restart = roll;
    } else {
        // stop roll btn durring dice animation
        btnRoll.classList.add("disabled");
        btnRoll.disabled = true;

        // remove hold listener before new round
        btnHold.removeEventListener("click", hold, { once: true });

        // random roll score
        const score = getRandomNumber(1, 6);
        rollImg(score);

        // timeout wait for dice animation
        setTimeout(() => {
            if (score === 1) {
                // reset player score and switch to new round with next player
                activePlayer.currentN = 0;
                activePlayer.current.innerHTML = 0;
                switchPlayer(activePlayer);
                cpuRoundCompt = null;
            } else {
                // animation fadeIn on current score
                activePlayer.current.classList.add("fade");
                setTimeout(() => {
                    activePlayer.current.classList.remove("fade");
                }, 1000);
                // ammend new score and créate new round with same player
                activePlayer.currentN += score;
                activePlayer.current.innerHTML = activePlayer.currentN;
                round(activePlayer);
            }
        }, 1500);
    }
}

// save current score to glabal and switch player
function hold() {
    if (gamePause.pause) {
        restart = hold;
    } else {
        // remove roll listener before new round
        btnRoll.removeEventListener("click", roll, { once: true });

        // animation fadeIn on global score
        activePlayer.global.classList.add("fade");
        setTimeout(() => {
            activePlayer.global.classList.remove("fade");
        }, 1000);
        // ammend score
        activePlayer.global.innerHTML =
            activePlayer.globalN + activePlayer.currentN;
        activePlayer.globalN += activePlayer.currentN;

        /**
         *  If player win, alert Winner and stop the game.
         *  Else save the score and start new Round with next player
         */
        if (activePlayer.globalN >= 100) {
            //alert winner
            const winner = `Winner ${activePlayer.pseudo.innerHTML}`;
            alert(winner);
            inGame = false;
            // disable btn
            btnHold.classList.add("disabled");
            btnHold.disabled = true;
            btnRoll.classList.add("disabled");
            btnRoll.disabled = true;
        } else {
            // reset player score and switch to next player
            activePlayer.currentN = 0;
            activePlayer.current.innerHTML = 0;
            switchPlayer(activePlayer);
        }
    }
}

// ---------- Utiles functions ----------

// alert if a game is already played.
// you can chose to continue the game
// or start a new game
function alertNewGame(formSettings) {
    // ask to reset current game for start a new game
    const response = confirm(
        "New game will reste current game!! Start new game?"
    );
    if (response) {
        // remove precedent game listener to not add too listener befor créate a new game
        btnRoll.removeEventListener("click", roll, { once: true });
        btnHold.removeEventListener("click", hold, { once: true });

        newGame(formSettings);
    }
}

// switch dice image with score result
function rollImg(score) {
    dices.forEach((dice) => {
        // animation if score is the same ad precedent
        if (dice.className === "active" && dice.id == score) {
            dice.style.transform = "rotateX(-180deg)";
            setTimeout(() => {
                dice.style = "";
            }, 1000);
        }

        // for any other score than the previous one, animation by setting class 'active'
        if (dice.className === "active") {
            dice.classList.remove("active");
        }
        if (dice.id == score) {
            dice.classList.add("active");
        }
    });
}

// Return a secure random number between min and max
getRandomNumber = (min, max) => {
    let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];

    randomNumber = randomNumber / 4294967296;

    return Math.floor(randomNumber * (max - min + 1)) + min;
};
