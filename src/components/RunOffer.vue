<template>
  <div>
    <Navigation :isVisible="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <div class="columns" v-if="!isShowDetail" style="width: 98%; float: left">
      <div class="column is-3 ml-2" v-if="!isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"><strong> Tạo lịch chạy OfferLive </strong></p>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">ID Object</p>
          <Dropdown @clicked="onClickChooseObject" v-if="objectChoosen" :object="objectChoosen" class="column"
            :id="objectChoosen._id" :title="'OBJECT_' + objectChoosen.seq + '_' + objectChoosen.nameObject" :items="dataListObject">
            OBJECT_{{objectChoosen.seq}}_{{objectChoosen.nameObject}} </Dropdown>
        </div>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">ID Offer</p>
          <Dropdown @clicked="onClickChooseOffer" v-if="offerChoosen" class="column" :id="offerChoosen._id"
            :title="'OFFER_' + offerChoosen.seq + '_' + offerChoosen.nameOffer" :items="dataListOffers"> OFFER_{{offerChoosen.seq}}_{{offerChoosen.nameOffer}} </Dropdown>
        </div>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">Thời gian bắt đầu</p>
          <datetime class="column" type="datetime" width="500px" v-model="offerLiveChoosen.timeStart"
            style="border:1px solid Grey;">
          </datetime>
        </div>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">Thời gian kết thúc</p>
          <datetime class="column" type="datetime" width="500px" height="100px" v-model="offerLiveChoosen.timeFinish"
            style="border:1px solid Grey;">
          </datetime>
        </div>

        <div class="has-text-centered ">
          <button class="button is-primary" @click="createOfferLive()">Tạo</button>
        </div>
      </div>
      <div class="column is-3 ml-2" v-if="isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"> <strong> Cập nhật OfferLive </strong></p>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">ID Object</p>
          <Dropdown v-if="objectChoosen" class="column" :object='objectChoosen' @clicked="onClickChooseObject"
            :id="objectChoosen._id" :title="'OBJECT_' + objectChoosen.seq + '_' + objectChoosen.nameObject" :items="dataListObject">
            OBJECT_{{objectChoosen.seq}}_{{objectChoosen.nameObject}}</Dropdown>
        </div>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">ID Offer</p>
          <Dropdown v-if="offerChoosen" class="column" @clicked="onClickChooseOffer" :id="offerChoosen._id"
            :title="'OFFER_' + offerChoosen.seq + '_' + offerChoosen.nameOffer" :items="dataListOffers"> OFFER_{{offerChoosen.seq}}_{{offerChoosen.nameOffer}} </Dropdown>
        </div>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">Thời gian tạo</p>
          <datetime class="column" type="datetime" width="200px" v-model="offerLiveChoosen.timeStart"
            style="border:1px solid Grey;">
            {{offerLiveChoosen.timeStart}}
          </datetime>
        </div>
        <div class="columns mt-5 has-text-centered" style="border:1px solid Grey;">
          <p class="column">Thời gian kết thúc</p>
          <datetime class="column" type="datetime" width="200px" v-model="offerLiveChoosen.timeFinish"
            style="border:1px solid Grey;">
          </datetime>
        </div>
        <div class="has-text-centered ">
          <button class="button is-small is-primary" @click="sendUpdateObject()">Cập nhật</button>
          <button class="button is-info is-small mr-3 ml-3 " @click="cancleUpdate()">Hủy</button>
          <!-- <button class="button is-small is-danger" @click="sendDeleteObject()">Delete</button> -->
        </div>
      </div>
      <div class="column ml-2 rows" :class="isCanCreate? 'is-9': 'is-12'" style="border:1px solid Grey;">
        <div class="row is-full" v-if="!dataUsersByCreatingObject.length > 0">
          <div class="has-text-centered">
            <span> <strong>Danh sách các OFFERS Đang chạy </strong></span>
            <button @click="filterObject()" class="button is-primary is-small mr-0 mb-2" style="float: right">Tìm
              kiếm</button>
            <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterObject"
              style="float: right;width: 10%; height: 30px" />

          </div>
          <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
            <thead style="backgroundColor: #3298dc">
              <th>ID OfferLive</th>
              <th>ID Offer</th>
              <th>ID Object</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Thời gian tạo</th>
              <th
                v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                Hành động</th>
            </thead>
            <tbody>
              <tr v-for="offerLive in dataListOffersLive" :key="offerLive._id" :style="[offerLive.groupOffer && offerLive.groupObject && offerLive.timeFinish >=
                 timeServer? 
                 offerLive._id == idOfferLiveUpdate ?
                   {backgroundColor: '#497059'}:  { backgroundColor : '#azure'} :  { backgroundColor: '#D3D3D3'} ]">
                <td @click="viewDetail(offerLive._id)"> <a> {{offerLive._id}} </a></td>
                <td>{{offerLive.groupOffer? 'OFFER_' + offerLive.groupOffer.seq : 'Không có'}}</td>
                <td>{{offerLive.groupObject? 'OBJECT_' + offerLive.groupObject.seq : 'Không có'}}</td>
                <td>{{ moment.unix(offerLive.timeStart).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td>{{ moment.unix(offerLive.timeFinish).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td>{{ moment.unix(offerLive.createAt).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td
                  v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                  <button class="button is-primary is-small" @click="beforUpdateObject(offerLive)">Cập nhật</button>
                  <button class="button is-danger is-small" @click="beforDeleteOfferLive(offerLive)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
    <Modal :isVisible.sync="modalAlert_isVisible" :title="modalAlert_title" :cbApprove="modalAlert_cbApprove"
      :cbCancle="modalAlert_cbCancle"></Modal>
    <div v-if="isShowDetail">
      <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
        <thead style="backgroundColor: #3298dc">
          <th>ID</th>
          <th>Group Offer</th>
          <th>Group Object</th>
          <th>Thời gian đếm ngược</th>
          <th>Loại - Số lượng</th>
          <th>Giá gốc</th>
          <th>Giá bán</th>
          <th>Thời gian bắt đầu</th>
          <th>Thời gian kết thúc</th>
          <th>Số lượng Users</th>
        </thead>
        <tbody>
          <tr>
            <td>{{ofrLiveDetail._id}}</td>
            <td @click="viewDetailLinkedGroupOffer(ofrLiveDetail.groupOffer)"><a>
                {{ofrLiveDetail.groupOffer? "OFFER_" + ofrLiveDetail.groupOffer.seq : 'Không có'}} </a></td>
            <td @click="viewDetailLinkedGroupObject(ofrLiveDetail.groupObject)"><a>
                {{ofrLiveDetail.groupObject? "OBJECT_" + ofrLiveDetail.groupObject.seq : 'Không có'}} </a> </td>
            <td>{{ofrLiveDetail.groupOffer ? ofrLiveDetail.groupOffer.durationCountDown : 'Không có'}}</td>
            <td>
              <p v-if="!ofrLiveDetail.groupOffer"> {{'Không có'}} </p>
              <span v-if="ofrLiveDetail.groupOffer">
                <p v-for="item in ofrLiveDetail.groupOffer.items" :key="item.type">
                  {{ listItemTypeToChoose[parseInt(item.type)] + '-' + item.value}}
                </p>
              </span>
            </td>
            <td>{{ofrLiveDetail.groupOffer ? ofrLiveDetail.groupOffer.originalCost : 'Không có'}}</td>
            <td>{{ofrLiveDetail.groupOffer ? ofrLiveDetail.groupOffer.promotionCost : 'Không có'}}</td>
            <td>{{moment.unix(ofrLiveDetail.timeStart).format("MM/DD/YYYY H:mm:ss")}} </td>
            <td>{{moment.unix(ofrLiveDetail.timeFinish).format("MM/DD/YYYY H:mm:ss")}} </td>
            <td>{{ofrLiveDetail.groupObject ? ofrLiveDetail.groupObject.totalUser : 'Không có'}}</td>
          </tr>
        </tbody>
      </table>
      <button class="button is-info" style="float: right" @click="isShowDetail = false">Quay lại</button>
    </div>
  </div>
</template>
<script>
  import Navigation from './Navigation'
  import Dropdown from './DropDown';
  import Pagination from '../Utility/Pagination';
  import TimeUtil from '../Utility/TimeUtility';
  import APICaller from '../network/APICaller';
  import moment from 'moment';
  import GameData from '../Utility/GameData';
  import ACCOUNT_ROLE from '../const/role_const'
  import Modal from './Modal';
  import ERROR_CODE, {
    SUCCESS
  } from '../const/error_code';

  import {
    Datetime
  } from 'vue-datetime'
  import 'vue-datetime/dist/vue-datetime.css'


  export default {
    name: 'RunOffer', //this is the name of the component
    components: {
      Navigation,
      Dropdown,
      datetime: Datetime,
      Modal
    },

    mounted() {
      GameData._getTimeServer(function (data) {
        console.log("time ", data);
        this.timeServer = data
      }.bind(this))
      this.getDataObject();
      this.getDataOffer();
      this.getDataOfferLive();
      this.isCanCreate = GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1]
        .id
    },

    data() {
      var gameID = GameData.getGameId();
      this.jsonConfig = require('../assets/json/' + gameID + '_config_so.json');
      if (this.jsonConfig == null) {
        alert(gameID + " hasnt registerd!");
        router.push('Login');
      }
      return {
        isShown: false,
        isShowUpdate: false,
        dataListObject: Array(),
        dataListOffers: Array(),
        objectChoosen: Object(),
        offerChoosen: Object(),
        dataListOffersLive: Array(),
        offerLiveChoosen: Object(),
        search: '',
        dataUsersByCreatingObject: Array(),
        dataObjectCreating: Object(),
        nameObject: 'default',
        totalData: Array(),
        idObjectUpdate: '',
        // gameId: 'p13',
        timeUtil: TimeUtil,
        moment: moment,
        GameData: GameData,
        ACCOUNT_ROLE: ACCOUNT_ROLE,
        isCanCreate: false,
        modalAlert_isVisible: false,
        modalAlert_title: "",
        modalAlert_cbApprove: "",
        modalAlert_cbCancle: "",
        notiText: "",
        notiState: "primary",
        isVisibleNoti: false,
        offerLiveUdate: Object(),
        isShowDetail: false,
        idOfferLiveUpdate: '',
        listItemTypeToChoose: this.getListItemTypeToChoose(),
        timeServer: ""
      }
    },

    methods: {
      getDataObject() {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        APICaller.get(
          "group_objects/get_list_group_object",
          header,
          function (res) {
            this.dataListObject = res.data.data;
            if (this.dataListObject.length > 0) {
              this.objectChoosen = this.dataListObject[0];
              console.log("=== objectChoosen ", this.objectChoosen);
            }
            for (let i in this.dataListObject) {
              this.dataListObject[i].title = "OBJECT" + this.dataListObject[i].seq + "_" + this.dataListObject[i].nameObject;
            }
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

      getDataOffer() {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        APICaller.get(
          "group_offers/get_list_group_offer",
          header,
          function (res) {
            this.dataListOffers = res.data.data;
            if (this.dataListOffers.length > 0) {
              this.offerChoosen = this.dataListOffers[0];
            }
            for (let i in this.dataListOffers) {
              this.dataListOffers[i].title = "OFFER_" + this.dataListOffers[i].seq + "_" + this.dataListOffers[i].nameOffer;
            }
            console.log("list group object " + JSON.stringify(this.dataListOffers));
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

      getDataOfferLive() {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        APICaller.get(
          "offer_lives/list",
          header,
          function (res) {
            console.log("list offer live " + JSON.stringify(res.data.data));
            this.dataListOffersLive = this.sortOffer(res.data.data);
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

      createOfferLive() {
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        let body = this.getBodyCreateOfferLive();
        if (!body) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Vui lòng điền đây đủ thông tin!";
          this.notiState = "danger";
          return;
        }
        console.log("body ", body);
        APICaller.post(
          "offer_lives/create",
          header,
          body,
          function (res) {
            if (res.data.errorCode == ERROR_CODE.SUCCESS) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Đã tạo thành công!";
              this.notiState = "success";
              console.log('====adata ', res.data.data);
              this.dataListOffersLive.unshift(res.data.data);
              this.cancleUpdate();
            } else {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Tạo thất bại!ErrorCode: " + res.data.errorCode;
              this.notiState = "danger";
            }
          }.bind(this),

          function (error) {
            console.log("aaaa", error);
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "Tạo thất bại!errorCode: " + console.error();;
            this.notiState = "danger";
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        );
      },

      getBodyCreateOfferLive() {
        let body = {};
        if (this.objectChoosen._id) {
          body.idObject = this.objectChoosen._id;
        } else {
          return false;
        }

        if (this.offerChoosen._id) {
          body.idOffer = this.offerChoosen._id;
        } else {
          return false;
        }

        if (this.offerLiveChoosen.timeStart) {
          body.timeStart = parseInt(moment(moment(this.offerLiveChoosen.timeStart).format()).format("X"));
        } else {
          return false;
        }

        if (this.offerLiveChoosen.timeFinish) {
          body.timeFinish = parseInt(moment(moment(this.offerLiveChoosen.timeFinish).format()).format("X"));
        } else {
          return false;
        }

        return body;
      },

      beforUpdateObject(offerLive) {
        this.idOfferLiveUpdate = '';
        this.cancleUpdate();
        if (this.dataListObject[0] == null && offerLive.groupObject == null) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Không có sẵn Object";
          this.notiState = "danger";
          this.objectChoosen = Object();
          return;
        }
        if (this.dataListOffers[0] == null && offerLive.groupOffer == null) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Không có sẵn Offer! ";
          this.notiState = "danger";
          this.offerChoosen = Object();
          return;
        }
        this.offerLiveUdate = offerLive;
        this.objectChoosen = offerLive.groupObject ? offerLive.groupObject : this.dataListObject[0];
        this.offerChoosen = offerLive.groupOffer ? offerLive.groupOffer : this.dataListOffers[0];

        this.offerLiveChoosen.timeStart = moment.unix(offerLive.timeStart).format()
        this.offerLiveChoosen.timeFinish = moment.unix(offerLive.timeFinish).format()
        this.offerLiveChoosen._id = offerLive._id;
        this.isShowUpdate = true;
        console.log("beforUpdateObject1 ", this.offerChoosen);
        console.log("beforUpdateObject2 ", this.objectChoosen);

      },

      beforDeleteOfferLive(offerLive) {
        this.offerLiveChoosen._id = offerLive._id;
        this.sendDeleteObject();
      },

      checkDuplicateChangeOfferLive(old, newVal) {
        if (old.groupObject ? old.groupObject._id != newVal.groupObject : newVal.groupObject != null) {
          return true
        } else if (old.groupOffer ? old.groupOffer._id != newVal.groupOffer : newVal.groupOffer != null) {
          return true;
        } else if (old.timeStart != newVal.timeStart) {
          return true;
        } else if (old.timeFinish != newVal.timeFinish) {
          return true;
        } else {
          return false;
        }
      },

      sendUpdateObject() {
        let body = {
          idOfferLive: this.offerLiveChoosen._id,
          dataModify: {
            groupObject: this.objectChoosen._id,
            groupOffer: this.offerChoosen._id,
            timeStart: parseInt(moment(moment(this.offerLiveChoosen.timeStart).format()).format("X")),
            timeFinish: parseInt(moment(moment(this.offerLiveChoosen.timeFinish).format()).format("X"))
          }
        }
        if (!this.checkDuplicateChangeOfferLive(this.offerLiveUdate, body.dataModify)) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Dữ liệu cập nhật không đổi";
          this.notiState = "danger";
          return;
        }
        this.modalAlert_isVisible = true;
        var updateOfferLiveCB = function () {
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

          APICaller.post(
            "offer_lives/edit",
            header,
            body,
            function (res) {
              console.log("res", res);
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thành công!";
                this.notiState = "success";
                this.dataListOffersLive.splice(this.dataListOffersLive.findIndex(v => v._id == this.offerLiveChoosen
                    ._id),
                  1);
                this.dataListOffersLive.unshift(res.data.data);
                this.idOfferLiveUpdate = res.data.data._id;
                this.cancleUpdate();
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thất bại!errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }

            }.bind(this),

            function (error) {
              console.log("aaaa", error);
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "update offferLive fail; errorCode: " + error;
              this.notiState = "danger";
            }.bind(this),
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          );
        }
        this.updateDataModalAlert("Bạn có muốn cập nhật? ", updateOfferLiveCB.bind(this))
      },

      sortOffer(offer) {
        console.log("sortOfferbefore ", offer);
        offer.sort(function (o1, o2) {
          if (o2.groupObject == null || o2.groupOffer == null) {
            if (o1.groupObject != null && o1.groupOffer != null) {
              return -1;
            }
          }

          if (o1.groupObject == null || o2.groupOffer == null) {
            if (o2.groupObject != null && o1.groupOffer != null) {
              return 1;
            }
          }

          if (o1.timeFinish >= this.timeServer) {
            if (o2.timeFinish < this.timeServer) {
              return -1;
            } else {
              // return 1;
            }
          }

          if (o2.timeFinish >= this.timeServer) {
            if (o1.timeFinish < this.timeServer) {
              return 1;
            } else {
              // return -1;
            }
          }
          return o2.createAt - o1.createAt;
        }.bind(this));
        return offer;
      },

      cancleUpdate() {
        this.isShowUpdate = false;
        this.offerLiveChoosen.timeStart = null;
        this.offerLiveChoosen.timeFinish = null;
        this.objectChoosen = this.dataListObject[0] ? this.dataListObject[0] : Object();
        this.offerChoosen = this.dataListOffers[0] ? this.dataListOffers[0] : Object();
      },

      sendDeleteObject() {
        this.modalAlert_isVisible = true;
        var deleteOfferLiveCB = function () {
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
            idOfferLive: this.offerLiveChoosen._id,
          }
          console.log("sendDeleteObject ", this.offerLiveChoosen);
          APICaller.post(
            "offer_lives/delete",
            header,
            body,
            function (res) {
              if (res.data.errorCode == SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thành công!";
                this.notiState = "success";
                console.log("deleted ", res);
                this.dataListOffersLive.splice(this.dataListOffersLive.findIndex(v => v._id == this.offerLiveChoosen
                    ._id),
                  1);
                this.cancleUpdate();
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thất bại!errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }

            }.bind(this),

            function (error) {
              console.log("aaaa", error);
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Xóa thất bại! errorCode: " + error;
              this.notiState = "danger";
            },
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          );
        }
        this.updateDataModalAlert("Bạn có muốn xóa? ", deleteOfferLiveCB.bind(this))
      },

      filterObject() {
        this.dataListOffersLive = this.dataListOffersLive.filter(item => {
          return item._id.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      },

      onClickChooseOffer(item) {
        this.offerChoosen = item;
      },

      onClickChooseObject(item) {
        this.objectChoosen = item;
      },

      updateDataModalAlert(title, callBack) {
        this.modalAlert_isVisible = true;
        this.modalAlert_title = title;
        this.modalAlert_cbApprove = callBack;
        this.modalAlert_cbCancle = function () {
          this.modalAlert_isVisible = false;
        }.bind(this);
      },

      viewDetail(idOfferLive) {
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
            idOfferLive: idOfferLive
          }
        };

        APICaller.get(
          "offer_lives/show_detail",
          header,
          function (res) {
            console.log("show Detail ", res);
            if (res.data.errorCode == SUCCESS) {
              this.isShowDetail = true;
              this.ofrLiveDetail = res.data.data;
            } else {

            }

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

      getListItemTypeToChoose() {
        var listItemTypeToChoose = [];
        var options = this.jsonConfig.OfferGroup;
        for (let i in options) {
          if (options[i].type && options[i].type == "items") {
            listItemTypeToChoose.push(options[i].title);
          }
        }
        console.log("getListItemTypeToChoose ", listItemTypeToChoose);
        return listItemTypeToChoose;
      },

      viewDetailLinkedGroupOffer(groupOffer) {
        if (groupOffer == null) {
          return;
        }
        let propOfferDetail = groupOffer;
        this.$router.replace({
          name: 'OfferGroup',
          params: {
            propOfferDetail
          }
        });
      },

      viewDetailLinkedGroupObject(groupObject) {
        if (groupObject == null) {
          return;
        }
        let propObjectDetail = groupObject;
        this.$router.replace({
          name: 'ObjectGroup',
          params: {
            propObjectDetail
          }
        });
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

  /* tr:nth-child(even) {
    background-color: azure;
  } */

</style>
