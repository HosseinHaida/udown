<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <q-form
        @submit="onSubmit"
        class="q-gutter-sm col-sm-9 col-xs-12 col-md-5 q-pt-md"
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
          v-model="password"
          label="Password *"
          lazy-rules
          color="indigo"
          :rules="[
            val => (val !== null && val !== '') || 'Please type your password'
          ]"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer q-mr-xs"
              @click="isPwd = !isPwd"
            /> </template
        ></q-input>
        <div class="row q-gutter-sm justify-between q-mb-md">
          <q-checkbox
            v-for="(sport, index) in sport_types"
            :key="index"
            v-model="sports"
            :val="sport.val"
            :color="sport.color"
            ><q-icon
              :color="sport.color"
              style="margin-top: -5px"
              class="q-mr-md"
              size="25px"
              :name="sport.icon"
            />
          </q-checkbox>
        </div>
        <div class="row justify-between q-gutter-md items-start">
          <q-select
            filled
            class="q-pt-md col-xs-12 col-md-5 q-pl-sm q-pr-md"
            :options="genders"
            v-model="gender"
            label="Gender *"
            lazy-rules
            color="indigo"
            required
          />
          <q-input
            filled
            class="q-pt-md col-xs-12 col-md-5 q-pl-sm q-pr-md"
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
import { sports } from "../store/sports";
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
      sport_types: sports,
      sports: ["basketball"],
      isPwd: true
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
