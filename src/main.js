import Vue from 'vue'
import App from './App.vue'
import Vuebar from 'vuebar';
import VueChatScroll from 'vue-chat-scroll'

Vue.use(Vuebar);
Vue.use(VueChatScroll)

new Vue({
  el: '#app',
  render: h => h(App)
})
