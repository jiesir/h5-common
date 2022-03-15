import Vue from 'vue';
import router from '@router'
import store from '@store';
import App from '@/App.vue';
import filters from '@/utils/filter';
import 'amfe-flexible';
import Vconsole from 'vconsole';

if (process.env.VUE_APP_ENV !== 'prod') {
    new Vconsole();
}

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
