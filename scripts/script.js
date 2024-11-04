import { Tetris } from "./tetris.js";
import {
  PLAYFIELD_COLUMNS,
  PLAYFIELD_ROWS,
  convertPositionToIndex,
} from "./utilities.js";

document.getElementById("username-display").innerHTML =
  localStorage.getItem("tetris.username");

document.addEventListener("DOMContentLoaded", function () {
  const letters = document.querySelectorAll(".letter");
  letters.forEach((letter, index) => {
    letter.style.setProperty("--letter-index", index);
  });
});

let requestId;
let timeoutId;

const tetris = new Tetris();
const cells = document.querySelectorAll(".grid>div");

initKeydown();

moveDown();

function initKeydown() {
  document.addEventListener("keydown", onKeydown);
}

function onKeydown(event) {
  switch (event.key) {
    case " ":
      rotate();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "Enter":
      dropDown();
      break;
    default:
      break;
  }
}

function moveDown() {
  tetris.moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) {
    gameOver();
  }
}

function moveLeft() {
  tetris.moveTetrominoLeft();
  draw();
}

function moveRight() {
  tetris.moveTetrominoRight();
  draw();
}

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawPlayField();
  drawTetromino();
  drawGhostTetromino();
}

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (!tetris.playField[row][column]) continue;
      const name = tetris.playField[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function rotate() {
  tetris.rotateTetromino();
  draw();
}

function dropDown() {
  tetris.dropTetrominoDown();
  draw();
  stopLoop();
  startLoop();
  if (tetris.isGameOver) {
    gameOver();
  }
}

function startLoop() {
  timeoutId = setTimeout(
    () => (requestId = requestAnimationFrame(moveDown)),
    700
  );
}

function stopLoop() {
  cancelAnimationFrame(requestId);
  clearTimeout(timeoutId);
}

function drawTetromino() {
  const name = tetris.tetromino.name;
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.row + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetris.tetromino.row + row,
        tetris.tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawGhostTetromino() {
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.ghostRow + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetris.tetromino.ghostRow + row,
        tetris.tetromino.ghostColumn + column
      );
      cells[cellIndex].classList.add("ghost");
    }
  }
}

function gameOver() {
  stopLoop();
  document.removeEventListener("keydown", onKeydown);
}

/*function startGame() {
  initKeydown();
  moveDown();
}
}*/