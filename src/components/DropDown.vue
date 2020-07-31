<template>
  <div class="menu-item" style="border:1px solid Grey;" @click="isOpen = !isOpen">
    <a class=" mt-0 " style="font-size: 15px; text-decoration: none; ">
      {{ titleName }}
      <i class="fa fa-arrow-circle-down fa-lg" style="float: right" aria-hidden="true"></i>
    </a>
    <div style="z-index: 100; width: 100%; left:50%; right:50%;overflow: hidden; margin-right:20px;"
      class="sub-menu mr-6 mt-1 is-focus" v-if="isOpen">
      <div style="z-index: 100; width: 100%;  float: left;" v-for="(item, i) in items" :key="i"
        class="menu-item  has-text-centered mr-6" :class="type == OBJECT_CONST.DROP_DOWN.LOGIN? '' : ' mt-1 pt-1'">
        <a style="z-index: 100;height:40px; text-decoration: none; " class="input item-input ml-0 mt-0"
          @click="onClickButton(item)">{{ item.title}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import OBJECT_CONST from '../const/object_const';
  import TimeUtil from '../Utility/TimeUtility';
  import lodash from 'lodash';

  export default {
    name: 'dropdown',
    props: ['id', 'title', 'items', 'type', 'object'],
    updated() {
      if (this.type == OBJECT_CONST.DROP_DOWN.OBJECT_UPDATE) {
        this.titleName = this.title;
        this.convertTimeData();
      }
    },

    mounted() {
      this.titleName = this.title;
      this.convertTimeData();
    },

    data() {
      return {
        isOpen: false,
        titleName: "",
        OBJECT_CONST: OBJECT_CONST
      }
    },
    methods: {
      onClickButton(item) {
        item.idOption = this.id;
        this.titleName = item.title;
        this.$emit('clicked', item)
      },

      convertTimeData() {
        return;
        if (this.type == OBJECT_CONST.DROP_DOWN.OBJECT) {
          if (this.id == 5 || this.id == 6) {
            if (this.isModify === true) {
              return;
            }
            // this.titleName = this.title;

            console.log('convertTimeData ', this.id, '===', this.titleName);
            this.titleName = TimeUtil.convertDuration(parseInt(this.title.split('-')[0])) + '-' + TimeUtil
              .convertDuration(
                parseInt(this.title.split('-')[1]));

            for (let i in this.items) {
              this.items[i].title = TimeUtil.convertDuration(parseInt(this.items[i].title.split('-')[0])) + '-' +
                TimeUtil.convertDuration(
                  parseInt(this.items[i].title.split('-')[1]))
            }
            this.isModify = true;
            console.log('convertTimeData ', this.id, '===', this.titleName);

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

</style>
