<template>
  <div>
    <div v-if="!user" class="q-pa-md row">
      <div class="col-xs-12 text-center">
        <span class="text-subtitle1 q-py-sm q-px-md custom-warning-tip">
          Please login first
        </span>
      </div>
    </div>
    <q-page class="q-pa-md" v-if="court && user">
      <div class="row q-gutter-sm">
        <div class="col-md col-xs-12 q-pl-sm q-ml-none q-mb-md">
          <div class="row justify-center">
            <div
              class="q-mb-md text-white col-xs-12"
              style="border-radius: 4px 4px 0 0; min-height: 86px"
              :class="'bg-' + eventColor"
            >
              <div
                class="column full-height justify-center items-center q-px-sm"
              >
                <div class="text-h5">
                  {{ court.name
                  }}<q-btn
                    color="white"
                    icon="directions"
                    :text-color="eventColor"
                    class="q-ml-sm"
                    round
                    dense
                    no-caps
                    :to="'/courts/' + court.id"
                    style="opacity: 0.7;"
                  />
                </div>
                <div style="opacity: 0.6; font-size: 15px">
                  {{ court.city }}
                </div>
              </div>
            </div>
            <q-card class="col-xs-12 q-px-sm" flat>
              <div class="row items-center q-mb-md">
                <q-avatar size="80px">
                  <q-img :ratio="1" :src="user.photo" />
                  <span class="user-photo-placeholder">{{
                    user.first_name.charAt(0).toUpperCase() +
                      user.last_name.charAt(0).toUpperCase()
                  }}</span>
                </q-avatar>
                <div class="column q-ml-md">
                  <span class="text-grey-6">Created by</span>
                  <div>
                    <span class="text-subtitle2">{{ user.username }}</span>
                    <q-icon
                      v-if="user.verified"
                      size="15px"
                      class="q-pl-xs"
                      color="positive"
                      flat
                      dense
                      round
                      name="verified"
                    />
                  </div>
                  <span class="text-grey-6">{{
                    user.first_name + " " + user.last_name
                  }}</span>
                </div>
              </div>
              <q-form class="row items-center">
                <div class="col-xs-12">
                  <div class="row justify-end">
                    <span v-for="(sport, index) in sports" :key="index">
                      <q-radio
                        v-if="court.sport_types.includes(sport.val)"
                        :val="sport.val"
                        :color="sport.color"
                        v-model="event.sport_type"
                        ><q-icon
                          :color="sport.color"
                          style="margin-top: -5px"
                          class="q-mr-md"
                          size="25px"
                          :name="sport.icon"
                        />
                      </q-radio>
                    </span>
                  </div>
                </div>
                <div class="col-xs-12 q-mt-xs">
                  <q-select
                    :color="eventColor"
                    filled
                    v-model="eventType"
                    label="Who can see this event?"
                    :options="eventTypes"
                  >
                    <template v-slot:prepend>
                      <q-icon name="policy" />
                    </template>
                  </q-select>
                </div>

                <div class="col-xs-12 q-mt-xs">
                  <q-input
                    type="number"
                    placeholder="How many guests come with you"
                    filled
                    :color="eventColor"
                    v-model="event.guests"
                  >
                    <template v-slot:prepend>
                      <q-icon name="group_add" />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 q-mt-xs">
                  <q-input
                    :color="eventColor"
                    filled
                    v-model="newItem"
                    multiple
                    label="Whats needed * optional *"
                    use-chips
                  >
                    <template v-slot:prepend>
                      <q-icon name="backpack" />
                    </template>
                    <template v-slot:after>
                      <q-btn
                        icon="add"
                        round
                        :color="eventColor"
                        @click="addAnItem()"
                      />
                    </template>
                  </q-input>
                  <q-chip
                    class="q-ml-none"
                    v-for="(item, index) in event.whats_needed"
                    :key="index + 'needed'"
                    dense
                    :label="item"
                    removable
                    @remove="removeAnItem(item)"
                    square
                  />
                </div>
              </q-form>
            </q-card>
          </div>
        </div>
        <q-date
          v-model="event.happens_at"
          mask="YYYY-MM-DDTHH:mm:ss.SSSZ"
          class="col-md-3 col-xs-12 q-ml-none q-pl-sm"
          today-btn
          :color="eventColor"
          flat
          subtitle="Choose a date"
        />
        <q-time
          ref="timePicker"
          v-model="event.happens_at"
          mask="YYYY-MM-DDTHH:mm:ss.SSSZ"
          :color="eventColor"
          class="col-md-3 col-xs-12 q-ml-none q-pl-sm"
          now-btn
          flat
        />
      </div>
      <div class="row q-gutter-sm">
        <div class="col-xs-12 col-md-6 q-mt-md q-pl-sm q-ml-none">
          <div class="row justify-center">
            <div
              class="text-h6 text-white col-xs-12"
              style="border-radius: 4px 4px 0 0; min-height: 86px"
              :class="'bg-' + eventColor"
            >
              <div class="column full-height justify-center items-center">
                <div class="text-h5">Participants</div>
                <div style="font-size: 15px">
                  <q-toggle
                    class="text-weight-light"
                    label="Guests?"
                    v-model="event.guests_allowed"
                    color="positive"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-center q-mt-sm">
            <div class="col-xs-6 q-px-xs">
              <q-input
                v-model="event.min_viable_population"
                label="Min"
                filled
              />
            </div>
            <div class="col-xs-6 q-px-xs">
              <q-input
                :value="
                  event.max_viable_population === 0
                    ? null
                    : event.max_viable_population
                "
                @input="setMaxPop($event)"
                label="Max"
                :hint="
                  event.max_viable_population === 0
                    ? 'Change maximum capacity'
                    : '0 means unlimited'
                "
                filled
              >
                <template
                  v-if="event.max_viable_population === 0"
                  v-slot:prepend
                  ><q-icon name="all_inclusive"
                /></template>
              </q-input>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-6 q-mt-md q-pl-sm q-ml-none">
          <div class="row justify-center">
            <div
              class="text-h6 text-white col-xs-12"
              style="border-radius: 4px 4px 0 0; min-height: 86px"
              :class="'bg-' + eventColor"
            >
              <div class="column full-height justify-center items-center">
                <div class="text-h5">Hide from</div>
              </div>
            </div>
          </div>
          <div class="row justify-center q-mt-sm">
            <div class="col-xs-12 q-px-xs">
              <q-select
                filled
                v-model="event.hide_from"
                multiple
                use-input
                input-debounce="200"
                label="Search users"
                :options="usersOptions"
                @filter="filterUsers"
                use-chips
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-gutter-sm justify-center">
        <div class="col-auto q-mt-lg q-pl-sm q-ml-none">
          <q-btn
            round
            size="lg"
            @click="createEvent()"
            icon="done"
            :color="eventColor"
            :loading="eventInsertPending"
          />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { QSpinnerFacebook } from "quasar";
import { sports } from "../store/sports";
export default {
  data() {
    return {
      sports,
      eventTypes: ["Only friends", "Only close friends", "Public"],
      eventType: "Only friends",
      newItem: "",
      event: {
        hide_from: [],
        guests: null,
        guests_allowed: true,
        min_viable_population: 0,
        max_viable_population: 0,
        sport_type: "",
        happens_at: "",
        whats_needed: []
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    },
    court() {
      return this.$store.state.courts.thisCourt;
    },
    eventColor() {
      return this.eventType === "Only close friends"
        ? "deep-purple"
        : this.eventType === "Only friends"
        ? "green-10"
        : "indigo";
    },
    eventInsertPending() {
      return this.$store.state.events.eventInsertPending;
    },
    only_close_friends() {
      return this.eventType === "Only close friends";
    },
    is_public() {
      return this.eventType === "Public";
    },
    usersOptions() {
      return this.$store.state.users.usersOptions;
    }
  },
  methods: {
    createEvent() {
      this.event.location_id = this.court.id;
      this.event.is_public = this.is_public;
      this.event.only_close_friends = this.only_close_friends;
      this.$store
        .dispatch("events/createNewEvent", this.event)
        .then(({ status, message, users }) => {
          if (status === "error") {
            this.$q.notify({
              color: "red-5",
              icon: "warning",
              message: message
            });
          }
          if (status === "success") {
            this.$q.notify({
              color: "green-4",
              icon: "cloud_done",
              message: message
            });
            this.$router.push("/events");
          }
        });
    },
    filterUsers(val, update) {
      const searchText = val;
      if (searchText === "" || searchText.trim().length === 0) {
        update(() => {
          this.$store.commit("users/setUsersOptions", []);
        });
        return;
      }
      update(() => {
        this.fetchUsers(searchText);
      });
    },
    fetchUsers(searchText) {
      this.$store
        .dispatch("users/fetchUsersListAsOptions", searchText)
        .then(({ status, message, users }) => {
          if (status === "error") {
            this.$q.notify({
              color: "red-5",
              icon: "warning",
              message: message
            });
          }
        });
    },
    setMaxPop(val) {
      this.event.max_viable_population = val;
    },
    addAnItem() {
      if (this.newItem !== "" && this.newItem.trim().length !== 0) {
        this.event.whats_needed.push(this.newItem);
      }
      this.newItem = "";
    },
    removeAnItem(item) {
      this.event.whats_needed = this.event.whats_needed.filter(
        arrayItem => arrayItem !== item
      );
    },
    fetchCourt(id) {
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "primary",
        spinnerSize: 140,
        backgroundColor: "indigo",
        message: "Fetching location. Hang on...",
        messageColor: "primary"
      });
      this.$store
        .dispatch("courts/fetchCourt", id)
        .then(({ status, message }) => {
          this.$q.loading.hide();
          if (status === "error") {
            this.$q.notify({
              color: "red-5",
              icon: "warning",
              message: message
            });
            this.$router.push("/");
          }
        });
    }
  },
  mounted() {
    this.fetchCourt(this.$route.params.location_id);
    if (this.$refs["timePicker"]) {
      this.$refs["timePicker"].setNow();
    }
  }
};
</script>
