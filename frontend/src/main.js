// main.js
import './assets/main.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';  // <-- Ajoutez ceci
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Configure the default x-auth-token header for all requests
axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('user-token');

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
  .use(router) // Utiliser le router
  .use(store) // <-- Ajoutez ceci
  .mount('#app');
