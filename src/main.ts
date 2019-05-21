import Vue from 'vue'

import { store } from './store'
import './store/modules'
import App from './app.vue'

new Vue({
    render: h => h(App),
    store,
}).$mount('#app')

