<template>
  <div
    class="fixed top-0 left-0 z-50 h-screen w-full overflow-hidden bg-transparent backdrop-blur-sm"
  >
    <div class="flex h-full w-full items-center justify-center bg-transparent">
      <div
        class="flex w-72 flex-col space-y-5 rounded-md bg-white p-4 text-black"
      >
        <h1 class="text-xl">Error: {{ msg }}</h1>
        <p>
          Please to provide a good service we need to know your localization.
        </p>
        <button
          class="rounded-sm bg-red-400 p-2 text-white"
          @click="$emit('closeModal')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>
