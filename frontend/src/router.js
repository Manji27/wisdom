import { createRouter, createWebHistory } from 'vue-router'
import UserList from './components/UserList.vue'
import UserProfile from './components/UserProfile.vue'
import GuideList from './components/GuideList.vue'
import GuideDetail from './components/GuideDetail.vue'
import NotFound from './components/NotFound.vue'
import LoginForm from './components/LoginForm.vue';
import SignUpForm from './components/SignUpForm.vue';
import GuideCreation from './components/GuideCreation.vue';
import GuideEdit from './components/GuideEdit.vue';
import GuideSpace from './components/GuideSpace.vue';
import Admin from './components/Admin.vue';
import UserInfo from './components/UserInfo.vue';
import Home from './components/Home.vue';
import Contact from './components/Contact.vue';
import Mentions from './components/Mentions.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/users', component: UserList },
  { path: '/user/:id', component: UserProfile, props: true },
  { path: '/guides', component: GuideList },
  { path: '/guide/:id', component: GuideDetail, props: true },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpForm
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/mentions',
    name: 'Mentions',
    component: Mentions
  },
  {
    path: '/guidecreation',
    name: 'GuideCreation',
    component: GuideCreation,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("user-token");
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        const user = JSON.parse(jsonPayload);
        if (user && (user.role === 'editor' || user.role === 'admin')) {
          next();
        } else {
          next('/login');
        }
      } else {
        next('/login');
      }
    }
  },
  {
    path: '/guidespace',
    name: 'GuideSpace',
    component: GuideSpace,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("user-token");
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        const user = JSON.parse(jsonPayload);
        if (user && (user.role === 'editor' || user.role === 'admin')) {
          next();
        } else {
          next('/login');
        }
      } else {
        next('/login');
      }
    }
  },
  // ...
  
  {
    path: '/guides/:id/',
    name: 'GuideEdit',
    component: GuideEdit,
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("user-token");
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        const user = JSON.parse(jsonPayload);
        console.log(user.role);  // Ajoutez cette ligne
    
        if (user && user.role === 'admin') {
          next();
        } else {
          next('/login');
        }
      } else {
        next('/login');
      }
    }
    
  },

  {
    path: '/userinfo/:id',
    name: 'UserInfo',
    component: UserInfo,
    props: true
  
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
