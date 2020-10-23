<template>
  <div>
    <q-item>
      <q-item-section avatar top>
        <q-avatar @click="userCard = true" style="cursor: pointer" size="55px">
          <q-img :ratio="1" :src="user.photo" />
          <span class="user-photo-placeholder">{{
            user.first_name.charAt(0).toUpperCase() +
              user.last_name.charAt(0).toUpperCase()
          }}</span>
        </q-avatar>
        <q-badge
          v-if="isCloseFriend"
          class="q-py-xs"
          floating
          style="z-index: 1"
          color="transparent"
          ><q-icon name="loyalty" size="sm" color="accent" class="q-mr-xs"
        /></q-badge>
      </q-item-section>

      <q-item-section
        top
        class="col-xs-auto col-sm-3 col-md-2 q-mr-sm username-field"
      >
        <div>
          <q-item-label class="q-mt-sm"
            ><span
              @click="userCard = true"
              style="cursor: pointer"
              class="text-subtitle2"
              >{{ user.username }}</span
            >
            <q-icon
              v-if="
                user.scopes.includes('edit_users_scopes') &&
                  user.scopes.includes('suspend_admins')
              "
              size="15px"
              color="accent"
              class="q-pl-xs"
              flat
              dense
              round
              name="all_inclusive"
            />
            <q-icon
              v-if="
                user.scopes.includes('edit_users_scopes') &&
                  !user.scopes.includes('suspend_admins')
              "
              size="15px"
              color="accent"
              class="q-pl-xs"
              flat
              dense
              round
              name="rule"
            />
            <q-icon
              v-if="user.verified"
              size="15px"
              class="q-pl-xs"
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

      <!-- Show user card -->
      <q-dialog v-model="userCard">
        <q-card>
          <q-img :src="user.photo" />

          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                {{ user.username }}
              </div>
              <div
                v-if="user.city"
                class="col-auto text-primary text-caption row no-wrap items-center"
              >
                <q-icon color="primary" class="q-pr-xs" name="place" />
                {{ user.city }}
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">
              {{ user.first_name }}
              {{ user.last_name }}
              <q-chip dense square icon="height"> {{ user.height }} cm </q-chip>
            </div>
            <div style="min-width: 250px" class="text-caption text-grey">
              <q-input
                :value="user.bio ? user.bio : 'No Biography'"
                class="q-mt-md"
                type="textarea"
                label="Bio"
                outlined
                style="background-color: #fafad2"
                color="indigo"
                readonly
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <span v-for="(sport, index) in sports" :key="index">
              <q-icon
                v-if="user.sports.includes(sport.val)"
                :name="sport.icon"
                class="q-ml-sm"
                size="26px"
                :color="sport.color"
              ></q-icon>
            </span>
            <q-btn-dropdown
              flat
              color="indigo"
              label="Options"
              class="q-pl-sm"
              style="margin-left: auto"
            >
              <div class="column">
                <q-btn
                  class="lt-sm"
                  @click="showScopesMenu(user.scopes)"
                  icon="admin_panel_settings"
                  label="Scopes"
                  color="primary"
                />
                <q-btn
                  class="q-mt-xs"
                  :label="user.verified ? 'Remove verification' : 'Verify user'"
                  :icon="user.verified ? 'remove' : 'verified_user'"
                  :disable="!canVerifyUsers"
                  v-if="!isMyself"
                  color="positive"
                  @click="
                    user.verified ? removeUserVerification() : verifyUser()
                  "
                />
                <q-btn
                  class="q-mt-xs"
                  :label="
                    isCloseFriend
                      ? 'Remove from close friends'
                      : 'Add to close friends'
                  "
                  :loading="closeFriendPending"
                  :icon="isCloseFriend ? 'remove' : 'loyalty'"
                  v-if="isFriend && !isMyself"
                  color="accent"
                  @click="
                    isCloseFriend
                      ? removeFromCloseFriends()
                      : addToCloseFriends()
                  "
                />
              </div>
            </q-btn-dropdown>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-item-section class="gt-xs col" top>
        <q-item-label lines="1">
          <span class="text-grey-8"></span>{{ user.bio }}
        </q-item-label>
        <q-item-label v-if="user.created_at" caption lines="1">
          {{ user.city ? user.city + " - " : "" }}
          Joined {{ getFullDate(user.created_at) }}
        </q-item-label>
        <q-item-label
          v-if="isUserLoggedIn && user !== undefined && user.scopes"
          lines="1"
          class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        >
          <q-btn-dropdown
            color="primary"
            flat
            @click="fillThisUsersScopes(user.scopes)"
            v-model="showScopes"
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <!-- <q-icon left name="map" /> -->
                <div class="text-center">Scopes</div>
              </div>
            </template>

            <div class="column q-pb-xs">
              <div class="row justify-center text-bold q-px-xs">
                <q-chip
                  color="primary"
                  text-color="white"
                  icon="alternate_email"
                  class="q-mb-xs col-xs-12"
                  square
                >
                  {{ user.username }}
                </q-chip>
              </div>
              <span v-for="(scope, index) in scopes" :key="index">
                <q-checkbox
                  v-if="user.scopes.includes(scope.name) || canEditScopes"
                  v-model="userScopes"
                  :val="scope.name"
                  :color="scope.color"
                  class="q-pl-xs q-pr-md"
                  :disable="
                    (isMyself && !canEditScopes) ||
                      (!isMyself && !canEditScopes)
                  "
                  style="min-width: 250px"
                >
                  <q-icon
                    class="col-auto q-mr-sm"
                    size="sm"
                    :name="scope.icon"
                    :color="scope.color"
                    text-color="white"
                  />
                  <span class="col-auto">{{ scope.desc }}</span>
                </q-checkbox>
              </span>
              <q-btn
                color="positive"
                class="q-mx-sm q-mb-xs q-mt-md"
                icon="check"
                label="Save"
                @click="saveUserScopes(user.id)"
                v-if="canEditScopes"
                :loading="userScopesUpdatePending"
              />
            </div>
          </q-btn-dropdown>
        </q-item-label>
      </q-item-section>

      <div class="col lt-sm"></div>

      <q-item-section side class="q-ml-md col-auto">
        <div class="text-grey-8 q-gutter-xs column">
          <q-btn
            v-if="isUserLoggedIn && !isMyself"
            class="bg-grey-2"
            size="12px"
            flat
            :loading="friendRequestPending"
            :color="isFriend ? 'positive' : isRequesting ? 'indigo' : ''"
            :icon="whichIconToShow(user.id)"
            @click="
              isFriend
                ? confirmUnfriend(user.id, user.username)
                : handleFriendRequest(user.id)
            "
          >
            <span class="q-px-sm gt-sm">{{
              isFriend
                ? "Friends"
                : isRequested
                ? "Requested"
                : isRequesting
                ? "Accept"
                : "Request"
            }}</span>
          </q-btn>
          <q-btn-dropdown
            flat
            dense
            class="q-pr-sm q-ml-xs"
            style="margin-left: auto"
            dropdown-icon="more_horiz"
          >
            <div class="column">
              <q-btn
                class="lt-sm"
                @click="showScopesMenu(user.scopes)"
                icon="admin_panel_settings"
                label="Scopes"
                color="primary"
              />
              <q-btn
                class="q-mt-xs"
                :label="user.verified ? 'Remove verification' : 'Verify user'"
                :icon="user.verified ? 'remove' : 'verified_user'"
                :disable="!canVerifyUsers"
                v-if="!isMyself"
                color="positive"
                @click="user.verified ? removeUserVerification() : verifyUser()"
              />
              <q-btn
                class="q-mt-xs"
                :label="
                  isCloseFriend
                    ? 'Remove from close friends'
                    : 'Add to close friends'
                "
                :loading="closeFriendPending"
                :icon="isCloseFriend ? 'remove' : 'loyalty'"
                v-if="isFriend && !isMyself"
                color="accent"
                @click="
                  isCloseFriend ? removeFromCloseFriends() : addToCloseFriends()
                "
              />
            </div>
          </q-btn-dropdown>
        </div>
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </div>
</template>
<script>
import { scopes } from "../store/scopes";
import { sports } from "../store/sports";
export default {
  name: "PlayerComponent",
  data() {
    return {
      scopes,
      sports,
      showScopes: false,
      userScopes: [],
      userCard: false
    };
  },
  props: [
    "user",
    "type",
    "isFriend",
    "canVerifyUsers",
    "isUserLoggedIn",
    "isMyself",
    "haveFriends",
    "isRequested",
    "isRequesting",
    "canEditScopes",
    "isCloseFriend"
  ],
  methods: {
    addToCloseFriends() {
      this.$store
        .dispatch("user/addToCloseFriends", this.user.id)
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
              icon: "loyalty",
              message: message
            });
          }
        });
    },
    removeFromCloseFriends() {
      this.$store
        .dispatch("user/removeFromCloseFriends", this.user.id)
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
              icon: "delete",
              message: message
            });
          }
        });
    },
    verifyUser() {
      this.$store
        .dispatch("users/verifyUser", this.user.id)
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
    removeUserVerification() {
      this.$store
        .dispatch("users/removeUserVerification", this.user.id)
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
              icon: "delete",
              message: message
            });
          }
        });
    },
    showScopesMenu(scopes) {
      this.fillThisUsersScopes(scopes);
      this.showScopes = !this.showScopes;
    },
    fillThisUsersScopes(scopes) {
      this.userScopes = scopes;
    },
    saveUserScopes(userId) {
      this.$store
        .dispatch("users/updateUserScopes", {
          scopes: this.userScopes,
          id: userId
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
          }
        });
    },
    confirmUnfriend(id, username) {
      this.$q
        .dialog({
          title: "Confirm",
          message: `Are you sure you want to remove <span style="color: #bf360c">${username}</span> from your friends?`,
          cancel: true,
          persistent: true,
          html: true,
          ok: {
            label: "Yes"
          }
        })
        .onOk(() => {
          this.handleFriendRequest(id);
        });
    },
    getFullDate(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
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
      return `${months[month]} ${day}. ${year}`;
    },
    whichIconToShow(id) {
      if (this.isFriend) {
        return "how_to_reg";
      } else if (this.isRequested) {
        return "hourglass_top";
      } else if (this.isRequesting) {
        return "check";
      } else {
        return "person_add";
      }
    },
    handleFriendRequest(id) {
      this.$store
        .dispatch("user/handleFriendRequest", id)
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
      return this.$store.state.user.friendRequestPending;
    },
    userScopesUpdatePending() {
      return this.$store.state.users.userScopesUpdatePending;
    },
    closeFriendPending() {
      return this.$store.state.user.closeFriendPending;
    }
  }
};
</script>
<style lang="sass" scoped>
@media (max-width: 321px)
  .username-field
    max-width: 110px
</style>
