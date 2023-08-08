<template>
  <div class="w-full mx-auto">
    <div class="relative">
      <img class="w-full h-80 object-cover mt-3" v-if="guide && guide.images.length > 0" :src="getImageUrl(guide.images[0])" alt="Guide Image" />
      <div class="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <h1 class="text-4xl font-semibold text-white py-4 uppercase" v-if="guide">{{ guide.titre }}</h1>
      </div>
    </div>
    
    <div class="test w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="padtest flex flex-col max-w-7xl mx-auto">
        <h2 class="text-2xl text-wisdom py-4 uppercase" v-if="guide">
  Genre : {{ guide.genre }}
</h2>
        <p class="text-base text-gray-600 mt-3 mb-5" v-if="guide" v-html="guide.contenu"></p>

        <div v-if="guide && $store.state.user && $store.state.user._id === guide.userId">
          <button class="mt-2 px-4 py-2 bg-wisdom text-white rounded-md hover:bg-blue-600 ml-3.5" @click="updateGuide">Editer</button>
          <button class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 ml-3.5" @click="deleteGuide">Supprimer</button>
        </div>

        <div v-if="guide">
          <h3 class="text-lg font-semibold text-gray-900 mt-6">Notez ce guide</h3>
          <form class="mt-3" @submit.prevent="submitRating">
            <select v-model="newRating" class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-gray-700">
              <option disabled value="">Sélectionnez une note</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <button type="submit" class="mt-2 px-4 py-2 bg-wisdom text-white rounded-md hover:bg-blue-600 ml-3.5">Noter</button>
          </form>
          <div class="container_notes">
          <h3 class="text-lg font-semibold text-gray-900 mt-6">Note moyenne</h3>
          <p class="text-lg text-gray-900">{{ averageRating }}</p>
          <h3 class="text-lg font-semibold text-gray-900 mt-6">Nombre de votes</h3>
          <p class="text-lg text-gray-900">{{ votesCount }}</p>
        </div>

          <h3 class="text-lg font-semibold text-gray-900 mt-6">Commentaires</h3>
          <form class="mt-3" @submit.prevent="submitComment">
            <textarea v-model="newComment" placeholder="Entrez votre commentaire ici" class="w-full h-20 px-3 py-2 border border-gray-300 rounded-md text-gray-700"></textarea>
            <button type="submit" class="mt-2 px-4 py-2 bg-wisdom text-white rounded-md hover:bg-blue-600">Commenter</button>
          </form>

          <ul class="mt-5 space-y-4" v-if="comments.length > 0">
            <li v-for="comment in comments" :key="comment._id" class="border border-gray-200 rounded-lg p-4">
              <p class="text-gray-700">Commenté par {{ comment.userId.nom }}</p>
              <p class="text-sm text-gray-500">Le {{ new Date(comment.dateCreation).toLocaleString() }}</p>
              <p class="text-base text-gray-600 mt-2">{{ comment.contenu }}</p>
            </li>
          </ul>
          <p class="text-gray-500 mt-5" v-else>Aucun commentaire disponible.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import guideService from '../services/guideService';
import commentService from '../services/commentService';
import { watch } from 'vue';

export default {

  
  data() {
    return {
      guide: null,
      newComment: '',
      comments: [],
      newRating: '',
      averageRating: null,
      votesCount: null,
      reportReason: '',
   

    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  async created() {
    await this.loadGuide();
  },
  methods: {

    async reportGuide() {
  try {
    const token = localStorage.getItem('user-token');
    await guideService.reportGuide(this.guide._id, this.reportReason, { headers: { 'x-auth-token': token } });
    this.reportReason = '';  // Réinitialisez la raison du signalement
    alert("Le guide a été signalé avec succès.");
  } catch (error) {
    console.error(error);
  }
},




    retourPagePrecedente() {
    window.history.go(-1);
  },

    updateGuide() {
    this.$router.push({ name: 'GuideEdit', params: { id: this.guide._id } });
  },
  

  async deleteGuide() {
    try {
      const token = localStorage.getItem('user-token');

      // Demande à l'utilisateur de confirmer la suppression
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce guide ?")) {
        // Supprime le guide via l'API
        await guideService.deleteGuide(this.guide._id, { headers: { 'x-auth-token': token } });
        // Redirigez l'utilisateur vers la page d'accueil ou rechargez les guides.
        this.$router.push("/guides");
      }
    } catch (error) {
      console.error(error);
    }
  },



    async loadGuide() {
  try {
    const token = localStorage.getItem('user-token');
    const response = await guideService.getGuide(this.id, { headers: { 'x-auth-token': token } });
    //console.log(response.data); // Ajoutez cette ligne pour afficher la réponse dans la console
    this.guide = response.data;
    if (response.data.averageRating !== undefined) {
      this.averageRating = response.data.averageRating.toFixed(1);
      this.votesCount = response.data.votesCount;
    } else {
      this.averageRating = 'N/A';
    }
    await this.loadComments();
  } catch (error) {
    console.error(error);
  }
},

    async loadComments() {
  try {
    const token = localStorage.getItem('user-token');

    if (this.guide) {
      const comments = await commentService.getCommentsByGuide(this.guide._id, { headers: { 'x-auth-token': token } });
      //console.log("Réponse de la requête des commentaires :", comments);

      if (Array.isArray(comments)) {
        this.comments = comments;
        //console.log("Commentaires assignés :", this.comments);
      } else {
        console.error("La réponse des commentaires n'est pas un tableau");
      }
    }
  } catch (error) {
    console.error(error);
  }
},

async submitRating() {
  try {
    const token = localStorage.getItem('user-token');
    const note = parseInt(this.newRating); // convertit en nombre
    const guideId = this.guide._id;
    const config = { headers: { 'x-auth-token': token } };
    await guideService.addRating(guideId, note, config);  // Change ici
    this.newRating = '';
    await this.loadGuide();  // rechargez le guide pour mettre à jour la note moyenne
  } catch (error) {
    console.error(error);
  }
},


    getImageUrl(imageFilename) {
      return `http://localhost:3000/${imageFilename}`;
    },
    async submitComment() {
      try {
        const token = localStorage.getItem('user-token');
        const comment = {
          guideId: this.guide._id,
          userId: this.$store.state.user._id,
          contenu: this.newComment
        };
        const config = { headers: { 'x-auth-token': token } };
        await commentService.createComment(comment, config);
        this.newComment = '';
        await this.loadComments();
      } catch (error) {
        console.error(error);
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler(newId) {
        await this.loadGuide();
      }
    }
  },
};
</script>
