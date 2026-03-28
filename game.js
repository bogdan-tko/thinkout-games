/* ── Tile config ─────────────────────── */
const TILES = {
  2: { name: "Brick", emoji: "🧱" },
  4: { name: "Wall", emoji: "🪨" },
  8: { name: "Room", emoji: "🚪" },
  16: { name: "Garage", emoji: "🔧" },
  32: { name: "Office", emoji: "🏢" },
  64: { name: "HQ", emoji: "🏛️" },
  128: { name: "Fort", emoji: "🏰" },
  256: { name: "Tower", emoji: "🗼" },
  512: { name: "Citadel", emoji: "🏯" },
  1024: { name: "Polis", emoji: "🌆" },
};

/* ── Constants ───────────────────────── */
const SIZE = 4;
const GAP = 10;
const PADDING = 10;
const SLIDE_MS = 100;
const MERGE_MS = 150;
const NEW_MS = 200;
const STORAGE_KEY = "thinkout1024";
const BEST_KEY = "thinkout1024_best";

/* Directions: [dr, dc] */
const DIR = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] };

/* ── DOM refs ────────────────────────── */
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const winOverlay = document.getElementById("winOverlay");

/* ── Game state ──────────────────────── */
let grid; // 4x4 array of values (0 = empty)
let score;
let bestScore;
let won;
let keepPlaying;
let cellSize;
let busy = false;

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
  return (
    `<span class="tile-emoji" style="font-size:${emojiSize()}px">${cfg.emoji}</span>` +
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

/* ── Persistence ─────────────────────── */
function saveGame() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ grid, score, won, keepPlaying }),
  );
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(BEST_KEY, String(bestScore));
  }
  bestEl.textContent = bestScore;
}

function loadGame() {
  bestScore = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      grid = data.grid;
      score = data.score || 0;
      won = data.won || false;
      keepPlaying = data.keepPlaying || false;
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
  board.querySelectorAll(".staticTile").forEach((el) => el.remove());
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c]) {
        const el = createTileEl(grid[r][c], r, c, "staticTile");
        el.style.zIndex = 1;
      }
    }
  }
}

function addScore(points) {
  score += points;
  scoreEl.textContent = score;
}

/* ── Core game logic ─────────────────── */
function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function getEmptyCells() {
  const cells = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (!grid[r][c]) cells.push([r, c]);
  return cells;
}

function spawnRandom() {
  const empty = getEmptyCells();
  if (!empty.length) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return { r, c, val: grid[r][c] };
}

function canMove() {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return true;
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

  for (const r of rows) {
    for (const c of cols) {
      const val = oldGrid[r][c];
      if (!val) continue;

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

  // Trigger slide by setting new positions (next frame for transition)
  requestAnimationFrame(() => {
    moveEls.forEach(({ el, toR, toC }) => {
      el.style.left = cellLeft(toC) + "px";
      el.style.top = cellTop(toR) + "px";
    });
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

    // Check win / game over
    const hasWin = grid.some((row) => row.some((v) => v >= 1024));
    if (hasWin && !won && !keepPlaying) {
      won = true;
      winOverlay.classList.add("visible");
    }
    if (!canMove()) {
      gameOverOverlay.classList.add("visible");
    }

    saveGame();
    busy = false;
  }, SLIDE_MS);
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

  if (!loadGame()) {
    grid = emptyGrid();
    score = 0;
    won = false;
    keepPlaying = false;
    spawnRandom();
    spawnRandom();
  }

  gameOverOverlay.classList.remove("visible");
  if (won && !keepPlaying) winOverlay.classList.add("visible");
  else winOverlay.classList.remove("visible");
  scoreEl.textContent = score;
  bestEl.textContent = bestScore;
  renderStaticTiles();

  document.addEventListener("keydown", onKeyDown);
  board.addEventListener("touchstart", onTouchStart, { passive: true });
  board.addEventListener("touchmove", onTouchMove, { passive: false });
  board.addEventListener("touchend", onTouchEnd, { passive: true });
}

function newGame() {
  busy = false;
  clearAnimTiles();
  board.querySelectorAll(".staticTile").forEach((el) => el.remove());
  gameOverOverlay.classList.remove("visible");
  winOverlay.classList.remove("visible");
  grid = emptyGrid();
  score = 0;
  won = false;
  keepPlaying = false;
  scoreEl.textContent = 0;
  spawnRandom();
  spawnRandom();
  renderStaticTiles();
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

/* Start */
document.addEventListener("DOMContentLoaded", init);
