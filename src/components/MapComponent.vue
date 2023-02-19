<template>
  <div id="map" class="z-[1] h-full"></div>
  <MapModal
    :msg="errorMessage"
    v-if="hasError"
    @close-modal="hasError = false"
  />
  <MapFeatures
    :should-fetch-location="fetchCoords"
    @search-geo-location="getGeolocalization"
    @send-result="plogResult"
    :coords="coords"
  />
</template>
<script setup lang="ts">
import type {
  Coordinates,
  GeolocalizationPosition,
} from "@/types/geolocalization";
import type { LayerGroup, Map } from "leaflet";
import { Marker, icon, map, marker, tileLayer } from "leaflet";
import { onMounted, ref } from "vue";

import MapFeatures from "@/components/MapFeatures.vue";
import MapModal from "@/components/MapModal.vue";

let myMap: Map | LayerGroup<unknown>;

onMounted(() => {
  myMap = map("map").setView([12.2137541551234, 4.80651220617253], 5);
  tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(myMap);
  myMap.on("move", () => {
    console.log("close suggestions");
  });
  getGeolocalization(true);
});

const coords = ref<Coordinates>({
  longitude: 0,
  latitude: 0,
});
const fetchCoords = ref<boolean>(true);
const geoMaker = ref<Marker<unknown>>();

const getGeolocalization = (shouldSearch: boolean): void => {
  fetchCoords.value = shouldSearch;
  if (!fetchCoords.value) {
    coords.value = {
      latitude: 0,
      longitude: 0,
    };
    sessionStorage.removeItem("coordinates");
    myMap.removeLayer(geoMaker.value);
    return;
  }

  if (sessionStorage.getItem("coordinates")) {
    coords.value = JSON.parse(sessionStorage.getItem("coordinates") as string);
    plogGeolocalization(coords.value);
    return;
  }

  fetchCoords.value = true;
  navigator.geolocation.getCurrentPosition(setCoordinates, getLogError);
};

const setCoordinates = (positions: GeolocalizationPosition): void => {
  coords.value = {
    latitude: positions.coords.latitude,
    longitude: positions.coords.longitude,
  };
  sessionStorage.setItem("coordinates", JSON.stringify(coords.value));
  plogGeolocalization(coords.value);
};

const hasError = ref(false);
const errorMessage = ref("");
const getLogError = (err: unknown): void => {
  hasError.value = true;
  errorMessage.value = err.message;
};

const plogGeolocalization = (coords: Coordinates): void => {
  const { latitude, longitude } = coords;
  const customMaker = icon({
    iconUrl: new URL("../assets/mark-down-blue.svg", import.meta.url).href,
    iconSize: [35, 35],
  });

  geoMaker.value = marker([latitude, longitude], {
    icon: customMaker,
  }).addTo(myMap);

  myMap.setView([latitude, longitude], 5);
};

const resultMarker = ref<Marker<unknown> | undefined>(undefined);
const plogResult = (coords: number[]): void => {
  if (resultMarker.value) {
    myMap.removeLayer(resultMarker.value);
  }

  const customMaker = icon({
    iconUrl: new URL("../assets/mark-down-red.svg", import.meta.url).href,
    iconSize: [35, 35],
  });

  resultMarker.value = marker([coords[1], coords[0]], {
    icon: customMaker,
  }).addTo(myMap);

  myMap.setView([coords[1], coords[0]], 14);
};
</script>
