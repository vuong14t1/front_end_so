// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import dropdown from 'vue-dropdowns'
import VueSession from 'vue-session'
Vue.use(VueSession)
import VueCookies from 'vue-cookies'
import {
  coerce
} from 'semver'
Vue.use(VueCookies)

Vue.config.productionTip = false
Vue.prototype.$gameId = "p13";

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
