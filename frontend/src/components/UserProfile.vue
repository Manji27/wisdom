<template>
  <div>
   
    <form @submit.prevent="onSubmit" class="min-h-screen  flex flex-col justify-center sm:py-12">
      <div class="border border-gray-200 p-10 xs:p-0 mx-auto md:w-full md:max-w-md bg-white  w-full rounded-lg">

        <label class="font-semibold text-sm text-gray-600 pb-1 block">Nom:</label>
        <input v-model="user.nom" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>

        <label class="font-semibold text-sm text-gray-600 pb-1 block">Email:</label>
        <input v-model="user.email" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>

        <label class="font-semibold text-sm text-gray-600 pb-1 block">Mot de passe:</label>
        <input type="password" v-model="password" placeholder="Laissez vide pour garder le même mot de passe" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>

        <label class="font-semibold text-sm text-gray-600 pb-1 block">Profil:</label>
        <input v-model="user.profil" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>

        <button type="submit" class="transition duration-200 bg-wisdom hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
          <span class="inline-block mr-2">Mettre à jour</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      user: {
        nom: '',
        email: '',
        profil: ''
      },
      password: ''
    };
  },
  async created() {
    const response = await axios.get(`http://localhost:3000/users/${this.id}`);
    this.user = response.data;
  },
  methods: {
    async onSubmit() {
      let userData = {
    nom: this.user.nom,
    email: this.user.email,
    mot_de_passe: this.password,
    profil: this.user.profil
  };

  if (this.password !== '') {
    userData.mot_de_passe = this.password;
  }

  try {
    await axios.put(`http://localhost:3000/users/${this.id}`, userData);
    this.password = ''; // Réinitialisez le champ du mot de passe.
    alert('Profil mis à jour !');
  } catch (error) {
    console.error(error);
  }
    }
  }
};
</script>
