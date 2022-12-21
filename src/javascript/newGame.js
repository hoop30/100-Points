// variables declaration

const newGameBtn = document.querySelector('#newGameBtn')
const gameSettings = document.querySelector('#gameSettings')
const closeGameStettings = document.querySelector('#closeGameSettings')
const btnStart = document.querySelector('#btnStart')
let gameSettingsModal = false

const playerOneType = document.querySelector('#playerOneType')
const playerTwoType = document.querySelector('#playerTwoType')
const pseudo1 = document.querySelector('#pseudo1')
const pseudo2 = document.querySelector('#pseudo2')

// listener

newGameBtn.addEventListener('click', openGameModal)
closeGameStettings.addEventListener('click', closeGameModal)
btnStart.addEventListener('click', closeGameModal)

playerOneType.addEventListener('change', (e) => cpuPseudoOne(e))
playerTwoType.addEventListener('change', (e) => cpuPseudoTwo(e))


// functions

function openGameModal() {
    gameSettings.classList.toggle('show')

    // reset value on each open modal
    pseudo1.value = 'Player 1'
    pseudo1.disabled = false
    pseudo2.value = 'Player 2'
    pseudo2.disabled = false
    playerOneType.value = 'human'
    playerTwoType.value = 'human'
}

function closeGameModal() {
    gameSettings.classList.remove('show')
}

function cpuPseudoOne(e) {

    console.log(e);
    if (e.target.value === 'cpu') {
        pseudo1.value = 'Computer 1'
        pseudo1.disabled = true
    } else if (e.target.value === 'human') {
        pseudo1.value = 'Player 1'
        pseudo1.disabled = false
    }
}

function cpuPseudoTwo(e) {

    if (e.target.value === 'cpu') {
        pseudo2.value = 'Computer 2'
        pseudo2.disabled = true
    } else if (e.target.value === 'human') {
        pseudo2.value = 'Player 2'
        pseudo2.disabled = false
    }
}
