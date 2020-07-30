export default {
  data() {
    return {
      gameId: "p13"
    }
  },
  methods: {
    getGameId: function () {
      return this.gameId;
    },

    setGameId: function (gameId) {
      this.gameId = gameId;
    }
  }

};
