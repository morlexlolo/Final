/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import moment from 'moment';

import VueRouter from 'vue-router';


// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

// CommonJS
window.swal = Swal;


Vue.use(VueRouter)

// importing vue progress bar

import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '3px'
});

//registering  vue the components

let routes = [{
        path: '/dashboard',
        component: (require('./components/Dashboard.vue').default)
    },
    {
        path: '/profile',
        component: (require('./components/Profile.vue').default)
    },
    {
        path: '/users',
        component: (require('./components/Users.vue').default)
    },
    {
        path: '/developer',
        component: (require('./components/Developer.vue').default)
    },
]
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

// regitering filter function as a global
Vue.filter('capitalize', function (value) {

    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  });

//   data moment registeration
Vue.filter('myDate',function (created) {
    return moment(created).format('MMMM Do YYYY, h:mm:ss a');
});


// custom event
window.Fire = new Vue();
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
//passport auth component

Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);
Vue.component('example-component', require('./components/ExampleComponent.vue').default);


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});
