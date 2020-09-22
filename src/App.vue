<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  beforeCreate() {
    this.$store.dispatch("user/fetchUserData").then(({ status, message }) => {
      if (status === "error") {
        this.$q.notify({
          color: "red-5",
          icon: "warning",
          message: message
        });
      }
    });
  }
};
</script>
