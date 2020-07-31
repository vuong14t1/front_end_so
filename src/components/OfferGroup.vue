<template>
  <div class="offfer">
    <Navigation :isVisibleNotify="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <div class="columns" style="width: 98%;float: left">
      <div class="column is-3" v-if="!isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered"><strong> Tạo Offer </strong></p>
        <form class="columns ml-1" style="border:1px solid Grey;font-size: 15px" v-for="option in options"
          :key="option.title">
          <div v-if="!option.listItems" class="column">{{option.title}}</div>
          <input v-if="!option.listItems" v-model="option.value" class="column mr-0">
          <p class="column " v-if="option.listItems">{{option.title}}</p>
          <Dropdown v-if="option.listItems" class="column" @clicked="onClickChild" :id="option.idOption"
            :title="option.listItem[option.value].title" :items="option.listItems">{{option.value}}</Dropdown>
        </form>
        <div class="has-text-centered ">
          <button class="button is-primary" @click="createOffer()">Create</button>
        </div>
      </div>
      <div class="column is-3 ml-2" v-if="isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"><strong> Cập nhật Offer </strong></p>
        <form class="columns ml-1" style="border:1px solid Grey;font-size: 15px" v-for="option in optionsUpdate"
          :key="option.title">
          <div v-if="!option.listItems" class="column">{{option.title}}</div>
          <input v-if="!option.listItems" v-model="option.value" class="column mr-0">
          <Dropdown v-if="option.listItems" class="column" @clicked="onClickChild" :id="option.idOption"
            :title="option.title" :items="option.listItems"></Dropdown>
          <p class="column " style="border-left:1px solid Grey;" v-if="option.isShow && option.listItems">
            {{option.listItem[option.value].title}}</p>
        </form>
        <div class="has-text-centered ">
          <button class="button is-small is-primary" @click="sendUpdateOffer()">Update</button>
          <button class="button is-info is-small mr-3 ml-3 " @click="cancleUpdate()">Cancel</button>
          <!-- <button class="button is-small is-danger" @click="sendDeleteOffer()">Delete</button> -->

        </div>
      </div>
      <div class="column mt-0 ml-2 rows columns is-centered is-vcentered" :class="isCanCreate ? 'is-9' : 'is-12'"
        style="border:1px solid Grey;  border-bottom-style: none;">
        <div class="row list-offers is-full">
          <div class="has-text-centered">
            <span><strong> Danh sách các OFFERS </strong></span>
            <button class="button is-small is-primary mr-0 mb-2" @click="filterOffer()"
              style="float: right">Search</button>
            <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterOffer"
              style="float: right;width: 10%; height: 30px" />
          </div>
          <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
            <thead style="backgroundColor: #3298dc">
              <th>ID Offer</th>
              <th v-for="option in options" :key="option.title">{{option.title}} </th>
              <th>Giá trị khuyến mãi</th>
              <th>Thời gian tạo</th>
              <th
                v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                Hành động</th>
            </thead>

            <tbody>
              <tr v-for="offer in dataListOffer" :key="offer._id">
                <td>{{offer._id}}</td>
                <td>{{offer.nameOffer}}</td>
                <td>{{jsonConfig.OfferGroup.type.listItem[offer.type].title}}
                <td>{{offer.value}}</td>
                <td>{{offer.promotionCost}}</td>
                <td>{{jsonConfig.OfferGroup.originalCost.listItem[offer.originalCost].title}}</td>
                <td>{{offer.description}}</td>
                <td>{{offer.durationCountDown}} </td>
                <td>
                  {{Math.round((parseInt(jsonConfig.OfferGroup.originalCost.listItem[offer.originalCost].title)
                   - offer.promotionCost)/parseInt(jsonConfig.OfferGroup.originalCost.listItem[offer.originalCost].title) * 100)}}
                  %</td>
                <td>{{ moment.unix(offer.createAt).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td
                  v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                  <button class="button is-small is-primary" @click="beforeUpdateOffer(offer)">update</button>
                  <button class="button is-danger is-small" @click="beforDeleteOffer(offer)">delete</button>

                </td>
              </tr>
            </tbody>
          </table>
          <nav class="column is-full pagination mr-0 is-small" role="navigation" aria-label="pagination">
            <ul class="pagination-list">
              <li v-for="i in paginationOffer.totalPage" v-bind:key=i>
                <a class="pagination-link " :class="[i  - 1 == paginationOffer.curPage ?'is-current':'']"
                  @click="getDataListOfferByPage(i)">{{i}}</a>
              </li>
              <li> total page: {{paginationOffer.totalPage}} </li>
            </ul>
          </nav>
        </div>
        <div class="layout-demo rows is-centered is-vcentered has-text-centered" v-if="isCanCreate"
          style="border:1px solid Grey;">
          <div class="row is-full" style="height=10%">
            <div class="mt-4">Tên Offer: <br> <strong> {{options.nameOffer.value}}</strong> </div>
            <div class="rotated">Giá trị Khuyến mãi
              <strong> {{Math.round((parseInt(jsonConfig.OfferGroup.originalCost.listItem[options.originalCost.value].title)
                   - options.promotionCost.value)/parseInt(jsonConfig.OfferGroup.originalCost.listItem[options.originalCost.value].title) * 100)}}
              % </strong> </div>
          </div>
          <div class="row columns is-full has-text-centered" style="text-align: center">
            <div class="column is-4" style="text-align: center">
              <p class="mt-2" style="border:1px solid Grey;height: 100px;
               background-color: powderblue; text-align: center" >Loại: <br> <br> <strong>{{jsonConfig.OfferGroup.type.listItem[options.type.value].title}} </strong>
              </p>
              <p class="mt-4" style="word-break: break-all;">Số lượng: <strong>{{options.value.value}}</strong></p>
            </div>
            <div class="column is-5">
              <p style="height: 180px; text-align: center"> Mô tả: <br> <strong> {{options.description.value}} </strong></p>
              <div>Giá bán: <strong> {{options.promotionCost.value}} </strong> </div>
              <p>Giá gốc: <strong><del>  {{jsonConfig.OfferGroup.originalCost.listItem[options.originalCost.value].title}} </del> </strong>
              </p>
            </div>
            <div class="column is-3">
              <p style="height: 180px"></p>
              <p>Thời gian đếm ngược: <br><strong> {{options.durationCountDown.value}} </strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :isVisible.sync="modalAlert_isVisible" :title="modalAlert_title" :cbApprove="modalAlert_cbApprove"
      :cbCancle="modalAlert_cbCancle"></Modal>
  </div>
</template>

<script>
  import Dropdown from './DropDown';
  import Navigation from './Navigation'
  import APICaller from '../network/APICaller';
  import Pagination from '../Utility/Pagination';
  import OBJECT_CONST from '../const/object_const';
  import GameData from '../Utility/GameData';
  import GameConst from '../const/game_const';
  import ACCOUNT_ROLE, {
    push
  } from '../const/role_const';
  import Modal from './Modal';
  import ERROR_CODE from '../const/error_code';
  import Utils from '../Utility/Utils';
  import moment from 'moment';



  export default {
    name: 'OfferGroup',
    components: {
      Dropdown,
      Navigation,
      Modal,

    },

    mounted() {
      this.getDataListOffer();
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
        GameData: GameData,
        isShown: false,
        isShowUpdate: false,
        options: this.loadJsonOptions(),
        optionsUpdate: this.loadJsonOptions(),
        dataListOffer: Array(),
        paginationOffer: Pagination,
        search: '',
        dataOfferCreating: Object(),
        totalData: Array(),
        idOfferUpdate: "",
        GameConst: GameConst,
        // jsonConfig: jsonConfig,
        ACCOUNT_ROLE: ACCOUNT_ROLE,
        isCanCreate: false,
        modalAlert_isVisible: false,
        modalAlert_title: "",
        modalAlert_cbApprove: "",
        modalAlert_cbCancle: "",
        notiText: "",
        notiState: "primary",
        isVisibleNoti: false,
        offerUpdate: Object(),
        moment: moment
      }
    },
    methods: {
      onClickChild(item) {
        console.log("onClickChild ", item, this.isShowUpdate);
        let data = this.isShowUpdate ? this.optionsUpdate : this.options;
        for (let i in data) {
          if (data[i].idOption == item.idOption) {
            data[i].isShow = true;
            data[i].value = item.id;
            data[i].choosenItem = item.title;
            console.log("==== update data", data[i]);
            return;
          }
        }
      },

      getDataListOffer() {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };
        APICaller.get(
          "group_offers/list",
          header,
          function (res) {
            this.totalData = res.data.data.sort(function (o1, o2) {
              return o2.createAt - o1.createAt;
            });
            this.paginationOffer.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE_OFFER);
            this.dataListOffer = this.paginationOffer.getDataByPage(1)
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

      getDataListOfferByPage(page) {
        this.dataListOffer = this.paginationOffer.getDataByPage(page).sort(function (o1, o2) {
          return o2.createAt - o1.createAt;
        });
      },

      filterOffer() {
        this.dataListOffer = this.totalData.filter(item => {
          return item.nameOffer.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      },

      createOffer() {
        let header = {
          headers: {
            "content-type": "application/json"
          },
          params: {
            gameId: GameData.getGameId()
          }
        };

        let body = this.getDataBodyOffer(true);
        console.log("createOffer ", body);
        if (body == null) return;
        APICaller.post(
          "group_offers/create",
          header,
          body,
          function (res) {
            if (res.data.errorCode == ERROR_CODE.SUCCESS) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Tạo offer thành công!";
              this.notiState = "success";
              console.log("createOffer ", res)
              this.dataOfferCreating = res.data.data;
              this.totalData.unshift(this.dataOfferCreating);
              this.paginationOffer.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE_OFFER);
              this.dataListOffer = this.paginationOffer.getDataByPage(1);
              this.clearDataOfferCreating();
            } else {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Tạo offer thất bại! errorCode: " + res.data.errorCode;
              this.notiState = "danger";
            }

          }.bind(this),
          function (error) {
            console.log(error);
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "create offfer fail; errorCode: " + error;
            this.notiState = "danger";
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        );
      },

      getDataBodyOffer(isCreate) {
        if (isCreate) {
          var data = this.options;
        } else {
          var data = this.optionsUpdate;
        }
        if (!this.validateParamObject(data)) {
          // alert("not enough");
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Vui lòng điền hết thông tin!";
          this.notiState = "danger";
          return null;
        }
        let body = new Object();
        console.log("data raw ", data);
        for (var i in data) {
          // console.log("========", data[i]);
          body[i] = data[i].value;
        }
        console.log("data ", body);
        return body;
      },

      clearDataOfferCreating() {
        for (var i in this.options) {
          if (this.options[i].listItem != null) {
            this.options[i].value = this.options[i].listItems[0].id;
          } else {
            this.options[i].value = "";
          }
        }
        this.dataOfferCreating = [];
        this.isShowUpdate = false;
        this.idOfferUpdate = "";
        this.offerUpdate = null;
      },

      beforeUpdateOffer(offer) {
        // this.idOfferUpdate = offer._id;
        this.offerUpdate = offer;
        this.isShowUpdate = true;
        for (var i in this.optionsUpdate) {
          this.optionsUpdate[i].value = offer[i];
          this.optionsUpdate[i].isShow = true;
        }
      },

      beforDeleteOffer(offer) {
        // this.idOfferUpdate = offer._id;
        this.offerUpdate = offer;
        this.sendDeleteOffer();
      },

      sendUpdateOffer() {
        let body = {
          idOffer: this.offerUpdate._id,
          dataModify: this.getDataBodyOffer(false)
        }
        if (!Utils.checkDuplicateData(body.dataModify, this.offerUpdate)) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Dữ liệu cập nhật không đổi";
          this.notiState = "danger";
          return;
        }

        this.modalAlert_isVisible = true;
        var updateOfferCB = function () {
          this.modalAlert_isVisible = false;
          let header = {
            headers: {
              "content-type": "application/json"
            },
            params: {
              gameId: GameData.getGameId()
            }
          };

          APICaller.post(
            "group_offers/edit",
            header,
            body,
            function (res) {
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.dataListOffer.splice(this.dataListOffer.findIndex(v => v._id == this.offerUpdate._id), 1, res
                  .data
                  .data);
                this.clearDataOfferCreating();
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thành công!";
                this.notiState = "success";
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thất bại! errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }

            }.bind(this),
            function (error) {
              console.log("err edit", error);
              this.clearDataOfferCreating();
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "update offfer fail; errorCode: " + error;
              this.notiState = "danger";
            },
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          )
        }

        this.updateDataModalAlert("Bạn có muốn cập nhật? ", updateOfferCB.bind(this));

      },

      sendDeleteOffer() {
        this.modalAlert_isVisible = true;
        var deleteOffer = function () {
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
            idOffer: this.offerUpdate._id
          };
          APICaller.post(
            "group_offers/delete",
            header,
            body,
            function (res) {
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thành công!";
                this.notiState = "success";
                console.log("success delete", res);
                this.totalData.splice(this.totalData.findIndex(v => v._id == this.offerUpdate._id), 1);
                this.paginationOffer.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE_OFFER);
                this.dataListOffer = this.paginationOffer.getDataByPage(1)
                this.cancleUpdate();
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thất bại! errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }

            }.bind(this),
            function (error) {
              this.cancleUpdate();
              console.log("err delete", error);
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "delete offfer fail; errorCode: " + error;
              this.notiState = "danger";
            }.bind(this),
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          )
        }
        this.updateDataModalAlert("Bạn có chắc chắn muốn xóa không? ", deleteOffer.bind(this));
      },

      cancleUpdate() {
        // this.idOfferUpdate = '';
        this.offerUpdate = null;
        this.isShowUpdate = false;
        for (let i in this.optionsUpdate) {
          this.optionsUpdate[i].isShow = false;
        }
        this.clearDataOfferCreating();
      },

      validateParamObject(data) {
        for (var i in data) {
          if (data[i].value === "" || data[i].value == null) {
            return false;
          }
        }
        return true;
      },

      loadJsonOptions() {
        var options = this.jsonConfig.OfferGroup;
        for (let i in options) {
          if (options[i].listItem == null) {
            options[i].value = "";
          } else {
            options[i].isShow = false;
            options[i].listItems = [];
            for (let j in options[i].listItem) {
              var object = Object();
              object.id = parseInt(j);
              if (options[i].listItem[j].from == null) {
                object.title = options[i].listItem[j].title;
              } else {
                object.title = options[i].listItem[j].from +
                  '-' + options[i].listItem[j].to;
              }
              options[i].listItems.push(object);
            }
            options[i].value = options[i].listItems[0].id;
            console.log("===== ", options[i].value);
          }
        }
        return options;
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

  .layout-demo {
    /* height: 40%; */
    width: 70%;
  }

  .list-offers {
    height: 100%;
  }

  .rotated {
    transform: rotate(25deg);
    -webkit-transform: rotate(25deg);
    -moz-transform: rotate(25deg);
    -o-transform: rotate(25deg);
    float: right;

  }

  .offfer {
    height: 100%;
  }

  p{
    word-break: break-all;
  }

</style>
