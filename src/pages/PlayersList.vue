<template>
  <q-page class="q-px-md">
    <players-component type="all" :howMany="25"></players-component>
  </q-page>
</template>
<script>
import PlayersComponent from "../components/Players.vue";
export default {
  name: "PlayersList",
  components: { "players-component": PlayersComponent }
};
</script>
