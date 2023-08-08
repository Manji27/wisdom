<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <button @click="retourPagePrecedente" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Retour</button>
      <h2 class="text-2xl font-semibold text-gray-900" v-if="user">{{ user.nom }}</h2>
      <h3 class="text-xl text-gray-700" v-if="user" v-html="user.email"></h3>
  
      <div class="mt-5 space-y-4" v-if="user && guides && guides.length">
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
          <p class="text-gray-700">{{ guide.contenu }}</p>
          <p class="text-gray-500">{{ guide.genre }}</p>
        </div>
      </div>
      <p class="mt-5 text-gray-500" v-if="user && (!guides || !guides.length)">Aucun guide trouvé pour cet utilisateur</p>
  
      <div class="mt-5 space-y-4" v-if="user && comments && comments.length">
  <div
    v-for="comment in comments"
    :key="comment._id"
    class="border border-gray-200 rounded-lg p-4"
  >
    <p class="text-gray-700">{{ comment.contenu }}</p>
    <button class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" @click="deleteComment(comment._id)">Supprimer le commentaire</button>
  </div>
</div>

      <p class="mt-5 text-gray-500" v-if="user && (!comments || !comments.length)">Aucun commentaire trouvé pour cet utilisateur</p>
  
    </div>
</template>

  
<script>
import guideService from '../services/guideService';
import commentService from '../services/commentService'; 
import jwtDecode from 'jwt-decode';
  
export default {
    data() {
      return {
        user: null,
        guides: [],
        comments: []
      };
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    async created() {
      await this.loadUserAndData();
    },
    methods: {

        async deleteComment(commentId) {
  try {
    await commentService.deleteComment(commentId);
    this.comments = this.comments.filter(comment => comment._id !== commentId);
  } catch (error) {
    console.error(error);
  }
}
,
      retourPagePrecedente() {
        window.history.go(-1);
      },
      async loadUserAndData() {
        try {
          // Récupérer le token utilisateur stocké localement
          const token = localStorage.getItem('user-token');
          if (token) {
            // Décoder le token pour obtenir l'ID utilisateur
            const decoded = jwtDecode(token);
            this.user = decoded;

            // Charger les guides de l'utilisateur
            const guidesResponse = await guideService.getMyGuides({ userId: this.id });
            this.guides = guidesResponse.data;

            // Charger les commentaires de l'utilisateur
            const commentsResponse = await commentService.getCommentsByUser(this.id);
console.log('commentsResponse', commentsResponse);
this.comments = commentsResponse;
console.log('this.comments', this.comments);


          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    watch: {
      id: {
        immediate: true,
        async handler(newId) {
          await this.loadUserAndData();
        }
      }
    },
};
</script>
