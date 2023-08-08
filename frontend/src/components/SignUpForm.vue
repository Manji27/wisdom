<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        
        <div class="bg-white rounded-lg p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <!-- Additional part for name and profile -->
          <label class="font-semibold text-sm text-gray-600 pb-1 block">Nom</label>
          <input type="text" id="name" v-model="nom" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
          <p v-if="error.nom" class="text-red-500 mb-5">{{ error.nom }}</p>

          <label class="font-semibold text-sm text-gray-600 pb-1 block">Profil</label>
          <input type="text" id="profile" v-model="profil" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
          <p v-if="error.profil" class="text-red-500 mb-5">{{ error.profil }}</p>

          <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
          <input type="email" id="email" v-model="email" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
          <p v-if="error.email" class="text-red-500 mb-5">{{ error.email }}</p>

          <label for="password" class="font-semibold text-sm text-gray-600 pb-1 block">Mot de passe</label>
          <input type="password" id="password" v-model="mot_de_passe" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
          <p v-if="error.mot_de_passe" class="text-red-500  mb-5">{{ error.mot_de_passe }}</p>

          <button type="submit" class="bg-wisdom transition duration-200  hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
              <span class="inline-block mr-2">Inscription</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
          </button>
          <!-- Rest of your form... -->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
data() {
  return {
    nom: '',
    email: '',
    mot_de_passe: '',
    profil: '',
    error: {},
  }
},
methods: {
  validateForm() {
    this.error = {};

    if (!this.nom) this.error.nom = "Le nom est obligatoire";
    if (!this.email) this.error.email = "Le mail est obligatoire";
    if (!this.mot_de_passe) this.error.mot_de_passe = "Le mot de passe est obligatoire";
    if (!this.profil) this.error.profil = "Le profil est obligatoire";

    return Object.keys(this.error).length === 0;
  },
  submitForm() {
    if (this.validateForm()) {
      axios.post('http://localhost:3000/users/register', {
        nom: this.nom,
        email: this.email,
        mot_de_passe: this.mot_de_passe,
        profil: this.profil,
      })
      .then(response => {
        // Stocker le token JWT dans le localStorage
        localStorage.setItem('user-token', response.data.token);
        // Rediriger l'utilisateur vers la page de connexion
        this.$router.push('/login');
      })
      .catch(error => {
        console.log(error.response.data);
        this.error.server = 'Inscription a échoué. Veuillez réessayer.';  
        console.error(error);
      });
    }
  },
},
};
</script>
