<template>
  <div class="is-fullwidth">
    <Navigation class="is-fullwidth" :isVisible="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <div class="columns" style="width: 98%;float: left">
      <div class="column is-3 ml-2" v-if="!isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"> <strong> Tạo Object </strong> </p>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;font-size: 15px"
          v-for="option in options" :key="option.title">
          <p class="column ">{{option.title}}</p>
          <Dropdown v-if="option.idOption == 0" class="column" @clicked="onClickChild" :id="option.idOption"
            :title="option.value" :items="option.listItems" :type="OBJECT_CONST.DROP_DOWN.OBJECT">{{option.value}}
          </Dropdown>
          <input type="number"
            style="width: 100px; height: 50px; text-align: center; border: none;border-left:1px solid Grey;"
            v-if="option.idOption != 0" v-model="option.from">
          <input type="number"
            style="width: 100px; height: 50px;text-align: center; border: none;border-left:1px solid Grey;"
            v-if="option.idOption != 0" v-model="option.to">
          <p v-if="option.isRequired" style="width: 20px; float: right;text-align: center;color: red"> * </p>
        </div>
        <div class="ml-50" style="text-align: center; width: 100%; height: 50px">NameObject:
          <input style="text-align: center; width: 70%; height: 40px;" placeholder="name object" v-model="nameObject" />
          <p style="width: 20px; float: right;text-align: center;color: red"> * </p>
        </div>
        <div class="has-text-centered mt-5 ">
          <button class="button is-primary mt-100" @click="createObject()">Tạo</button>
        </div>
      </div>
      <div class="column is-3 ml-2" v-if="isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"><strong> {{isShowDetail ? 'Xem Object ': 'Cập nhật Object'}} </strong> </p>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;font-size: 15px"
          v-for="option in optionsUpdate" :key="option.title">
          <p class="column ">{{option.title}}</p>
          <Dropdown v-if="option.idOption == 0" class="column" @clicked="onClickChild" :object="option"
            :id="option.idOption" :title="option.value" :type="OBJECT_CONST.DROP_DOWN.OBJECT_UPDATE"
            :items="option.listItems">{{option.value}}</Dropdown>
          <input type="number"
            style="width: 100px; height: 70px; text-align: center;border: none;border-left:1px solid Grey;"
            v-if="option.idOption != 0" v-model="option.from">
          <input type="number"
            style="width: 100px; height: 70px;text-align: center;border: none;border-left:1px solid Grey;"
            v-if="option.idOption != 0" v-model="option.to">
          <p v-if="option.isRequired" style="width: 20px; float: right;text-align: center;color: red"> * </p>
        </div>
        <div class="ml-50" style="text-align: center; width: 100%; height: 50px">NameObject:
          <input style="text-align: center; width: 70%; height: 40px" placeholder="name object" v-model="nameObject" />
          <p style="width: 20px; float: right;text-align: center;color: red"> * </p>
        </div>
        <div class="has-text-centered " v-if="!isShowDetail">
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
          <table class="table is-bordered is-fullwidth  has-text-centered mt-3" style="font-size: 13px">
            <thead style="backgroundColor: #3298dc">
              <th>ID Object</th>
              <th>Tên</th>
              <th>Số lượng user</th>
              <th>Số lượng user hiện tại</th>
              <th v-for="option in options" :key="option.title">{{option.title}} </th>
              <th>Thời gian tạo</th>
              <th
                v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                Hành động</th>
            </thead>
            <tbody>
              <tr v-for="object in dataListObject" :key="object._id"
                :style="[object._id == idObjectUpdate ? {backgroundColor: '#48c774'} : {backgroundColor: 'none'}]">
                <td @click="showDetailObject(object)"><a>OBJECT_{{object.seq}}</a></td>
                <td>{{object.nameObject}}</td>
                <td>{{object.totalUser}}</td>
                <td>{{object.totalCurrentUser}}</td>
                <td>{{object.channelPayment}}</td>
                <td>{{object.totalCost.from}} - {{object.totalCost.to}}</td>
                <td>{{object.numberPay.from}} - {{object.numberPay.to}}</td>
                <td>{{object.totalGame.from}} - {{object.totalGame.to}}</td>
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
            <strong> Danh sách UID: (số lương {{dataUsersByCreatingObject.length}}) </strong>
            <button @click="filterUserByUId()" class="button   is-primary is-small  mr-0" style="float: right">Tìm
              kiếm</button>
            <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterUserByUId"
              style="float: right;width: 10%; height: 30px" />
            <button @click="addUserToGroup()" class="button  is-primary is-small mr-5" style="float: right">Add
              User</button>
            <input class="input is-primary is-medium" v-model="idUserAdded" @keydown.enter="addUserToGroup"
              style="float: right;width: 10%; height: 30px" />

          </div>
          <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
            <thead style="backgroundColor: #3298dc">
              <th>UID</th>
              <th>Kênh nạp</th>
              <th>Số tiền đã nạp</th>
              <th>Số lần nạp</th>
              <th>Số ván chơi</th>
              <th>Gói mua gần nhất(MMK)</th>
              <th>Thời gian tạo</th>
              <th>Thời gian online gần nhất</th>
              <th>Kênh chơi</th>

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
          <div class="button is-primary" style="float: right" @click="clearDataObjectCreating()"> OK </div>
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


    created() {
      if (this.propObjectDetail) {
        this.isShowUpdate = true;
        this.beforUpdateObject(this.propObjectDetail);
        this.isShowDetail = true;
      }
    },
    props: ['propObjectDetail'],


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
        nameObject: '',
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
        objectUpdate: Object(),
        objectDetail: Object(),
        isShowDetail: false,
        idUserAdded: ''
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
              if (i == 'age' || i == 'timeLastOnline') {
                object.title = TimeUtil.convertDuration(parseInt(options[i].listItem[j].from)) + '-' + TimeUtil
                  .convertDuration(
                    parseInt(options[i].listItem[j].to));
              } else {
                object.title = options[i].listItem[j].from +
                  '-' + options[i].listItem[j].to;
              }
            }
            options[i].listItems.push(object);
          }
          if (i == 'channelPayment') {
            options[i].value = options[i].listItems[0].title
          } else {
            options[i].from = options[i].listItems[0].title.split('-')[0];
            options[i].to = options[i].listItems[0].title.split('-')[1];
          }

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
        console.log("createObject ", this.options);
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
            if(res.data.errorCode == ERROR_CODE.EXIST) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Tên Nhóm Object đã tồn tại!";
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
                console.log('==== lisst user ', this.dataObjectCreating);
                // this.dataObjectCreating.totalCurrentUser = this.dataObjectCreating.totalUser;
                this.totalData.unshift(this.dataObjectCreating);
                this.paginationObject.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE);
                this.dataListObject = this.paginationObject.getDataByPage(1);
                if (res.data.errorCode == ERROR_CODE.EMPTY) {
                  this.isVisibleNoti = Math.round(+new Date() / 1000);
                  this.notiText = "Không có user nào!";
                  this.notiState = "danger";
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
        this.dataUsersByCreatingObject = [],
          this.dataObjectCreating = null;
        this.nameObject = '';
        this.totalPageUser = 0;
        this.isShowUser = false;
        this.isShowDetail = false;
      },

      beforUpdateObject(object) {
        this.idObjectUpdate = -9999;
        this.isShowDetail = false;
        console.log("beforUpdateObject ", this.idObjectUpdate)
        this.cancleUpdate();
        this.objectUpdate = object;
        // this.idObjectUpdate = object._id;
        this.nameObject = object.nameObject;
        this.isShowUpdate = true;
        for (var i in this.optionsUpdate) {
          this.optionsUpdate[i].isShow = true;
          if (object[i].from != null) {
            if (this.optionsUpdate[i].idOption == 6 || this.optionsUpdate[i].idOption == 5) {
              this.optionsUpdate[i].from = this.timeUtil.convertDuration(object[i].from);
              this.optionsUpdate[i].to = this.timeUtil
                .convertDuration(object[i].to);
            } else {

              this.optionsUpdate[i].from = object[i].from;
              this.optionsUpdate[i].to = object[i].to;
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

        if (body.dataModify == null) return;

        if (!Utils.checkDuplicateData(body.dataModify, this.objectUpdate)) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Dữ liệu cập nhật không đổi";
          this.notiState = "danger";
          return;
        }
        this.idObjectUpdate = -9999;

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
                this.totalData.splice(this.totalData.findIndex(v => v._id == this.objectUpdate._id), 1);
                this.totalData.unshift(res.data.data);
                this.totalData.sort(
                  function (o1, o2) {
                    return o2.createAt - o1.createAt;
                  });
                this.paginationObject.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE);
                this.dataListObject = this.paginationObject.getDataByPage(1);
                this.idObjectUpdate = res.data.data._id;
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
        // if (!this.validateParamObject(data)) {
        //   // alert("not enough");
        //   console.log("====  getDataBodyObject");
        //   this.isVisibleNoti = Math.round(+new Date() / 1000);
        //   this.notiText = "Thông tin còn thiếu hoặc không hợp lệ!";
        //   this.notiState = "danger";
        //   return null;
        // }

        let body = {
          totalGame: {
            from: parseInt(data.totalGame.from),
            to: parseInt(data.totalGame.to)
          },
          channelPayment: data.channelPayment.value,
          totalCost: {
            from: parseInt(data.totalCost.from),
            to: parseInt(data.totalCost.to)
          },
          numberPay: {
            from: parseInt(data.numberPay.from),
            to: parseInt(data.numberPay.to)
          },
          lastPaidPack: {
            from: parseInt(data.lastPaidPack.from),
            to: parseInt(data.lastPaidPack.to)
          },
          age: {
            from: parseInt(data.age.from) * OBJECT_CONST.TIME.DAY,
            to: parseInt(data.age.to) * OBJECT_CONST.TIME.DAY,
          },
          timeLastOnline: {
            from: parseInt(data.timeLastOnline.from) * OBJECT_CONST.TIME.DAY,
            to: parseInt(data.timeLastOnline.to) * OBJECT_CONST.TIME.DAY,
          },
          channelGame: {
            from: parseInt(data.channelGame.from),
            to: parseInt(data.channelGame.to)
          },

          nameObject: this.nameObject
        };
        if(body.nameObject.trim() == "") {
            console.log("====  getDataBodyObject");
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Vui lòng đặt tên hợp lệ!";
          this.notiState = "danger";
          return null;
        }
        return body;
      },

      cancleUpdate() {
        this.isShowUpdate = false;
        this.dataUsersByCreatingObject = [];
        this.dataObjectCreating = [];
        // this.idObjectUpdate = '';
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
          if (data[i].value) {
            if (data[i].value == "") {
              console.log("validateParamObject ", data[i]);
              return false;
            }
          } 
          else if (data[i].from.length == 0 || data[i].from == null || data[i] == null || data[i] == "" || data[i].to
            .length == 0 || data[i].to == null) {
            console.log("validateParamObject ", data[i]);

            return false;
          } else if (parseInt(data[i].from) >= parseInt(data[i].to)) {
            console.log("validateParamObject ", data[i]);

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
        console.log(obj);
        this.beforUpdateObject(obj);
        this.isShowUpdate = true;
        this.isShowDetail = true;
        this.dataObjectCreating = obj;
        this.totalPageUser = Math.ceil(obj.totalUser / OBJECT_CONST.PAGE.NUM_PER_PAGE);
        this.getDataUserByPage(1);
      },

      filterUserByUId() {
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
            userId: this.search.toLowerCase(),
            groupObject: this.dataObjectCreating._id
          }
        };
        APICaller.get(
          "tracking_user/search_user_by_group",
          header,
          function (res) {
            if (res.data.data == null) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Không tìn thấy user nào.";
              this.notiState = "danger";
              return;
            }
            let dataUserByCreatingObject = res.data.data;
            var channel = CHANNEL_PAYMENT[GameData.getGameId()][this.dataObjectCreating.channelPayment + ''];
            dataUserByCreatingObject.channel = dataUserByCreatingObject.channelPayment[
              channel].channel;
            dataUserByCreatingObject.numberPay = dataUserByCreatingObject.channelPayment[
              channel].number;
            dataUserByCreatingObject.totalCost = dataUserByCreatingObject.channelPayment[
              channel].cost;
            this.dataUsersByCreatingObject = [];
            this.dataUsersByCreatingObject.push(dataUserByCreatingObject);
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
        // this.dataUsersByCreatingObject = this.dataUsersByCreatingObject.filter(item => {
        //   return item._id.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        // })
      },

      updateDataModalAlert(title, callBack) {
        this.modalAlert_isVisible = true;
        this.modalAlert_title = title;
        this.modalAlert_cbApprove = callBack;
        this.modalAlert_cbCancle = function () {
          this.modalAlert_isVisible = false;
        }.bind(this);
      },

      addUserToGroup() {
        if (this.dataObjectCreating == null) return;
        if (this.idUserAdded == '' || this.idUserAdded.length == 0) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "UID không hợp lệ.";
          this.notiState = "danger";
          return;
        }
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
            uId: this.idUserAdded.toLowerCase(),
            groupId: this.dataObjectCreating._id
          }
        };
        APICaller.get(
          "group_objects/add_user_to_group",
          header,
          function (res) {
            console.log("======== add_user_to_group", res);
            if (res.data.errorCode == 1) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Thêm User lỗi!.";
              this.notiState = "danger";
            }
            else if (res.data.data.ok) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Thêm user thành công.";
              this.notiState = "success";
              this.isShowUser = false;
              this.getDataListObject();
            }

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
      }

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
