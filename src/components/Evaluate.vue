<template>
  <div>
    <Navigation></Navigation>
    <!-- <p class="title has-text-centered" style="width: 100%; float: left"></p> -->
    <div style="width: 98%;float: left">
      <!-- <p class="title has-text-centered mt-100" style="width: 100%;  height: 0px;float: left"></p> -->
      <button @click="filterOfferLive()" class="button is-primary mb-2" style="float: right">Tìm kiếm</button>
      <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterOfferLive"
        style="float: right;width: 10%; height: 40px" />
    </div>
    <div>
      <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
        <thead style="backgroundColor: #3298dc">
          <th>Id</th>
          <th>ID Offer</th>
          <th>ID Object</th>
          <th @click="sortData(1)"><a> Thời gian bắt đầu </a><i class="fas fa-arrow-down arrow_1"></i> </th>
          <th @click="sortData(2)"><a> Thời gian kết thúc </a><i class="fas fa-arrow-down arrow_2"></i></th>
          <th @click="sortData(3)"><a> Số người nhận </a><i class="fas fa-arrow-down arrow_3"></i></th>
          <th @click="sortData(4)"><a> Số hiển thị </a><i class="fas fa-arrow-down arrow_4"></i></th>
          <th @click="sortData(5)"><a> Số mua </a><i class="fas fa-arrow-down arrow_5"></i></th>
          <th @click="sortData(6)"><a> Giá bán </a><i class="fas fa-arrow-down arrow_6"></i></th>
          <th @click="sortData(7)"><a> Rev </a><i class="fas fa-arrow-down arrow_7"></i></th>
          <th @click="sortData(8)"><a> % Mua/Hiển thị </a><i class="fas fa-arrow-down arrow_8"></i></th>
          <th @click="sortData(9)"><a> Thời gian tạo </a><i class="fas fa-arrow-down arrow_9"></i></th>
        </thead>
        <tbody>
          <tr v-for="offerLive in dataListOffersLive" :key="offerLive._id" :style="[ offerLive.groupOffer &&
           offerLive.groupObject && offerLive.timeFinish >=timeServer?
               { backgroundColor: 'azure'} 
               : { backgroundColor : '#D3D3D3'}]">
            <td>{{offerLive._id}}</td>
            <td @click="viewDetailGroupOffer(offerLive.groupOffer)">
              <a> {{offerLive.groupOffer? "OFFER_" + offerLive.groupOffer.seq : 'Không có'}} </a> </td>
            <td @click="viewDetailGroupObject(offerLive.groupObject)">
              <a> {{offerLive.groupObject? "OBJECT_" + offerLive.groupObject.seq : 'Không có'}} </a> </td>
            <td>{{moment.unix(offerLive.timeStart).format("MM/DD/YYYY H:mm:ss")}} </td>
            <td>{{moment.unix(offerLive.timeFinish).format("MM/DD/YYYY H:mm:ss")}} </td>
            <td>{{offerLive.totalReceived}} </td>
            <td>{{offerLive.totalShow}} </td>
            <td>{{offerLive.totalBought}} </td>
            <td>{{offerLive.groupOffer? offerLive.groupOffer.promotionCost : 'Không có'}} </td>
            <td>{{offerLive.groupOffer ? offerLive.groupOffer.promotionCost * offerLive.totalBought : 'Không có'}} </td>
            <td>
              {{offerLive.totalBought == 0 || offerLive.totalShow == 0 ? 0 : Math.ceil(offerLive.totalBought / offerLive.totalShow * 100)}}
            </td>
            <td>{{ moment.unix(offerLive.createAt).format("MM/DD/YYYY H:mm:ss")}}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <p class="title mt-5 has-text-centered"> Tổng số Offer đang chạy: {{dataListOffersLive.length}} </p>
    <p class="title has-text-centered"> Tổng Revenue : {{this.totalRevenue}} </p>
    <p>
      <ul>

      </ul>
    </p>
  </div>
</template>

<script>
  import Navigation from './Navigation'
  import APICaller from '../network/APICaller';
  import Pagination from '../Utility/Pagination';
  import moment from 'moment';
  import GameData from '../Utility/GameData';
  import router from '../router';

  export default {
    name: 'Evaluate',
    components: {
      Navigation
    },

    data() {
      return {
        // gameId: "p13",
        dataListOffersLive: Array(),
        totalRevenue: 0,
        moment: moment,
        search: '',
        timeServer: "",
        ascSortByTimeStart: true,
        ascSortByTimeFinish: true,
        ascSortByTotalReceived: true,
        ascSortByTotalShow: true,
        ascSortByTotalBought: true,
        ascSortByPromotionCost: true,
        ascSortByRevenue: true,
        ascSortByRateBuy: true,
        ascSortByTimeCreated: true,
      }
    },

    mounted() {
      GameData._getTimeServer(function (data) {
        console.log("time ", data);
        this.timeServer = data
      }.bind(this))
      this.getDataEvaluate();
    },

    methods: {
      getDataEvaluate() {
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
            this.dataListOffersLive = res.data.data.sort(function (o1, o2) {
              return o2.createAt - o1.createAt;
            });
            console.log("dataListOffersLive ", this.dataListOffersLive);
            if (this.dataListOffersLive.length > 0) {
              for (let i in this.dataListOffersLive) {
                if (this.dataListOffersLive[i].groupOffer == null) continue;
                this.totalRevenue += this.dataListOffersLive[i].groupOffer.promotionCost * this.dataListOffersLive[i]
                  .totalBought;
              }
            }

          }.bind(this),

          function (error) {
            console.log("aaaa", error);
          }
        );
      },

      filterOfferLive() {
        this.dataListOffersLive = this.dataListOffersLive.filter(item => {
          return item._id.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      },

      viewDetailGroupOffer(groupOffer) {
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

      viewDetailGroupObject(groupObject) {
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
      },

      sortData(idSort) {
        let checkSort = true;
        switch (idSort) {
          case 1:
            this.dataListOffersLive.sort(function (o1, o2) {
              if (this.ascSortByTimeStart) {
                return o1.timeStart - o2.timeStart;
              } else {
                return o2.timeStart - o1.timeStart;
              }
            }.bind(this))
            checkSort = this.ascSortByTimeStart;
            this.ascSortByTimeStart = !this.ascSortByTimeStart;
            break;
          case 2:
            this.dataListOffersLive.sort(function (o1, o2) {
              if (this.ascSortByTimeFinish) {
                return o1.timeFinish - o2.timeFinish;
              } else {
                return o2.timeFinish - o1.timeFinish;
              }
            }.bind(this))
            checkSort = this.ascSortByTimeFinish;
            this.ascSortByTimeFinish = !this.ascSortByTimeFinish;
            break;
          case 3:
            this.dataListOffersLive.sort(function (o1, o2) {
              if (this.ascSortByTotalReceived) {
                return o1.totalReceived - o2.totalReceived;
              } else {
                return o2.totalReceived - o1.totalReceived;
              }
            }.bind(this))
            checkSort = this.ascSortByTotalReceived;
            this.ascSortByTotalReceived = !this.ascSortByTotalReceived;
            break;
          case 4:
            this.dataListOffersLive.sort(function (o1, o2) {
              if (this.ascSortByTotalShow) {
                return o1.totalShow - o2.totalShow;
              } else {
                return o2.totalShow - o1.totalShow;
              }
            }.bind(this))
            checkSort = this.ascSortByTotalShow;
            this.ascSortByTotalShow = !this.ascSortByTotalShow;
            break;
          case 5:
            this.dataListOffersLive.sort(function (o1, o2) {
              if (this.ascSortByTotalBought) {
                return o1.totalBought - o2.totalBought;
              } else {
                return o2.totalBought - o1.totalBought;
              }
            }.bind(this))
            checkSort = this.ascSortByTotalBought;
            this.ascSortByTotalBought = !this.ascSortByTotalBought;
            break;
          case 6:
            console.log("ascSortByPromotionCost ", this.ascSortByPromotionCost);
            this.dataListOffersLive.sort(function (o1, o2) {
              let o1Val = o1.groupOffer == null ? null : o1.groupOffer.promotionCost;
              let o2Val = o2.groupOffer == null ? null : o2.groupOffer.promotionCost;
              if (this.ascSortByPromotionCost) {

                return o1Val - o2Val;
              } else {

                return o2Val - o1Val;
              }
            }.bind(this))
            checkSort = this.ascSortByPromotionCost;
            this.ascSortByPromotionCost = !this.ascSortByPromotionCost;
            break;
          case 7:
            console.log("ascSortByPromotionCost ", this.ascSortByPromotionCost);
            this.dataListOffersLive.sort(function (o1, o2) {
              let o1Val = o1.groupOffer == null ? null : o1.groupOffer.promotionCost * o1.totalBought;
              let o2Val = o2.groupOffer == null ? null : o2.groupOffer.promotionCost * o2.totalBought;
              if (this.ascSortByRevenue) {

                return o1Val - o2Val;
              } else {

                return o2Val - o1Val;
              }
            }.bind(this))
            checkSort = this.ascSortByRevenue;
            this.ascSortByRevenue = !this.ascSortByRevenue;
            break;
          case 8:
            this.dataListOffersLive.sort(function (o1, o2) {
              let o1Val = o1.totalShow == 0 ? 0 : o1.totalBought / o1.totalShow;
              let o2Val = o2.totalShow == 0 ? 0 : o2.totalBought / o2.totalShow;
              if (this.ascSortByRateBuy) {
                return o1Val - o2Val;
              } else {
                return o2Val - o1Val;
              }
            }.bind(this))
            checkSort = this.ascSortByRateBuy;
            this.ascSortByRateBuy = !this.ascSortByRateBuy;
            break;
          case 9:
            this.dataListOffersLive.sort(function (o1, o2) {
              if (this.ascSortByTimeCreated) {
                return o1.createAt - o2.createAt;
              } else {
                return o2.createAt - o1.createAt;
              }
            }.bind(this))
            checkSort = this.ascSortByTimeCreated;
            this.ascSortByTimeCreated = !this.ascSortByTimeCreated;
            break;
        }
        if (checkSort) {
          $('.arrow_' + idSort).css({
            '-webkit-transform': 'rotate(0deg)',
            '-moz-transform': 'rotate(0deg)',
            '-ms-transform': 'rotate(0deg)',
            '-o-transform': 'rotate(0deg)',
            'transform': 'rotate(0deg)',
          });
        } else {
          $('.arrow_' + idSort).css({
            '-webkit-transform': 'rotate(180deg)',
            '-moz-transform': 'rotate(180deg)',
            '-ms-transform': 'rotate(180deg)',
            '-o-transform': 'rotate(180deg)',
            'transform': 'rotate(180deg)',
          });
        }
      }
    }
  }

</script>
<style scoped>
  .title {
    font-size: 15px;
  }

</style>
