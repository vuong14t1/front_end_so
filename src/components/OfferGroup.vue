<template>
  <div class="offfer">
    <Navigation :isVisible="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <p class="pt-5" style="text-align: center" @click="handleClickShowHistory()"> <strong> <a>
          {{dataHistory[0] ? 'Cập nhật lúc: ' + moment.unix(dataHistory[0].createAt ).format("MM/DD/YYYY H:mm:ss") : 'Chưa có cập nhật nào'}}
        </a> </strong></p>
    <div class="columns" style="width: 98%;float: left">
      <div class="column is-3" v-if="!isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered"><strong> Tạo Offer </strong> <span class="f"
            style="float: right; text-align: center;color: red"> * bắt buộc</span> </p>
        <form class="columns list-item ml-1" style=" width: 100%; border:1px solid Grey;font-size: 15px"
          v-for="option in options" :key="option.title">
          <!-- //normal -->
          <div v-if="!option.listItems && !option.type" class="column">{{option.title}}</div>
          <input v-if="!option.listItems && !option.type" v-model="option.value" class="column mr-0"
            :class="option.maxlength ?'input_offer_' + option.idOption : ''"
            style=" border: none;border-left:1px solid Grey;" @input="assertMaxChars(option)">

          <div v-if="!option.listItems && option.type" class="column">Loại</div>
          <div v-if="!option.listItems && option.type" class="column"><strong> {{option.title}} </strong></div>
          <input type="number" v-if="option.type == 'items'" placeholder="number" v-model="option.value"
            @change="onChangeValueChooseItem(option.value)"
            style="width: 100px; height: 55px; text-align: center; border: none;border-left:1px solid Grey;">
          <div v-if="option.listItems" class="column">{{option.title}}</div>
          <p class="column" v-if="option.listItems">
            <Dropdown v-if="option.listItems" class="column" @clicked="onClickChild" :id="option.idOption"
              :title="option.listItems[option.value].title" :items="option.listItems">
              {{option.value}}</Dropdown>
          </p>
          <p class="astisrik" v-if="option.isRequired" style="width: 20px; float: right;text-align: center;color: red">
            *</p>

        </form>
        <div class="has-text-centered ">
          <button class="button is-primary" @click="createOffer()">Tạo</button>
        </div>
      </div>
      <div class="column is-3 ml-2" v-if="isShowUpdate && isCanCreate" style="border:1px solid Grey;">
        <p class="has-text-centered	"><strong> {{isViewDetail ? ' Xem Offer' : ' Cập nhật Offer'}} </strong> <span
            class="f" style="float: right; text-align: center;color: red"> * required</span> </p>
        <form class="columns list-item ml-1" style="border:1px solid Grey;font-size: 15px"
          v-for="option in optionsUpdate" :key="option.title">
          <!-- //normal -->
          <div v-if="!option.listItems && !option.type" class="column">{{option.title}}</div>
          <input v-if="!option.listItems && !option.type" v-model="option.value" class="column mr-0"
            style=" border: none;border-left:1px solid Grey;" @input="assertMaxChars(option)">

          <div v-if="!option.listItems && option.type" class="column">Loại</div>
          <div v-if="!option.listItems && option.type" class="column"><strong> {{option.title}} </strong></div>
          <input type="number" v-if="option.type == 'items'" placeholder="number" v-model="option.value"
            @change="onChangeValueChooseItem(option.value)"
            style="width: 100px; height: 55px; text-align: center; border: none;border-left:1px solid Grey;">
          <div v-if="option.listItems" class="column">{{option.title}}</div>
          <p class="column" v-if="option.listItems">
            <Dropdown v-if="option.listItems" class="column" @clicked="onClickChild" :id="option.idOption"
              :title="option.listItems[option.value].title" :items="option.listItems">
              {{option.value}}</Dropdown>
          </p>
          <p v-if="option.isRequired" style="width: 20px; float: right;text-align: center;color: red"
            class="icon-asterisk"> * </p>

        </form>
        <div class="has-text-centered " v-if="!isViewDetail">
          <button class="button is-small is-primary" @click="sendUpdateOffer()">Cập nhật</button>
          <button class="button is-info is-small mr-3 ml-3 " @click="cancleUpdate()">Hủy</button>
        </div>
      </div>
      <div class="column mt-0 ml-2 rows columns is-centered is-vcentered" :class="isCanCreate ? 'is-9' : 'is-12'"
        style="border:1px solid Grey;  border-bottom-style: none;">
        <div class="row list-offers is-full">
          <div class="has-text-centered">
            <span><strong> Danh sách các OFFERS đã tạo </strong></span>
            <button class="button is-small is-primary mr-0 mb-2" @click="filterOffer()" style="float: right">Tìm
              kiếm</button>
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
              <tr v-for="offer in dataListOffer" :key="offer._id"
                :style="[offer._id == idOfferUpdate ? {backgroundColor: '#497059'} : {backgroundColor: 'none'}]">
                <td @click="viewDetailOffer(offer)"> <a> OFFER_{{offer.seq}} </a></td>
                <td>{{offer.nameOffer}}</td>
                <td v-for="type in offer.items" :key="type.type">{{type.value}} </td>
                <td>{{offer.originalCost}}</td>
                <td>{{offer.promotionCost}}</td>
                <td>
                  {{Math.round((parseInt(offer.originalCost)
                   - offer.promotionCost)/parseInt(offer.originalCost) * 100)}}
                  %</td>
                <td>{{ moment.unix(offer.createAt).format("MM/DD/YYYY H:mm:ss")}}</td>
                <td
                  v-if="GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1].id  ">
                  <button class="button is-small is-primary" @click="beforeUpdateOffer(offer)">Cập nhật</button>
                  <button class="button is-danger is-small" @click="beforDeleteOffer(offer)">Xóa</button>

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
        <!-- <div class="layout-demo rows is-centered is-vcentered has-text-centered" v-if="false"
          style="border:1px solid Grey;">
          <div class="row is-full" style="height=10%"><strong> Demo UI Offer </strong>
            <div class="mt-4">Tên Offer: <br> <strong> {{options.nameOffer.value}}</strong> </div>
            <div class="rotated">Giá trị Khuyến mãi
              <strong>
                {{options.originalCost.value == 0 ? " " :  Math.round((parseInt(options.originalCost.value - jsonConfig.OfferGroup.promotionCost.listItem[options.promotionCost.value].title)
                   )/parseInt(options.originalCost.value) * 100)}}
                % </strong> </div>
          </div>
          <div class="row columns is-full has-text-centered" style="text-align: center">
            <div class="column is-4" style="text-align: center">
              <p class="mt-2" style="height: 0px;
               background-color: powderblue; text-align: center">
                <p v-for="type in listItemTypeToChoose" :key="type">{{type}} - {{options[type].value}} </p>
                <br> <br>
            </div>
            <div class="column is-5">
              <div>Giá bán: <strong>
                  {{jsonConfig.OfferGroup.promotionCost.listItem[options.promotionCost.value].title }} </strong> </div>
              <p>Giá gốc: <strong><del>
                    {{options.originalCost.value }} </del> </strong>
              </p>
            </div>

          </div>
        </div> -->
        <div class="layout-demo rows is-centered is-vcentered has-text-centered" v-if="isCanCreate">
          <div class="columns mt-0">
            <div class="column is-8 offer_demo_name" style="color: white; text-align: center; font-size: 30px">
              {{  options.nameOffer.value.length > 0 ? options.nameOffer.value : 'Tên Offer'}}</div>
            <div class="column is-4" style="color: white; text-align: center; font-size: 30px"> Time remain</div>
          </div>
          <div class="columns mt-0">
            <div class="column is-1"
              style="width: 100px; float: left; color: white; text-align: center; font-size: 20px">
              {{options.originalCost.value == 0 ? " SALE" :  Math.round((parseInt(options.originalCost.value - jsonConfig.OfferGroup.promotionCost.listItem[options.promotionCost.value].title)
                   )/parseInt(options.originalCost.value) * 100)}}
              % OFF </div>
          </div>
          <!-- <div class="columns mt-0"> -->
          <div style="color: white; text-align: center; font-size: 30px"> <span><img
                src="../assets/image/img_so_icon_gold.png" width="30px" /> {{options.GOLD.value}}
              + <img src="../assets/image/img_so_icon_vip.png" width="30px" /> {{ options.V_POINT.value}} </span> </div>
          <div class="ml-5" style="color: white; text-align: center; font-size: 30px">
            <p style="color: green; text-align: center; font-size: 40px">
              {{jsonConfig.OfferGroup.promotionCost.listItem[options.promotionCost.value].title }} <span
                style="color: white; text-align: center; font-size: 30px"> <del>
                  {{options.originalCost.value.length > 0 ? options.originalCost.value : "Giá gốc"}} </del> </span> </p>
          </div>
          <div class="mt-5" style="text-align: center"> <img src="../assets/image/img_so_btn_buy.png" width="120px"
              height="50px" /> </div>
          <!-- </div> -->
        </div>
      </div>
      <div v-if="isShowHistory" style="background-color: #42b983;  border-radius:10px;
            position:absolute; top: 100px; right: 0px !important; float: right; width: 15%; height: 85%; overflow: auto; border: 1px grey radius
            z-index: 2; text-align: center">
        <p class="mt-5 title" style="font-size: 20px; color: white; ">Lịch sử chỉnh sửa</p>
        <div v-for="item in dataHistory" :key="item.time">
          <section class="accordions ml-4 mt-3 pl-3 pt-2 pb-3"
            style="backgroundColor: white; width: 90%; text-align: left;  border-radius:10px;">
            <article class="accordion is-active">
              <div class="accordion-header toggle">
                <p> {{ moment.unix(item.createAt).format("MM/DD/YYYY H:mm:ss")}} </p>
              </div>
              <div class="accordion-body">
                <div class="accordion-content">
                  <p> Account: <strong> {{item.author}} </strong> </p>
                  <p>{{item.msg}} </p>
                </div>
              </div>
            </article>
          </section>
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
  import GAME from '../const/game_const';
  import HISTORY_TAB from '../const/history_action_const';


  export default {
    name: 'OfferGroup',
    components: {
      Dropdown,
      Navigation,
      Modal,

    },

    created() {
      console.log("created ", this.propOfferDetail)
      if (this.propOfferDetail) {
        this.isShowUpdate = true;
        this.beforeUpdateOffer(this.propOfferDetail);
        this.isViewDetail = true;
        this.totalData.push(this.propOfferDetail);
        this.paginationOffer.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE_OFFER);
        this.dataListOffer = this.paginationOffer.getDataByPage(1)
      }
    },

    props: ['propOfferDetail'],

    mounted() {
      if (!this.propOfferDetail) {
        this.getDataListOffer();
      }
      this.isCanCreate = GameData.getRoleAccount() == ACCOUNT_ROLE[0].id || GameData.getRoleAccount() == ACCOUNT_ROLE[1]
        .id

      this.getDataHistory();
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
        moment: moment,
        OBJECT_CONST: OBJECT_CONST,
        listItemTypeToChoose: this.getListItemTypeToChoose(),
        isViewDetail: false,
        dataHistory: Array(),
        isShowHistory: false
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

      onClickChildChooseItem(item) {
        console.log("onClickChildChooseItem ", item, this.options);
        let data = this.isShowUpdate ? this.optionsUpdate : this.options;
        data.items.isShow = true;
        data.items.value = item.id;
        data.items.choosenItem = item.title;
      },

      handleAddNewItem() {
        //  var content = $('.sub-item').html();
        // $('.list-item').html(content);
        $('.sub-item').clone().appendTo('.list-item');
      },

      onChangeValueChooseItem(number) {
        console.log('onChangeValueChooseItem ', number, this.options);
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
            for (let i in this.totalData) {
              this.insertEmptyDataForOffer(this.totalData[i]);
            }
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
              let dataObject = res.data.data;
              this.insertEmptyDataForOffer(dataObject);
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

      insertEmptyDataForOffer(target) {
        for (let i in this.listItemTypeToChoose) {
          if (target.items.findIndex(v => v.type == i) == -1) {
            let obj = {
              type: parseInt(i),
              value: 0
            }
            target.items.push(obj);
          }
        }
      },

      getDataBodyOffer(isCreate) {
        if (isCreate) {
          var data = this.options;
        } else {
          var data = this.optionsUpdate;
        }
        console.log("data create " + JSON.stringify(data));
        if (!this.validateParamObject(data)) {
          // alert("not enough");
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Vui lòng điền hết thông tin!";
          this.notiState = "danger";
          return null;
        }
        if (data['GOLD']['value'] < 100000) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Giá trị GOLD yêu cầu phải lớn hơn 100K";
          this.notiState = "danger";
          return null;
        }
        // if (data['nameOffer']['value'].length > 13) {
        //   this.isVisibleNoti = Math.round(+new Date() / 1000);
        //   this.notiText = "Tên của offer tối đa chỉ 13 kí tự";
        //   this.notiState = "danger";
        //   return null;
        // }
        let body = new Object();
        console.log("data raw ", data);
        let items = [];

        for (let i in this.listItemTypeToChoose) {
          let number = data[this.listItemTypeToChoose[i] + ''].value;
          if (number === 0 || number === "" || isNaN(number)) continue;
          let item = {
            type: parseInt(i), // this.listItemTypeToChoose[i],
            value: parseInt(number)
          }
          items.push(item);
        }


        for (var i in data) {
          if (i == 'promotionCost') {
            body[i] = data[i].listItem[data[i].value].title;
          } else {
            body[i] = data[i].value;
          }
          // console.log("========", data[i]);
        }

        body.items = items;

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
        // this.idOfferUpdate = "";
        this.offerUpdate = null;
      },

      beforeUpdateOffer(offer) {
        console.log("beforeUpdateOffer ", offer)
        this.isViewDetail = false;
        this.offerUpdate = offer;
        this.isShowUpdate = true;
        for (var i in this.optionsUpdate) {
          if (i == 'promotionCost') {
            this.optionsUpdate[i].value = this.jsonConfig.OfferGroup.promotionCost.listItems.findIndex(v => parseInt(v
              .title) == parseInt(offer[i]));
          } else {
            this.optionsUpdate[i].value = offer[i];
            if (this.optionsUpdate[i].maxlength) {
              if (this.optionsUpdate[i].value.length >= this.optionsUpdate[i].maxlength / 2) {
                console.log("doday");
                $('.input_offer_' + this.optionsUpdate[i].idOption).css({
                  'font-size': '11px'
                })
              }
            }
          }
          this.optionsUpdate[i].isShow = true;
        }
        for (let i in offer.items) {
          this.optionsUpdate[this.listItemTypeToChoose[offer.items[i].type]].value = offer.items[i].value;
        }

        $('.offer_demo_name').css({
          'font-size': '20px'
        })
      },

      beforDeleteOffer(offer) {
        // this.idOfferUpdate = offer._id;
        this.offerUpdate = offer;
        this.sendDeleteOffer();
      },

      _checkDuplicateDataOffer(o1, o2){
          return JSON.stringify(o1.items) == JSON.stringify(o2.items) && o1.nameOffer == o2.nameOffer && o1.originalCost == o2.originalCost && o1.promotionCost == o2.promotionCost; 
      },  

      sendUpdateOffer() {
        let body = {
          idOffer: this.offerUpdate._id,
          dataModify: this.getDataBodyOffer(false)
        }
        console.log("dataModify ", body.dataModify);
        console.log("offerUpdate ", this.offerUpdate);

        if (this._checkDuplicateDataOffer(this.offerUpdate, body.dataModify)) {
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
              console.log("group_offers/edit", res)
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.insertEmptyDataForOffer(res.data.data);
                this.totalData.splice(this.totalData.findIndex(v => v._id == this.offerUpdate._id), 1);
                this.totalData.unshift(res.data.data);
                this.paginationOffer.handlePagination(this.totalData, OBJECT_CONST.PAGE.NUM_PER_PAGE_OFFER);
                this.dataListOffer = this.paginationOffer.getDataByPage(1);
                this.clearDataOfferCreating();
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thành công!";
                this.notiState = "success";
                this.idOfferUpdate = res.data.data._id;
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
          if (!data[i].isRequired) continue;
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
            if (options[i].isMultiChoice) {
              options[i].value = [];
            } else {
              options[i].value = options[i].listItems[1].id;
            }
          }
        }

        console.log("==== ", options)

        return options;
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

      updateDataModalAlert(title, callBack) {
        this.modalAlert_isVisible = true;
        this.modalAlert_title = title;
        this.modalAlert_cbApprove = callBack;
        this.modalAlert_cbCancle = function () {
          this.modalAlert_isVisible = false;
        }.bind(this);
      },

      viewDetailOffer(offer) {
        this.isShowUpdate = true;
        this.beforeUpdateOffer(offer);
        this.isViewDetail = true;
      },

      getDataHistory() {
        let header = {
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          params: {
            gameId: GameData.getGameId(),
            tab: HISTORY_TAB.OFFER
          }
        };
        APICaller.get(
          "history_action_route/list",
          header,
          function (res) {
            console.log("history_action_route/list", res);
            if (!res.data.errorCode == ERROR_CODE.SUCCESS) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Lấy lịch sử bị lỗi!.";
              this.notiState = "danger";
            } else {
              this.dataHistory = res.data.data.sort(function (o1, o2) {
                return o2.createAt - o1.createAt;
              });
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
      },

      handleClickShowHistory() {
        this.isShowHistory = !this.isShowHistory;
        this.getDataHistory();
      },

      assertMaxChars(object) {
        if (object.maxlength == null || object.maxlength == undefined) return;
        if (object.value.length >= object.maxlength / 2) {
          $('.input_offer_' + object.idOption).css({
            'font-size': '11px'
          })
          $('.offer_demo_name').css({
            'font-size': '20px'
          })
        }
        if (object.value.length >= object.maxlength) {
          object.value = object.value.substring(0, object.maxlength);
        }
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

  .layout-demo {
    /* height: 40%; */
    width: 70%;
  }

  .list-offers {
    height: 50%;
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

  p {
    word-break: break-all;
  }

  .tooltiptext {
    visibility: hidden;
    width: 150%;
  }

  .astisrik:hover .tooltiptext {
    visibility: visible;
  }

  .layout-demo {
    background-image: url("../assets/image/img_so_bg.png");
    height: 620px;
    width: 626px;
    background-repeat: no-repeat
  }

  del {
    text-decoration: line-through;
  }

</style>
