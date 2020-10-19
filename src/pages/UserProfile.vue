<template>
  <q-page class="q-pa-md" :class="!user ? 'row justify-evenly' : ''">
    <!-- //////////// In case nobody's logged in ///////////// -->
    <div v-if="!user" class="col-xs-12 text-center">
      <span class="text-subtitle1 q-py-sm q-px-md custom-warning-tip">
        Please login first
      </span>
    </div>

    <q-card v-if="user" flat>
      <!-- <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="personal" label="Personal" />
        <q-tab
          name="friends"
          label="Friends"
          @click="fetchInboundRequestsCount()"
          ><q-badge
            v-if="inboundRequestsCount > 0"
            color="indigo"
            floating
            transparent
            :label="inboundRequestsCount"
            style="margin-right: -10px"
        /></q-tab>
      </q-tabs> -->

      <!-- <q-separator /> -->

      <!-- <q-tab-panels v-model="tab" style="min-height: 450px"> -->
      <!-- <q-tab-panel name="personal" class="row justify-between"> -->
      <div class="row justify-between">
        <div class="col-xs-12">
          <div class="text-h5 text-grey-7 q-pb-sm">Personal</div>
          <q-separator />
        </div>

        <div class="col-md-4 col-sm-5 col-xs-12 first-column">
          <div class="column q-mt-md">
            <q-avatar
              style="cursor: pointer"
              @click="showPhoto = true"
              size="140px"
              class="q-mb-lg q-mt-sm q-ml-sm"
            >
              <q-img :ratio="1" :src="user.photo">
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center bg-primary text-subtitle2 text-white"
                  >
                    Upload another photo
                  </div>
                </template></q-img
              ><span class="user-photo-placeholder">{{
                user.first_name.charAt(0).toUpperCase() +
                  user.last_name.charAt(0).toUpperCase()
              }}</span></q-avatar
            >
            <!-- Modal to show big Photo -->
            <q-dialog v-if="user.photo" v-model="showPhoto">
              <q-card
                class="bg-transparent"
                style="width: 750px; max-width: 90vw;"
                flat
              >
                <q-card-section class="row items-center q-pb-md">
                  <!-- <div class="text-h6">Close icon</div> -->
                  <q-space />
                  <q-btn
                    size="lg"
                    color="white"
                    text-color="black"
                    icon="close"
                    round
                    dense
                    v-close-popup
                  />
                </q-card-section>
                <q-card-section style="padding: 0">
                  <q-img class="full-width" contain :src="user.photo"></q-img>
                </q-card-section>
              </q-card>
            </q-dialog>
            <div class="row">
              <q-form class="col-xs-12">
                <q-file
                  v-model="pickedPhoto"
                  filled
                  dense
                  label="Pick a photo"
                  accept=".jpg, image/*"
                  :filter="checkPhotoSize"
                  @rejected="onRejected"
                >
                  <template v-slot:prepend>
                    <q-icon dense name="attach_file" />
                  </template>
                  <template v-slot:after>
                    <q-btn
                      @click="onPhotoUploadClick"
                      round
                      outline
                      icon="check"
                      :loading="photoUploadPending"
                      ><q-tooltip
                        content-style="font-size: 12px"
                        :offset="[10, 10]"
                      >
                        Save photo
                      </q-tooltip></q-btn
                    >
                  </template>
                </q-file>
              </q-form>
              <q-input
                :value="user.bio"
                @input="updateUser('bio', $event)"
                rows="4"
                style="max-height: 300px"
                class="q-my-md col-xs-12 col-md-12"
                type="textarea"
                label="Bio"
                filled
                color="indigo"
              />
              <q-checkbox
                v-for="(sport, index) in sports"
                :key="'sport' + index"
                class="col-xs-12"
                :value="user.sports"
                :val="sport.val"
                :color="sport.color"
                @input="updateUser('sports', $event)"
                ><q-icon
                  :color="sport.color"
                  style="margin-top: -5px"
                  class="q-mr-md"
                  size="25px"
                  :name="sport.icon"
                />{{ sport.label }}
              </q-checkbox>
            </div>
          </div>
        </div>
        <div class="col-md-8 col-xs-12 col-sm-7">
          <q-form
            @submit="onFormSubmit"
            class="q-gutter-sm row justify-center q-pt-xl"
          >
            <div class="col-xs-12">
              <div class="row">
                <q-input
                  class="col-xs-12 q-px-sm"
                  :value="user.username"
                  @input="updateUser('username', $event)"
                  label="Username"
                  lazy-rules
                  filled
                  color="indigo"
                  :rules="[
                    val => (val && val.length > 0) || 'Please type something'
                  ]"
                  bottom-slots
                >
                  <template v-slot:prepend>
                    <q-icon
                      class="q-mr-xs"
                      :name="user.verified ? 'verified' : 'person'"
                    />
                  </template>
                </q-input>
                <q-input
                  class="col-xs-12 col-md-6 q-px-sm"
                  :value="user.first_name"
                  @input="updateUser('first_name', $event)"
                  label="First name"
                  lazy-rules
                  filled
                  color="indigo"
                  :rules="[val => (val && val.length > 0) || 'Required']"
                  style="min-width: 150px"
                />
                <q-input
                  class="col-xs-12 col-md-6 q-px-sm"
                  :value="user.last_name"
                  @input="updateUser('last_name', $event)"
                  label="Last name"
                  lazy-rules
                  filled
                  color="indigo"
                  :rules="[val => (val && val.length > 0) || 'Required']"
                  style="min-width: 150px"
                />
                <q-input
                  class="col-xs-12 col-md-6 q-px-sm"
                  v-model="oldPassword"
                  label="Old password"
                  lazy-rules
                  filled
                  color="indigo"
                  :rules="[
                    val =>
                      val.length > 8 ||
                      val.length === 0 ||
                      'Minimum 8 characters'
                  ]"
                  :type="isPwd ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer q-mr-xs"
                      @click="isPwd = !isPwd"
                    /> </template></q-input
                ><q-input
                  class="col-xs-12 col-md-6 q-px-sm"
                  v-model="newPassword"
                  label="New password"
                  lazy-rules
                  filled
                  color="indigo"
                  :rules="[
                    val =>
                      val.length > 8 ||
                      val.length === 0 ||
                      'Minimum 8 characters'
                  ]"
                  :type="isNewPwd ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isNewPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer q-mr-xs"
                      @click="isNewPwd = !isNewPwd"
                    /> </template
                ></q-input>
                <q-select
                  class="q-mt-sm col-xs-12 col-md-6 q-px-sm"
                  :options="genders"
                  :value="user.gender"
                  @input="updateUser('gender', $event)"
                  label="Gender"
                  lazy-rules
                  filled
                  color="indigo"
                  :rules="[val => val.length > 0 || 'Please select']"
                />
                <q-input
                  class="q-mt-sm col-xs-12 col-md-6 q-px-sm"
                  :value="user.height"
                  @input="updateUser('height', $event)"
                  label="Height"
                  lazy-rules
                  filled
                  type="number"
                  color="indigo"
                  :rules="[
                    val => (val > 0 && val < 300) || 'Please type a valid age'
                  ]"
                  hint="cm"
                />
                <q-select
                  class="q-mt-sm col-xs-12 q-px-sm"
                  :options="cities"
                  :value="user.city"
                  @input="updateUser('city', $event)"
                  label="City"
                  lazy-rules
                  filled
                  color="indigo"
                  bottom-slots
                >
                  <template v-slot:after>
                    <q-icon class="q-mr-xs" name="place" />
                  </template>
                </q-select>
                <div class="col-xs-12 q-px-sm">
                  <div class="row">
                    <div class="col"></div>
                    <q-btn
                      class="q-mt-lg col-auto"
                      color="indigo"
                      type="submit"
                      label="SAVE"
                      :loading="updatePending"
                    ></q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </div>
      </div>
      <!-- </q-tab-panel> -->

      <!-- <q-tab-panel class="row justify-start" name="friends">
          <div class="col-xs-12">
            <players-component
              :type="usersType"
              :howMany="25"
            ></players-component>
          </div>
        </q-tab-panel> -->

      <!-- <q-tab-panel name="photos">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel> -->
      <!-- </q-tab-panels> -->
    </q-card>
  </q-page>
</template>
<script>
import PlayersComponent from "../components/Players.vue";
import { sports } from "../store/sports";
export default {
  name: "profile",
  // components: { "players-component": PlayersComponent },
  data() {
    return {
      showPhoto: false,
      tab: "personal",
      pickedPhoto: null,
      oldPassword: "",
      newPassword: "",
      sports: sports,
      isPwd: true,
      isNewPwd: true
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    },
    genders() {
      return this.$store.state.main.genders;
    },
    cities() {
      return this.$store.state.main.cities;
    },
    updatePending() {
      return this.$store.state.user.updatePending;
    },
    photoUploadPending() {
      return this.$store.state.user.photoUploadPending;
    }
  },
  methods: {
    updateUser(key, value) {
      this.$store.commit("user/updateUserObj", { key, value });
    },
    checkPhotoSize(files) {
      return files.filter(file => file.size < 2000000);
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        color: "red-5",
        icon: "warning",
        message: "Please select an image less than 2 MBs"
      });
    },
    onFormSubmit() {
      this.$store.commit("user/updateUserObj", {
        key: "old_password",
        value: this.oldPassword
      });
      this.$store.commit("user/updateUserObj", {
        key: "new_password",
        value: this.newPassword
      });
      this.$store
        .dispatch("user/update", this.user)
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
          }
        });
    },
    onPhotoUploadClick() {
      if (this.pickedPhoto) {
        const formData = new FormData();
        formData.append("photo", this.pickedPhoto);
        this.$store
          .dispatch("user/uploadPhoto", formData)
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
            }
          });
      }
    }
  },
  mounted() {
    this.$store.dispatch("user/fetchUserData").then(({ status, message }) => {
      if (status === "error") {
        this.$q.notify({
          color: "red-5",
          icon: "warning",
          message: message
        });
      }
      this.fetchInboundRequestsCount();
    });
  }
};
</script>
<style lang="sass" scoped>
@media (min-width: 600px)
  .first-column
    padding-right: 20px
</style>
