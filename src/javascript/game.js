let inGame = false
const p1Side = document.querySelector('#playerOneSide')
const p2Side = document.querySelector('#playerTwoSide')
const btnStart = document.querySelector('#new-game')
const btnRoll = document.querySelector('#roll')
const btnHold = document.querySelector('#hold')
const player1 = {
    global: Number(document.querySelector('#p1-global').innerText),
    current: Number(document.querySelector('#p1-current').innerText)
}
const player2 = {
    global: Number(document.querySelector('#p2-global').innerText),
    current: Number(document.querySelector('#p2-current').innerText)
}
let roll = false
let hold = false

if (hold) {
    btnHold.classList.add('disable')
} else {
    btnHold.classList.remove('disable')
}


btnStart.addEventListener('click', () => {
    // alert if game is played
    inGame ? alertNewGame() : newGame()
})

function alertNewGame() {
    // ask to reset current game for start a new game
    const response = confirm('New game will reste current game!! Start new game?')
    if (response) {
        newGame()
    }

}

function newGame() {
    inGame = true

    // define player to start
    let currentPlayer = getRandomNumber(1, 2)
    
    // start round
    round(currentPlayer)
}

function round(player) {
    
    // reset and set active player
    let activePlayer

    p1Side.classList.remove('active')
    p2Side.classList.remove('active')
    
    if (player === 1) {
        p1Side.classList.add('active')
        activePlayer = player1
    } else if (player === 2) {
        p2Side.classList.add('active')
        activePlayer = player2
    }

    
    // btn state

    // // roll btn
    if ((activePlayer.global + activePlayer.current) < 100) {
        btnRoll.classList.remove('disabled')
        btnRoll.disabled = false
    } else {
        btnRoll.classList.add('disabled')
        btnRoll.disabled = true
    }

    // // hold btn
    if (activePlayer.current === 0) {
        btnHold.classList.add('disabled')
        btnHold.disabled = true
    } else {
        btnHold.classList.remove('disabled')
        btnHold.disabled = false
    }


    // listener btn
    btnRoll.addEventListener('click', () => roll())
    btnHold.addEventListener('click', () => hold())
}

// Return a secure random number between min and max
getRandomNumber = (min, max) => {
    let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0]

    randomNumber = randomNumber / 4294967296

    return Math.floor(randomNumber * (max - min + 1)) + min
}
