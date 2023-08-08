<template>
  <div class="total max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard Admin</h1>

    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-900 uppercase">Statistiques</h2>
      <div class="stats flex gap-4">
      <p class="mt-2">Nombre d'inscriptions : {{ users.length }}</p>
      <p class="mt-2">Nombre de guides rédigés : {{ guides.length }}</p>
    </div>
    </div>

    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-900 uppercase">Utilisateurs</h2>
      <table class="table-auto w-full mt-2">
        <thead>
          <tr>
            <th class="border px-4 py-2">Nom</th>
            <th class="border px-4 py-2">Email</th>
            <th class="border px-4 py-2">Role</th>
            <th class="border px-4 py-2">Action</th>
            <th class="border px-4 py-2">Changer le rôle</th>

          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="(user, index) in users" :key="index">
              <td class="cursor-pointer border px-4 py-2" @click="goToUserInfo(user._id)">{{ user.nom }}</td>
            <td class="border px-4 py-2">{{ user.email }}</td>
            <td class="border px-4 py-2">{{ user.role }}</td>
            <td class="border px-4 py-2">
              <button 
@click="confirmDeleteUser(user._id)"
class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800"
>
Supprimer utilisateur
</button>

            </td>
            <td class="border px-4 py-2">
<select @change="changeUserRole(user._id, $event)">
  <option :selected="user.role === 'user'" value="user">User</option>
  <option :selected="user.role === 'editor'" value="editor">Editor</option>
  <option :selected="user.role === 'admin'" value="admin">Admin</option>
</select>
</td>
          </tr>
        </tbody>
      </table>

      
    </div>

    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-900 uppercase">Guides</h2>
      <table class="table-auto w-full mt-2">
        <thead>
          <tr>
            <th class="border px-4 py-2">Titre</th>
            <th class="border px-4 py-2">Genre</th>
            <th class="border px-4 py-2">Auteur</th>
            <th class="border px-4 py-2">Notes</th>
            <th class="border px-4 py-2">Date</th>
            <th class="border px-4 py-2">Action</th>
    
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="(guide, index) in guides" :key="index">
            <td class="border px-4 py-2">{{ guide.titre }}</td>
            <td class="border px-4 py-2">{{ guide.genre }}</td>
            <td class="border px-4 py-2">{{ guide.username }}</td>
            <td class="border px-4 py-2">{{ guide.averageRating }}</td>
            <td class="border px-4 py-2">{{ guide.dateCreation }}</td>
            <td class="border px-4 py-2">
              <button 
@click="confirmDeleteGuide(guide._id)"
class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800"
>
Supprimer guide
</button>

        </td>
          </tr>
        </tbody>
      </table>
    </div>

  
  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        guides: []
      };
    },
    async created() {
      this.users = await this.fetchUsers();
      this.guides = await this.fetchGuides();
    },
    methods: {
      async changeUserRole(userId, event) {
  const newRole = event.target.value;
  const response = await axios.put(`http://localhost:3000/users/${userId}`, {
    role: newRole
  });
  if (response.status === 200) {
    const user = this.users.find(user => user._id === userId);
    if (user) user.role = newRole;
  }
},
        goToUserInfo(userId) {
      this.$router.push({ name: 'UserInfo', params: { id: userId } });
    },

        confirmDeleteUser(userId) {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.deleteUser(userId);
    }
  },
  confirmDeleteGuide(guideId) {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce guide ?')) {
      this.deleteGuide(guideId);
    }
  },
        async deleteGuide(guideId) {
      const response = await axios.delete(`http://localhost:3000/guides/${guideId}`);
      if (response.status === 200) {
        this.guides = this.guides.filter(guide => guide._id !== guideId);
      }
    },
      async fetchUsers() {
        const response = await axios.get('http://localhost:3000/users'); 
        return response.data;
      },
      async fetchGuides() {
  const response = await axios.get('http://localhost:3000/guides');
  const guidesWithUsernames = await Promise.all(response.data.map(async guide => {
    if (guide.userId) { // Ajoutez cette vérification
      const userResponse = await axios.get(`http://localhost:3000/users/${guide.userId}`);
      guide.username = userResponse.data.nom; // Ajouter le nom d'utilisateur au guide
    } else {
      guide.username = 'Utilisateur non défini'; // ou toute autre valeur par défaut
    }
    return guide;
  }));
  return guidesWithUsernames;
},

      async deleteUser(userId) {
        const response = await axios.delete(`http://localhost:3000/users/${userId}`);
        if (response.status === 200) {
          this.users = this.users.filter(user => user._id !== userId);
        }
      }
    }
  };
  </script>
  