const wordDiv = document.getElementById('word');
const keyboardDiv = document.getElementById('keyboard');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const hangmanFigure = document.getElementById('hangman-figure');

let secretWordArr = [];
let guessedLetters = [];
let secretWord = '';
let maxWrong = 6;
let wrongGuesses = 0;

// SVG Hangman parts
const hangmanPartsSVG = [
  '<line x1="10" y1="140" x2="130" y2="140" stroke="#6366F1" stroke-width="4"/>', // base
  '<line x1="70" y1="140" x2="70" y2="20" stroke="#6366F1" stroke-width="4"/>',   // pole vertical
  '<line x1="70" y1="20" x2="130" y2="20" stroke="#6366F1" stroke-width="4"/>',   // pole horizontal
  '<line x1="130" y1="20" x2="130" y2="40" stroke="#6366F1" stroke-width="4"/>',  // rope
  '<circle cx="130" cy="55" r="15" stroke="#ef4444" stroke-width="4" fill="none"/>', // head
  '<line x1="130" y1="70" x2="130" y2="110" stroke="#374151" stroke-width="4"/>', // body
  '<line x1="130" y1="80" x2="110" y2="100" stroke="#374151" stroke-width="4"/>', // left arm
  '<line x1="130" y1="80" x2="150" y2="100" stroke="#374151" stroke-width="4"/>', // right arm
  '<line x1="130" y1="110" x2="110" y2="130" stroke="#374151" stroke-width="4"/>', // left leg
  '<line x1="130" y1="110" x2="150" y2="130" stroke="#374151" stroke-width="4"/>'  // right leg
];

function updateHangmanFigure(wrongGuessCount) {
  // Decide how many parts to show according to wrongGuessCount
  let partsToShow = [];
  if (wrongGuessCount === 0) {
    partsToShow = [hangmanPartsSVG[0]]; // base only
  } else if (wrongGuessCount === 1) {
    partsToShow = hangmanPartsSVG.slice(0, 2);
  } else if (wrongGuessCount === 2) {
    partsToShow = hangmanPartsSVG.slice(0, 3);
  } else if (wrongGuessCount === 3) {
    partsToShow = hangmanPartsSVG.slice(0, 5);
  } else if (wrongGuessCount === 4) {
    partsToShow = hangmanPartsSVG.slice(0, 6);
  } else if (wrongGuessCount === 5) {
    partsToShow = hangmanPartsSVG.slice(0, 8);
  } else if (wrongGuessCount >= 6) {
    partsToShow = hangmanPartsSVG.slice(0, 10);
  }
  hangmanFigure.innerHTML = `
    <svg width="160" height="160" class="mx-auto" xmlns="http://www.w3.org/2000/svg" >
      ${partsToShow.join('')}
    </svg>
  `;
}

async function getWord() {
  const res = await fetch('http://localhost:5000/word');
  const data = await res.json();
  return data.word.toUpperCase();
}

function displayWord() {
  wordDiv.innerHTML = secretWordArr.map(letter =>
    guessedLetters.includes(letter) ? letter : '_'
  ).join(' ');
}

function displayKeyboard() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  keyboardDiv.innerHTML = '';
  alphabet.split('').forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.className = 'px-2 py-1 bg-indigo-100 border border-indigo-500 rounded text-indigo-700 font-bold hover:bg-indigo-200 disabled:opacity-60';
    btn.disabled = guessedLetters.includes(letter) || wrongGuesses >= maxWrong || isGameWon();
    btn.onclick = () => handleGuess(letter);
    keyboardDiv.appendChild(btn);
  });
}

function handleGuess(letter) {
  if (guessedLetters.includes(letter) || isGameWon() || wrongGuesses >= maxWrong) return;
  guessedLetters.push(letter);
  if (!secretWordArr.includes(letter)) {
    wrongGuesses++;
  }
  updateGame();
}

function isGameWon() {
  return secretWordArr.every(letter => guessedLetters.includes(letter));
}

function checkGameStatus() {
  if (isGameWon()) {
    statusDiv.textContent = `🎉 You won! The word was "${secretWord}".`;
  } else if (wrongGuesses >= maxWrong) {
    statusDiv.textContent = `😢 You lost! The word was "${secretWord}".`;
  } else {
    statusDiv.textContent = `Wrong guesses: ${wrongGuesses} / ${maxWrong}`;
  }
}

async function resetGame() {
  guessedLetters = [];
  wrongGuesses = 0;
  secretWord = await getWord();
  secretWordArr = secretWord.split('');
  updateGame();
  statusDiv.textContent = '';
}

function updateGame() {
  displayWord();
  displayKeyboard();
  checkGameStatus();
  updateHangmanFigure(wrongGuesses);
}

resetBtn.onclick = resetGame;
resetGame();
