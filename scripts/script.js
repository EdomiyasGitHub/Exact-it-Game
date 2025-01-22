'use strict';


// Selectors
const input = document.querySelector('.input-field');
const message = document.querySelector('.n-input-text');
const mainNumber = document.querySelector('.secret-number');
const timerMessage = document.querySelector('.timer');
const timeDisplay = document.querySelector('.time-left');

const btnNew = document.querySelector('.new-button');
const btnEasy = document.querySelector('.easy-button');
const btnHard = document.querySelector('.hard-button');
const btnGuess = document.querySelector('.guess-button');
const btnHow = document.querySelector('.how-to-play');
const btnCloseModal = document.querySelector('.close-modal');

const modal = document.querySelector('.game-description');
const overlay = document.querySelector('.overlay');

const guessContainer = document.querySelector('.guess-logger');

let secretNumber, inputShort, numberCounter, positionCounter, easyModeOn = 1, hardModeOn = 0, timeLeft = 0, playingTime = 0, timerInterval, elapsedTime = 0;


function init () {
    secretNumber = new Array (0, 0, 0, 0);
    generateUniqueRandomNumber(secretNumber);
    mainNumber.textContent = '****';
    message.textContent = 'Enter a 4-digit number';

    // //* Displays the secret number for efficient testing
    // mainNumber.textContent = secretNumber;

    // easyModeOn = 1;
    // hardModeOn = 0;
    input.value = '';
    removeGuesses();

    document.querySelector('body').style.backgroundColor = '#0e0e0e';
    document.querySelector('body').style.color = '#d7d7d7';
    document.querySelector('.guess-container').style.backgroundColor = '#242424';
    document.querySelector('.guess-logger').style.backgroundColor = '#0e0e0e';
    document.querySelector('.game-description').style.backgroundColor = '#1f1f1f';

    if(easyModeOn) {
        btnHard.classList.remove('mode-on');
        btnHard.classList.remove('mode-on:hover');
        btnEasy.classList.add('mode-on');
        btnEasy.classList.add('mode-on:hover');
    } else if (!easyModeOn) {
        btnEasy.classList.remove('mode-on');
        btnEasy.classList.remove('mode-on:hover');
        btnHard.classList.add('mode-on');
        btnHard.classList.add('mode-on:hover');
    }

    btnGuess.classList.remove('disable-hover');
    input.classList.remove('disable-hover');

    startTimer();
    elapsedTime = 0;
}


const startTimer = function () {
    playingTime = 250;
    timeLeft = playingTime;
    timerMessage.textContent = `Time Left: ${playingTime} seconds`;
    timeDisplay.textContent = timeLeft;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft --;
        timerMessage.textContent = `Time Left: ${timeLeft} seconds`;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            message.textContent = 'Time is up! You lost.';
            btnGuess.classList.add('disable-hover');
            input.classList.add('disable-hover');
            input.value = '';
        }

    }, 1000);
};


const generateRandom = function() {
    return Math.trunc(Math.random() * 8) + 1;
};

const generateUniqueRandomNumber = function(array) {
    for(let i = 0; i < array.length; i++) {
        array[i] = generateRandom();
        for(let j = 1; j <= i; j++){
            if (array[i] === array[i-j]) 
                i--;
        }
        console.log(array[i]);
    }
    return array;
};


const noRepeat = function(array) {
    const digit = String(array).split('').map(Number);
    const uniqueDigits = new Set(digit);
    return uniqueDigits.size !== digit.length;
};

const inputErrorAnimation = function() {
    input.classList.add('invalid');
    setTimeout(() => input.classList.remove('invalid'), 500);
};

const validateInput = function(array) {
    input.classList.remove('invalid');

    if (array.length !== 4 || isNaN(array)) {
        message.textContent = 'Please enter a valid 4-digit number';
        inputErrorAnimation();
        return false;
    }
    if (noRepeat(array)) {
        message.textContent = 'Please enter a number with no repeating digits';
        inputErrorAnimation();
        return false;
    }
    return true;
};


const calculateNumber = function() {
    let nCounter = 0;
    for(let i = 0; i < inputShort.length; i++){
        for (let j = 0; j < secretNumber.length; j++) {
            if (inputShort[i] == secretNumber[j]) {
                nCounter++;
            }
        }
    }
    console.log(`Matching digits count: ${nCounter}`);
    return nCounter;
};

const calculatePosition = function() {
    let pCounter = 0;
    for(let i = 0; i < inputShort.length; i++) {
        if(inputShort[i] == secretNumber[i]) {
            pCounter++;
        }
    }
    console.log(`Exact positions count: ${pCounter}`);
    return pCounter;
};


const showGuesses = function() {
    const guessDiv = document.createElement('div');
    guessDiv.classList.add('guesses');
    
    const attemptParagraph = document.createElement('p');
    attemptParagraph.classList.add('attempt-guess');
    attemptParagraph.textContent = inputShort;

    const numberParagraph = document.createElement('p');
    numberParagraph.textContent = calculateNumber();

    const positionParagraph = document.createElement('p');
    positionParagraph.textContent = calculatePosition();

    guessDiv.appendChild(attemptParagraph);
    guessDiv.appendChild(numberParagraph);
    guessDiv.appendChild(positionParagraph);

    guessContainer.appendChild(guessDiv);

    guessContainer.scrollTop = guessContainer.scrollHeight;
};

const removeGuesses = function() {
    guessContainer.innerHTML = '';
};


const checkInput = function () {
    inputShort = input.value.trim();
    console.log(`Input value: "${inputShort}"`);
    console.log(inputShort.length);

    if(validateInput(inputShort)) {
        showGuesses();
        numberCounter = calculateNumber();
        positionCounter = calculatePosition();

        // ! The positioning of this if statement solved a sneaky bug. Here's how
            // * It was in Guess Operations. This if condition by itself does not does not check for validation, so someone can just put repeated numbers in the input, and crack the game.
            // ? How would they crack the Game? If the guess was 1234, the player can put in 1111, 2222, 3333, 4444 back to back and seen the position of each correct number. 
            // * Putting the if statement here disallows the cheat by checking forvalid statements in its parent if statement

        if (easyModeOn === 1) {
            mainNumber.textContent = '';
            for(let i = 0; i < inputShort.length; i++) {
                if (inputShort[i] != secretNumber[i]) { 
                    mainNumber.textContent += '*';
                } else {
                    mainNumber.textContent += secretNumber[i];
                    console.log('Here');
                }
            }
        }
    }

};


init();


const gameWon = function() {
    btnGuess.classList.add('disable-hover');
    input.classList.add('disable-hover');
    input.blur();
    elapsedTime = playingTime - timeLeft;
    clearInterval(timerInterval);
    timerMessage.textContent = `Completed in: ${elapsedTime} seconds`;

    input.value = '';
    mainNumber.textContent = '';
    message.textContent = "You've won the game! Great job."
    for(let i = 0; i < secretNumber.length; i++) {
        mainNumber.textContent += secretNumber[i];
    }

    document.querySelector('body').style.backgroundColor = '#d7d7d7';
    document.querySelector('body').style.color = '#0e0e0e';
    document.querySelector('.guess-container').style.backgroundColor = '#aaa';
    document.querySelector('.guess-logger').style.backgroundColor = '#d1d1d1';
    document.querySelector('.game-description').style.backgroundColor = '#d7d7d7';
};

const guessOperation = function() {
    numberCounter = 0;
    positionCounter = 0;
    checkInput();
    if (numberCounter === 4 && positionCounter === 4) {
        // console.log(`Number Counter: ${numberCounter}`);
        // console.log(`Position Counter: ${positionCounter}`);
        gameWon();
    }

    input.value = '';
};




btnEasy.addEventListener('click', function() {
    easyModeOn = 1;
    hardModeOn = 0;
    init();
});

btnHard.addEventListener('click', function() {
    easyModeOn = 0;
    hardModeOn = 1;
    init();
});

btnNew.addEventListener('click', init);


btnGuess.addEventListener('click', guessOperation);
document.addEventListener('keydown', function(e) {
    if(e.key === 'Enter')
        guessOperation();
});


function openModal() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function closeModal () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

btnHow.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !(modal.classList.contains('hidden'))) 
        closeModal();   
});