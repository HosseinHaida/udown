<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <q-form
        @submit="onSubmit"
        class="q-gutter-sm col-sm-9 col-xs-12 col-md-4 q-pt-md"
      >
        <q-img
          src="udown-logo.png"
          class="q-ml-lg q-mt-md q-mb-md"
          style="max-width: 120px; min-width: 80px; float: right"
        />
        <q-input
          filled
          v-model="username"
          label="Username *"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Required']"
          style="min-width: 150px"
        />
        <q-input
          filled
          type="password"
          v-model="password"
          label="Password *"
          lazy-rules
          :rules="[val => (val !== null && val !== '') || 'Required']"
          style="min-width: 150px"
        />
        <div>
          <q-btn
            label="Login"
            :loading="signinPending"
            type="submit"
            color="indigo"
          />
          <q-btn
            label="Signup"
            to="/signup"
            color="indigo"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: null,
      password: null
    };
  },

  methods: {
    onSubmit() {
      this.$store
        .dispatch("user/signin", {
          username: this.username,
          password: this.password
        })
        .then(({ status, message }) => {
          if (status === "error") {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: message
            });
          } else if (status === "success") {
            this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "login",
              message: message
            });
            this.$router.push("/");
          }
        });
    }
  },
  computed: {
    signinPending() {
      return this.$store.state.user.signinPending;
    }
  }
};
</script>
