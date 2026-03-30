/* ── Tile config ─────────────────────── */
const TILES = {
  2: { name: "Brick", img: "brick.png" },
  4: { name: "Wall", img: "wall.png" },
  8: { name: "Garage", img: "garage.png" },
  16: { name: "Office", img: "office.png" },
  32: { name: "Fort", img: "fort.png" },
  64: { name: "Tower", img: "tower.png" },
  128: { name: "Citadel", img: "citadel.png" },
  256: { name: "Polis", img: "polis.png" },
};

/* ── Constants ───────────────────────── */
const SIZE = 4;
const GAP = 10;
const PADDING = 10;
const SLIDE_MS = 100;
const MERGE_MS = 150;
const NEW_MS = 200;
const STORAGE_KEY = "thinkout1024";

/* Directions: [dr, dc] */
const DIR = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] };

/* ── Progression order (for progress bar) */
const PROGRESSION = [2, 4, 8, 16, 32, 64, 128, 256];

/* ── DOM refs ────────────────────────── */
const board = document.getElementById("board");
const progressTrack = document.getElementById("progressTrack");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverMsg = document.getElementById("gameOverMsg");
const winOverlay = document.getElementById("winOverlay");

/* ── Tax config ──────────────────────── */
const TAX_INTERVAL = 12;   // spawn a tax tile every N moves
const TAX_DURATION = 5;    // tax tile lasts N moves

/* ── Game state ──────────────────────── */
let grid; // 4x4 array of values (0 = empty)  (-1 = tax)
let score;
let won;
let keepPlaying;
let cellSize;
let busy = false;
let moveCount = 0;
let taxCells = []; // [{ r, c, remaining }]

/* ── Helpers ─────────────────────────── */
function calcCellSize() {
  const boardWidth = board.offsetWidth;
  cellSize = (boardWidth - PADDING * 2 - GAP * (SIZE - 1)) / SIZE;
}

function cellLeft(col) {
  return PADDING + col * (cellSize + GAP);
}
function cellTop(row) {
  return PADDING + row * (cellSize + GAP);
}

function emojiSize() {
  return cellSize * 0.28;
}
function nameSize() {
  return cellSize * 0.16;
}

function makeTileHTML(val) {
  const cfg = TILES[val] || { name: String(val), emoji: "❓" };
  const icon = cfg.img
    ? `<img class="tile-img" src="${cfg.img}" alt="${cfg.name}" style="height:${emojiSize() * 1.4}px">`
    : `<span class="tile-emoji" style="font-size:${emojiSize()}px">${cfg.emoji}</span>`;
  return (
    icon +
    `<span class="tile-name" style="font-size:${nameSize()}px">${cfg.name}</span>`
  );
}

function createTileEl(val, row, col, className) {
  const el = document.createElement("div");
  el.className = `tile ${className}`;
  el.dataset.value = val;
  el.innerHTML = makeTileHTML(val);
  el.style.width = cellSize + "px";
  el.style.height = cellSize + "px";
  el.style.left = cellLeft(col) + "px";
  el.style.top = cellTop(row) + "px";
  board.appendChild(el);
  return el;
}

function clearAnimTiles() {
  board
    .querySelectorAll(".moveTile, .mergeTile, .newTile")
    .forEach((el) => el.remove());
}

/* ── Progress bar ────────────────────── */
function buildProgressBar() {
  progressTrack.innerHTML = "";
  PROGRESSION.forEach((val, i) => {
    const cfg = TILES[val];
    const step = document.createElement("div");
    step.className = "progress-step";
    step.dataset.value = val;
    const icon = cfg.img
      ? `<img class="progress-img" src="${cfg.img}" alt="${cfg.name}">`
      : `<span class="progress-emoji">${cfg.emoji}</span>`;
    step.innerHTML =
      icon +
      `<span class="progress-name">${cfg.name}</span>`;
    progressTrack.appendChild(step);

    if (i < PROGRESSION.length - 1) {
      const conn = document.createElement("div");
      conn.className = "progress-connector";
      conn.dataset.index = i;
      progressTrack.appendChild(conn);
    }
  });
}

function updateProgressBar() {
  // Find highest tile on the board
  let highest = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] > highest) highest = grid[r][c];

  const highestIdx = PROGRESSION.indexOf(highest);

  // Update steps
  const steps = progressTrack.querySelectorAll(".progress-step");
  steps.forEach((step, i) => {
    step.classList.remove("reached", "current");
    if (i < highestIdx) step.classList.add("reached");
    else if (i === highestIdx) step.classList.add("current");
  });

  // Update connectors
  const conns = progressTrack.querySelectorAll(".progress-connector");
  conns.forEach((conn, i) => {
    conn.classList.toggle("filled", i < highestIdx);
  });

  // Auto-scroll to show current step
  const currentStep = progressTrack.querySelector(".progress-step.current");
  if (currentStep) {
    currentStep.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}

/* ── Persistence ─────────────────────── */
function saveGame() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ grid, score, won, keepPlaying, moveCount, taxCells }),
  );
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      grid = data.grid;
      score = data.score || 0;
      won = data.won || false;
      keepPlaying = data.keepPlaying || false;
      moveCount = data.moveCount || 0;
      taxCells = data.taxCells || [];
      return true;
    } catch {
      /* fall through */
    }
  }
  return false;
}

/* ── Rendering (static layer) ────────── */
function renderStaticTiles() {
  // Remove any existing static tiles
  board.querySelectorAll(".staticTile, .taxTile").forEach((el) => el.remove());
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] > 0) {
        const el = createTileEl(grid[r][c], r, c, "staticTile");
        el.style.zIndex = 1;
      }
    }
  }
  // Render tax tiles
  taxCells.forEach((tax) => {
    const el = createTaxTileEl(tax.r, tax.c, tax.remaining);
    el.style.zIndex = 1;
  });
}

function createTaxTileEl(row, col, remaining) {
  const el = document.createElement("div");
  el.className = "tile taxTile";
  el.style.width = cellSize + "px";
  el.style.height = cellSize + "px";
  el.style.left = cellLeft(col) + "px";
  el.style.top = cellTop(row) + "px";
  el.innerHTML =
    `<span class="tax-label">Tax</span>` +
    `<span class="tax-countdown">${remaining}</span>`;
  board.appendChild(el);
  return el;
}

function addScore(points) {
  score += points;
}

/* ── Core game logic ─────────────────── */
function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function getEmptyCells() {
  const cells = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (grid[r][c] === 0) cells.push([r, c]);
  return cells;
}

function isTaxCell(r, c) {
  return taxCells.some((t) => t.r === r && t.c === c);
}

function spawnTax() {
  const empty = getEmptyCells();
  if (empty.length <= 2) return; // don't spawn if too cramped
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = -1; // mark as blocked
  taxCells.push({ r, c, remaining: TAX_DURATION });
  // Animate the tax tile appearing
  const el = createTaxTileEl(r, c, TAX_DURATION);
  el.classList.add("newTile");
  el.getBoundingClientRect();
  el.style.transform = "scale(1)";
  setTimeout(() => {
    el.remove();
    renderStaticTiles();
  }, NEW_MS);
}

function getGameOverText() {
  return {
    msg: "Every builder hits a wall. But the best ones start again, smarter, stronger, and ready to lay the next brick. Try again?"
  };
}

function spawnRandom(forceValue) {
  const empty = getEmptyCells();
  if (!empty.length) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = forceValue || (Math.random() < 0.9 ? 2 : 4);
  return { r, c, val: grid[r][c] };
}

function canMove() {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (grid[r][c] < 0) continue; // skip tax
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

function findFarthest(r, c, dr, dc) {
  let prevR = r,
    prevC = c;
  let nr = r + dr,
    nc = c + dc;
  while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !grid[nr][nc]) {
    prevR = nr;
    prevC = nc;
    nr += dr;
    nc += dc;
  }
  return {
    farthest: { r: prevR, c: prevC },
    next: { r: nr, c: nc },
  };
}

/* ── Move with animation ─────────────── */
function doMove(direction) {
  if (busy) return;
  const [dr, dc] = DIR[direction];

  // Build traversal order
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];
  if (dr === 1) rows.reverse();
  if (dc === 1) cols.reverse();

  let moved = false;
  let scoreGain = 0;
  const moves = []; // { fromR, fromC, toR, toC, val }
  const merges = []; // { r, c, val (doubled) }
  const merged = new Set(); // "r,c" of cells that already received a merge

  // Work on a copy so we can track moves
  const oldGrid = grid.map((row) => [...row]);
  grid = emptyGrid();

  // Restore tax cells in the new grid (they don't move)
  taxCells.forEach((t) => { grid[t.r][t.c] = -1; });

  for (const r of rows) {
    for (const c of cols) {
      const val = oldGrid[r][c];
      if (!val || val < 0) continue; // skip empty and tax cells

      const { farthest, next } = findFarthestInNew(r, c, dr, dc);

      // Check merge: next cell in new grid has same value & hasn't merged yet
      if (
        next.r >= 0 &&
        next.r < SIZE &&
        next.c >= 0 &&
        next.c < SIZE &&
        grid[next.r][next.c] === val &&
        !merged.has(next.r + "," + next.c)
      ) {
        // Merge
        grid[next.r][next.c] = val * 2;
        merged.add(next.r + "," + next.c);
        scoreGain += val * 2;
        moves.push({ fromR: r, fromC: c, toR: next.r, toC: next.c, val });
        merges.push({ r: next.r, c: next.c, val: val * 2 });
        moved = true;
      } else {
        // Just slide
        grid[farthest.r][farthest.c] = val;
        moves.push({
          fromR: r,
          fromC: c,
          toR: farthest.r,
          toC: farthest.c,
          val,
        });
        if (r !== farthest.r || c !== farthest.c) moved = true;
      }
    }
  }

  if (!moved) {
    // Restore grid
    grid = oldGrid;
    return;
  }

  busy = true;

  // Clear previous animation tiles, hide static tiles
  clearAnimTiles();
  board.querySelectorAll(".staticTile").forEach((el) => el.remove());

  // Phase 1: Create moveTile elements at OLD positions
  const moveEls = moves.map((m) => {
    const el = createTileEl(m.val, m.fromR, m.fromC, "moveTile");
    return { el, toR: m.toR, toC: m.toC };
  });

  // Trigger slide by setting new positions (double rAF ensures old position is painted first)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      moveEls.forEach(({ el, toR, toC }) => {
        el.style.left = cellLeft(toC) + "px";
        el.style.top = cellTop(toR) + "px";
      });

      // Phase 2: After slide completes — show merges, spawn new tile
      setTimeout(() => {
    // Remove moveTiles
    moveEls.forEach(({ el }) => el.remove());

    // Score
    if (scoreGain) addScore(scoreGain);

    // Create merge animations
    merges.forEach((m) => {
      const el = createTileEl(m.val, m.r, m.c, "mergeTile");
      // Force reflow then trigger scale
      el.getBoundingClientRect();
      el.style.transform = "scale(1)";
    });

    // Render static tiles (with updated merged values)
    renderStaticTiles();

    // Hide merge tile statics briefly (mergeTile is on top)
    // After merge animation, remove mergeTiles
    setTimeout(() => {
      board.querySelectorAll(".mergeTile").forEach((el) => el.remove());
    }, MERGE_MS);

    // Spawn new tile
    const spawned = spawnRandom();
    if (spawned) {
      const el = createTileEl(spawned.val, spawned.r, spawned.c, "newTile");
      el.getBoundingClientRect();
      el.style.transform = "scale(1)";
      setTimeout(() => {
        el.remove();
        renderStaticTiles();
      }, NEW_MS);
    }

    // Tax: decrement existing tax timers
    taxCells.forEach((tax) => tax.remaining--);
    const expiredTax = taxCells.filter((tax) => tax.remaining <= 0);
    expiredTax.forEach((tax) => {
      grid[tax.r][tax.c] = 0; // free the cell
    });
    taxCells = taxCells.filter((tax) => tax.remaining > 0);

    // Tax: spawn new tax tile every N moves
    moveCount++;
    if (moveCount % TAX_INTERVAL === 0) {
      spawnTax();
    }

    // Re-render after tax changes
    if (expiredTax.length > 0) renderStaticTiles();

    // Update progress
    updateProgressBar();

    // Check win / game over
    const hasWin = grid.some((row) => row.some((v) => v >= 256));
    if (hasWin && !won && !keepPlaying) {
      won = true;
      winOverlay.classList.add("visible");
    }
    if (!canMove()) {
      const { msg } = getGameOverText();
      gameOverMsg.textContent = msg;
      gameOverOverlay.classList.add("visible");
    }

    saveGame();
    busy = false;
      }, SLIDE_MS);
    });
  });
}

/* Find farthest empty cell in the NEW grid (being built) */
function findFarthestInNew(r, c, dr, dc) {
  let prevR = r,
    prevC = c;
  let nr = r + dr,
    nc = c + dc;
  while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !grid[nr][nc]) {
    prevR = nr;
    prevC = nc;
    nr += dr;
    nc += dc;
  }
  return {
    farthest: { r: prevR, c: prevC },
    next: { r: nr, c: nc },
  };
}

/* ── Input handling ──────────────────── */
function onKeyDown(e) {
  const map = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  if (map[e.key]) {
    e.preventDefault();
    doMove(map[e.key]);
  }
}

// Touch/swipe
let touchStartX, touchStartY;
function onTouchStart(e) {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}
function onTouchMove(e) {
  if (touchStartX == null) return;
  e.preventDefault();
}
function onTouchEnd(e) {
  if (touchStartX == null) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 30) return;
  if (absDx > absDy) {
    doMove(dx > 0 ? "right" : "left");
  } else {
    doMove(dy > 0 ? "down" : "up");
  }
  touchStartX = touchStartY = null;
}

/* ── Init ────────────────────────────── */
function init() {
  calcCellSize();
  buildProgressBar();

  if (!loadGame()) {
    grid = emptyGrid();
    score = 0;
    won = false;
    keepPlaying = false;
    spawnRandom(2);
    spawnRandom(2);
  }

  gameOverOverlay.classList.remove("visible");
  if (won && !keepPlaying) winOverlay.classList.add("visible");
  else winOverlay.classList.remove("visible");
  renderStaticTiles();
  updateProgressBar();

  document.addEventListener("keydown", onKeyDown);
  board.addEventListener("touchstart", onTouchStart, { passive: true });
  board.addEventListener("touchmove", onTouchMove, { passive: false });
  board.addEventListener("touchend", onTouchEnd, { passive: true });
}

function newGame() {
  busy = false;
  clearAnimTiles();
  board.querySelectorAll(".staticTile, .taxTile").forEach((el) => el.remove());
  gameOverOverlay.classList.remove("visible");
  winOverlay.classList.remove("visible");
  grid = emptyGrid();
  score = 0;
  won = false;
  keepPlaying = false;
  moveCount = 0;
  taxCells = [];
  spawnRandom(2);
  spawnRandom(2);
  renderStaticTiles();
  updateProgressBar();
  saveGame();
}

/* ── Button handlers ─────────────────── */
document.getElementById("newGameBtn").onclick = newGame;
document.getElementById("retryBtn").onclick = newGame;
document.getElementById("newGameWinBtn").onclick = newGame;
document.getElementById("keepPlayingBtn").onclick = () => {
  keepPlaying = true;
  winOverlay.classList.remove("visible");
  saveGame();
};

/* Recalc on resize */
window.addEventListener("resize", () => {
  calcCellSize();
  clearAnimTiles();
  renderStaticTiles();
});

/* ── Onboarding ─────────────────────── */
const ONBOARDING_KEY = "thinkout_onboarded";
const TOTAL_SLIDES = 5;
let currentSlide = 0;

function showOnboarding() {
  const onboarding = document.getElementById("onboarding");
  if (localStorage.getItem(ONBOARDING_KEY)) {
    onboarding.classList.add("hidden");
    onboarding.style.display = "none";
    return;
  }
  onboarding.classList.remove("hidden");
}

function goToSlide(n) {
  currentSlide = n;
  document.querySelectorAll(".onboarding-slide").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".dot").forEach((d) => d.classList.remove("active"));
  document.querySelector(`.onboarding-slide[data-slide="${n}"]`).classList.add("active");
  document.querySelector(`.dot[data-dot="${n}"]`).classList.add("active");

  const btn = document.getElementById("onboardingNext");
  btn.textContent = n === TOTAL_SLIDES - 1 ? "Let's build!" : "Next";
}

document.getElementById("onboardingNext").onclick = () => {
  if (currentSlide < TOTAL_SLIDES - 1) {
    goToSlide(currentSlide + 1);
  } else {
    // Close onboarding
    const onboarding = document.getElementById("onboarding");
    onboarding.classList.add("hidden");
    localStorage.setItem(ONBOARDING_KEY, "1");
    setTimeout(() => { onboarding.style.display = "none"; }, 300);
  }
};

// Allow clicking dots to navigate
document.querySelectorAll(".dot").forEach((dot) => {
  dot.onclick = () => goToSlide(parseInt(dot.dataset.dot));
});


/* Start */
document.addEventListener("DOMContentLoaded", () => {
  init();
  showOnboarding();
});
