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
          v-if="!user"
          class="q-mr-sm"
          icon="login"
          label="LOGIN"
          push
          to="/login"
          size="13px"
          color="grey-1"
          text-color="dark"
        />
        <q-btn-dropdown
          v-if="user"
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
            <div class="column items-center" style="min-width: 110px">
              <q-avatar size="72px">
                <q-img :ratio="1" :src="user.photo" />
                <span class="user-photo-placeholder">{{
                  user.first_name.charAt(0).toUpperCase() +
                    user.last_name.charAt(0).toUpperCase()
                }}</span>
              </q-avatar>
              <q-chip
                class="q-mt-md"
                dense
                square
                :label="'@' + user.username"
              />
              <div class="text-subtitle1 q-mb-xs">
                {{ user ? user.first_name + " " + user.last_name : "" }}
              </div>

              <q-btn-group
                ><q-btn
                  :color="user ? 'negative' : 'positive'"
                  :label="user ? 'Logout' : 'Login'"
                  push
                  size="12px"
                  @click="logout"
                  v-close-popup/>
                <q-btn
                  v-if="user"
                  to="/profile"
                  label="Profile"
                  push
                  color="indigo"
                  size="12px"
                  v-close-popup
              /></q-btn-group>

              <q-input
                v-model="user.bio"
                class="q-mt-md"
                type="textarea"
                label="Bio"
                style="background-color: #fafad2"
                filled
                color="indigo"
                readonly
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
          v-if="user"
          to="/profile"
          clickable
          v-ripple
          active-class="active-drawer-link"
        >
          <q-item-section avatar>
            <q-icon size="28px" name="account_box" />
          </q-item-section>

          <q-item-section>
            Profile
          </q-item-section>
        </q-item>
        <q-item
          to="courts"
          clickable
          v-ripple
          active-class="active-drawer-link"
        >
          <q-item-section avatar>
            <q-icon size="28px" name="sports_basketball" />
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
            <q-icon size="28px" name="people" />
          </q-item-section>

          <q-item-section>
            Players
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerStatus" side="right" elevated>
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
    },
    logout() {
      this.$store.commit("user/logout");
      this.$q.notify({
        color: "light-blue-4",
        icon: "logout",
        message: "Logged out"
      });
      this.$router.push("login");
    }
  },
  beforeMount() {
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
      //     icon: "cloud_download",
      //     message: message
      //   });
      // }
    });
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
