<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">Mes Guides</h1>
  
      <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-5">
        <div 
          v-for="guide in guides" 
          :key="guide._id"
          class="border border-gray-200 rounded-lg p-4"
        >
        <router-link 
  :to="`/guide/${guide._id}`"
  class="text-lg text-blue-500 hover:underline"
>
  {{ guide.titre }}
</router-link>
          <p class="text-gray-700 line-clamp-3">{{ guide.contenu }}</p>
          <p class="text-gray-500">{{ guide.genre }}</p>
          <!-- Ajoutez d'autres champs du guide que vous voulez afficher ici -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import guideService from '../services/guideService';
  import jwt_decode from "jwt-decode";
  
export default {
  data() {
    return {
      guides: [],
    };
  },
  async created() {
  const userToken = localStorage.getItem('user-token');
  console.log('User token from Local Storage:', userToken);
  if (userToken) {
    try {
      const decoded = jwt_decode(userToken);
      const userId = decoded._id; // ou une autre clé en fonction de la structure de votre token
      console.log('User ID from userToken:', userId);

      const response = await guideService.getMyGuides({ userId });
      console.log('Response from getMyGuides:', response);
      this.guides = response.data;
    } catch (error) {
      console.error(error);
    }
  }
},
};
  </script>
  