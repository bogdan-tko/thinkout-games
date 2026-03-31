/* ── Answer & Valid Words ────────────── */
const ANSWER = "BUILD";

const VALID_WORDS = [
  "BUILD",
  "FUNDS",
  "PLANS",
  "TRACK",
  "GROWS",
  "BRICK",
  "THINK",
  "SPEND",
  "COSTS",
  "GOALS",
  "TOWER",
  "SCALE",
  "STACK",
  "FLOWS",
  "SHARE",
  "STOCK",
  "VALUE",
  "ASSET",
  "DEBIT",
  "DRAFT",
  "LOANS",
  "YIELD",
  "TAXES",
  "TOOLS",
  "CHART",
  "TREND",
  "AUDIT",
  "POLIS",
  "MONEY",
  "GRANT",
  "BANKS",
  "BOOKS",
  "BRACE",
  "CRANE",
  "FORGE",
  "FRAME",
  "GROUT",
  "LEVEL",
  "LOADS",
  "MANOR",
  "MORTA",
  "PLANT",
  "RAISE",
  "REBAR",
  "RIVET",
  "ROUGH",
  "SCOUT",
  "SLATE",
  "TRADE",
  "TRUST",
  "UNITS",
  "VAULT",
  "WAGES",
  "WORTH",
  "BONDS",
  "CLERK",
  "CUBIC",
  "DEALS",
  "DRILL",
  "DWELL",
  "ENTRY",
  "EQUAL",
  "FIXED",
  "FLOOR",
  "FOUND",
  "GROSS",
  "HOUSE",
  "INDEX",
  "INPUT",
  "JOINT",
  "LABOR",
  "LEASE",
  "LINER",
  "MAKER",
  "MATCH",
  "NICHE",
  "OFFER",
  "ORDER",
  "OWNER",
  "PARSE",
  "PITCH",
  "POINT",
  "PRIME",
  "PROOF",
  "QUOTA",
  "RATIO",
  "ROUTE",
  "SALES",
  "SETUP",
  "SIGHT",
  "SOLID",
  "STAMP",
  "STEAM",
  "STONE",
  "STORE",
  "SURGE",
  "TABLE",
  "TALLY",
  "TERMS",
  "TITLE",
  "TOTAL",
  "TRUSS",
  "URBAN",
  "USAGE",
  "WEIGH",
  "YIELD",
  "ABOUT",
  "ABOVE",
  "ADAPT",
  "AGILE",
  "ALIGN",
  "ALLOW",
  "APPLY",
  "ARENA",
  "AVAIL",
  "AWARE",
  "BASIC",
  "BEACH",
  "BEGIN",
  "BELOW",
  "BENCH",
  "BLEND",
  "BLOCK",
  "BLOOM",
  "BOARD",
  "BOOST",
  "BOUND",
  "BRAND",
  "BREAK",
  "BRIEF",
  "BRING",
  "BROAD",
  "BUDGE",
  "BUNCH",
  "BUYER",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHECK",
  "CHIEF",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLIMB",
  "CLOSE",
  "COACH",
  "COVER",
  "CRAFT",
  "CRASH",
  "DAILY",
  "DEPTH",
  "DIGIT",
  "DOING",
  "DOUBT",
  "DRAWN",
  "DRIVE",
  "EARLY",
  "EARTH",
  "EIGHT",
  "EMAIL",
  "EVENT",
  "EVERY",
  "EXACT",
  "EXTRA",
  "FAITH",
  "FAULT",
  "FIELD",
  "FIFTY",
  "FIGHT",
  "FINAL",
  "FIRST",
  "FLESH",
  "FLOAT",
  "FOCUS",
  "FORCE",
  "FRONT",
  "FRUIT",
  "FULLY",
  "GIVEN",
  "GOING",
  "GRACE",
  "GRADE",
  "GRAND",
  "GRASP",
  "GREEN",
  "GROUP",
  "GUARD",
  "GUESS",
  "GUIDE",
  "HANDS",
  "HAPPY",
  "HEART",
  "HEAVY",
  "HUMAN",
  "IDEAL",
  "IMAGE",
  "IMPLY",
  "INNER",
  "ISSUE",
  "JUDGE",
  "KNOWN",
  "LARGE",
  "LATER",
  "LAUGH",
  "LAYER",
  "LEARN",
  "LEGAL",
  "LIGHT",
  "LIMIT",
  "LINES",
  "LINKS",
  "LIVES",
  "LOCAL",
  "LOGIC",
  "LOOSE",
  "LOWER",
  "LUCKY",
  "LUNCH",
  "MAGIC",
  "MAJOR",
  "MARCH",
  "MEDIA",
  "MERGE",
  "MIGHT",
  "MINOR",
  "MODEL",
  "MONTH",
  "MORAL",
  "MOUNT",
  "NERVE",
  "NEVER",
  "NIGHT",
  "NOISE",
  "NORTH",
  "NOTED",
  "NOVEL",
  "OCCUR",
  "PANEL",
  "PARTY",
  "PAUSE",
  "PEACE",
  "PENNY",
  "PHASE",
  "PHONE",
  "PIECE",
  "PLACE",
  "PLAIN",
  "PLATE",
  "PLAZA",
  "POWER",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRIOR",
  "PRIZE",
  "PROVE",
  "QUICK",
  "QUIET",
  "QUITE",
  "RANGE",
  "RAPID",
  "REACH",
  "READY",
  "REALM",
  "REFER",
  "REIGN",
  "RELAX",
  "REPLY",
  "RIGHT",
  "RIVAL",
  "RIVER",
  "ROUND",
  "ROYAL",
  "RURAL",
  "SAINT",
  "SAVED",
  "SCENE",
  "SCORE",
  "SENSE",
  "SERVE",
  "SEVEN",
  "SHALL",
  "SHAPE",
  "SHIFT",
  "SHINE",
  "SHORT",
  "SHOWN",
  "SIDED",
  "SINCE",
  "SIXTH",
  "SIXTY",
  "SKILL",
  "SLEEP",
  "SLICE",
  "SLIDE",
  "SMALL",
  "SMART",
  "SMILE",
  "SOLVE",
  "SOUTH",
  "SPACE",
  "SPARE",
  "SPEAK",
  "SPEED",
  "SPLIT",
  "SPORT",
  "STAGE",
  "STAKE",
  "STAND",
  "START",
  "STATE",
  "STEER",
  "STICK",
  "STILL",
  "STRIP",
  "STUDY",
  "STUFF",
  "STYLE",
  "SUITE",
  "SUPER",
  "SWEET",
  "SWING",
  "TAKEN",
  "TASTE",
  "TEACH",
  "THEME",
  "THICK",
  "THIRD",
  "THOSE",
  "THREE",
  "THREW",
  "THROW",
  "TIGHT",
  "TIMES",
  "TODAY",
  "TOKEN",
  "TOPIC",
  "TOUCH",
  "TOUGH",
  "TRACE",
  "TRAIL",
  "TRAIN",
  "TREAT",
  "TRIAL",
  "TRICK",
  "TRIED",
  "TRUCK",
  "TRULY",
  "TWICE",
  "TWIST",
  "ULTRA",
  "UNDER",
  "UNION",
  "UNITE",
  "UNTIL",
  "UPPER",
  "UPSET",
  "USING",
  "USUAL",
  "VALID",
  "VIDEO",
  "VIGOR",
  "VIRAL",
  "VISIT",
  "VITAL",
  "VOCAL",
  "VOICE",
  "WASTE",
  "WATCH",
  "WATER",
  "WHEEL",
  "WHERE",
  "WHILE",
  "WHITE",
  "WHOLE",
  "WHOSE",
  "WIDER",
  "WOMEN",
  "WORLD",
  "WRITE",
  "YOUNG",
];

const WORD_SET = new Set(VALID_WORDS);
const MAX_ROWS = 6;
const WORD_LENGTH = 5;
const FLIP_DURATION = 300; // ms per half-flip
const FLIP_STAGGER = 200; // ms between each tile flip

/* ── State ───────────────────────────── */
let currentRow = 0;
let currentCol = 0;
let currentGuess = [];
let guesses = []; // array of { word, result[] }
let gameOver = false;
let isAnimating = false;
let keyStates = {}; // letter → "correct" | "present" | "absent"

/* ── DOM refs ────────────────────────── */
const boardEl = document.getElementById("board");
const keyboardEl = document.getElementById("keyboard");
const toastsEl = document.getElementById("toasts");
const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultMsg = document.getElementById("resultMsg");
const resultBoard = document.getElementById("resultBoard");
const shareBtn = document.getElementById("shareBtn");

/* ── Helpers ─────────────────────────── */
function getTile(row, col) {
  return boardEl.querySelector(
    `.row[data-row="${row}"] .tile[data-col="${col}"]`,
  );
}

function getKey(letter) {
  return keyboardEl.querySelector(`.key[data-key="${letter}"]`);
}

/* ── Evaluate guess against answer ──── */
function evaluate(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const answerChars = answer.split("");
  const guessChars = guess.split("");

  // First pass: find correct (green)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = null;
      guessChars[i] = null;
    }
  }

  // Second pass: find present (yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === null) continue;
    const idx = answerChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerChars[idx] = null;
    }
  }

  return result;
}

/* ── Toast ───────────────────────────── */
function showToast(message, duration = 1500) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastsEl.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add("fade-out");
      toast.addEventListener("animationend", () => toast.remove(), {
        once: true,
      });
    }, duration);
  }

  return toast;
}

/* ── Input: add letter ──────────────── */
function addLetter(letter) {
  if (gameOver || isAnimating) return;
  if (currentCol >= WORD_LENGTH) return;

  currentGuess.push(letter);
  const tile = getTile(currentRow, currentCol);
  tile.textContent = letter;
  tile.classList.add("filled");
  currentCol++;
}

/* ── Input: remove letter ───────────── */
function removeLetter() {
  if (gameOver || isAnimating) return;
  if (currentCol <= 0) return;

  currentCol--;
  currentGuess.pop();
  const tile = getTile(currentRow, currentCol);
  tile.textContent = "";
  tile.classList.remove("filled");
}

/* ── Input: submit guess ────────────── */
function submitGuess() {
  if (gameOver || isAnimating) return;
  if (currentCol < WORD_LENGTH) {
    shakeRow(currentRow);
    showToast("Not enough letters");
    return;
  }

  const word = currentGuess.join("");

  if (!WORD_SET.has(word)) {
    shakeRow(currentRow);
    showToast("Not in word list");
    return;
  }

  const result = evaluate(word, ANSWER);
  guesses.push({ word, result });

  // Lock input during animation
  isAnimating = true;

  // Flip tiles one by one
  flipRow(currentRow, word, result, () => {
    // Update keyboard colors
    updateKeyboard(word, result);

    const won = result.every((r) => r === "correct");

    if (won) {
      gameOver = true;
      clearState();
      bounceRow(currentRow, () => {
        setTimeout(() => showResult(true), 300);
      });
    } else if (currentRow >= MAX_ROWS - 1) {
      gameOver = true;
      clearState();
      setTimeout(() => showResult(false), 600);
    } else {
      currentRow++;
      currentCol = 0;
      currentGuess = [];
      isAnimating = false;
      saveState();
    }
  });
}

/* ── Flip animation ─────────────────── */
function flipRow(row, word, result, onComplete) {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    tiles.push(getTile(row, i));
  }

  let flipped = 0;

  tiles.forEach((tile, i) => {
    const delay = i * FLIP_STAGGER;

    // Phase 1: flip to hide (front → 90deg)
    setTimeout(() => {
      tile.style.transition = `transform ${FLIP_DURATION}ms ease-in`;
      tile.style.transform = "rotateX(90deg)";

      // At midpoint: change color & content
      setTimeout(() => {
        tile.classList.add("revealed", result[i]);
        tile.textContent = word[i];

        // Phase 2: flip to show (90deg → 0)
        tile.style.transition = `transform ${FLIP_DURATION}ms ease-out`;
        tile.style.transform = "rotateX(0deg)";

        flipped++;
        if (flipped === WORD_LENGTH) {
          // Wait for last flip to finish
          setTimeout(() => {
            // Clean up inline styles
            tiles.forEach((t) => {
              t.style.transition = "";
              t.style.transform = "";
            });
            if (onComplete) onComplete();
          }, FLIP_DURATION);
        }
      }, FLIP_DURATION);
    }, delay);
  });
}

/* ── Shake animation (invalid word) ─── */
function shakeRow(row) {
  const rowEl = boardEl.querySelector(`.row[data-row="${row}"]`);
  const tiles = rowEl.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => tile.classList.remove("shake"),
      { once: true },
    );
  });
}

/* ── Bounce animation (win) ─────────── */
function bounceRow(row, onComplete) {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    tiles.push(getTile(row, i));
  }

  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("bounce");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("bounce");
          if (i === WORD_LENGTH - 1 && onComplete) onComplete();
        },
        { once: true },
      );
    }, i * 100);
  });
}

/* ── Update keyboard key colors ─────── */
function updateKeyboard(word, result) {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = word[i];
    const state = result[i];
    const current = keyStates[letter];

    // Priority: correct > present > absent
    if (state === "correct") {
      keyStates[letter] = "correct";
    } else if (state === "present" && current !== "correct") {
      keyStates[letter] = "present";
    } else if (state === "absent" && !current) {
      keyStates[letter] = "absent";
    }

    const keyEl = getKey(letter);
    if (keyEl) {
      keyEl.classList.remove("correct", "present", "absent");
      keyEl.classList.add(keyStates[letter]);
    }
  }
}

/* ── Show result overlay ────────────── */
function showResult(won) {
  const messages = won
    ? ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew!"]
    : null;

  if (won) {
    resultTitle.textContent = messages[Math.min(guesses.length - 1, 5)];
    resultMsg.textContent =
      "Every great business starts with one word. You found it.";
  } else {
    resultTitle.textContent = "So close!";
    resultMsg.innerHTML = `The word was <strong>${ANSWER}</strong>. Even the best builders miss sometimes.`;
  }

  // Build mini board
  resultBoard.innerHTML = "";
  guesses.forEach(({ result }) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "result-row";
    result.forEach((state) => {
      const tileDiv = document.createElement("div");
      tileDiv.className = `result-tile ${state}`;
      rowDiv.appendChild(tileDiv);
    });
    resultBoard.appendChild(rowDiv);
  });

  resultOverlay.classList.remove("hidden");
}

/* ── Share results ───────────────────── */
function shareResults() {
  const emojiMap = { correct: "🟩", present: "🟨", absent: "⬛" };
  const rows = guesses
    .map(({ result }) => result.map((r) => emojiMap[r]).join(""))
    .join("\n");

  const text = `ThinkOut · Trial & Error ${guesses.length}/${MAX_ROWS}\n\n${rows}\n\n${location.origin}/trial-and-error/`;

  if (navigator.share) {
    navigator.share({ text }).catch(() => {
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Copied to clipboard!"))
    .catch(() => showToast("Could not copy"));
}

/* ── Persistence ─────────────────────── */
const STATE_KEY = "thinkout_wordle_state";

function saveState() {
  const state = {
    guesses: guesses.map((g) => ({ word: g.word, result: g.result })),
    gameOver,
    keyStates,
  };
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function clearState() {
  localStorage.removeItem(STATE_KEY);
}

function restoreState() {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) return false;

  try {
    const state = JSON.parse(raw);
    if (!state.guesses || !state.guesses.length) return false;

    // Replay each guess instantly (no animation)
    state.guesses.forEach((g, rowIdx) => {
      for (let col = 0; col < WORD_LENGTH; col++) {
        const tile = getTile(rowIdx, col);
        tile.textContent = g.word[col];
        tile.classList.add("filled", "revealed", g.result[col]);
      }
    });

    guesses = state.guesses;
    keyStates = state.keyStates || {};
    gameOver = state.gameOver || false;
    currentRow = guesses.length;
    currentCol = 0;
    currentGuess = [];

    // Restore keyboard colors
    Object.entries(keyStates).forEach(([letter, state]) => {
      const keyEl = getKey(letter);
      if (keyEl) {
        keyEl.classList.remove("correct", "present", "absent");
        keyEl.classList.add(state);
      }
    });

    // If game was over, show the result overlay
    if (gameOver) {
      const won = guesses[guesses.length - 1].result.every(
        (r) => r === "correct",
      );
      setTimeout(() => showResult(won), 300);
    }

    return true;
  } catch (e) {
    return false;
  }
}

/* ── Reset game ──────────────────────── */
function resetGame() {
  currentRow = 0;
  currentCol = 0;
  currentGuess = [];
  guesses = [];
  gameOver = false;
  isAnimating = false;
  keyStates = {};

  // Clear board
  boardEl.querySelectorAll(".tile").forEach((tile) => {
    tile.textContent = "";
    tile.className = "tile";
    tile.style.transition = "";
    tile.style.transform = "";
  });

  // Clear keyboard
  keyboardEl.querySelectorAll(".key").forEach((key) => {
    key.classList.remove("correct", "present", "absent");
  });

  resultOverlay.classList.add("hidden");
  clearState();
}

/* ── Event: physical keyboard ────────── */
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === "Enter") {
    e.preventDefault();
    submitGuess();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    removeLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  }
});

/* ── Event: on-screen keyboard ───────── */
keyboardEl.addEventListener("click", (e) => {
  const keyBtn = e.target.closest(".key");
  if (!keyBtn) return;

  const key = keyBtn.dataset.key;
  if (key === "ENTER") {
    submitGuess();
  } else if (key === "BACKSPACE") {
    removeLetter();
  } else {
    addLetter(key);
  }
});

/* ── Event: buttons ──────────────────── */
shareBtn.addEventListener("click", shareResults);

/* ── Onboarding ─────────────────────── */
const ONBOARDING_KEY = "thinkout_wordle_onboarded";
const TOTAL_SLIDES = 3;
let currentSlide = 0;

function showOnboarding() {
  const onboarding = document.getElementById("onboarding");
  if (localStorage.getItem(ONBOARDING_KEY)) {
    onboarding.classList.add("hidden");
    onboarding.style.display = "none";
    return;
  }
  onboarding.classList.remove("hidden");
  onboarding.style.display = "";
}

function goToSlide(n) {
  currentSlide = n;
  document
    .querySelectorAll(".onboarding-slide")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".dot")
    .forEach((d) => d.classList.remove("active"));
  document
    .querySelector(`.onboarding-slide[data-slide="${n}"]`)
    .classList.add("active");
  document.querySelector(`.dot[data-dot="${n}"]`).classList.add("active");
  const btn = document.getElementById("onboardingNext");
  btn.textContent = n === TOTAL_SLIDES - 1 ? "Got it!" : "Next";
}

document.getElementById("onboardingNext").onclick = () => {
  if (currentSlide < TOTAL_SLIDES - 1) {
    goToSlide(currentSlide + 1);
  } else {
    const onboarding = document.getElementById("onboarding");
    onboarding.classList.add("hidden");
    localStorage.setItem(ONBOARDING_KEY, "1");
    setTimeout(() => {
      onboarding.style.display = "none";
    }, 300);
  }
};

document.querySelectorAll(".dot").forEach((dot) => {
  dot.onclick = () => goToSlide(parseInt(dot.dataset.dot));
});

document.getElementById("instructionsBtn").onclick = () => {
  const onboarding = document.getElementById("onboarding");
  currentSlide = 0;
  goToSlide(0);
  onboarding.style.display = "";
  onboarding.classList.remove("hidden");
};

/* ── Init ────────────────────────────── */
if (!restoreState()) {
  resetGame();
}
showOnboarding();
