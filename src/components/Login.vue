<template class="component">
  <div class="hero component-login">
    <Notification :isVisible="isVisibleNoti" :text="notiText" :state="notiState" style="width: 30%; float: left">
    </Notification>
    <div class="hero-body" style="width: 100%;">
      <div class="columns is-centered ">
        <div class="column is-half">
          <div class="notification is-light" style="width: 50%;left: 20%">
            <figure class="image container is-64x64">
              <img src="../assets/logo.png">
            </figure>
       
            <div class="field is-centered " style="width:100%;">
              <label class="label">Email</label>
              <p class="control has-icons-left has-icons-right">
                <input v-model="email" name="email" class="input" type="text" placeholder="Email">
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div class="field" style="width:100%;">
              <label class="label">Password:</label>
              <p class="control has-icons-left">
                <input v-model="password" name="password" class="input" type="password" placeholder="Password">
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
                 <div class="field is-centered" style="width:100%; height: 50px;">
              <label class="label">Chọn game</label>
              <DropDown class="gameName input column" style="float: left; " :type="OBJECT_CONST.DROP_DOWN.LOGIN"
                :title="gameTitle" :items="listGame" @clicked="onClickChild">{{gameTitle}}</DropDown>
            </div>
            <!-- <div class="field columns">
              <label class="label column is-2 ">Game:</label>
            </div> -->
            <div class="field mt-6" style="z-index: -1 !important; text-align: center; width: 100%">
              <a class="button is-info  is-outlined " @click="doLogin()">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import DropDown from './DropDown'
  import APICaller from '../network/APICaller';
  import router from '../router';
  import USER_ROLE from '../const/role_const';
  import GameData from '../Utility/GameData';
  import GAME from '../const/game_const';
  import OBJECT_CONST from '../const/object_const';
  import Notification from './Notification';
  import ERROR_CODE from '../const/error_code';

  export default {
    name: 'Login',
    components: {
      DropDown,
      Notification
    },
    data() {
      return {
        email: '',
        password: '',
        gameTitle: GameData.getGameId(),
        listGame: GAME.LIST_GAME,
        OBJECT_CONST: OBJECT_CONST,
        notiText: "aaa",
        notiState: "primary",
        isVisibleNoti: false
      }
    },

    beforeCreate() {
      let header = {
        headers: {
          "content-type": "application/json",
        },
        params: {
          gameId: GameData.getGameId()
        }
      }
      APICaller.get(
        "accounts_route/logout",
        header,
        function (res) {
          if (res.data.errorCode == 0) {
            // this.isVisibleNoti = Math.round(+new Date() / 1000);
            // this.notiText = "logout successfullt";
            // this.notiState = "success";
            localStorage.removeItem('accRole');
            // localStorage.removeItem('gameId');
          } else {
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "Lỗi log out!" + Object.keys(ERROR_CODE)[res.data.errorCode];
            this.notiState = "danger";
          }
        }.bind(this),
        function (error) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "logout fail; errorCode: " + error;
          this.notiState = "danger";
        }.bind(this)
      )
    },

    methods: {
      doLogin() {
        let header = {
          headers: {
            "content-type": "application/json",
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        let body = {
          email: this.email,
          password: this.password
        };

        APICaller.post(
          "accounts_route/login",
          header,
          body,
          function (res) {
            if (res.data.errorCode == 0) {
              console.log('=vao day success');
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Đăng nhập thành công!";
              this.notiState = "success";
              // setTimeout(function(){
              // this.isVisibleNoti = false
              GameData.setRoleAccount(res.data.data.role);
              this.$router.push(this.$route.query.redirect || '/');
              // }.bind(this), 2000)

            } else {
              console.log("vao day");
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              var msg = "Đăng nhập thất bại! " + Object.keys(ERROR_CODE)[res.data.errorCode];
              if (res.data.errorCode == ERROR_CODE.NOT_FOUND_GAME_ID) {
                msg = "Game chưa được đăng kí!Liên hệ vuongpq2."
              }
              this.notiText = msg;
              this.notiState = "danger";
            }

          }.bind(this),
          function (error) {
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "login fail; errorCode: " + error;
            this.notiState = "danger";
            console.log(error);
          }.bind(this)
        );
      },

      onClickChild(game) {
        this.gameTitle = game.title;
        GameData.setGameId(game.title);
      }
    }
  }

</script>
<style>
  html,
  body {
    width: 100%;
    height: 100%;
  }

  .component-login {
    width: 100%;
    height: 100%;
    background-attachment: fixed;
    /* background-color: #47887e; */
  }

  .spacing {
    margin-right: 10px;
  }

  .field {
    width: 70%;
  }

</style>
