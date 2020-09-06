<template>
  <div class="q-px-md">
    <players-component :type="'none'" :howMany="25"></players-component>
  </div>
</template>
<script>
import PlayersComponent from "../components/Players.vue";
export default {
  name: "PlayersList",
  components: { "players-component": PlayersComponent }
};
</script>
