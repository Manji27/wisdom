<template>
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <form @submit.prevent="submitForm" class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 class="flex items-center justify-center font-bold text-center text-2xl mb-5">
          Formulaire de contact
        </h1>
        <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div class="px-5 py-7">
            <label for="name" class="font-semibold text-sm text-gray-600 pb-1 block">Nom</label>
            <input id="name" v-model="name" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" type="text" />

            <label for="email" class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input id="email" v-model="email" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" type="email" />

            <label for="message" class="font-semibold text-sm text-gray-600 pb-1 block">Message</label>
            <textarea id="message" v-model="message" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" rows="4"></textarea>

            <button type="submit" class="transition duration-200 bg-wisdom hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
              <span class="inline-block mr-2">Envoyer</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: '',
    }
  },
  methods: {
    submitForm() {
      // Your form submission logic here...
    },
  },
}
</script>
