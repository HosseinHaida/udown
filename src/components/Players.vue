<template>
  <div class="q-py-md column">
    <div class="col-xs-12">
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
        <single-player
          v-for="(user, index) in users"
          :key="index"
          :user="user"
          :isUserLoggedIn="loggedInUser ? true : false"
          :haveFriends="loggedInUser && loggedInUser.friends ? true : false"
          :isMyself="loggedInUser && loggedInUser.id !== user.id ? false : true"
          :isFriend="
            loggedInUser &&
            loggedInUser.friends &&
            loggedInUser.friends.includes(user.id)
              ? true
              : false
          "
          :isRequested="
            loggedInUser &&
            loggedInUser.outbound_requests &&
            loggedInUser.outbound_requests.includes(user.id)
              ? true
              : false
          "
        />
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
  </div>
</template>
<script>
import PlayerComponent from "./Player.vue";
export default {
  name: "PlayersComponent",
  data() {
    return {
      which: {
        page: 1
      },
      searchText: ""
    };
  },
  components: { "single-player": PlayerComponent },
  props: ["type", "howMany"],
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
    }
  },
  methods: {
    fetchUsers(goToFirstPage) {
      if (goToFirstPage === true) {
        this.which.page = 1;
      }
      this.$store
        .dispatch("users/fetchUsersList", {
          type: this.type,
          page: this.which.page,
          howMany: this.howMany,
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
    }
  },
  mounted() {
    this.fetchUsers(true);
  }
};
</script>
