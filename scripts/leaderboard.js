export class LeaderboardManager {
  static STORAGE_KEY = "tetris.leaderboard";
  static MAX_RECORDS = 10;

  constructor() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    try {
      this.leaderboard =
        JSON.parse(localStorage.getItem(LeaderboardManager.STORAGE_KEY)) || [];
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      this.leaderboard = [];
    }
  }

  addScore(username, score, level) {
    if (!username || typeof score !== "number" || typeof level !== "number") {
      console.error("Invalid score data");
      return;
    }

    const newScore = {
      username,
      score,
      level,
      date: new Date().toLocaleDateString(),
    };

    const existingScoreIndex = this.leaderboard.findIndex(
      (record) => record.username === username
    );

    if (existingScoreIndex !== -1) {
      if (score > this.leaderboard[existingScoreIndex].score) {
        this.leaderboard[existingScoreIndex] = newScore;
      }
    } else {
      this.leaderboard.push(newScore);
    }

    this.updateLeaderboard();
  }

  updateLeaderboard() {
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(
      0,
      LeaderboardManager.MAX_RECORDS
    );
    this.saveToStorage();
  }

  getScores() {
    return [...this.leaderboard];
  }

  clearLeaderboard() {
    this.leaderboard = [];
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem(
        LeaderboardManager.STORAGE_KEY,
        JSON.stringify(this.leaderboard)
      );
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  }
}

export function displayLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboard-body");
  if (!leaderboardBody) return;

  const leaderboardManager = new LeaderboardManager();
  const scores = leaderboardManager.getScores();

  leaderboardBody.innerHTML = getLeaderboardHTML(scores);
}

function getLeaderboardHTML(scores) {
  if (!Array.isArray(scores) || scores.length === 0) {
    return '<tr><td colspan="5">Нет результатов</td></tr>';
  }

  return scores.map((score, index) => createScoreRow(score, index)).join("");
}

function createScoreRow(score, index) {
  return `
      <tr>
          <td>${index + 1}</td>
          <td>${score.username}</td>
          <td>${score.score}</td>
          <td>${score.level}</td>
          <td>${score.date}</td>
      </tr>
  `;
}

export function clearLeaderboard() {
  if (!confirm("Вы уверены, что хотите очистить таблицу рекордов?")) return;

  const leaderboardManager = new LeaderboardManager();
  leaderboardManager.clearLeaderboard();
  displayLeaderboard();
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    displayLeaderboard();
    Object.assign(window, { displayLeaderboard, clearLeaderboard });
  });
}
