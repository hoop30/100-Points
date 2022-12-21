// ---------- Title ----------

// comments

/**
 * Gameplay description
 */




// ---------- Variables declaration ---------- 

let inGame = false
let activePlayer

const p1Side = document.querySelector('#playerOneSide')
const p2Side = document.querySelector('#playerTwoSide')
const btnStart = document.querySelector('#new-game')
const btnRoll = document.querySelector('#roll')
const btnHold = document.querySelector('#hold')
const dices = document.querySelectorAll('#dice>img')

const player1 = {
    globalN: Number(document.querySelector('#p1-global').innerHTML),
    currentN: Number(document.querySelector('#p1-current').innerHTML),
    global: document.querySelector('#p1-global'),
    current: document.querySelector('#p1-current'),
    name: 'player1'
}
const player2 = {
    globalN: Number(document.querySelector('#p2-global').innerHTML),
    currentN: Number(document.querySelector('#p2-current').innerHTML),
    global: document.querySelector('#p2-global'),
    current: document.querySelector('#p2-current'),
    name: 'player2'
}



// ---------- Listener ----------

btnStart.addEventListener('click', () => {
    // alert if a game is already in progress, before lose score
    inGame ? alertNewGame() : newGame()
})



// ---------- Gameplay functions ---------- 


/** 
 * New game is starting
 *  */
// create a new game 
function newGame() {
    inGame = true

    // before create a new game all score is reset
    player1.globalN = 0
    player1.currentN = 0
    player2.globalN = 0
    player2.currentN = 0
    player1.global.innerHTML = 0
    player1.current.innerHTML = 0
    player2.global.innerHTML = 0
    player2.current.innerHTML = 0
    console.log('new game :', player1, player2);

    // set random player to start
    getRandomNumber(1, 2) === 1 ? round(player1) : round(player2)
}


/** 
 * New round for same or new active player
 * */
// new round with current active player
function round(player) {
    
    // reset and set active player
    activePlayer = player
    
    p1Side.classList.remove('active')
    p2Side.classList.remove('active')
    
    if (activePlayer === player1) {
        p1Side.classList.add('active')
    } else if (activePlayer === player2) {
        p2Side.classList.add('active')
    }
    console.log('new round active player :', activePlayer.current.id, player1, player2);
    

    // set btn state: active or not
    // // roll btn (inactive if the score allows the player to win)
    if ((activePlayer.globalN + activePlayer.currentN) < 100) {
        btnRoll.classList.remove('disabled')
        btnRoll.disabled = false
    } else {
        btnRoll.classList.add('disabled')
        btnRoll.disabled = true
    }

    // // hold btn (inactive if the player's score is zero)
    if (activePlayer.currentN === 0) {
        btnHold.classList.add('disabled')
        btnHold.disabled = true
    } else {
        btnHold.classList.remove('disabled')
        btnHold.disabled = false
    }

    /**
     * The player command is expected
     */
    // listener btn 
    btnRoll.addEventListener('click', roll, {once: true})
    btnHold.addEventListener('click', hold, {once: true})
}

// switch player before start new round with
function switchPlayer(activePlayer) {
    activePlayer === player1 ? activePlayer = player2 : activePlayer = player1

    round(activePlayer)
}



// ---------- Commande functions ---------- 

// roll the dice and ammend score
function roll() {

    // remove hold listener before new round
    btnHold.removeEventListener('click', hold, {once: true})
    
    const score = getRandomNumber(1, 6)
    console.log('roll btn score : ', score);
    rollImg(score)

    // timeout wait for dice animation 
    setTimeout(() => {

        /**
         * Depending on the score, the player changes or stays the same and new round start
         */
        if (score === 1) {
            // reset player score and switch to new round with next player
            activePlayer.currentN = 0
            activePlayer.current.innerHTML = 0
            switchPlayer(activePlayer)
        } else {
        
            // animation fadeIn on current score
            activePlayer.current.classList.add('fade')
            setTimeout(() => {
                activePlayer.current.classList.remove('fade')
            }, 1000);
            // ammend new score and create new round with same player
            activePlayer.currentN += score
            activePlayer.current.innerHTML = activePlayer.currentN
            round(activePlayer)
        }
    }, 1500);
}

// save current score to glabal and switch player
function hold() {

    // remove roll listener before new round
    btnRoll.removeEventListener('click', roll, {once: true})

    console.log(activePlayer.currentN);
    // ammend score
    activePlayer.global.innerHTML = activePlayer.globalN + activePlayer.currentN
    activePlayer.globalN += activePlayer.currentN

    /**
     *  If player win, alert Winner and stop the game.
     *  Else save the score and start new Round with next player
     */
    if (activePlayer.globalN >= 100) {
        const winner = `Winner ${activePlayer.name}`
        alert(winner)
        inGame = false
        activePlayer = undefined
        btnHold.classList.add('disabled')
        btnHold.disabled = true
    } else {

        // reset player score and switch to next player
        activePlayer.currentN = 0
        activePlayer.current.innerHTML = 0
        switchPlayer(activePlayer)
    }

}



// ---------- Utiles functions ---------- 

// alert if a game is already played.
// you can chose to continue the game
// or start a new game
function alertNewGame() {
    // ask to reset current game for start a new game
    const response = confirm('New game will reste current game!! Start new game?')
    if (response) {
        // remove precedent game listener to not add too listener befor créate a new game
        btnRoll.removeEventListener('click', roll, {once: true})
        btnHold.removeEventListener('click', hold, {once: true})
        newGame()
    }

}

// switch dice image with score result
function rollImg(score) {
    dices.forEach(dice => {
        
        // animation if score is the same ad precedent
        if (dice.className === 'active' && dice.id == score) {
            dice.style.transform = 'rotateX(-180deg)';
            setTimeout(() => {
                dice.style = '';
            }, 750);
        }

        // for any other score than the previous one, animation by setting class 'active'
        if (dice.className === 'active') {
            dice.classList.remove('active')
        } 
        if (dice.id == score) {
            dice.classList.add('active')
        }
    })
}

// Return a secure random number between min and max
getRandomNumber = (min, max) => {
    let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0]

    randomNumber = randomNumber / 4294967296

    return Math.floor(randomNumber * (max - min + 1)) + min
}