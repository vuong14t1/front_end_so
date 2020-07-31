<template>
  <div>
    <div class=" buttons" style="width: 80%; float: left">
      <router-link class="button mt-5 ml-5"  v-for="routes in links" v-bind:key="routes.id"
        :to="`${routes.page}`" :class="[!routes.isVisible ?'is-hidden':'', '/' + $route.name == routes.page?'is-info' :' is-focused']">
        <p>{{routes.text}} </p>
      </router-link>
      <button class="button  is-focused mt-5 ml-5" @click="refreshPage()">Làm mới trang</button>
      <button class="button is-focused mt-5 ml-5">{{gameTitle}}</button>
    </div>
    <router-link v-if="!isActive" class="button  is-focused  mt-5 mr-3" style="float: right" :to="'/login'" >Đăng xuất</router-link>
    <div v-if="isActive" class="notification " :class="'is-' + state" style="width: 20%; height: 50px;float: left;z-index: 100"
      @click="closeNotify()"><button class="delete"></button>
      {{text}}</div>
  </div>
</template>

<script>
  import DropDown from './DropDown'
  import GAME from '../const/game_const'
  import GameData from '../Utility/GameData'
  import ACCOUNT_ROLE from '../const/role_const'

  export default {
    name: 'Navigation',
    components: {
      DropDown
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
          // {
          //   id: 5,
          //   text: 'Đăng xuất',
          //   page: '/login',
          //   isVisible: true
          // }
        ],
        gameTitle: GameData.getGameId(),
        listGame: GAME.LIST_GAME
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
      }
    }
  }

</script>
<style>
  .spacing {
    margin-right: 10px;
  }

</style>
