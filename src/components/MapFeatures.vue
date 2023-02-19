<template>
  <div
    class="absolute top-10 left-14 z-10 flex flex-row-reverse items-center gap-x-3 text-base"
  >
    <div
      class="rounded-md px-2.5 py-1.5 shadow-md shadow-gray-600"
      :class="[
        shouldFetchLocation
          ? 'cursor-pointer bg-white text-black'
          : 'animate-pulse cursor-not-allowed bg-gray-400 text-gray-300',
      ]"
      @click="$emit('searchGeoLocation', !shouldFetchLocation)"
    >
      <i class="fas fa-location-arrow"></i>
    </div>

    <div class="relative flex h-full md:min-w-[350px]">
      <input
        type="text"
        class="h-full w-full rounded-md py-2.5 pl-9 pr-4 text-sm shadow-md focus:outline-none"
        placeholder="Start your search here"
        v-model="searchQuery"
        @input="search"
      />
      <div class="absolute left-[8px] flex h-full items-center">
        <i class="fas fa-search"></i>
      </div>
    </div>

    <div
      v-if="searchQuery"
      class="absolute left-0 top-12 h-[200px] w-full overflow-y-auto overflow-x-hidden rounded-md bg-white"
    >
      <LoadingComponent v-if="!searchedData.length" />
      <template v-else>
        <div
          class="flex cursor-pointer items-center gap-x-2 px-4 py-2 hover:bg-slate-600 hover:text-white"
          v-for="feature in searchedData"
          :key="feature.id"
          @click="sendResult(feature)"
        >
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ feature.place_name }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType, ref } from "vue";
import type { Coordinates } from "@/types/geolocalization";
import LoadingComponent from "@/components/LoadingComponent.vue";
import axios from "axios";

const props = defineProps({
  shouldFetchLocation: {
    type: Boolean,
    default: true,
  },
  coords: {
    type: Object as PropType<Coordinates>,
    required: true,
  },
});
const emit = defineEmits(["searchGeoLocation", "sendResult"]);

const searchQuery = ref("");
const searchedData = ref([]);
const queryTimeOut = ref(300);

const search = async (): Promise<void> => {
  clearTimeout(queryTimeOut.value);
  searchedData.value.splice(0);
  queryTimeOut.value = setTimeout(async () => {
    if (searchQuery.value) {
      const params = new URLSearchParams({
        access_token:
          "pk.eyJ1Ijoid2licmMiLCJhIjoiY2xlYmR6NG1qMThmcTNycXh4enptcDEwZyJ9.c__L-q0w1iF2G6QaNrH0bA",
        fuzzyMatch: "true",
        language: "fr",
        limit: "10",
        proximity: `${props.coords.longitude}, ${props.coords.latitude}`,
      });

      const getData = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?${params}`
      );
      searchedData.value = getData.data.features;
    }
  }, 700);
};

const sendResult = (result: unknown): void => {
  emit("sendResult", result.geometry.coordinates);
};
</script>
