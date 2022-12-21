// variables declaration

const rulesBtn = document.querySelector('#rulesBtn')
const rules = document.querySelector('#rules')
const rulesOverlay = document.querySelector('#rulesOverlay')
const rulesCloseBtn = document.querySelector('#rulesCloseBtn')


// listener

rulesBtn.addEventListener('click', openRules)
rulesOverlay.addEventListener('click', closeRules)
rulesCloseBtn.addEventListener('click', closeRules)


// functions

function openRules() {
    rules.classList.toggle('show')
}

function closeRules() {

    rules.classList.remove('show')
}

