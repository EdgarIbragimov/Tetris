import { Tetris } from "./tetris.js";
import { Player } from "./player.js";
import { LeaderboardManager } from "./leaderboard.js";
import {
  PLAYFIELD_COLUMNS,
  PLAYFIELD_ROWS,
  convertPositionToIndex,
} from "./utilities.js";

class Game {
  constructor() {
    this.requestId = null;
    this.timeoutId = null;
    this.tetris = new Tetris();
    this.cells = document.querySelectorAll(".grid>div");
    this.player = new Player();
    this.isPlaying = false;
    this.miniCells = document.querySelectorAll(".mini-grid>div");
    this.onKeydown = this.onKeydown.bind(this);
  }

  initGame() {
    document.addEventListener("keydown", this.onKeydown);
  }

  startGame() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.tetris = new Tetris(); // сброс состояния игры
    this.cells.forEach((cell) => cell.removeAttribute("class"));
    document.getElementById("score").innerText = "0";
    document.getElementById("level").innerText = "0";

    const startButton = document.getElementById("start-button");
    startButton.disabled = true;

    this.moveDown();
  }

  onKeydown(event) {
    if (!this.isPlaying) {
      if (event.key === "Enter") {
        this.startGame();
      }
      return;
    }

    switch (event.key) {
      case " ":
        this.rotate();
        break;
      case "ArrowDown":
        this.moveDown();
        break;
      case "ArrowLeft":
        this.moveLeft();
        break;
      case "ArrowRight":
        this.moveRight();
        break;
      case "Enter":
        this.dropDown();
        break;
      default:
        break;
    }
  }

  moveDown() {
    this.tetris.moveTetrominoDown();
    this.draw();
    this.stopLoop();
    this.startLoop();

    if (this.tetris.isGameOver) {
      this.gameOver();
    }
  }

  moveLeft() {
    this.tetris.moveTetrominoLeft();
    this.draw();
  }

  moveRight() {
    this.tetris.moveTetrominoRight();
    this.draw();
  }

  draw() {
    this.cells.forEach((cell) => cell.removeAttribute("class"));
    this.drawPlayField();
    this.drawTetromino();
    this.drawGhostTetromino();
    this.drawNextTetromino();
  }

  drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
      for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
        if (!this.tetris.playField[row][column]) continue;
        const name = this.tetris.playField[row][column];
        const cellIndex = convertPositionToIndex(row, column);
        this.cells[cellIndex].classList.add(name);
      }
    }
  }

  rotate() {
    this.tetris.rotateTetromino();
    this.draw();
  }

  dropDown() {
    this.tetris.dropTetrominoDown();
    this.draw();
    this.stopLoop();
    this.startLoop();
    if (this.tetris.isGameOver) {
      this.gameOver();
    }
  }

  startLoop() {
    this.timeoutId = setTimeout(
      () => (this.requestId = requestAnimationFrame(() => this.moveDown())),
      this.tetris.getSpeed()
    );
  }

  stopLoop() {
    cancelAnimationFrame(this.requestId);
    clearTimeout(this.timeoutId);
  }

  drawTetromino() {
    const name = this.tetris.tetromino.name;
    const tetrominoMatrixSize = this.tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
      for (let column = 0; column < tetrominoMatrixSize; column++) {
        if (!this.tetris.tetromino.matrix[row][column]) continue;
        if (this.tetris.tetromino.row + row < 0) continue;
        const cellIndex = convertPositionToIndex(
          this.tetris.tetromino.row + row,
          this.tetris.tetromino.column + column
        );
        this.cells[cellIndex].classList.add(name);
      }
    }
  }

  drawGhostTetromino() {
    const tetrominoMatrixSize = this.tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
      for (let column = 0; column < tetrominoMatrixSize; column++) {
        if (!this.tetris.tetromino.matrix[row][column]) continue;
        if (this.tetris.tetromino.ghostRow + row < 0) continue;
        const cellIndex = convertPositionToIndex(
          this.tetris.tetromino.ghostRow + row,
          this.tetris.tetromino.ghostColumn + column
        );
        this.cells[cellIndex].classList.add("ghost");
      }
    }
  }

  // Новый метод для отрисовки следующей фигуры
  drawNextTetromino() {
    // Очищаем мини-сетку
    this.miniCells.forEach((cell) => cell.removeAttribute("class"));

    const nextTetromino = this.tetris.nextTetromino;
    if (!nextTetromino) return;

    const matrix = nextTetromino.matrix;
    const matrixSize = matrix.length;

    // Вычисляем смещение для центрирования фигуры
    const offset = {
      row: Math.floor((4 - matrixSize) / 2),
      col: Math.floor((4 - matrixSize) / 2),
    };

    // Отрисовываем фигуру в мини-сетке
    for (let row = 0; row < matrixSize; row++) {
      for (let column = 0; column < matrixSize; column++) {
        if (!matrix[row][column]) continue;

        const cellIndex = (row + offset.row) * 4 + (column + offset.col);
        if (cellIndex >= 0 && cellIndex < this.miniCells.length) {
          this.miniCells[cellIndex].classList.add(nextTetromino.name);
        }
      }
    }
  }

  gameOver() {
    this.isPlaying = false;
    this.stopLoop();
    // Удаляем старый обработчик перед добавлением нового
    document.removeEventListener("keydown", this.onKeydown);
    // Добавляем обработчик заново
    document.addEventListener("keydown", this.onKeydown);

    const leaderboardManager = new LeaderboardManager();
    leaderboardManager.addScore(
      this.player.username,
      this.tetris.score,
      this.tetris.level
    );

    const startButton = document.getElementById("start-button");
    startButton.disabled = false;

    setTimeout(() => {
      alert(
        `Игра окончена!\nОчки: ${this.tetris.score}\nУровень: ${this.tetris.level}`
      );
      window.location.href = "leaderboard.html";
    }, 100);
  }
}

let game;

// Инициализация игры после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  // Анимация букв
  const letters = document.querySelectorAll(".letter");
  letters.forEach((letter, index) => {
    letter.style.setProperty("--letter-index", index);
  });

  // Отображение имени пользователя
  const usernameDisplay = document.getElementById("username-display");
  if (usernameDisplay) {
    const username = localStorage.getItem("tetris.username");
    usernameDisplay.textContent = username || "Гость";
  }

  // Создание экземпляра игры
  game = new Game();
  game.initGame();

  // Делаем функцию startGame доступной глобально
  // window.startGame = () => game.startGame();
  const startButton = document.querySelector("#start-button");
  if (startButton) {
    startButton.addEventListener("click", () => game.startGame());
  }
});
