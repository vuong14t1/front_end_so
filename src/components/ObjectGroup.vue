<template>
  <div>
    <Navigation :isVisible="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <div class="columns" style="width: 98%;float: left">
      <div class="column is-3 ml-2" v-if="!isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"> <strong> Tạo Object </strong> </p>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;font-size: 15px"
          v-for="option in options" :key="option.title">
          <p class="column ">{{option.title}}</p>
          <Dropdown class="column" @clicked="onClickChild" :id="option.idOption" :title="option.value"
            :items="option.listItems" :type="OBJECT_CONST.DROP_DOWN.OBJECT">{{option.value}}</Dropdown>
        </div>
        <div class="ml-50" style="text-align: center; width: 100%; height: 50px">NameObject:
          <input style="text-align: center; width: 70%; height: 40px" placeholder="name object" v-model="nameObject" />
        </div>
        <div class="has-text-centered mt-5 ">
          <button class="button is-primary mt-100" @click="createObject()">Tạo</button>
        </div>
      </div>
      <div class="column is-3 ml-2" v-if="isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"><strong> Cập nhật Object </strong> </p>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;font-size: 15px"
          v-for="option in optionsUpdate" :key="option.title">
          <p class="column ">{{option.title}}</p>
          <Dropdown class="column" @clicked="onClickChild" :object="option" :id="option.idOption" :title="option.value"
            :items="option.listItems">{{option.value}}</Dropdown>
        </div>
        <div class="ml-50" style="text-align: center; width: 100%; height: 50px">NameObject:
          <input style="text-align: center; width: 70%; height: 40px" placeholder="name object" v-model="nameObject" />
        </div>
        <div class="has-text-centered ">
          <button class="button is-small is-primary" @click="sendUpdateObject()">Cập nhật</button>
          <button class="button is-info is-small mr-3 ml-3 " @click="cancleUpdate()">Hủy</button>
          <!-- <button class="button is-small is-danger" @click="sendDeleteObject()">Delete</button> -->

        </div>
      </div>
      <div class="column ml-2 rows" :class="isCanCreate ? 'is-9' : 'is-12'" style="border:1px solid Grey;">
        <div class="row is-full" v-if="!isShowUser">
          <div class="has-text-centered">
            <span><strong> Danh sách các OBJECTS </strong> </span>
            <button @click="filterObject()" class="button is-primary is-small mr-0 mb-2" style="float: right">Tìm
              kiếm</button>
            <!-- <input v-model="search" @keydown.enter="filterObject" style="float: right" /> -->
            <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterObject"
              style="float: right;width: 10%; height: 30px" />
          </div>
          <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 13px">
            <thead style="backgroundColor: #3298dc">
              <th>ID Object</th>
              <th>Tên</th>
              <th>Số lượng user</th>
              <th v-for="option in options" :key="option.title">{{option.title}} </th>
              <th>Thời gian tạo</th>
              <th
                v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                Hành động</th>
            </thead>
            <tbody>
              <tr v-for="object in dataListObject" :key="object._id">
                <td @click="showDetailObject(object)"><a>{{object._id}}</a></td>
                <td>{{object.nameObject}}</td>
                <td>{{object.totalUser}}</td>
                <td>{{object.channelPayment}}</td>
                <td>{{object.totalCost.from}} - {{object.totalCost.to}}</td>
                <td>{{object.numberPay.from}} - {{object.numberPay.to}}</td>
                <td>{{object.totalGame.from}} - {{object.numberPay.to}}</td>
                <td>{{object.lastPaidPack.from}} - {{object.lastPaidPack.to}}</td>
                <td>{{timeUtil.convertDuration(object.age.from)}} - {{timeUtil.convertDuration(object.age.to)}}</td>
                <td>{{timeUtil.convertDuration(object.timeLastOnline.from)}} -
                  {{timeUtil.convertDuration(object.timeLastOnline.to)}}</td>
                <td>{{object.channelGame.from}} - {{object.channelGame.to}}</td>
                <td>{{ moment.unix(object.createAt).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td
                  v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                  <button class="button is-primary is-small" @click="beforUpdateObject(object)">Cập nhật</button>
                  <button class="button is-danger is-small" @click="beforDeleteObject(object)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav class="column is-full pagination mr-0 is-small" role="navigation" aria-label="pagination">
            <ul class="pagination-list">
              <li v-for="i in paginationObject.totalPage" v-bind:key=i>
                <a class="pagination-link " :class="[i  - 1 == paginationObject.curPage ?'is-current':'']"
                  @click="getDataListObjectByPage(i)">{{i}}</a>
              </li>
              <li> Tổng trang: {{paginationObject.totalPage}} </li>
            </ul>
          </nav>
        </div>
        <div class="row is-full mt-3" v-if="isShowUser">
          <div class="has-text-centered pt-3" style="border-top:1px solid Grey;">
            Tổng số users được chọn: {{dataUsersByCreatingObject.length}}
            <button @click="filterUserByUId()" class="mr-0" style="float: right">Tìm kiếm</button>
            <input v-model="search" @keydown.enter="filterUserByUId" style="float: right" />
          </div>
          <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
            <thead style="backgroundColor: #3298dc">
              <th>Danh sách USERS</th>
              <th v-for="option in options" :key="option.title">{{option.title}} </th>
            </thead>

            <tbody>
              <tr v-for="object in dataUsersByCreatingObject" :key="object._id">
                <td>{{object.userId}}</td>
                <td>{{object.channel}}</td>
                <td>{{object.totalCost}}</td>
                <td>{{object.numberPay}}</td>
                <td>{{object.totalGame}}</td>
                <td>{{object.lastPaidPack}}</td>
                <td>{{moment.unix(object.timeCreateAccount).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td>{{moment.unix(object.lastTimeOnline).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td>{{object.channelGame}}</td>
              </tr>
            </tbody>
          </table>
          <nav class="column is-full pagination is-small" role="navigation" aria-label="pagination">
            <ul class="pagination-list">
              <li v-for="i in totalPageUser" v-bind:key=i>
                <a class="pagination-link" :class="[i == curPageUser ?'is-current':'']"
                  @click="getDataUserByPage(i)">{{i}}</a>
              </li>
            </ul>
          </nav>
          <!-- <div class="column is-full has-text-centered">
            <form>
              Đặt tên ID Object: <input v-model="nameObject" />
              <button @click="setNameObject(nameObject)">Đặt ID Object</button>
            </form>
          </div> -->
        </div>
      </div>
    </div>
    <Modal :isVisible.sync="modalAlert_isVisible" :title="modalAlert_title" :cbApprove="modalAlert_cbApprove"
      :cbCancle="modalAlert_cbCancle"></Modal>
  </div>
</template>

<script>
  import Navigation from './Navigation'
  import Dropdown from './DropDown';
  import APICaller from '../network/APICaller';
  import Pagination from '../Utility/Pagination';
  import OBJECT_CONST from '../const/object_const';
  import TimeUtil from '../Utility/TimeUtility';
  import ERROR_CODE from '../const/error_code';
  import CHANNEL_PAYMENT from '../const/channel_const';
  import moment from 'moment';
  import router from '../router';
  import GameData from '../Utility/GameData';
  import lodash from 'lodash';
  import ACCOUNT_ROLE from '../const/role_const';
  import Modal from './Modal';
  import Utils from '../Utility/Utils';
  import GAME from '../const/game_const';

  export default {
    name: 'ObjectGroup',
    components: {
      Dropdown,
      Navigation,
      Modal,

    },

    mounted() {
      this.gameId = GameData.getGameId();
      if (GameData.getRoleAccount() == null) {
        this.isVisibleNoti = Math.round(+new Date() / 1000);
        this.notiText = "Yêu cầu đăng nhạp!";
        this.notiState = "danger";
        setTimeout(function () {
          router.push('Login');
        }.bind(this), 100)
      }
      this.isCanCreate = GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1]
        .id
      this.getDataListObject();
    },

    data() {
      var gameID = GameData.getGameId();
      try {
        this.jsonConfig = require('../assets/json/' + gameID + '_config_so.json');
      } catch (error) {
        alert(gameID + " hasnt registerd!");
        router.push('Login');
      }
      return {
        GameData: GameData,
        options: this.loadJsonOptions(),
        optionsUpdate: this.loadJsonOptions(),
        isShown: false,
        isShowUpdate: false,
        dataListObject: Array(),
        paginationObject: Pagination,
        paginationUser: Pagination,
        search: '',
        dataUsersByCreatingObject: Array(),
        dataObjectCreating: Object(),
        nameObject: 'default',
        totalData: Array(),
        idObjectUpdate: '',
        timeUtil: TimeUtil,
        OBJECT_CONST: OBJECT_CONST,
        CHANNEL_PAYMENT: CHANNEL_PAYMENT,
        isShowUser: false,
        moment: moment,
        totalPageUser: 0,
        curPageUser: 1,
        ACCOUNT_ROLE: ACCOUNT_ROLE,
        isCanCreate: false,
        modalAlert_isVisible: false,
        modalAlert_title: "",
        modalAlert_cbApprove: "",
        modalAlert_cbCancle: "",
        notiText: "",
        notiState: "primary",
        isVisibleNoti: false,
        objectUpdate: Object()
      }
    },

    methods: {
      loadJson() {
        for (let i in this.options) {
          this.options[i].isShow = false;
          this.options[i].listItems = [];
          for (let j in this.options[i].listItem) {
            var object = Object();
            object.id = parseInt(j);
            if (this.options[i].listItem[j].from == null) {
              object.title = this.options[i].listItem[j];
            } else {
              object.title = this.options[i].listItem[j].from +
                '-' + this.options[i].listItem[j].to;
            }
            this.options[i].listItems.push(object);
          }
          this.options[i].value = this.options[i].listItems[0].title;
          this.options[i].isModify = false;

        }
        this.optionsUpdate = lodash.clone(this.options, true);
      },

      loadJsonOptions() {
        // let gameId = GameData.getGameId();
        // console.log("loadJsonOptions ", GameData.getGameId());
        // let jsonConfig = require('../assets/json/' + gameId + '_config_so.json');
        var options = this.jsonConfig.ObjectGroup;
        for (let i in options) {
          options[i].isShow = false;
          options[i].listItems = [];
          for (let j in options[i].listItem) {
            var object = Object();
            object.id = parseInt(j);
            if (options[i].listItem[j].from == null) {
              object.title = options[i].listItem[j];
            } else {
              object.title = options[i].listItem[j].from +
                '-' + options[i].listItem[j].to;
            }
            options[i].listItems.push(object);
          }
          options[i].value = options[i].listItems[0].title;
          options[i].isModify = false;
        }
        return options;
      },

      onClickChild(item) {
        let data = this.isShowUpdate ? this.optionsUpdate : this.options;
        for (let i in data) {
          if (data[i].idOption == item.idOption) {
            data[i].isShow = true;
            data[i].value = item.title;
            data[i].choosenItem = item.id;
            return;
          }
        }
      },

      getDataListObject() {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        APICaller.get(
          "group_objects/list",
          header,
          function (res) {
            this.totalData = res.data.data.sort(function (o1, o2) {
              return o2.createAt - o1.createAt;
            });
            this.paginationObject.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE);
            this.dataListObject = this.paginationObject.getDataByPage(1);
          }.bind(this),
          function (error) {
            console.log("aaaa", error);
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        );
      },

      getDataListObjectByPage(page) {
        this.dataListObject = this.paginationObject.getDataByPage(page).sort(function (o1, o2) {
          return o2.createAt - o1.createAt;
        });
      },

      filterObject() {
        this.dataListObject = this.totalData.filter(item => {
          return item.nameObject.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      },

      createObject() {
        console.log("createObject ", GameData.getGameId());
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };

        let body = this.getDataBodyObject(true);
        if (body == null) return;
        APICaller.post(
          "group_objects/create",
          header,
          body,
          function (res) {
            this.dataObjectCreating = res.data.data;
            if (res.data.errorCode == ERROR_CODE.EMPTY) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Không tìm thấy user nào!";
              this.notiState = "danger";
              return;
            }

            header.params = Object.assign(header.params, {
              idGroupObject: this.dataObjectCreating._id
            });
            APICaller.get(
              "group_objects/list_user",
              header,
              function (res) {
                console.log('==== lisst user ', res);
                if (res.data.errorCode == ERROR_CODE.EMPTY) {
                  this.isVisibleNoti = Math.round(+new Date() / 1000);
                  this.notiText = "Không có user nào!";
                  this.notiState = "danger";
                  this.totalData.unshift(this.dataObjectCreating);
                  this.paginationObject.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE);
                  this.dataListObject = this.paginationObject.getDataByPage(1);
                  this.clearDataObjectCreating();
                  return;
                }
                this.dataUsersByCreatingObject = res.data.data;
                console.log('dataUsersByCreatingObject ', this.dataObjectCreating.totalUser);
                var channel = CHANNEL_PAYMENT[GameData.getGameId()][body.channelPayment + ''];
                for (let u in this.dataUsersByCreatingObject) {
                  this.dataUsersByCreatingObject[u].channel = this.dataUsersByCreatingObject[u].channelPayment[
                    channel].channel;
                  this.dataUsersByCreatingObject[u].numberPay = this.dataUsersByCreatingObject[u].channelPayment[
                    channel].number;
                  this.dataUsersByCreatingObject[u].totalCost = this.dataUsersByCreatingObject[u].channelPayment[
                    channel].cost;
                }
                this.totalPageUser = Math.ceil(this.dataObjectCreating.totalUser / OBJECT_CONST.PAGE.NUM_PER_PAGE);
                console.log("totalPageUser ", this.totalPageUser);
                this.isShowUser = true;
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Tạo thành công!";
                this.notiState = "success";
                // this.clearDataObjectCreating();
              }.bind(this),
              function (error) {
                console.log('group_objects/list_user ==== error', error);
              }
            )


          }.bind(this),
          function (error) {
            console.log(error);
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        );
      },

      setNameObject(name) {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        let body = {
          idGroupObject: this.dataObjectCreating._id,
          nameObject: name
        };
        APICaller.post(
          "group_objects/set_name",
          header,
          body,
          function (res) {
            console.log('res ', res);
            this.dataObjectCreating.nameObject = name;
            this.totalData.push(this.dataObjectCreating);
            this.paginationObject.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE);
            this.dataListObject = this.paginationObject.getDataByPage(this.paginationObject.totalPage).sort(function (
              o1, o2) {
              return o2.createAt - o1.createAt;
            });
            this.clearDataObjectCreating();
          }.bind(this),
          function (error) {
            console.log(error);
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        )
      },

      clearDataObjectCreating() {
        console.log("clearDataObjectCreating ");
        this.dataUsersByCreatingObject = [],
          this.dataObjectCreating = null;
        this.nameObject = 'default';
        this.totalPageUser = 0;
        this.isShowUser = false;
      },

      beforUpdateObject(object) {
        this.cancleUpdate();
        this.objectUpdate = object;
        this.nameObject = object.nameObject;
        this.isShowUpdate = true;
        for (var i in this.optionsUpdate) {
          this.optionsUpdate[i].isShow = true;
          if (object[i].from != null) {
            if (this.optionsUpdate[i].idOption == 6 || this.optionsUpdate[i].idOption == 5) {
              this.optionsUpdate[i].value = this.timeUtil.convertDuration(object[i].from) + "-" + this.timeUtil
                .convertDuration(object[i].to);
            } else {

              this.optionsUpdate[i].value = object[i].from + "-" + object[i].to;
            }
          } else {
            this.optionsUpdate[i].value = object[i];
          }
        }
      },

      beforDeleteObject(object) {
        this.cancleUpdate();
        this.objectUpdate = object;
        this.sendDeleteObject();
      },

      sendUpdateObject() {
        let body = {
          idGroupObject: this.objectUpdate._id,
          dataModify: this.getDataBodyObject(false)
        }
        if (!Utils.checkDuplicateData(body.dataModify, this.objectUpdate)) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Dữ liệu cập nhật không đổi";
          this.notiState = "danger";
          return;
        }

        this.modalAlert_isVisible = true;
        var updateObjectCB = function () {
          this.modalAlert_isVisible = false;
          let header = {
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*"
            },
            params: {
              gameId: GameData.getGameId()
            }
          };

          console.log("sendUpdateObject1 ", JSON.stringify(body));
          if (body.dataModify == null) return;
          APICaller.post(
            "group_objects/edit",
            header,
            body,
            function (res) {
              console.log("success edit", res);
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Update thành công";
                this.notiState = "success";
                this.dataListObject.splice(this.dataListObject.findIndex(v => v._id == this.objectUpdate._id), 1,
                  res
                  .data.data);
                this.cancleUpdate();
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Update lỗi errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }
            }.bind(this),
            function (error) {
              console.log("err edit", error);
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "update object fail; err0rC0de: " + error;
              this.notiState = "danger";
              this.cancleUpdate();
            }.bind(this),
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          )
        }
        this.updateDataModalAlert("Bạn có muốn update không?", updateObjectCB.bind(this));
      },

      sendDeleteObject() {
        this.modalAlert_isVisible = true;
        var deleteObjectCB = function () {
          this.modalAlert_isVisible = false;
          let header = {
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*"
            },

            params: {
              gameId: GameData.getGameId()
            }
          };
          let body = {
            idGroupObject: this.objectUpdate._id
          };
          APICaller.post(
            "group_objects/delete",
            header,
            body,
            function (res) {
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thành công!";
                this.notiState = "success";
                console.log("success delete", res);
                this.totalData.splice(this.totalData.findIndex(v => v._id == this.objectUpdate._id), 1);
                this.paginationObject.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE);
                this.dataListObject = this.paginationObject.getDataByPage(1);
                this.cancleUpdate();
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa lỗi, errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }
            }.bind(this),
            function (error) {
              console.log("err delete", error);
              this.cancleUpdate();
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "delete object fail; ERRORCODE: " + error;
              this.notiState = "danger";
            }.bind(this),
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          )
        }
        this.updateDataModalAlert("Bạn chắc chắn có muốn xóa? ", deleteObjectCB.bind(this));
      },

      getDataBodyObject(isCreate) {
        if (isCreate) {
          var data = this.options;
        } else {
          var data = this.optionsUpdate;
        }
        if (!this.validateParamObject(data)) {
          // alert("not enough");
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Bạn phải điền hết thông tin!";
          this.notiState = "danger";
          return null;
        }
        let body = {
          totalGame: {
            from: parseInt(data.totalGame.value.split('-')[0]),
            to: parseInt(data.totalGame.value.split('-')[1])
          },
          channelPayment: data.channelPayment.value,
          totalCost: {
            from: parseInt(data.totalCost.value.split('-')[0]),
            to: parseInt(data.totalCost.value.split('-')[1])
          },
          numberPay: {
            from: parseInt(data.numberPay.value.split('-')[0]),
            to: parseInt(data.numberPay.value.split('-')[1])
          },
          lastPaidPack: {
            from: parseInt(data.lastPaidPack.value.split('-')[0]),
            to: parseInt(data.lastPaidPack.value.split('-')[1])
          },
          age: {
            from: parseInt(data.age.value.split('-')[0]) * OBJECT_CONST.TIME.DAY,
            to: parseInt(data.age.value.split('-')[1]) * OBJECT_CONST.TIME.DAY,
          },
          timeLastOnline: {
            from: parseInt(data.timeLastOnline.value.split('-')[0]) * OBJECT_CONST.TIME.DAY,
            to: parseInt(data.timeLastOnline.value.split('-')[1]) * OBJECT_CONST.TIME.DAY,
          },
          channelGame: {
            from: parseInt(data.channelGame.value.split('-')[0]),
            to: parseInt(data.channelGame.value.split('-')[1])
          },

          nameObject: this.nameObject
        };
        return body;
      },

      cancleUpdate() {
        this.isShowUpdate = false;
        this.dataUsersByCreatingObject = [];
        this.dataObjectCreating = [];
        this.idObjectUpdate = '';
        this.objectUpdate = null;
        for (var i in this.options) {
          this.options[i].isShow = false;
        }
        for (var i in this.optionsUpdate) {
          this.optionsUpdate[i].isShow = false;
        }
        this.clearDataObjectCreating();
      },

      validateParamObject(data) {
        for (var i in data) {
          if (data[i].value == "" || data[i].value == null || data[i] == null || data[i] == "") {
            return false;
          }
        }
        return true;
      },

      getDataUserByPage(page) {
        this.curPageUser = page;
        page = page === undefined ? 0 : page - 1;
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
            indexPage: page,
            idGroupObject: this.dataObjectCreating._id
          }
        };

        APICaller.get(
          "group_objects/list_user",
          header,
          function (res) {
            if (res.data.errorCode == ERROR_CODE.EMPTY) {
              // alert("found empty users");
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Không tìn thấy user nào.";
              this.notiState = "danger";
              return;
            }
            this.dataUsersByCreatingObject = res.data.data;
            console.log('dataUsersByCreatingObject ', this.dataUsersByCreatingObject);
            var channel = CHANNEL_PAYMENT[GameData.getGameId()][this.dataObjectCreating.channelPayment + ''];
            for (let u in this.dataUsersByCreatingObject) {
              this.dataUsersByCreatingObject[u].channel = this.dataUsersByCreatingObject[u].channelPayment[
                channel].channel;
              this.dataUsersByCreatingObject[u].numberPay = this.dataUsersByCreatingObject[u].channelPayment[
                channel].number;
              this.dataUsersByCreatingObject[u].totalCost = this.dataUsersByCreatingObject[u].channelPayment[
                channel].cost;
            }
            this.isShowUser = true;
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

      showDetailObject(obj) {
        console.log(obj)
        this.dataObjectCreating = obj;
        this.totalPageUser = Math.ceil(obj.totalUser / OBJECT_CONST.PAGE.NUM_PER_PAGE);
        this.getDataUserByPage(1);
      },

      filterUserByUId() {
        this.dataUsersByCreatingObject = this.dataUsersByCreatingObject.filter(item => {
          return item._id.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      },

      updateDataModalAlert(title, callBack) {
        this.modalAlert_isVisible = true;
        this.modalAlert_title = title;
        this.modalAlert_cbApprove = callBack;
        this.modalAlert_cbCancle = function () {
          this.modalAlert_isVisible = false;
        }.bind(this);
      },

    }
  }

</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .columns {
    margin: 20px;
  }

  .rows {
    display: flex;
    flex-direction: column;
  }

  .pagination .pagination-list {
    float: right;
  }

  tr:nth-child(even) {
    background-color: azure;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    overflow-x: scroll;
  }

</style>
