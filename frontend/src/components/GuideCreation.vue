<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="min-h-screen  flex flex-col justify-center sm:py-12">
        <div class="p-10 xs:p-0 mx-auto  md:w-3/6">
         
          <label class="font-semibold text-sm text-gray-600 pb-1 block">Genre</label>
          <select id="genre" v-model="genre" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full">
            <option disabled value="">Sélectionnez un genre</option>
            <option value="Développement">Développement</option>
            <option value="Sport">Sport</option>
            <option value="Musique">Musique</option>
            <option value="Art">Art</option>
            <option value="Finances">Finances</option>
          </select>
          <p v-if="error.genre" class="text-red-500 mb-5">{{ error.genre }}</p>

          <label class="font-semibold text-sm text-gray-600 pb-1 block">Image</label>
          <input type="file" multiple @change="handleFiles" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full">

          <label class="font-semibold text-sm text-gray-600 pb-1 block">Titre</label>
          <input type="text" id="titre" v-model="titre" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
          <p v-if="error.titre" class="text-red-500 mb-5">{{ error.titre }}</p>

          <label class="font-semibold text-sm text-gray-600 pb-1 block">Contenu</label>
          <editor
            tinymce-script-src="node_modules/tinymce/tinymce.min.js"
            api-key="z7oudvchewbu3ub0spr9tfke3ika3nvtna3hqbm0ey2d0wd9"
            :init="{
              plugins: 'lists link image table code help wordcount',
              images_upload_url: 'http://localhost:3000/imageUpload',
            }"
            v-model="contenu"
          />
          <p v-if="error.contenu" class="text-red-500 mb-5">{{ error.contenu }}</p>

         

          <button type="submit" class="transition duration-200 bg-wisdom hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
            <span class="inline-block mr-2">Enregistrer</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';

export default {
  components: {
    Editor
  },
  data() {
    return {
      titre: '',
      contenu: '',
      genre: '',
      files: [],
      error: {
        titre: null,
        contenu: null,
        genre: null,
      },
    };
  },
  methods: {

    validateForm() {
      this.error = {
        titre: null,
        contenu: null,
        genre: null,
      };

      if (!this.titre) this.error.titre = "Le titre est obligatoire";
      if (!this.contenu) this.error.contenu = "Le contenu est obligatoire";
      if (!this.genre) this.error.genre = "Le genre est obligatoire";

      return Object.keys(this.error).every(key => !this.error[key]);
    },
    
    handleFiles(event) {
      const MAX_FILE_SIZE = 300 * 1024; // Taille maximale du fichier en octets (300 Ko)
      const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

      this.files = Array.from(event.target.files).filter(file => {
        // Vérifier la taille du fichier
        if (file.size > MAX_FILE_SIZE) {
          alert('Le fichier ' + file.name + ' est trop grand. La taille maximale autorisée est de 300 Ko.');
          return false;
        }

        // Vérifier le type de fichier
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          alert('Le fichier ' + file.name + ' n\'est pas un type de fichier autorisé. Les types de fichiers autorisés sont .png, .jpeg, .jpg, .svg.');
          return false;
        }

        return true;
      });
    },
    async submitForm() {
  // Vérifie si le formulaire est valide avant de le soumettre
  if (!this.validateForm()) {
    return;
  }

  const formData = new FormData();
  formData.append('titre', this.titre);
  formData.append('contenu', this.contenu);
  formData.append('genre', this.genre);

  for (let i = 0; i < this.files.length; i++) {
    formData.append('image', this.files[i], this.files[i].name);
  }

  const token = localStorage.getItem('user-token');

  try {
    const response = await axios.post('http://localhost:3000/guides/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token
      }
    });
    console.log(response.data);

    // Redirection vers la page /guides
    this.$router.push('/guides');
  } catch (err) {
    console.error(err);
  }
}


  }
};
</script>
