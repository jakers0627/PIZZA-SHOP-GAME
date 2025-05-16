let selectedVoice = null;

// Load and choose a natural-sounding voice
function loadVoices() {
  const voices = window.speechSynthesis.getVoices();

  if (!voices.length) {
    setTimeout(loadVoices, 100);
    return;
  }

  selectedVoice = voices.find(voice =>
    voice.name.includes("Google US English") ||
    voice.name.includes("Google UK English Female") ||
    voice.name.includes("Google UK English Male") ||
    voice.name.includes("Microsoft Aria") ||
    voice.name.includes("Samantha")
  ) || voices[0];
}

// Speak text using the selected voice
function speak(text) {
  if (!selectedVoice) {
    loadVoices();
    setTimeout(() => speak(text), 100);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.pitch = 1.1;  // Friendly tone
  utterance.rate = 1;     // Normal speed
  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
}

// Load voices when available
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices(); // Attempt early load

// === Game Logic ===

const boxContainer = document.getElementById("box-container");
const dialogueText = document.getElementById("dialogue-text");
const chef = document.getElementById("chef");

const boxes = [
  {
    closed: "assets/box-closed.png",
    open: "assets/pizza-1.png",
    description: "This is a triangle pizza with red sauce!",
  },
  {
    closed: "assets/box-closed.png",
    open: "assets/pizza-2.png",
    description: "This one is a square pizza with green toppings!",
  },
  {
    closed: "assets/box-closed.png",
    open: "assets/pizza-3.png",
    description: "Yum! A round pizza with yellow cheese!",
  },
];

const dialogues = [
  "Hi there! Welcome to the Pizza Shop!",
  "Can you count the pizza boxes with me?",
  "Let’s open them and see what’s inside!",
  "Now, describe the pizzas you see!",
  "Look! The chef is here to say hello!",
  "He needs your help to find the round pizza!",
];

let currentDialogue = 0;

function loadBoxes() {
  boxes.forEach((box, index) => {
    const img = document.createElement("img");
    img.src = box.closed;
    img.classList.add("box");
    img.onclick = () => openBox(img, box);
    boxContainer.appendChild(img);
  });
}

function openBox(imgElement, boxData) {
  imgElement.src = boxData.open;
  speak(boxData.description);
}

function nextDialogue() {
  currentDialogue++;
  if (currentDialogue < dialogues.length) {
    dialogueText.textContent = dialogues[currentDialogue];
    speak(dialogues[currentDialogue]);

    if (dialogues[currentDialogue].includes("chef")) {
      chef.classList.remove("hidden");
    }
  } else {
    dialogueText.textContent = "Great job! You're a pizza expert!";
    speak("Great job! You're a pizza expert!");
  }
}

window.onload = () => {
  loadBoxes();
  speak(dialogues[currentDialogue]);
};