<template>
  <q-page
    class="q-pa-md"
    :class="!user ? 'row items-center justify-center' : ''"
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
          <div class="col-md-3 col-sm-5 col-xs-12 q-px-md">
            <div class="column">
              <q-avatar size="140px" class="q-mb-lg q-mt-sm q-ml-sm">
                <q-img
                  :ratio="1"
                  :src="user.photo ? user.photo : 'user-avatar.png'"
                ></q-img
              ></q-avatar>
              <div class="row">
                <q-form class="col-xs-12 q-mb-md">
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
                      /> </template
                  ></q-file>
                </q-form>
                <q-checkbox
                  class="col-xs-12"
                  v-model="user.sports"
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
                  v-model="user.sports"
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
                  v-model="user.sports"
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
                  v-model="user.sports"
                  val="badminton"
                  color="grey-9"
                  ><q-icon
                    style="margin-top: -5px"
                    class="q-mr-md"
                    size="25px"
                    name="img:badminton.png"
                  />Badminton
                </q-checkbox>
                <q-input
                  v-model="user.bio"
                  class="q-mt-md col-xs-12 col-md-12"
                  type="textarea"
                  label="Bio"
                  filled
                  color="indigo"
                />
              </div>
            </div>
          </div>
          <div class="col-md-8 col-xs-12 col-sm-7 q-px-md">
            <q-form
              @submit="onFormSubmit"
              class="q-gutter-sm row items-start q-pt-xl"
            >
              <q-input
                class="col-xs-12 col-md-10"
                v-model="user.username"
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
                v-model="user.first_name"
                label="First name"
                lazy-rules
                dense
                color="indigo"
                :rules="[val => (val && val.length > 0) || 'Required']"
                style="min-width: 150px"
              />
              <q-input
                class="col-xs-12 col-md-5"
                v-model="user.last_name"
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
                v-model="user.gender"
                label="Gender"
                lazy-rules
                dense
                color="indigo"
                :rules="[val => val.length > 0 || 'Please select']"
              />
              <q-input
                class="q-mt-sm col-xs-12 col-md-5"
                v-model="user.height"
                label="Height"
                lazy-rules
                dense
                type="number"
                color="indigo"
                :rules="[
                  val =>
                    (val && val.length > 0 && val < 300) ||
                    'Please type a valid age'
                ]"
                hint="cm"
              />
              <q-select
                class="q-mt-sm col-xs-12 col-md-5"
                :options="cities"
                v-model="user.city"
                label="City"
                lazy-rules
                dense
                color="indigo"
                :rules="[val => val.length > 0 || 'Please select']"
              />
              <div class="col"></div>
              <q-btn
                class="q-mt-xl"
                color="indigo"
                type="submit"
                label="SAVE"
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
      tab: "personal",
      pickedPhoto: null,
      oldPassword: null,
      newPassword: null
    };
  },
  computed: {
    user: {
      set: function(val) {
        this.$store.commit("user/updateUser", val);
      },
      get: function() {
        return this.$store.state.user.data;
      }
    },
    genders() {
      return this.$store.state.main.genders;
    },
    cities() {
      return this.$store.state.main.cities;
    },
    photoUploadPending() {
      return this.$store.state.user.photoUploadPending;
    }
  },
  methods: {
    checkPhotoSize(files) {
      return files.filter(file => file.size < 1000000);
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Please select an image < 1 MB"
      });
    },
    onFormSubmit() {},
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
                textColor: "white",
                icon: "warning",
                message: message
              });
            } else if (status === "success") {
              this.$q.notify({
                color: "green-4",
                textColor: "white",
                icon: "cloud_done",
                message: message
              });
            }
          });
      }
    }
  }
};
</script>
