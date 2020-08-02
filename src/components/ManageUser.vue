<template>
  <div>
    <Navigation :isVisible="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <!-- <p class="title has-text-centered" style="width: 100%; float: left"></p> -->
    <div style="width: 98%;float: left">
      <!-- <p class="title has-text-centered mt-100" style="width: 100%;  height: 0px;float: left"></p> -->
      <button @click="filterUserByUId()" class="button is-primary mb-2" style="float: right">Tìm kiếm</button>
      <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterUserByUId"
        style="float: right;width: 10%; height: 40px" />
    </div>
    <div class="row is-full mt-3">
          <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
            <thead style="backgroundColor: #3298dc">
              <th>UID</th>
              <th>Kênh chơi</th>
              <th>Kênh nạp</th>
              <th>Group Object</th>
              <th>Gói mua gần nhất</th>
              <th>Số ván chơi</th>
              <th>Thời gian online gần nhất</th>
              <th>Thời gian tạo</th>
              <th>Modify Offer</th>
            </thead>
            <tbody>
              <tr v-for="object in listUser" :key="object._id">
                <td>{{object.userId}}</td>
                <td>{{object.channelGame}}</td>
                <td><p v-for="line in object.channelPaymentDetail.split('\n')" :key="line">{{line}}</p> </td>
                <td>{{object.groupObject ? object.groupObject.nameObject : 'Không có'}}</td>
                <td>{{object.lastPaidPack}}</td>
                <td>{{object.totalGame}}</td>
                <td>{{moment.unix(object.lastTimeOnline).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td>{{moment.unix(object.timeCreateAccount).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td>{{object.isModifiedOffer}}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="listUser.length > 0" class="button is-primary" style="float: right" @click="clearFilterUser()"> OK </div>
        </div>
    <p>
      <ul>

      </ul>
    </p>
  </div>
</template>

<script>
  import Navigation from './Navigation'
  import APICaller from '../network/APICaller';
  import moment from 'moment';
  import GameData from '../Utility/GameData';
  import TimeUtil from '../Utility/TimeUtility';
  import ERROR_CODE from '../const/error_code';

  export default {
    name: 'ManageUser',
    components: {
      Navigation
    },

    data() {
      return {
        listUser: Array(),
        notiText: "",
        notiState: "primary",
        isVisibleNoti: false,
        search: '',
        TimeUtil: TimeUtil,
        moment: moment
      }
    },

    mounted() {
    },

    methods: {
       filterUserByUId() {
         this.listUser = [];
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
            userId: this.search.toLowerCase()
          }
        };
        APICaller.get(
          "tracking_user/search_user",
          header,
          function (res) {
            console.log("=== ", res);
            if (res.data.data == null) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Không tìn thấy user nào.";
              this.notiState = "danger";
              return;
            }
            let userFilted = res.data.data;
            userFilted.channelPaymentDetail = "";
            for(let c in userFilted.channelPayment){
              userFilted.channelPaymentDetail += "Kênh chơi: " + userFilted.channelPayment[c].channel 
              + " | Số lần mua: " +  userFilted.channelPayment[c].number 
              + " | Số tiền: " +  userFilted.channelPayment[c].cost  + "\n";  
            }
            this.listUser.push(userFilted);
          }.bind(this),
          function (error) {
            console.log('group_objects/list_user ==== error', error);
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        )
      },

      clearFilterUser(){
        this.listUser = [];
      }
    }
  }

</script>
<style scoped>
  .title {
    font-size: 15px;
  }
  .pre-formatted {
  white-space: pre;
}

</style>
