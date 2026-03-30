/* ── Groups config ───────────────────── */
const GROUPS = [
  {
    name: "Structures You Build",
    color: "#F9DF6D",
    textColor: "#1a1a1a",
    words: ["Fort", "Tower", "Citadel", "Polis"],
  },
  {
    name: "Plan the Growth",
    color: "#A0C35A",
    textColor: "#1a1a1a",
    words: ["Budgets", "Forecasts", "Scenarios", "Cash Flow"],
  },
  {
    name: "Know Your Numbers",
    color: "#B0C4EF",
    textColor: "#1a1a1a",
    words: ["Inflows", "Outflows", "Transactions", "Accounts"],
  },
  {
    name: "Builder's Tools",
    color: "#BA81C5",
    textColor: "#1a1a1a",
    words: ["Brick", "Mortar", "Crane", "Blueprint"],
  },
];

const MAX_MISTAKES = 4;

/* ── State ───────────────────────────── */
let words = [];
let selected = [];
let solved = [];
let mistakes = 0;
let gameOver = false;

/* ── DOM refs ────────────────────────── */
const gridEl = document.getElementById("grid");
const solvedEl = document.getElementById("solved");
const mistakeDotsEl = document.getElementById("mistakeDots");
const submitBtn = document.getElementById("submitBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const deselectBtn = document.getElementById("deselectBtn");
const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultMsg = document.getElementById("resultMsg");
const resultGroups = document.getElementById("resultGroups");
const playAgainBtn = document.getElementById("playAgainBtn");

/* ── Helpers ─────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findGroup(word) {
  return GROUPS.find((g) => g.words.includes(word));
}

/* ── Rendering ───────────────────────── */
function renderGrid() {
  gridEl.innerHTML = "";
  words.forEach((word) => {
    const btn = document.createElement("button");
    btn.className = "word-tile";
    if (selected.includes(word)) btn.classList.add("selected");
    btn.textContent = word;
    btn.onclick = () => toggleWord(word);
    gridEl.appendChild(btn);
  });
}

function renderMistakes() {
  mistakeDotsEl.innerHTML = "";
  for (let i = 0; i < MAX_MISTAKES; i++) {
    const dot = document.createElement("span");
    dot.className = "mistake-dot";
    if (i < mistakes) dot.classList.add("used");
    mistakeDotsEl.appendChild(dot);
  }
}

function renderSolved() {
  solvedEl.innerHTML = "";
  solved.forEach((group) => {
    const div = document.createElement("div");
    div.className = "solved-group";
    div.style.background = group.color;
    div.style.color = group.textColor;
    div.innerHTML =
      `<div class="solved-group-name">${group.name}</div>` +
      `<div class="solved-group-words">${group.words.join(", ")}</div>`;
    solvedEl.appendChild(div);
  });
}

function updateSubmitBtn() {
  submitBtn.disabled = selected.length !== 4;
}

/* ── Game logic ──────────────────────── */
function toggleWord(word) {
  if (gameOver) return;
  const idx = selected.indexOf(word);
  if (idx >= 0) {
    selected.splice(idx, 1);
  } else if (selected.length < 4) {
    selected.push(word);
  }
  renderGrid();
  updateSubmitBtn();
}

function deselectAll() {
  selected = [];
  renderGrid();
  updateSubmitBtn();
}

function shuffleWords() {
  words = shuffle(words);
  renderGrid();
}

function submit() {
  if (selected.length !== 4 || gameOver) return;

  // Check if all 4 selected words belong to the same group
  const group = findGroup(selected[0]);
  const isCorrect = selected.every((w) => group.words.includes(w));

  if (isCorrect) {
    // Remove words from grid
    words = words.filter((w) => !selected.includes(w));
    solved.push(group);
    selected = [];
    renderSolved();
    renderGrid();
    updateSubmitBtn();

    // Check if all solved
    if (solved.length === GROUPS.length) {
      gameOver = true;
      setTimeout(() => showResult(true), 500);
    }
  } else {
    // Check if 3 out of 4 are from the same group (one away)
    const groupCounts = {};
    selected.forEach((w) => {
      const g = findGroup(w);
      groupCounts[g.name] = (groupCounts[g.name] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(groupCounts));

    // Shake animation
    const tiles = gridEl.querySelectorAll(".word-tile.selected");
    tiles.forEach((t) => {
      t.classList.add("shake");
      t.addEventListener("animationend", () => t.classList.remove("shake"), { once: true });
    });

    mistakes++;
    renderMistakes();

    if (maxCount === 3) {
      // Show "one away" hint
      showOneAway();
    }

    if (mistakes >= MAX_MISTAKES) {
      gameOver = true;
      // Reveal all remaining groups
      GROUPS.forEach((g) => {
        if (!solved.find((s) => s.name === g.name)) {
          solved.push(g);
        }
      });
      words = [];
      selected = [];
      renderSolved();
      renderGrid();
      setTimeout(() => showResult(false), 800);
    }
  }
}

function showOneAway() {
  // Brief visual hint - could be a toast
  const toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;top:20px;left:50%;transform:translateX(-50%);" +
    "background:#27272a;color:#fff;padding:10px 20px;border-radius:8px;" +
    "font-size:14px;font-weight:600;z-index:200;animation:slideFadeIn 300ms ease;";
  toast.textContent = "One away!";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 300ms ease";
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

function showResult(won) {
  resultTitle.textContent = won ? "Well played!" : "Better luck next time";
  resultMsg.textContent = won
    ? "You found all four groups. A true builder knows their vocabulary."
    : "Not every build goes to plan. Try again?";

  resultGroups.innerHTML = "";
  GROUPS.forEach((g) => {
    const div = document.createElement("div");
    div.className = "result-group";
    div.style.background = g.color;
    div.style.color = g.textColor;
    div.innerHTML =
      `<div class="result-group-name">${g.name}</div>` +
      `<div class="result-group-words">${g.words.join(", ")}</div>`;
    resultGroups.appendChild(div);
  });

  resultOverlay.classList.remove("hidden");
}

/* ── Init ────────────────────────────── */
function init() {
  const allWords = GROUPS.flatMap((g) => g.words);
  words = shuffle(allWords);
  selected = [];
  solved = [];
  mistakes = 0;
  gameOver = false;

  resultOverlay.classList.add("hidden");
  renderGrid();
  renderMistakes();
  renderSolved();
  updateSubmitBtn();
}

/* ── Event listeners ─────────────────── */
submitBtn.onclick = submit;
shuffleBtn.onclick = shuffleWords;
deselectBtn.onclick = deselectAll;
playAgainBtn.onclick = init;

/* ── Onboarding ─────────────────────── */
const ONBOARDING_KEY = "thinkout_connections_onboarded";
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
  document.querySelectorAll(".onboarding-slide").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".dot").forEach((d) => d.classList.remove("active"));
  document.querySelector(`.onboarding-slide[data-slide="${n}"]`).classList.add("active");
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
    setTimeout(() => { onboarding.style.display = "none"; }, 300);
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

document.addEventListener("DOMContentLoaded", () => {
  init();
  showOnboarding();
});
