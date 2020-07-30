<template>
  <div id="app" class="container-fluid">
    <!-- <Navigation></Navigation> -->
    <router-view />
  </div>
</template>

<script>
  import Navigation from './components/Navigation'
  export default {
    name: 'app',
    components: {
      'Navigation': Navigation
    }
  }

</script>

<style>
  @import "../node_modules/bulma/css/bulma.css";

</style>
