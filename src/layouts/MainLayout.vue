<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title>
          <q-avatar>
            <img src="udown-logo.png" />
          </q-avatar>
          U Down?
        </q-toolbar-title>

        <!-- User Pic -->
        <q-btn
          v-if="!user.id"
          class="q-mr-sm"
          icon="login"
          label="LOGIN"
          push
          size="13px"
          color="grey-1"
          text-color="dark"
        />
        <q-btn-dropdown
          v-if="user.id"
          class="q-mr-sm"
          size="13px"
          color="grey-1"
          push
          no-caps
          @click="onMainClick"
          text-color="dark"
        >
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-icon left name="person" />
              <div class="text-center" style="text-transform: uppercase">
                {{ user.first_name }}
              </div>
            </div>
          </template>

          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md gt-sm">Settings</div>

              <div class="lt-md items-center" style="min-width: 110px">
                <q-avatar class="q-mr-md" size="72px">
                  <img src="user-avatar.png" />
                </q-avatar>
                <q-btn
                  :color="user.id ? 'negative' : 'positive'"
                  :label="user.id ? 'Logout' : 'Login'"
                  push
                  size="12px"
                  v-close-popup
                />

                <q-input
                  v-model="user.bio"
                  class="q-mt-md q-mb-xs"
                  type="textarea"
                  label="Bio"
                  style="background-color: #fafad2"
                  filled
                  color="indigo"
                />
              </div>

              <!-- <q-toggle v-model="switchOne" label="Use Mobile Data" />
              <q-toggle v-model="switchTwo" label="Bluetooth" /> -->

              <q-input
                label="Username"
                class="q-mb-xs"
                v-model="user.username"
                dense
                filled
                color="indigo"
              >
                <!-- <template v-slot:after>
                  <q-btn round dense flat icon="edit" />
                </template> -->
              </q-input>
              <q-input
                label="First Name"
                filled
                class="q-mb-xs"
                v-model="user.first_name"
                dense
                color="indigo"
              />
              <q-input
                label="Last Name"
                filled
                class="q-mb-xs"
                v-model="user.last_name"
                dense
                color="indigo"
              />
              <div class="row">
                <q-input
                  label="Height"
                  filled
                  type="number"
                  style="max-width: 90px"
                  class="q-mb-xs"
                  v-model="user.height"
                  dense
                  color="indigo"
                />
                <q-input
                  label="Gender"
                  filled
                  style="max-width: 95px"
                  class="q-mb-xs q-ml-xs"
                  v-model="user.gender"
                  dense
                  color="indigo"
                />
              </div>
              <q-input
                label="Sport"
                filled
                class="q-mb-xs"
                v-model="user.sport"
                dense
                color="indigo"
              />
              <q-btn
                flat
                class="q-mt-md"
                label="Save Changes"
                icon="send"
                color="indigo"
              />
            </div>

            <q-separator vertical inset class="q-mx-lg gt-sm " />

            <div class="column gt-sm items-center" style="min-width: 110px">
              <q-avatar size="72px">
                <img src="user-avatar.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ user.id ? user.first_name + " " + user.last_name : "" }}
              </div>

              <q-btn
                :color="user.id ? 'negative' : 'positive'"
                :label="user.id ? 'Logout' : 'Login'"
                push
                size="12px"
                v-close-popup
              />

              <q-input
                v-model="user.bio"
                class="q-mt-md"
                type="textarea"
                label="Bio"
                style="background-color: #fafad2"
                filled
                color="indigo"
              />
            </div>
          </div>
        </q-btn-dropdown>

        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="rightDrawerStatus = !rightDrawerStatus"
        />
      </q-toolbar>

      <!-- <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs> -->
    </q-header>

    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      bordered
      mini
      :width="200"
      :breakpoint="500"
      content-class="bg-grey-3"
    >
      <!-- drawer content -->
      <q-list padding>
        <q-item
          to="courts"
          clickable
          v-ripple
          active-class="active-drawer-link"
        >
          <q-item-section avatar>
            <q-icon name="sports_basketball" />
          </q-item-section>

          <q-item-section>
            Locations
          </q-item-section>
        </q-item>

        <q-item
          to="/players"
          clickable
          v-ripple
          active-class="active-drawer-link"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>

          <q-item-section>
            Players
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerStatus" side="right" bordered>
      <!-- drawer content -->
      <events-list></events-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import eventsList from "../components/Events.vue";
export default {
  name: "MainLayout",
  data() {
    return {
      left: false,
      switchOne: false,
      switchTwo: true
    };
  },
  computed: {
    rightDrawerStatus: {
      get: function() {
        return this.$store.state.main.rightDrawerStatus;
      },
      set: function(val) {
        return this.$store.commit("main/setRightDrawerStatus", val);
      }
    },
    user() {
      return this.$store.state.user.data;
    }
  },
  methods: {
    onMainClick() {
      // console.log('Clicked on main button')
    },

    onItemClick() {
      // console.log('Clicked on an Item')
    }
  },
  components: {
    "events-list": eventsList
  }
};
</script>
<style lang="sass" scoped>
.active-drawer-link
  background-color: $dark
  color: $deep-orange-10
</style>
