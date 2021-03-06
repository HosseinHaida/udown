<template>
  <div class="q-py-md row">
    <div class="col-xs-12">
      <q-input
        filled
        dense
        placeholder="Search"
        v-model="searchText"
        hint="Username, first name, last name"
        @input="fetchUsers(true)"
        class="q-mb-sm"
        debounce="200"
        :loading="usersFetchPending"
        bottom-slots
      >
        <template v-slot:prepend> <q-icon name="search"/></template
      ></q-input>
      <q-list class="rounded-borders q-py-sm">
        <!-- <q-item-label header>Users</q-item-label> -->
        <single-player
          v-for="(user, index) in users"
          :key="index"
          :user="user"
          :type="type"
          :canVerifyUsers="
            loggedInUser &&
              loggedInUser.scopes &&
              loggedInUser.scopes.includes('verify_users')
          "
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
          :isCloseFriend="
            loggedInUser &&
            loggedInUser.close_friends &&
            loggedInUser.close_friends.includes(user.id)
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
          :isRequesting="
            loggedInUser &&
            loggedInUser.inbound_requests &&
            loggedInUser.inbound_requests.includes(user.id)
              ? true
              : false
          "
          :canEditScopes="
            loggedInUser &&
              loggedInUser.scopes &&
              loggedInUser.scopes.includes('edit_users_scopes')
          "
        />
      </q-list>
      <div class="row">
        <q-pagination
          v-model="which.page"
          :max="total.pages"
          @input="fetchUsers"
          :input="true"
          size="16px"
        />
        <div class="col"></div>
        <q-chip square class="q-mt-sm q-pr-sm" dense
          ><q-avatar
            color="primary"
            text-color="white"
            class="text-weight-bold"
            >{{ total.count }}</q-avatar
          ><span class="q-ml-xs">{{
            type === "requests"
              ? "Requests"
              : type === "friends"
              ? "Friends"
              : type === "close"
              ? "Close friends"
              : "Users"
          }}</span></q-chip
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
  watch: {
    type: function() {
      this.fetchUsers(true);
    }
  },
  mounted() {
    this.fetchUsers(true);
  },
  destroyed() {
    this.$store.commit("users/setUsersList", []);
    this.$store.commit("users/setUsersListTotals", { pages: 0, count: 0 });
  }
};
</script>
