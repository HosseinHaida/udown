<template>
  <div>
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

      <q-item-section top class="col-xs-4 col-sm-3 col-md-2 q-mr-sm">
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

      <q-item-section class="gt-xs col" top>
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

      <div class="col lt-sm"></div>

      <q-item-section
        v-if="isUserLoggedIn && !isMyself && haveFriends"
        top
        side
        class="q-ml-md col-auto"
      >
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            class="bg-grey-2"
            size="12px"
            flat
            :loading="friendRequestPending"
            :color="isFriend ? 'positive' : ''"
            :icon="whichIconToShow(user.id)"
            :disabled="isFriend || isRequested"
            @click="sendFriendRequestTo(user.id)"
          >
            <span class="q-px-sm gt-sm">{{
              isFriend ? "Friends" : isRequested ? "Requested" : "Request"
            }}</span>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </div>
</template>
<script>
export default {
  name: "PlayerComponent",
  props: [
    "user",
    "isFriend",
    "isUserLoggedIn",
    "isMyself",
    "haveFriends",
    "isRequested"
  ],
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
    whichIconToShow(id) {
      if (this.isFriend) {
        return "how_to_reg";
      } else {
        if (this.isRequested) {
          return "hourglass_top";
        } else {
          return "person_add";
        }
      }
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
    }
  },
  computed: {
    friendRequestPending() {
      return this.$store.state.friendRequestPending;
    }
  }
};
</script>
