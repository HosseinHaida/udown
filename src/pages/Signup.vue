<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <q-form
        @submit="onSubmit"
        class="q-gutter-sm col-sm-9 col-xs-12 col-md-4 q-pt-md"
      >
        <q-img
          src="udown-logo.png"
          class="q-ml-md q-mt-md q-mb-md"
          style="max-width: 120px; min-width: 80px; float: right"
        />
        <q-input
          filled
          v-model="firstName"
          label="First name *"
          lazy-rules
          color="indigo"
          :rules="[val => (val && val.length > 0) || 'Required']"
          style="min-width: 150px"
        />
        <q-input
          filled
          v-model="lastName"
          label="Last name *"
          lazy-rules
          color="indigo"
          :rules="[val => (val && val.length > 0) || 'Required']"
          style="min-width: 150px"
        />
        <q-input
          filled
          icon="person"
          v-model="username"
          label="Username *"
          lazy-rules
          color="indigo"
          :rules="[val => (val && val.length > 0) || 'Please type something']"
        >
          <template v-slot:prepend> <q-icon name="person" /> </template
        ></q-input>
        <q-input
          filled
          type="password"
          v-model="password"
          label="Password *"
          lazy-rules
          color="indigo"
          :rules="[
            val => (val !== null && val !== '') || 'Please type your password'
          ]"
        />
        <div class="row q-gutter-sm justify-between q-mb-md">
          <q-checkbox v-model="sports" val="basketball" color="primary"
            ><q-icon
              color="primary"
              style="margin-top: -5px"
              class="q-mr-md"
              size="25px"
              name="sports_basketball"
          /></q-checkbox>
          <q-checkbox v-model="sports" val="volleyball" color="blue"
            ><q-icon
              color="blue"
              style="margin-top: -5px"
              class="q-mr-md"
              size="25px"
              name="sports_volleyball"
          /></q-checkbox>
          <q-checkbox v-model="sports" val="soccer" color="black"
            ><q-icon
              color="black"
              style="margin-top: -5px"
              class="q-mr-md"
              size="25px"
              name="sports_soccer"
          /></q-checkbox>
          <q-checkbox v-model="sports" val="badminton" color="grey-9"
            ><q-icon
              style="margin-top: -5px"
              class="q-mr-md"
              size="25px"
              name="img:badminton.png"
          /></q-checkbox>
        </div>
        <div class="row justify-between">
          <q-select
            filled
            class="q-mt-sm col-xs-12 col-md-5"
            :options="genders"
            v-model="gender"
            label="Gender *"
            lazy-rules
            color="indigo"
            :rules="[val => val.length > 0 || 'Please select']"
          />
          <q-input
            filled
            class="q-mt-sm col-xs-12 col-md-5"
            v-model="height"
            label="Height *"
            lazy-rules
            type="number"
            color="indigo"
            :rules="[
              val =>
                (val && val.length > 0 && val < 300) ||
                'Please type a valid age'
            ]"
            hint="cm"
          />
        </div>
        <div>
          <q-btn
            :loading="signupPending"
            class="q-mt-md"
            label="Signup"
            type="submit"
            color="indigo"
          />
          <q-btn
            label="Login"
            to="/login"
            color="indigo"
            flat
            class="q-ml-sm q-mt-md"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
export default {
  name: "signup",
  data() {
    return {
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      gender: null,
      height: null,
      sports: ["basketball"]
    };
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("user/signup", {
          username: this.username,
          password: this.password,
          first_name: this.firstName,
          last_name: this.lastName,
          gender: this.gender,
          height: this.height,
          sports: this.sports
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
              icon: "cloud_done",
              message: message
            });
            this.$router.push("/");
          }
        });
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        color: "red-5",
        icon: "warning",
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      });
    }
  },
  computed: {
    signupPending() {
      return this.$store.state.user.signupPending;
    },
    genders() {
      return this.$store.state.main.genders;
    }
  }
};
</script>
