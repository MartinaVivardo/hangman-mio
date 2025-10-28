const CATEGORIES = {
  Animales: [
    "perro","gato","elefante","jirafa","tiburon","leon","tigre","zorro","ballena","delfin",
    "aguila","pinguino","koala","canguro","hipopotamo","rinoceronte","ardilla","lobo","oso","buho"
  ],
  Paises: [
    "argentina","brasil","chile","uruguay","paraguay","bolivia","peru","ecuador","colombia","mexico",
    "canada","espana","francia","italia","alemania","portugal","japon","china","india","australia"
  ],
  Profesiones: [
    "medico","enfermero","ingeniero","maestro","profesor","abogado","arquitecto","carpintero","electricista","mecanico",
    "panadero","programador","disenador","fotografo","periodista","farmaceutico","biologo","quimico","chef","policia"
  ]
};

const ORIGINAL_WORDS = ["javascript", "programa", "ahorcado", "desarrollo", "computadora"];
CATEGORIES.General = ORIGINAL_WORDS;

function getPoolByCategory(categoryKey) {
  if (categoryKey && categoryKey !== "__random__" && CATEGORIES[categoryKey]) {
    return CATEGORIES[categoryKey];
  }
  return Object.values(CATEGORIES).flat();
}
function pickWord(categoryKey) {
  const pool = getPoolByCategory(categoryKey);
  return pool[Math.floor(Math.random() * pool.length)];
}


let selectedWord;                
let hiddenWord;                   
let attempts = 6;
let wrongLetters = [];

const wordDisplay = document.getElementById("word");
const letterInput = document.getElementById("letter-input");
const guessBtn = document.getElementById("guess-btn");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const wrongLettersDisplay = document.getElementById("wrong-letters");
const restartBtn = document.getElementById("restart-btn");
const hangmanFigure = document.getElementById("hangman-figure");

const categorySelect = document.getElementById("categorySelect");
const currentCategoryEl = document.getElementById("currentCategory");

const hangmanStages = [
    `
   +---+
   |   |
       |
       |
       |
       |
=========
`,
    `
   +---+
   |   |
   O   |
       |
       |
       |
=========
`,
    `
   +---+
   |   |
   O   |
   |   |
       |
       |
=========
`,
    `
   +---+
   |   |
   O   |
  /|   |
       |
       |
=========
`,
    `
   +---+
   |   |
   O   |
  /|\\  |
       |
       |
=========
`,
    `
   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
=========
`,
    `
   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
=========
`
];

function updateDisplay() {
  wordDisplay.textContent = hiddenWord.join(" ");
  attemptsDisplay.textContent = attempts;
  wrongLettersDisplay.textContent = wrongLetters.join(", ");
  hangmanFigure.textContent = hangmanStages[6 - attempts];
}

function updateCategoryBadge(selectedKey) {
  if (!currentCategoryEl) return;
  const pretty = !selectedKey || selectedKey === "__random__" ? "Aleatoria" : selectedKey;
  currentCategoryEl.textContent = `Categoría: ${pretty}`;
}

function guessLetter() {
  const letter = (letterInput.value || "").toLowerCase();
  if (!letter || !/^[a-zñ]$/i.test(letter)) {
    message.textContent = "Ingresa una letra válida.";
    return;
  }
  if (hiddenWord.includes(letter) || wrongLetters.includes(letter)) {
    message.textContent = "Ya intentaste esa letra.";
    return;
  }

  message.textContent = "";
  if (selectedWord.includes(letter)) {
    selectedWord.split("").forEach((l, i) => {
      if (l === letter) hiddenWord[i] = letter;
    });
  } else {
    wrongLetters.push(letter);
    attempts--;
  }

  updateDisplay();
  letterInput.value = "";
  letterInput.focus();

  if (!hiddenWord.includes("_")) {
    message.textContent = "🎉 ¡Ganaste!";
    guessBtn.disabled = true;
  } else if (attempts <= 0) {
    message.textContent = `💀 Perdiste. La palabra era: ${selectedWord}`;
    guessBtn.disabled = true;
  }
}

function startGameFromCategory() {
  const selectedKey = categorySelect ? categorySelect.value : "__random__";
  selectedWord = pickWord(selectedKey);             // <- elige palabra por categoría (o aleatoria)
  hiddenWord = Array(selectedWord.length).fill("_");
  attempts = 6;
  wrongLetters = [];
  message.textContent = "";
  guessBtn.disabled = false;
  updateCategoryBadge(selectedKey);
  updateDisplay();
}

guessBtn.addEventListener("click", guessLetter);
letterInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") guessLetter();
});

restartBtn.addEventListener("click", startGameFromCategory);

if (categorySelect) {
  categorySelect.addEventListener("change", startGameFromCategory);
}

startGameFromCategory();

