<template>
  <q-page
    class="q-pa-md"
    :class="!user ? 'row items-center justify-evenly' : ''"
  >
    <div v-if="!user" class="col-xs-12 text-center text-h4">
      Please login first
    </div>

    <q-card v-if="user" flat bordered>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="personal" label="Personal" />
        <q-tab name="friends" label="Friends" />
        <q-tab name="photos" label="Photos" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated style="min-height: 450px">
        <q-tab-panel name="personal" class="row justify-between">
          <div class="col-md-4 col-sm-5 col-xs-12 q-px-md">
            <div class="column">
              <q-avatar
                style="cursor: pointer"
                @click="showPhoto = true"
                size="140px"
                class="q-mb-lg q-mt-sm q-ml-sm"
              >
                <q-img :ratio="1" :src="user.photo"></q-img
                ><span class="user-photo-placeholder">{{
                  user.first_name.charAt(0).toUpperCase() +
                    user.last_name.charAt(0).toUpperCase()
                }}</span></q-avatar
              >
              <!-- Modal to show big Photo -->
              <q-dialog v-if="user.photo" v-model="showPhoto">
                <q-card style="width: 700px; max-width: 80vw;">
                  <q-bar class="bg-white">
                    <span class="text-subtitle1">{{ user.first_name }}</span>
                    <q-space />

                    <q-btn size="14px" dense flat icon="close" v-close-popup>
                      <q-tooltip>Close</q-tooltip>
                    </q-btn>
                  </q-bar>
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
                    label="Pick a photo"
                    dense
                    accept=".jpg, image/*"
                    :filter="checkPhotoSize"
                    @rejected="onRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:after>
                      <q-btn
                        @click="onPhotoUploadClick"
                        round
                        dense
                        flat
                        icon="send"
                        :loading="photoUploadPending"
                        ><q-tooltip
                          content-class="bg-info"
                          content-style="font-size: 14px"
                          :offset="[10, 10]"
                        >
                          Save photo
                        </q-tooltip></q-btn
                      >
                    </template>
                    <!-- <template v-slot:before>
                      <q-btn
                        @click="onPhotoUploadClick"
                        round
                        dense
                        flat
                        icon="delete"
                        :loading="photoUploadPending"
                      >
                        <q-tooltip
                          content-class="bg-red-5"
                          content-style="font-size: 14px"
                          :offset="[10, 10]"
                        >
                          Delete current photo
                        </q-tooltip>
                      </q-btn>
                    </template> -->
                  </q-file>
                </q-form>
                <q-input
                  :value="user.bio"
                  @input="updateUser('bio', $event)"
                  rows="4"
                  style="max-height: 200px"
                  class="q-my-md col-xs-12 col-md-12"
                  type="textarea"
                  label="Bio"
                  filled
                  color="indigo"
                />
                <q-checkbox
                  class="col-xs-12"
                  :value="user.sports"
                  @input="updateUser('sports', $event)"
                  val="basketball"
                  color="primary"
                  ><q-icon
                    color="primary"
                    style="margin-top: -5px"
                    class="q-mr-md"
                    size="25px"
                    name="sports_basketball"
                  />Basketball
                </q-checkbox>
                <q-checkbox
                  class="col-xs-12"
                  :value="user.sports"
                  @input="updateUser('sports', $event)"
                  val="volleyball"
                  color="blue"
                >
                  <q-icon
                    color="blue"
                    style="margin-top: -5px"
                    class="q-mr-md"
                    size="25px"
                    name="sports_volleyball"
                  />
                  Volleyball
                </q-checkbox>
                <q-checkbox
                  class="col-xs-12"
                  :value="user.sports"
                  @input="updateUser('sports', $event)"
                  val="soccer"
                  color="black"
                  ><q-icon
                    color="black"
                    style="margin-top: -5px"
                    class="q-mr-md"
                    size="25px"
                    name="sports_soccer"
                  />Soccer
                </q-checkbox>
                <q-checkbox
                  class="col-xs-12"
                  :value="user.sports"
                  @input="updateUser('sports', $event)"
                  val="badminton"
                  color="grey-9"
                  ><q-icon
                    style="margin-top: -5px"
                    class="q-mr-md"
                    size="25px"
                    name="img:badminton.png"
                  />Badminton
                </q-checkbox>
              </div>
            </div>
          </div>
          <div class="col-md-8 col-xs-12 col-sm-7 q-px-md">
            <q-form
              @submit="onFormSubmit"
              class="q-gutter-sm row items-start q-pt-xl q-px-sm"
            >
              <q-input
                class="col-xs-12 col-md-10"
                :value="user.username"
                @input="updateUser('username', $event)"
                label="Username"
                lazy-rules
                dense
                color="indigo"
                :icon="user.verified === true ? 'verified' : 'person'"
                :rules="[
                  val => (val && val.length > 0) || 'Please type something'
                ]"
              />
              <q-input
                class="col-xs-12 col-md-5"
                :value="user.first_name"
                @input="updateUser('first_name', $event)"
                label="First name"
                lazy-rules
                dense
                color="indigo"
                :rules="[val => (val && val.length > 0) || 'Required']"
                style="min-width: 150px"
              />
              <q-input
                class="col-xs-12 col-md-5"
                :value="user.last_name"
                @input="updateUser('last_name', $event)"
                label="Last name"
                lazy-rules
                dense
                color="indigo"
                :rules="[val => (val && val.length > 0) || 'Required']"
                style="min-width: 150px"
              />
              <q-input
                class="col-xs-12 col-md-5"
                type="password"
                v-model="oldPassword"
                label="Old password"
                lazy-rules
                dense
                color="indigo"
                :rules="[
                  val =>
                    val.length > 8 || val.length === 0 || 'Minimum 8 characters'
                ]"
              /><q-input
                class="col-xs-12 col-md-5"
                type="password"
                v-model="newPassword"
                label="New password"
                lazy-rules
                dense
                color="indigo"
                :rules="[
                  val =>
                    val.length > 8 || val.length === 0 || 'Minimum 8 characters'
                ]"
              />
              <q-select
                class="q-mt-sm col-xs-12 col-md-5"
                :options="genders"
                :value="user.gender"
                @input="updateUser('gender', $event)"
                label="Gender"
                lazy-rules
                dense
                color="indigo"
                :rules="[val => val.length > 0 || 'Please select']"
              />
              <q-input
                class="q-mt-sm col-xs-12 col-md-5"
                :value="user.height"
                @input="updateUser('height', $event)"
                label="Height"
                lazy-rules
                dense
                type="number"
                color="indigo"
                :rules="[
                  val => (val > 0 && val < 300) || 'Please type a valid age'
                ]"
                hint="cm"
              />
              <q-select
                class="q-mt-sm col-xs-12 col-md-5"
                :options="cities"
                :value="user.city"
                @input="updateUser('city', $event)"
                label="City"
                lazy-rules
                dense
                color="indigo"
              />
              <div class="col-xs-9"></div>
              <q-btn
                class="q-mt-lg"
                color="indigo"
                type="submit"
                label="SAVE"
                :loading="updatePending"
              ></q-btn>
            </q-form>
          </div>
        </q-tab-panel>

        <q-tab-panel name="friends">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="photos">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
<script>
export default {
  name: "profile",
  data() {
    return {
      showPhoto: false,
      tab: "personal",
      pickedPhoto: null,
      oldPassword: "",
      newPassword: ""
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
      return files.filter(file => file.size < 1000000);
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        color: "red-5",
        icon: "warning",
        message: "Please select an image less than 1 MB"
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
      // else if (status === "success") {
      //   this.$q.notify({
      //     color: "light-blue-4",
      //     badgeColor: "indigo",
      //     icon: "cloud_download",
      //     message: message
      //   });
      // }
    });
  }
};
</script>
