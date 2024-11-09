export class Player {
  constructor() {
    this.username = localStorage.getItem("tetris.username") || "Гость";
  }

  getPlayerInfo() {
    return {
      username: this.username,
    };
  }
}
