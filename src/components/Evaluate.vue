<template>
  <div>
    <Navigation></Navigation>
    <p class="title has-text-centered" style="width: 100%; float: left"></p>
    <div>
      <table class="table is-bordered is-fullwidth has-text-centered mt-3" style="font-size: 15px">
        <thead style="backgroundColor: #3298dc">
          <th>Group Offer</th>
          <th>Group Object</th>
          <th>Time Start</th>
          <th>Time Finish</th>
          <th>Số người nhận</th>
          <th>Số hiển thị</th>
          <th>Số mua</th>
          <th>Giá bán</th>
          <th>Rev</th>
          <th>% Buy/Show</th>
        </thead>
        <tbody>
          <tr v-for="offerLive in dataListOffersLive" :key="offerLive._id"  :style="[ offerLive.groupOffer && offerLive.groupObject && offerLive.timeFinish >= Math.round(+new Date() / 1000)?
               { backgroundColor: 'azure'} 
               : { backgroundColor : 'pink'}]">
            <td>{{offerLive.groupOffer? offerLive.groupOffer.nameOffer : 'deleted'}} </td>
            <td>{{offerLive.groupObject? offerLive.groupObject.nameObject : 'deleted'}} </td>
            <td>{{moment.unix(offerLive.timeStart).format("MM/DD/YYYY H:mm:ss")}} </td>
            <td>{{moment.unix(offerLive.timeFinish).format("MM/DD/YYYY H:mm:ss")}} </td>
            <td>{{offerLive.totalReceived}} </td>
            <td>{{offerLive.totalShow}} </td>
            <td>{{offerLive.totalBought}} </td>
            <td>{{offerLive.groupOffer? offerLive.groupOffer.promotionCost : 'deleted'}} </td>
            <td>{{offerLive.groupOffer ? offerLive.groupOffer.promotionCost * offerLive.totalBought : 'deleted'}} </td>
            <td>{{offerLive.totalBought == 0 || offerLive.totalShow == 0 ? 0 : Math.ceil(offerLive.totalBought / offerLive.totalShow * 100)}} </td>
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
        moment: moment
      }
    },

    mounted() {
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
            this.dataListOffersLive = res.data.data;
            console.log("dataListOffersLive ", this.dataListOffersLive);
            if (this.dataListOffersLive.length > 0) {
              for (let i in this.dataListOffersLive) {
                if(this.dataListOffersLive[i].groupOffer == null) continue;
                this.totalRevenue += this.dataListOffersLive[i].groupOffer.promotionCost * this.dataListOffersLive[i]
                  .totalBought;
              }
            }

          }.bind(this),

          function (error) {
            console.log("aaaa", error);
          }
        );
      }
    }
  }

</script>
<style scoped>
  .title {
    font-size: 15px;
  }

</style>
