var ACCOUNT_ROLE = require('../const/role_const')
var GAME_CONST = require('../const/game_const');

class GameData {
  gameId = localStorage.gameId;
  accountRole = localStorage.accRole;
  getGameId() {
    // if(this.gameId == null){
    //   this.gameId = "p13";
    // }
    return this.gameId;
  };

  setGameId(gameId) {
    this.gameId = gameId;
    localStorage.gameId = gameId
  };

  getRoleAccount() {
    return this.accountRole;
  };

  setRoleAccount(role) {
    this.accountRole = role;
    localStorage.accRole = role;
  }
}

const instance = new GameData();
export default instance;
