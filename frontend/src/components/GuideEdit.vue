<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <form @submit.prevent="submit" class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <h1 class="text-2xl font-semibold text-gray-900 mb-4">Modifier le Guide</h1>
      
      <div class="mb-5">
        <label class="font-semibold text-sm text-gray-600 pb-1 block">Titre:</label>
        <input v-model="guide.titre" type="text" required class="border rounded-lg px-3 py-2 mt-1 text-sm w-full">
      </div>
      
      <div class="mb-5">
        <label class="font-semibold text-sm text-gray-600 pb-1 block">Contenu:</label>
        <textarea v-model="guide.contenu" required class="border rounded-lg px-3 py-2 mt-1 h-40 text-sm w-full"></textarea>
      </div>
      
      <button type="submit" class="transition duration-200 bg-wisdom hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
        <span class="inline-block mr-2">Modifier le Guide</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
      
      <button @click="retourPagePrecedente" class="mt-4 transition duration-200 bg-wisdom hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
        <span class="inline-block mr-2">Retour</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
      </button>
    </form>
  </div>
</template>

  
  
  <script>
  import guideService from '../services/guideService';
  
  export default {
    data() {
      return {
        guide: {
          titre: '',
          contenu: '',
          genre: '',
        },
      };
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    async created() {
      await this.loadGuide();
    },
    methods: {

        retourPagePrecedente() {
    window.history.go(-1);
  },
      async loadGuide() {
        try {
          const token = localStorage.getItem('user-token');
          const response = await guideService.getGuide(this.id, {
            headers: { 'x-auth-token': token },
          });
          this.guide = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async submit() {
        try {
          const token = localStorage.getItem('user-token');
          const guideId = this.guide._id;
          const config = { headers: { 'x-auth-token': token } };
          await guideService.updateGuide(guideId, this.guide, config);
          this.$router.push(`/guide/${guideId}`);
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  