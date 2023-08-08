<template>
  <div>
    <h1 class="bg-blue-700">Liste des utilisateurs</h1>
    <ul>
      <li v-for="user in users" :key="user._id">
        <router-link :to="`/user/${user._id}`">
          {{ user.nom }} - {{ user.email }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios.get('http://localhost:3000/users')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
};
</script>
