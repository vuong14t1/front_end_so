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
          <th>Group Offer</th>
          <th>Group Object</th>
          <th>Thời gian bắt đầu</th>
          <th>Thời gian kết thúc</th>
          <th>Số người nhận</th>
          <th>Số hiển thị</th>
          <th>Số mua</th>
          <th>Giá bán</th>
          <th>Rev</th>
          <th>% Mua/Hiển thị</th>
          <th>Thời gian tạo</th>
        </thead>
        <tbody>
          <tr v-for="offerLive in dataListOffersLive" :key="offerLive._id" :style="[ offerLive.groupOffer &&
           offerLive.groupObject && offerLive.timeFinish >=timeServer?
               { backgroundColor: 'azure'} 
               : { backgroundColor : '#D3D3D3'}]">
            <td>{{offerLive._id}}</td>
            <td @click="viewDetailGroupOffer(offerLive.groupOffer)">
              <a> {{offerLive.groupOffer? offerLive.groupOffer.nameOffer : 'Không có'}} </a> </td>
            <td @click="viewDetailGroupObject(offerLive.groupObject)">
              <a> {{offerLive.groupObject? offerLive.groupObject.nameObject : 'Không có'}} </a> </td>
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
        timeServer: ""
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
            this.dataListOffersLive = res.data.data.sort(function(o1, o2){
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
      }
    }
  }

</script>
<style scoped>
  .title {
    font-size: 15px;
  }

</style>
