var ACCOUNT_ROLE = require('../const/role_const')
var GAME_CONST = require('../const/game_const');
// var APICaller = require('../network/APICaller')
import APICaller from '../network/APICaller';

class GameData {
  gameId = localStorage.gameId;
  accountRole = localStorage.accRole;
  serverTime = "";
  getGameId() {
    if (this.gameId == null) {
      this.gameId = "p13";
    }
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
  };

  async _getTimeServer(callBack) {
    let header = {
      headers: {
        "content-type": "application/json"
      },
      params: {
        gameId: this.gameId
      }
    };
    APICaller.get(
      "utils_route/server_time",
      header,
      function (res) {
          this.serverTime = res.data.data.serverTime;
          callBack(this.serverTime)
        }.bind(this),
        function (error) {
          console.log("utils_route/server_time error ", error);
        }
    )
  }
}

const instance = new GameData();
export default instance;
