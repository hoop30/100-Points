let inGame = false
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
let activePlayer

btnStart.addEventListener('click', () => {
    // alert if game is played
    inGame ? alertNewGame() : newGame()
})

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

// créate a new game 
function newGame() {
    inGame = true

    // before créate a new game all score is reset
    player1.globalN = 0
    player1.currentN = 0
    player2.globalN = 0
    player2.currentN = 0
    player1.global.innerHTML = 0
    player1.current.innerHTML = 0
    player2.global.innerHTML = 0
    player2.current.innerHTML = 0

    // define player to start
    getRandomNumber(1, 2) === 1 ? round(player1) : round(player2)
}

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
    

    // set btn state active or not
    // // roll btn
    if ((activePlayer.globalN + activePlayer.currentN) < 100) {
        btnRoll.classList.remove('disabled')
        btnRoll.disabled = false
    } else {
        btnRoll.classList.add('disabled')
        btnRoll.disabled = true
    }

    // // hold btn
    if (activePlayer.currentN === 0) {
        btnHold.classList.add('disabled')
        btnHold.disabled = true
    } else {
        btnHold.classList.remove('disabled')
        btnHold.disabled = false
    }

    // listener btn 
    btnRoll.addEventListener('click', roll, {once: true})
    btnHold.addEventListener('click', hold, {once: true})
}

// roll the dice and ammend score
function roll() {

    // stop roll btn durring dice animation
    btnRoll.classList.add('disabled')
    btnRoll.disabled = true

    // remove hold listener before new round
    btnHold.removeEventListener('click', hold, {once: true})
    
    // random roll score
    const score = getRandomNumber(1, 6)
    rollImg(score)

    // timeout wait for dice animation 
    setTimeout(() => {
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
            // ammend new score and créate new round with same player
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

    // animation fadeIn on global score
    activePlayer.global.classList.add('fade')
            setTimeout(() => {
                activePlayer.global.classList.remove('fade')
            }, 1000);
    // ammend score
    activePlayer.global.innerHTML = activePlayer.globalN + activePlayer.currentN
    activePlayer.globalN += activePlayer.currentN

    if (activePlayer.globalN >= 100) {
        const winner = `Winner ${activePlayer.name}`
        alert(winner)
    } else {

        // reset player score and switch to next player
        activePlayer.currentN = 0
        activePlayer.current.innerHTML = 0
        switchPlayer(activePlayer)
    }

}

// switch player before start new round with
function switchPlayer(activePlayer) {
    activePlayer === player1 ? activePlayer = player2 : activePlayer = player1


    round(activePlayer)
}



// switch dice image with roll score result
function rollImg(score) {
    dices.forEach(dice => {
        
        // animation if score is the same a precedent
        if (dice.className === 'active' && dice.id == score) {
            console.log('same roll');
            dice.style.transform = 'rotateX(-180deg)';
            setTimeout(() => {
                //dice.style.transform = 'rotateX(360deg)';
                dice.style = '';
            }, 750);
        }

        // for any of other scrore as precendent animation by class 'active'
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