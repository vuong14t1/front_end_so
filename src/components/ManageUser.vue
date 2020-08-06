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
    <button class="button  is-focused mb-5 mr-5"  @click="handleSubmit" style="float: right">Import Data User</button>
    <button class="button  is-focused mb-5 mr-5" style="float: right">
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    </button>
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
            <td>
              <p v-for="line in object.channelPaymentDetail.split('\n')" :key="line">{{line}}</p>
            </td>
            <td>
              <p v-for="line in object.listGroupObject.split('|')" :key="line">{{line}}</p>
            </td>
            <td>{{object.lastPaidPack}}</td>
            <td>{{object.totalGame}}</td>
            <td>{{moment.unix(object.lastTimeOnline).format("MM/DD/YYYY H:mm:ss")}}</td>
            <td>{{moment.unix(object.timeCreateAccount).format("MM/DD/YYYY H:mm:ss")}}</td>
            <td>{{object.isModifiedOffer}}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="listUser.length > 0" class="button is-info" style="float: right" @click="clearFilterUser()"> OK </div>
      <div v-if="listUser.length > 0" class="button is-primary" style="float: right" @click="beforeUpdate(listUser[0])">
        UPDATE
      </div>
    </div>

    <div class="modal is-active" v-if="isUpdate">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Cập nhật User</p>
          <button class="delete" aria-label="close" @click="isUpdate = false"></button>
        </header>
        <section class="modal-card-body" style="width:100%">
          <div>
            <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
              <thead style="backgroundColor: #3298dc">
                <th>UID</th>
                <th>Kênh chơi</th>
                <th>Kênh nạp</th>
                <!-- <th>Group Object</th> -->
                <th>Gói mua gần nhất</th>
                <th>Số ván chơi</th>
                <th>Thời gian online gần nhất</th>
                <th>Thời gian tạo</th>
                <th>Modify Offer</th>
              </thead>
              <tbody>
                <tr>
                  <td>{{userUpdated.userId}}</td>
                  <td><input style="width:50px; height: 50px" v-model="userUpdated.channelGame" /></td>
                  <td>
                    <input style="width:300px; height: 50px" v-model="userUpdated.channelPaymentDetail" />
                    <!-- <p v-for="line in object.channelPaymentDetail.split('\n')" :key="line">{{line}}</p> -->
                  </td>
                  <!-- <td>{{userUpdated.groupObject ? userUpdated.groupObject.nameObject : 'Không có'}}</td> -->
                  <td><input style="width:50px; height: 50px" v-model="userUpdated.lastPaidPack" /></td>
                  <td><input style="width:50px; height: 50px" v-model="userUpdated.totalGame" /></td>
                  <td>
                    <datetime class="column" type="datetime" width="200px" v-model="userUpdated.lastTimeOnline"
                      style="border:1px solid Grey;">
                      {{userUpdated.lastTimeOnline + ''}}
                    </datetime>
                  </td>
                  <td>
                    <datetime class="column" type="datetime" width="200px" v-model="userUpdated.timeCreateAccount"
                      style="border:1px solid Grey;">
                      {{userUpdated.timeCreateAccount + ''}}
                    </datetime>
                  </td>
                  <td><input style="width:50px; height: 50px" v-model="userUpdated.isModifiedOffer" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer class="modal-card-foot" style="text-align: justify">
          <button class="button is-success" @click="updateAccount(userUpdated)">Cập nhật</button>
          <button class="button" @click="isUpdate = false">Hủy</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigation from './Navigation'
  import APICaller from '../network/APICaller';
  import moment from 'moment';
  import GameData from '../Utility/GameData';
  import TimeUtil from '../Utility/TimeUtility';
  import ERROR_CODE from '../const/error_code';
  import {
    Datetime
  } from 'vue-datetime'

  export default {
    name: 'ManageUser',
    components: {
      Navigation,
      datetime: Datetime,
    },

    data() {
      return {
        listUser: Array(),
        notiText: "",
        notiState: "primary",
        isVisibleNoti: false,
        search: '',
        TimeUtil: TimeUtil,
        moment: moment,
        isUpdate: false,
        userUpdated: Object(),
        rawFile: ''
      }
    },

    mounted() {},

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
            for (let c in userFilted.channelPayment) {
              userFilted.channelPaymentDetail += "Kênh nạp: " + userFilted.channelPayment[c].channel +
                " | Số lần mua: " + userFilted.channelPayment[c].number +
                " | Số tiền: " + userFilted.channelPayment[c].cost + "\n";
            }
            userFilted.listGroupObject = "";
            for(let o in userFilted.groupObject){
              userFilted.listGroupObject += userFilted.groupObject[o] + "|";
            }
            if(userFilted.listGroupObject.length == 0){
              userFilted.listGroupObject = "không có";
            }
            this.listUser.push(userFilted);
            this.userUpdated = this.listUser[0];
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

      clearFilterUser() {
        this.listUser = [];
      },

      beforeUpdate(user) {
        this.userUpdated = user;
        this.isUpdate = true;
        this.userUpdated.lastTimeOnline = moment.unix(user.lastTimeOnline).format();
        this.userUpdated.timeCreateAccount = moment.unix(user.timeCreateAccount).format();
        this.userUpdated.channelPaymentDetail = "";
        for (let c in user.channelPayment) {
          this.userUpdated.channelPaymentDetail += user.channelPayment[c].channel +
            "|" + user.channelPayment[c].number +
            "|" + user.channelPayment[c].cost + "-";
        }
      },

      updateAccount(user) {
        //update data user to update
        user.timeCreateAccount = parseInt(moment(moment(user.timeCreateAccount).format()).format("X"));
        user.lastTimeOnline = parseInt(moment(moment(user.lastTimeOnline).format()).format("X"));
        let listPaymentUpdated = user.channelPaymentDetail.split('-');
        for (let i in listPaymentUpdated) {
          let listDetailPaymentUpdate = listPaymentUpdated[i].split("|");
          let channel = user.channelPayment.find(v => v.channel == listDetailPaymentUpdate[0]);
          if (channel) {
            channel.cost = listDetailPaymentUpdate[2];
            channel.number = listDetailPaymentUpdate[1];
          }
        }

        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
          }
        };

        let body = {
          dataModify: user
        }

        APICaller.post(
          "tracking_user/edit_user",
          header,
          body,
          function (res) {
            console.log("=== ", res);
            if (res.data.errorCode == ERROR_CODE.NOT_FOUND) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Không tìn thấy user.";
              this.notiState = "danger";
              return;
            } else if (res.data.errorCode == ERROR_CODE.SUCCESS) {
              this.isUpdate = false;
              this.userUpdated = null;
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Cập nhật thành công";
              this.notiState = "success";
            }
          }.bind(this),
          function (error) {
            console.log('tracking_user/edit_user ==== error', error);
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        )
      },


      handleClick(e) {
        const files = e.target.files
        this.rawFile = files[0] // only use files[0]
      },

      handleSubmit(){
        if (!this.rawFile) return
        console.log(this.rawFile.name);
        let formData = new FormData();
        formData.append('name', this.rawFile.name);
        formData.append('file', this.rawFile);
        console.log("formData ", formData);
        let header = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            gameId: GameData.getGameId(),
          }
        };
        APICaller.post('tracking_user/import_data_user',
          header,
          formData,
          function (res) {
            console.log('SUCCESS!!', res);
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "Tạo thành công: " + res.data.data.checkSuccess + " | Thất  bại: " + res.data.data.checkFail;
            this.notiState = "success";
          }.bind(this),
          function (error) {
            console.log('FAILURE!!', error);
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "Tạo thất bại";
            this.notiState = "danger";
          }.bind(this))
      },
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

  .modal-content,
  .modal-card {
    margin: 0 20px;
    max-height: calc(100vh - 160px);
    overflow: auto;
    position: relative;
    width: 100%;
  }

  @media screen and (min-width: 769px) {

    .modal-content,
    .modal-card {
      margin: 0 auto;
      max-height: calc(100vh - 40px);
      width: 960px;
    }
  }

</style>
