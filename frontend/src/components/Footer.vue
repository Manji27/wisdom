<template>
    <footer class="bg-wisdom text-white p-6 relative">
      <div class="container mx-auto text-center">
        <p class="mb-6">&copy; 2023 Wisdom. Tous droits réservés.</p>
        <div class="space-x-4">
          <router-link to="/mentions" class="hover:text-blue-300">Mentions légales</router-link>
          <router-link to="/contact" class="hover:text-blue-300">Contact</router-link>
        </div>
      </div>
    </footer>
</template>

  
  
  <script>
  export default {
    name: 'Footer',
  };
  </script>
  
  <style scoped>
  footer {
  
    bottom: 0;
    width: 100%;
  }
  </style>
  