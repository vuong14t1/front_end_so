<template>
  <div v-if="isActive">
    <div class="modal is-active" style="modal-content-width: 40px">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{title}}</p>
          <button class="delete" aria-label="close" @click="cancel()"></button>
        </header>
        <footer class="modal-card-foot has-text-centured">
          <button class="button is-success" @click="aprove()"> Đồng ý</button>
          <button class="button" @click="cancel()">Hủy</button>
        </footer>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'Modal',
    props: ['title', 'isVisible', 'cbApprove', 'cbCancle'],
    data() {
      return {
        isActive: true
      }
    },

    watch: {
      isVisible: function (newValue, old) {
        this.isActive = newValue;
      }
    },

    mounted() {
      this.isActive = this.isVisible;
    },
    methods: {
      cancel() {
        this.cbCancle && this.cbCancle();
      },

      aprove() {
        this.cbApprove && this.cbApprove();
      }
    }
  }

</script>