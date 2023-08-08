<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-semibold text-gray-900">Liste des guides</h2>
    
    <input 
      type="search" 
      v-model="searchTerm"
      placeholder="Recherche..." 
      class="mt-5 mb-5 w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-gray-700"
    >

    <div class="mt-5 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
  <button 
    @click="resetGenreFilter"
    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 w-full sm:w-auto"
  >
    Tous les genres
  </button>
  <button 
    v-for="genre in genres" 
    :key="genre" 
    @click="filterByGenre(genre)"
    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 w-full sm:w-auto"
  >
    {{ genre }}
  </button>

  <button
    @click="toggleRatingFilter()"
    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 w-full sm:w-auto"
  >
    {{ ratingOrder }}
  </button>
</div>


    <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-5">
      <div v-for="guide in filteredGuides" 
           :key="guide._id"
           class="card-container border-gray-200 rounded-lg p-4">

        <router-link 
          :to="`/guide/${guide._id}`"
          class="block max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <!-- affichage de l'image -->
          <img class="w-full h-64 object-cover rounded-t-lg" v-if="guide.images && guide.images.length > 0" :src="getImageUrl(guide.images[0])" alt="Guide Image" />
          <div class="p-6">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> {{ guide.titre }}</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Note : {{ guide.averageRating || 'Non noté' }}</p>

          </div>
        </router-link>
      </div>
    </div>


    
  </div>
</template>


<script>
import guideService from '../services/guideService';



export default {
  data() {
    return {
      guides: [],
      filteredGuides: [],
      genres: ['Développement', 'Sport', 'Musique', 'Art', 'Finances'],
      searchTerm: '',
      selectedGenre: null,
      filterByRating: null,
      filterByViewCount: null,
      filterByTime: null,
      ratingOrder: 'Croissant',
      ratings: [1, 2, 3, 4, 5] 
    };
  },

  async created() {

   
    
    
    try {
      const response = await guideService.getGuides();
      this.guides = response.data;
      this.filteredGuides = this.guides;
    } catch (error) {
      console.error(error);
    }

    
    
  },
  
  
  methods: {

    
    resetGenreFilter() {
      this.selectedGenre = null;
      this.searchTerm = '';
    },
    getImageUrl(imageFilename) {
      return `http://localhost:3000/${imageFilename}`;
    },
    filterByGenre(genre) {
      this.selectedGenre = genre;
    },
    toggleRatingFilter() {
      if (this.filterByRating === null) {
        this.filterByRating = 'desc';
        this.ratingOrder = 'Décroissant';
      } else if (this.filterByRating === 'desc') {
        this.filterByRating = 'asc';
        this.ratingOrder = 'Croissant';
      } else {
        this.filterByRating = null;
        this.ratingOrder = 'Aucun';
      }
    },
    
    filterGuides() {
      let filtered = this.guides;
    
      if (this.searchTerm) {
        filtered = filtered.filter(guide => guide.titre.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }

      if (this.selectedGenre) {
        filtered = filtered.filter(guide => guide.genre === this.selectedGenre);
      }

      if (this.filterByRating) {
        if (this.filterByRating === 'asc') {
          filtered = filtered.sort((a, b) => a.averageRating - b.averageRating);
        } else {
          filtered = filtered.sort((a, b) => b.averageRating - a.averageRating);
        }
      }

      if (this.filterByViewCount) {
        filtered = filtered.filter(guide => guide.viewsCount >= this.filterByViewCount);
      }

      if (this.filterByTime) {
        filtered = filtered.filter(guide => guide.time <= this.filterByTime);
      }

      this.filteredGuides = filtered;
    }
  },
  watch: {
    searchTerm(newTerm) {
      this.filterGuides();
    },
    selectedGenre() {
      this.filterGuides();
    },
    filterByRating() {
      this.filterGuides();
    },
    filterByViewCount() {
      this.filterGuides();
    },
    filterByTime() {
      this.filterGuides();
    }
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}


</style>
