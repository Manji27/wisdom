<template>
  <div id="app" :class="{ 'bg-white': isMobileMenuOpen }" class="bg-section flex flex-col min-h-screen">
    <nav class="bg-white sticky top-0 z-50 border-gray-200">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link to="/">
          <a href="#" class="flex items-center">
            <span class="self-center text-2xl font-semibold whitespace-nowrap">Wisdom</span>
          </a>
        </router-link>
        <div class="md:hidden">
          <!-- Burger Menu -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="block text-gray-900 hover:text-blue-700 focus:text-blue-700 focus:outline-none"
          >
            <svg
              class="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            </svg>
          </button>
        </div>
        <transition name="mobile-menu" mode="out-in">
          <div :class="{ 'hidden': !isMobileMenuOpen }" class="w-full md:w-auto md:flex gap-4" id="navbar-default">
            <router-link
              to="/guides"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Guides
            </router-link>
            <router-link
              v-if="isLoggedIn && user && (user.role === 'editor' || user.role === 'admin')"
              to="/guidecreation"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Créer
            </router-link>
            <router-link
              v-if="isLoggedIn && user && (user.role === 'editor' || user.role === 'admin')"
              to="/guidespace"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Mes guides
            </router-link>
            <router-link
              to="/contact"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Contact
            </router-link>
            <router-link
              v-if="!isLoggedIn"
              to="/login"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Connexion
            </router-link>
            <router-link
              v-if="!isLoggedIn"
              to="/signup"
              class="wisdom-btn block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-blue-900 md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Inscription
            </router-link>
            <!-- Rest of your router-links... -->
            <router-link
              v-if="user"
              :to="`/user/${user._id}`"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Mon compte
            </router-link>
            <router-link
              v-if="isLoggedIn && user && user.role === 'admin'"
              to="/admin"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Admin
            </router-link>
            <button
              v-if="isLoggedIn"
              @click="logout"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-blue-900 md:border-0 md:hover:text-blue-700"
              @click.native="toggleMobileMenu"
            >
              Déconnexion
            </button>
          </div>
        </transition>
      </div>
    </nav>
    <router-view class="flex-grow" />
    <Footer />
  </div>
</template>

<script>
import UserList from './components/UserList.vue';
import GuideList from './components/GuideList.vue';
import GuideDetail from './components/GuideDetail.vue';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Footer,
  },
  data() {
    return {
      selectedGuideId: null,
      userId: null,
      user: null,
      isMobileMenuOpen: false,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    fetchUser() {
      const token = localStorage.getItem('user-token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;

        axios
          .get(`http://localhost:3000/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.user = response.data;
            this.$store.commit('setUser', this.user);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    selectGuide(id) {
      this.selectedGuideId = id;
    },
    logout() {
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-id');
      this.$router.replace('/login');
    },
  },
  created() {
    const userToken = localStorage.getItem('user-token');
    this.isLoggedIn = !!userToken;

    if (this.isLoggedIn) {
      this.userId = localStorage.getItem('user-id');
    }
  },
};
</script>

<style>
#app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
