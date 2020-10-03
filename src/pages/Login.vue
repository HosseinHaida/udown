<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <q-form
        @submit="onSubmit"
        class="q-gutter-sm col-sm-9 col-xs-12 col-md-5 q-pt-md"
      >
        <div class="row justify-end">
          <q-img
            src="udown-logo.png"
            class="q-ml-lg q-mt-md q-mb-md"
            style="max-width: 120px; min-width: 80px"
          />
        </div>

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
          v-model="password"
          label="Password *"
          lazy-rules
          :rules="[val => (val !== null && val !== '') || 'Required']"
          style="min-width: 150px"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer q-mr-xs"
              @click="isPwd = !isPwd"
            /> </template
        ></q-input>
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
      password: null,
      isPwd: true
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
              icon: "warning",
              message: message
            });
          } else if (status === "success") {
            this.$q.notify({
              color: "green-4",
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
