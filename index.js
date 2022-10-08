const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const container = document.querySelector(".container");
const btn = document.getElementById("btn");
const btnT = btn;
let timeGo = false;
let currInterval;
let startType = true;
let wordCount = 1;
let currChar;
let compTime;

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");
  let isIncorrect = false;

  let correct = true;
  if (startType) {
    arrayQuote.forEach((characterSpan, index) => {
      const character = arrayValue[index];
      if (character == null) {
        characterSpan.classList.remove("correct");
        characterSpan.classList.remove("incorrect");
        correct = false;
      } else if (character === characterSpan.innerText && !isIncorrect) {
        characterSpan.classList.add("correct");
        characterSpan.classList.remove("incorrect");
      } else {
        characterSpan.classList.remove("correct");
        characterSpan.classList.add("incorrect");
        correct = false;
        isIncorrect = true;
      }
      currChar = characterSpan.innerText;
    });

    if (correct) {
      compTime = parseFloat(timerElement.innerText);
      timerElement.innerText = `${((wordCount * 60) / compTime).toFixed(
        2
      )} WPM`;
      startType = false;
      quoteDisplayElement.innerHTML = "";
      quoteInputElement.value = null;
      quoteInputElement.disabled = true;
      timerElement.disabled = true;
      container.appendChild(btnT);
      clearInterval(currInterval);
      wordCount = 1;
    }
  }
});

function noBackspace(event) {
  let evt = event || window.event;

  if (evt && !containsInc()[0] && currChar != ' ') {
    let keyCode = evt.charCode || evt.keyCode;
    if (keyCode === 8) {
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    }
  }
}

const containsInc = () => {
  let conInc = [false];
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  arrayQuote.forEach((char, index) => {
    if (char.classList.value == "incorrect") {
      conInc = [true, index];
      return false;
    }
  });
  return conInc;
};

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    if (characterSpan.innerText == " ") {
      wordCount++;
    }
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

let startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();

  currInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

const startGame = () => {
  quoteInputElement.disabled = false;
  timerElement.disabled = false;
  startType = true;
  container.removeChild(btn);
  timeGo = true;
  startTimer();
  renderNewQuote();
};
