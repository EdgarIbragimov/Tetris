export class LeaderboardManager {
  constructor() {
    this.leaderboard =
      JSON.parse(localStorage.getItem("tetris.leaderboard")) || [];
  }

  addScore(username, score, level) {
    const existingScoreIndex = this.leaderboard.findIndex(
      (record) => record.username === username
    );

    const newScore = {
      username,
      score,
      level,
      date: new Date().toLocaleDateString(),
    };

    if (existingScoreIndex !== -1) {
      const existingScore = this.leaderboard[existingScoreIndex];
      if (score > existingScore.score) {
        this.leaderboard[existingScoreIndex] = newScore;
      }
    } else {
      this.leaderboard.push(newScore);
    }

    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
    this.saveToStorage();
  }

  getScores() {
    return this.leaderboard;
  }

  clearLeaderboard() {
    this.leaderboard = [];
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem(
      "tetris.leaderboard",
      JSON.stringify(this.leaderboard)
    );
  }
}

export function displayLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboard-body");
  if (!leaderboardBody) return;

  const leaderboardManager = new LeaderboardManager();
  const scores = leaderboardManager.getScores();

  if (scores && Array.isArray(scores) && scores.length > 0) {
    leaderboardBody.innerHTML = scores
      .map(
        (score, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${score.username}</td>
                    <td>${score.score}</td>
                    <td>${score.level}</td>
                    <td>${score.date}</td>
                </tr>
            `
      )
      .join("");
  } else {
    leaderboardBody.innerHTML = '<tr><td colspan="5">Нет результатов</td></tr>';
  }
}

export function clearLeaderboard() {
  if (confirm("Вы уверены, что хотите очистить таблицу рекордов?")) {
    const leaderboardManager = new LeaderboardManager();
    leaderboardManager.clearLeaderboard();
    displayLeaderboard();
  }
}

// Инициализация при загрузке страницы
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    displayLeaderboard();

    // Делаем функции доступными глобально
    window.displayLeaderboard = displayLeaderboard;
    window.clearLeaderboard = clearLeaderboard;
  });
}
