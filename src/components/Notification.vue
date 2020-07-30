<template>
      <div v-if="isActive" class="notification " :class="'is-' + state" @click="closeNotify()" style="width: 20%; height: 50px;float: left;z-index: 100"><button class="delete"></button>
      {{text}}</div>
</template>

<script>
  export default {
    name: 'Modal',
    props: ['text', 'state', 'isVisible'],
    data() {
      return {
        isActive: false
      }
    },

     watch: {
      isVisible: function () {
        this.isActive = true;
        setTimeout(function () {
          this.isActive = false
        }.bind(this), 5000);
      }
    },
    mounted() {
      setTimeout(function () {
        this.isActive = false
      }.bind(this), 5000);
    },
    methods: {
       closeNotify() {
        this.isActive = false
      }
    }
  }

</script>