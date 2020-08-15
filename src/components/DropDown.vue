<template>
  <div class="menu-item" style="border:1px solid Grey;" >
    <div  @click="clickDropDown">
      <a class=" mt-0 " style="font-size: 15px; text-decoration: none; ">
      {{ titleName}}
      <i class="fa icon-arrow fa-arrow-circle-down fa-lg mybutton" :class="nameClassIcon" style="float: right"
        aria-hidden="true"></i>
    </a>
    </div>
    
    <div style="width: 100%; left:50%; right:50%;overflow: hidden; margin-right:20px;"
      class="sub-menu mr-6 mt-1 is-focus" v-if="isOpen">
      <div style="z-index: 100; width: 100%;  float: left; text-lign: center;" v-for="(item, i) in items" :key="i"
        class="menu-item  has-text-centered mr-6" :class="type == OBJECT_CONST.DROP_DOWN.LOGIN? '' : ' mt-1 pt-1'">
        <a style="height:40px; text-decoration: none;" :class="'item_' + id + '_' +  item.id" class="input item-input item-chosen ml-0 mt-0"
         :style="[type == OBJECT_CONST.DROP_DOWN.LOGIN ? {zIndex: 100} : {zIndex: 0}]"
          @click="onClickButton(item)">{{ item.title}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import OBJECT_CONST from '../const/object_const';
  import TimeUtil from '../Utility/TimeUtility';
  import lodash from 'lodash';
  import $ from 'jquery'
  export default {
    name: 'dropdown',
    props: ['id', 'title', 'items', 'type', 'object', 'notiText', 'isVisibleNoti'],
    updated() {
      if (this.type == OBJECT_CONST.DROP_DOWN.OBJECT_UPDATE) {
        this.convertTimeData();
      }
      this.titleName = this.title;
    },

    computed: {
      nameClassIcon() {
        return this.type + ""
      }
    },

    mounted() {
      this.titleName = this.title;
      this.convertTimeData();
    },

    created() {
      if (this.object && this.object.isMultiChoice) {
        this.isOpen = true;
        this.object.value = new Array();
      }
    },

    data() {
      return {
        isOpen: false,
        titleName: "",
        OBJECT_CONST: OBJECT_CONST,
        isMultiChoice: false
      }
    },
    methods: {
      onClickButton(item) {
        if (this.object && this.object.isMultiChoice) {
          this.onClickMultiItem(item);
          return;
        }
        item.idOption = this.id;
        this.titleName = item.title;
        this.isOpen = ! this.isOpen
        this.$emit('clicked', item)
      },

      onClickMultiItem(item) {
        let foundExistItem = this.object.value.findIndex(v => v == item.title);
        if (foundExistItem == -1) {
          this.object.value.push(item.title);
          item.chosen = true;
        } else {
          this.object.value.splice(foundExistItem, 1);
          item.chosen = false;
        }
         $('.item_' + this.id + "_" + item.id).css({
             backgroundColor: item.chosen == true ? '#3366cc' : 'azure'
           })
      },

      updateUI(){
        for(let i in this.items){
          $('.item_' + this.id + "_" + this.items[i].id).css({
             backgroundColor: this.items[i].chosen == true ? '#3366cc' : 'azure'
           })
        }
      },

      clickDropDown() {
        console.log("=clickDropDown ", this.items)
        if (this.isOpen) {
          $('.' + this.type).css({
            '-webkit-transform': 'rotate(0deg)',
            '-moz-transform': 'rotate(0deg)',
            '-ms-transform': 'rotate(0deg)',
            '-o-transform': 'rotate(0deg)',
            'transform': 'rotate(0deg)',
          });
        } else {
                  this.updateUI();

          $('.' + this.type).css({
            '-webkit-transform': 'rotate(180deg)',
            '-moz-transform': 'rotate(180deg)',
            '-ms-transform': 'rotate(180deg)',
            '-o-transform': 'rotate(180deg)',
            'transform': 'rotate(180deg)',
          });
        }
        // if (this.object && this.object.isMultiChoice) {

        // } else {
          this.isOpen = !this.isOpen;
        // }
        if (this.items == null || this.items.length <= 0) {
          console.log("khong co lua chon");
          alert("Không có lựa chọn nào!");
        }
      },

      convertTimeData() {
        return;
        if (this.type == OBJECT_CONST.DROP_DOWN.OBJECT) {
          if (this.id == 5 || this.id == 6) {
            if (this.isModify === true) {
              return;
            }
            this.titleName = TimeUtil.convertDuration(parseInt(this.title.split('-')[0])) + '-' + TimeUtil
              .convertDuration(
                parseInt(this.title.split('-')[1]));

            for (let i in this.items) {
              this.items[i].title = TimeUtil.convertDuration(parseInt(this.items[i].title.split('-')[0])) + '-' +
                TimeUtil.convertDuration(
                  parseInt(this.items[i].title.split('-')[1]))
            }
            this.isModify = true;
          }
        }
      },
    }
  }

</script>

<style>
  nav .menu-item svg {
    width: 10px;
    margin-left: 10px;
  }

  .item-input:hover {
    background-color: azure;
  }

  nav .menu-item .sub-menu {
    position: absolute;
    background-color: #222;
    top: calc(100% + 18px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    border-radius: 0px 0px 16px 16px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all .5s ease-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  /* .fa-arrow-circle-down {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  } */

</style>
