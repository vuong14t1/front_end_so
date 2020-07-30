<template>
  <div class="menu-item"  style="border:1px solid Grey;" @click="isOpen = !isOpen">
    <a class=" mt-0 " style="font-size: 15px">
      {{ titleName }}
      <i class="fa fa-arrow-circle-down fa-lg" style="float: right" aria-hidden="true"></i>
    </a>
    <div style="z-index: 100;" class="sub-menu ml-0 " v-if="isOpen">
      <div style="z-index: 100; width: 105%;  float: left" v-for="(item, i) in items" :key="i" 
      class="menu-item  has-text-centered" 
      :class="type == OBJECT_CONST.DROP_DOWN.LOGIN? '' : ' mt-1 pt-1'"
      >
        <a style="z-index: 100" class="input mt-0" @click="onClickButton(item)">{{ item.title}}</a>
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
      this.convertTimeData();
      this.titleName = this.title;
      // console.log("object ", this.object);
    },

    mounted() {
      // console.log("object ", this.object);
      this.convertTimeData();
      this.titleName = this.title;
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
        if (this.type == OBJECT_CONST.DROP_DOWN.OBJECT) {
          if (this.id == 5 || this.id == 6) {
            if (this.isModify === true) {
              return;
            }
            this.titleName = TimeUtil.convertDuration(parseInt(this.title.split('-')[0])) + '-' + TimeUtil.convertDuration(
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
