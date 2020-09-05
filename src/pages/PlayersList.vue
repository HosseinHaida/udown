<template>
  <q-page class="q-pa-md row q-gutter-md justify-center">
    <div class="column full-width q-px-md">
      <q-input
        filled
        dense
        placeholder="Search"
        v-model="searchText"
        @input="fetchUsers(true)"
        class="q-mb-sm"
        debounce="200"
        :loading="usersFetchPending"
      />
      <q-list class="rounded-borders q-py-sm">
        <!-- <q-item-label header>Users</q-item-label> -->
        <div v-for="(user, index) in users" :key="index">
          <q-item>
            <q-item-section avatar top>
              <q-avatar>
                <q-img :ratio="1" :src="user.photo" />
                <span class="user-photo-placeholder">{{
                  user.first_name.charAt(0).toUpperCase() +
                    user.last_name.charAt(0).toUpperCase()
                }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section style="min-width: 118px" top class="col-2 q-mr-md">
              <div>
                <q-item-label class="q-mt-sm"
                  >{{ user.username }}
                  <q-icon
                    v-if="user.verified"
                    size="15px"
                    color="positive"
                    flat
                    dense
                    round
                    name="verified"
                  /><br />
                </q-item-label>
                <span class="text-grey-6">{{
                  user.first_name + " " + user.last_name
                }}</span>
              </div>
            </q-item-section>

            <q-item-section class="gt-sm" top>
              <q-item-label lines="1">
                <span class="text-grey-8"></span>{{ user.bio }}
              </q-item-label>
              <q-item-label v-if="user.created_at" caption lines="1">
                {{ user.city ? user.city + " - " : "" }}
                Joined {{ getYearPlusMonth(user.created_at) }}
              </q-item-label>
              <q-item-label
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
              >
                <q-btn dense flat class="cursor-pointer" label="VIEW" />
              </q-item-label>
            </q-item-section>

            <q-item-section v-if="loggedInUser" top side class="q-ml-md">
              <div
                v-if="loggedInUser.id !== user.id"
                class="text-grey-8 q-gutter-xs"
              >
                <q-btn
                  v-if="loggedInUser.friends"
                  class="bg-grey-2"
                  size="12px"
                  flat
                  :color="
                    loggedInUser.friends.includes(user.id) ? 'positive' : ''
                  "
                  :loading="friendRequestPending"
                  :icon="whichIconToShow(user.id)"
                  :disabled="
                    loggedInUser.friends.includes(user.id) ||
                      loggedInUser.requests.includes(user.id)
                  "
                  @click="sendFriendRequestTo(user.id)"
                >
                  <span class="q-px-sm gt-sm">{{
                    loggedInUser.friends.includes(user.id)
                      ? "Friends"
                      : isRequested(user.id)
                  }}</span>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </div>
      </q-list>
      <div class="row">
        <q-pagination
          v-model="which.page"
          :max="total.pages"
          @input="fetchUsers"
          :input="true"
        />
        <div class="col"></div>
        <q-chip square class="q-mt-sm q-pr-sm" dense
          ><q-avatar
            color="primary"
            text-color="white"
            class="text-weight-bold"
            >{{ total.count }}</q-avatar
          ><span class="q-ml-xs">Users</span></q-chip
        >
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: "PlayersList",
  data() {
    return {
      which: {
        page: 1,
        howMany: 25
      },
      searchText: ""
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.state.user.data;
    },
    users() {
      return this.$store.state.users.list;
    },
    total() {
      return this.$store.state.users.total;
    },
    usersFetchPending() {
      return this.$store.state.users.usersFetchPending;
    },
    friendRequestPending() {
      return this.$store.state.friendRequestPending;
    }
  },
  methods: {
    getYearPlusMonth(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth();
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      return months[month] + " " + year;
    },
    fetchUsers(goToFirstPage) {
      if (goToFirstPage === true) {
        this.which.page = 1;
      }
      this.$store
        .dispatch("users/fetchUsersList", {
          page: this.which.page,
          howMany: this.which.howMany,
          searchText: this.searchText
        })
        .then(({ status, message }) => {
          if (status === "error") {
            this.$q.notify({
              color: "red-5",
              icon: "warning",
              message: message
            });
          }
        });
    },
    sendFriendRequestTo(id) {
      this.$store
        .dispatch("user/sendFriendRequestTo", id)
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
    whichIconToShow(id) {
      if (this.loggedInUser.friends.includes(id)) {
        return "how_to_reg";
      } else {
        if (this.loggedInUser.requests.includes(id)) {
          return "hourglass_top";
        } else {
          return "person_add";
        }
      }
    },
    isRequested(id) {
      if (this.loggedInUser.requests.includes(id)) {
        return "Requested";
      } else {
        return "Request";
      }
    }
  },
  beforeMount() {
    this.fetchUsers(true);
  }
};
</script>
