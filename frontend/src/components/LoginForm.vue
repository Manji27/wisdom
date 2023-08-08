<template>
    <div>
      <form @submit.prevent="submitForm">
        <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
  <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
    <h1 class=" flex items-center justify-center font-bold text-center text-2xl mb-5"><img class="w-52" src="public\img\ink.png" alt=""></h1>  
    <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
      <div class="px-5 py-7">
        <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
        <input type="email" id="email"  v-model="email" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
        <p v-if="error.email" class="text-red-500 mb-5">{{ error.email }}</p>
        <label for="password" class="font-semibold text-sm text-gray-600 pb-1 block">Mot de passe</label>
        <input type="password" id="password" v-model="mot_de_passe" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
        <p v-if="error.mot_de_passe" class="text-red-500 mb-5">{{ error.mot_de_passe }}</p>
        <button type="submit" class="bg-wisdom transition duration-200  hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
            <span class="inline-block mr-2">Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </button>
      </div>
      <div class="py-5">
        <div class="grid grid-cols-2 gap-1">
          <div class="text-center sm:text-left whitespace-nowrap">
          
          </div>
          <div class="text-center sm:text-right  whitespace-nowrap">
        
          </div>
        </div>
      </div>
    </div>
    <div class="py-5">
        <div class="grid grid-cols-2 gap-1">
          <div class="text-center sm:text-left whitespace-nowrap">
          
          </div>
        </div>
      </div>
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
        email: '',
        mot_de_passe: '',
        error: {
          email: null,
          mot_de_passe: null,
        },
      }
    },
    methods: {
      validateForm() {
        this.error = {
          email: null,
          mot_de_passe: null,
        };
  
        if (!this.email) this.error.email = "L'e-mail est obligatoire";
        if (!this.mot_de_passe) this.error.mot_de_passe = "Le mot de passe est obligatoire";
  
        return Object.keys(this.error).every(key => !this.error[key]);
      },
      submitForm() {
        if (this.validateForm()) {
          axios.post('http://localhost:3000/users/login', {
            email: this.email,
            mot_de_passe: this.mot_de_passe,
          })
          .then(response => {
            localStorage.setItem('user-token', response.data.token);
            this.$router.push('/guides');
            
          })
          .catch(error => {
            this.error.server = 'Echec de la connexion. Veuillez vérifier vos identifiants.';
            console.error(error);
          });
        }
      },
    },
  };
  </script>


  