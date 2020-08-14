<template>
  <div>
    <div class=" buttons" style="width: 70%; float: left">
      <router-link class="button mt-5 ml-5" v-for="routes in links" v-bind:key="routes.id" :to="`${routes.page}`"
        :class="[!routes.isVisible ?'is-hidden':'', '/' + $route.name == routes.page?'is-info' :' is-focused']">
        <p>{{routes.text}} </p>
      </router-link>
      <button class="button  is-focused mt-5 ml-5" @click="refreshPage()">Làm mới trang</button>
      <button v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id" class="button  is-danger mt-5 ml-5"
        @click="deleteAllOptions()">Xóa toàn bộ</button>
    </div>
    <router-link v-if="!isActive" class="button  is-focused  mt-5 mr-3" style="float: right" :to="'/login'">Đăng xuất
    </router-link>
    <p v-if="!isActive" class="button mt-5 ml-5" style="float: right;border: none; border-bottom:1px solid #3298dc; ">
      <strong> Game: {{gameTitle}} </strong></p>
    <div v-if="isActive" class="notification " :class="'is-' + state"
      style="width: 20%; height: 50px;float: left;z-index: 100" @click="closeNotify()"><button class="delete"></button>
      {{text}}</div>
    <div v-if="isDeleteAll">
      <div class="modal is-active" style="modal-content-width: 40px">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Xóa toàn bộ</p>
            <button class="delete" aria-label="close" @click="cancel()"></button>
          </header>
          <section class="modal-card-body">
            <div class="createAccount" style="text-align: center">
              <button v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id" class="button  is-danger mt-5 ml-5"
                style="width: 50%" @click="deleteAll('delete_all_users')">Xóa toàn bộ Users</button>
              <button v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id" class="button  is-danger mt-5 ml-5"
                style="width: 50%" @click="deleteAll('delete_all_group_object')">Xóa toàn bộ Objects</button>
              <button v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id" class="button  is-danger mt-5 ml-5"
                style="width: 50%" @click="deleteAll('delete_all_group_offer')">Xóa toàn bộ Offers</button>
              <button v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id" class="button  is-danger mt-5 ml-5"
                style="width: 50%" @click="deleteAll('delete_all_offer_live')">Xóa toàn bộ Offers đang chạy</button>

            </div>
          </section>
          <footer class="modal-card-foot has-text-centured">
            <!-- <button class="button is-success" @click="aprove()"> OK</button> -->
            <!-- <button class="button" @click="cancel()">Cancel</button> -->
          </footer>
        </div>
      </div>
    </div>
    <Modal :isVisible.sync="modalAlert_isVisible" :title="modalAlert_title" :cbApprove="modalAlert_cbApprove"
      :cbCancle="modalAlert_cbCancle"></Modal>
  </div>
</template>

<script>
  import DropDown from './DropDown'
  import GAME from '../const/game_const'
  import GameData from '../Utility/GameData'
  import ACCOUNT_ROLE from '../const/role_const'
  import APICaller from '../network/APICaller'
  import Modal from './Modal'

  export default {
    name: 'Navigation',
    components: {
      DropDown,
      Modal
    },
    props: ['text', 'state', 'isVisible'],

    watch: {
      isVisible: function () {
        this.isActive = true;
        setTimeout(function () {
          this.isActive = false
        }.bind(this), 2000);
      }
    },

    data() {
      return {
        isActive: false,
        isDeleteAll: false,
        modalAlert_isVisible: false,
        modalAlert_title: "",
        modalAlert_cbApprove: "",
        modalAlert_cbCancle: "",
        links: [{
            id: 0,
            text: 'Nhóm Object',
            page: '/ObjectGroup',
            isVisible: true
          },
          {
            id: 1,
            text: 'Nhóm Offer',
            page: '/OfferGroup',
            isVisible: true
          },
          {
            id: 2,
            text: 'Chạy Offer',
            page: '/RunOffer',
            isVisible: true
          },
          {
            id: 3,
            text: 'Đánh giá',
            page: '/Evaluate',
            isVisible: true
          },
          {
            id: 4,
            text: 'Quản lí tài khoản',
            page: '/ManageAccount',
            isVisible: true
          },
          {
            id: 5,
            text: 'Quản lý Users',
            page: '/ManageUser',
            isVisible: true
          }
        ],
        gameTitle: GameData.getGameId(),
        listGame: GAME.LIST_GAME,
        GameData: GameData,
        ACCOUNT_ROLE: ACCOUNT_ROLE
      }
    },

    mounted() {
      this.gameTitle = GameData.getGameId();
      if (GameData.getRoleAccount() == ACCOUNT_ROLE[0].id) {
        this.links[4].isVisible = true;
      } else {
        this.links[4].isVisible = false;
      }

      setTimeout(function () {
        this.isActive = false
      }.bind(this), 2000);
    },

    methods: {
      onClickChild(game) {
        this.gameTitle = game.title;
        GameData.setGameId(game.title);
      },
      closeNotify() {
        this.isActive = false
      },

      refreshPage() {
        this.$router.go(this.$router.currentRoute)
      },

      updateDataModalAlert(title, callBack) {
        this.modalAlert_isVisible = true;
        this.modalAlert_title = title;
        this.modalAlert_cbApprove = callBack;
        this.modalAlert_cbCancle = function () {
          this.modalAlert_isVisible = false;
        }.bind(this);
      },

      deleteAllOptions() {
        this.isDeleteAll = true;
      },

      cancel() {
        this.isDeleteAll = false;
      },

      deleteAll(route) {
        var deleteAllUsersCB = function () {
          let header = {
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*"
            },
            params: {
              gameId: GameData.getGameId()
            }
          };

          APICaller.get(
            "danger_route/" + route,
            header,
            function (res) {
              this.showNotifyDeleteSuccess();
            }.bind(this),
            function (error) {
              this.showNotifyDeleteFail();
            },
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          );
        }

        this.updateDataModalAlert("Bạn có chắc xóa không?", deleteAllUsersCB.bind(this))
      },

      showNotifyDeleteSuccess() {
        this.isActive = true;
        this.state = 'success';
        this.text = 'Xóa thành công';
        setTimeout(function () {
          this.isActive = false
        }.bind(this), 2000);
        this.refreshPage();
      },

      showNotifyDeleteFail() {
        this.isActive = true;
        this.state = 'danger';
        this.text = 'Xóa không thành công';
        setTimeout(function () {
          this.isActive = false
        }.bind(this), 2000);
        this.refreshPage();
      }
    }
  }

</script>
<style>
  .spacing {
    margin-right: 10px;
  }

</style>
