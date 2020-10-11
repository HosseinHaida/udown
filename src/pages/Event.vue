<template>
  <q-page class="q-pa-md" v-if="event && loggedInUser">
    <div class="row q-gutter-sm">
      <div class="col-md col-xs-12 q-pl-sm q-ml-none q-mb-md">
        <div class="row justify-center">
          <div
            class="q-mb-md text-white col-xs-12"
            style="border-radius: 4px 4px 0 0; min-height: 86px"
            :class="'bg-' + eventColor"
          >
            <div class="column full-height justify-center items-center q-px-sm">
              <div class="text-h5">
                {{ event.name
                }}<q-btn
                  color="white"
                  icon="directions"
                  :text-color="eventColor"
                  class="q-ml-sm"
                  round
                  dense
                  no-caps
                  :to="'/courts/' + event.location_id"
                  style="opacity: 0.7;"
                />
              </div>
              <div style="opacity: 0.6; font-size: 15px">
                {{ event.city }}
              </div>
            </div>
          </div>
          <q-card class="col-xs-12 q-px-sm" flat>
            <div
              class="row items-center q-mb-md"
              :class="
                event.created_by === loggedInUser.id ? 'justify-between' : ''
              "
            >
              <q-avatar size="80px">
                <q-img :ratio="1" :src="event.photo" />
                <span class="user-photo-placeholder">{{
                  event.first_name.charAt(0).toUpperCase() +
                    event.last_name.charAt(0).toUpperCase()
                }}</span>
              </q-avatar>
              <div class="column q-ml-md">
                <span class="text-grey-6">Created by</span>
                <div>
                  <span class="text-subtitle2">{{ event.username }}</span>
                  <q-icon
                    v-if="event.verified"
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
                  event.first_name + " " + event.last_name
                }}</span>
              </div>
              <div
                class="col"
                v-if="event.created_by === loggedInUser.id"
              ></div>
              <q-btn-dropdown
                v-if="event.created_by === loggedInUser.id"
                color="negative"
                dropdown-icon="more_horiz"
                class="q-pr-sm bg-grey-2"
                dense
                flat
              >
                <q-btn
                  label="Cancel"
                  @click="cancelEvent()"
                  icon="close"
                  color="negative"
                ></q-btn>
              </q-btn-dropdown>
            </div>
            <div class="row items-center">
              <q-table
                class="col-xs-12"
                :data="data"
                :columns="columns"
                row-key="name"
                hide-header
                hide-bottom
                flat
              />
            </div>
          </q-card>
        </div>
      </div>
      <q-date
        :value="getFullDateWithDashes(event.happens_at)"
        mask="YYYY-M-D"
        class="col-md-3 col-xs gt-sm"
        readonly
        :color="eventColor"
        flat
      />
      <div class="col-md-3 col-xs col-sm lt-md">
        <div class="row justify-center">
          <div
            class="text-h6 q-mb-md text-white col-xs-12"
            style="border-radius: 4px 4px 0 0; min-height: 86px"
            :class="'bg-' + eventColor"
          >
            <div class="row full-height justify-center items-center q-px-md">
              <span>{{ getEventDate() }}</span>
            </div>
          </div>
          <div class="col-xs-12 text-subtitle2">
            <div class="row full-height justify-center items-center">
              <div class="col-xs-12">
                <q-chip
                  class="q-ma-none time-chip"
                  size="17px"
                  square
                  style="width: 100%"
                  ><q-avatar
                    icon="event"
                    text-color="white"
                    :color="eventColor"
                  />
                  <span class="full-width text-center">{{
                    getMonthPlusDay()
                  }}</span>
                </q-chip>
              </div>
              <div class="col-xs-12 q-mt-sm">
                <q-chip class="q-ma-none time-chip" :label="getYear()" square />
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-time
        :value="getTime(event.happens_at)"
        mask="HH:mm"
        :color="eventColor"
        class="col-md-3 col-xs col-sm-4"
        readonly
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
                <q-chip style="opacity: 0.6" dense square
                  >Min {{ event.min_viable_population }}</q-chip
                >
                <q-chip style="opacity: 0.6" dense square
                  >Max
                  <span
                    class="q-ml-xs"
                    v-if="event.max_viable_population > 0"
                    >{{ event.max_viable_population }}</span
                  >
                  <span v-else>
                    <q-icon
                      size="16px"
                      class="q-ml-xs"
                      name="all_inclusive"
                    /> </span
                ></q-chip>
                <span style="opacity: 0.9">
                  <q-toggle
                    color="positive"
                    unchecked-icon="clear"
                    :value="event.guests_allowed"
                    label="Guests"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-xs-12 q-pt-sm"
            v-if="event.participants && event.participants.length > 0"
          >
            <!-- <players-component type="all" :howMany="5"></players-component> -->
            <!-- ///////////////////////////// -->
            <!-- ///////////////////////////// -->
            <div v-for="(user, index) in event.participants" :key="index">
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="60px">
                    <q-img :ratio="1" :src="user.photo" />
                    <span class="user-photo-placeholder">{{
                      user.first_name.charAt(0).toUpperCase() +
                        user.last_name.charAt(0).toUpperCase()
                    }}</span>
                  </q-avatar>
                </q-item-section>

                <q-item-section class="col-xs col-md-2 q-mr-sm username-field">
                  <div>
                    <q-item-label class="q-mt-sm"
                      ><span class="text-subtitle2">{{ user.username }}</span>
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
                    }}</span
                    ><br />
                    <span class="text-grey-8 lt-sm">
                      Be @
                      <q-chip
                        :color="eventColor"
                        text-color="white"
                        class="time-chip"
                        dense
                        outline
                        :label="user.be_there_at"
                        square
                      />
                    </span>
                  </div>
                </q-item-section>

                <q-item-section class="gt-xs col">
                  <q-item-label lines="1">
                    <span class="text-grey-8"></span>{{ user.bio }}
                  </q-item-label>
                  <q-item-label
                    v-if="user.created_at"
                    caption
                    style="font-size: 13px"
                    lines="1"
                  >
                    Signed {{ getFullDate(user.created_at) }} @
                    {{ getTime(user.created_at) }}
                  </q-item-label>
                  <q-item-label
                    lines="1"
                    class="q-mt-xs text-body2 text-weight-normal"
                  >
                    Will be there @
                    <q-chip
                      :color="eventColor"
                      text-color="white"
                      class="time-chip"
                      dense
                      outline
                      :label="user.be_there_at"
                      square
                    />
                  </q-item-label>
                  <q-item-label
                    v-if="user.will_bring && user.will_bring.length > 0"
                  >
                    <q-chip
                      v-for="(item, index) in user.will_bring"
                      :key="index + '_will_be_brought'"
                      dense
                      square
                      :label="item.charAt(0).toUpperCase() + item.substring(1)"
                    />
                  </q-item-label>
                </q-item-section>

                <!-- <div class="col lt-sm" style="border: 1px solid black"></div> -->

                <q-item-section side class="col-auto q-ml-sm">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="user.probability"
                    size="50px"
                    :thickness="0.22"
                    :color="eventColor"
                    track-color="grey-3"
                  >
                    {{ user.probability }}%
                  </q-circular-progress>
                  <q-btn-dropdown
                    dense
                    flat
                    dropdown-icon="more_horiz"
                    class="q-pr-sm q-mt-xs lt-sm"
                  >
                    <q-list dense bordered padding class="rounded-borders">
                      <q-item v-ripple>
                        <q-item-section>
                          <q-item-label
                            v-if="user.created_at"
                            caption
                            style="font-size: 13px"
                            lines="1"
                          >
                            Signed {{ getFullDate(user.created_at) }} @
                            {{ getTime(user.created_at) }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="user.guests > 0">
                        <q-item-section>
                          <q-item-label
                            caption
                            style="font-size: 13px"
                            lines="1"
                          >
                            Brings {{ user.guests }} guest(s)
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        v-if="user.will_bring && user.will_bring.length > 0"
                      >
                        <q-item-section>
                          <q-item-label
                            caption
                            style="font-size: 13px"
                            lines="1"
                          >
                            <q-chip
                              v-for="(item, index) in user.will_bring"
                              :key="index"
                              dense
                              square
                              :label="item"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </div>
            <!-- ///////////////////////////// -->
            <!-- ///////////////////////////// -->
          </div>
          <div class="col-xs-12" v-else>
            <div class="row q-mt-md">
              <span class="text-subtitle1 q-py-sm q-px-md custom-warning-tip">
                Nobody has yet signed in this event
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md q-mt-md q-pl-sm q-ml-none">
        <div class="row justify-center">
          <div
            class="text-h6 text-white col-xs-12 q-px-sm q-ml-none"
            style="border-radius: 4px 4px 0 0; min-height: 86px"
            :class="'bg-' + eventColor"
          >
            <div class="column full-height justify-center items-center">
              <div class="text-h5">U Down?</div>
            </div>
          </div>
        </div>
        <q-form class="column q-my-md" @submit="signForThisEvent()">
          <div class="row">
            <div class="col-xs-12">
              <q-input
                filled
                class="q-pb-none"
                label="You'll be there at"
                v-model="newParticipant.be_there_at"
                :placeholder="getTime(event.happens_at)"
                lazy-rules
                :rules="['time']"
                :color="eventColor"
              >
                <template v-slot:after>
                  <q-btn round icon="access_time" :color="eventColor">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        :color="eventColor"
                        v-model="newParticipant.be_there_at"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 q-mt-md">
              <div class="row">
                <q-input
                  :color="eventColor"
                  v-model="newParticipant.probability"
                  filled
                  class="col-xs-8"
                  type="number"
                  placeholder="How sure are you coming?"
                  hint="between 0 and 100"
                  :rules="[
                    val =>
                      (val && val > 0 && val < 101) ||
                      'Please type a valid percentage'
                  ]"
                ></q-input>
                <q-linear-progress
                  class="col q-ml-xs"
                  size="56px"
                  :value="newParticipant.probability / 100"
                  :color="eventColor"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      :text-color="eventColor"
                      :label="newParticipant.probability + '%'"
                    />
                  </div>
                </q-linear-progress>
              </div>
            </div>
            <div class="col-xs-12 q-mt-md">
              <q-select
                :color="eventColor"
                filled
                v-model="newParticipant.will_bring"
                multiple
                label="Stuff you'd bring * optional *"
                :options="event.whats_needed"
                use-chips
              >
                <template v-slot:prepend>
                  <q-icon name="backpack" />
                </template>
              </q-select>
            </div>
            <div class="col-xs-12 q-mt-md">
              <div class="row">
                <div class="col">
                  <q-input
                    type="number"
                    v-if="event.guests_allowed"
                    placeholder="How many guests come with you?"
                    filled
                    v-model="newParticipant.guests"
                    :color="eventColor"
                  >
                    <template v-slot:prepend>
                      <q-icon name="group_add" />
                    </template>
                  </q-input>
                </div>
                <div class="col-auto q-ml-md">
                  <q-btn
                    :label="event.canceled ? 'Canceled' : 'I\'m Down'"
                    style="height: 56px"
                    :color="event.canceled ? 'negative' : eventColor"
                    type="submit"
                    :disable="event.canceled"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { QSpinnerFacebook } from "quasar";
export default {
  name: "Event",
  data() {
    return {
      newParticipant: {
        probability: "",
        be_there_at: "",
        guests: null,
        will_bring: null
      },
      columns: [
        {
          name: "desc",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "value",
          align: "left",
          label: "Value",
          field: "value"
        }
      ]
    };
  },
  computed: {
    event() {
      return this.$store.state.events.thisEvent;
    },
    eventColor() {
      return this.event && this.event.only_close_friends
        ? "deep-purple"
        : this.event && !this.event.is_public && !this.event.only_close_friends
        ? "green-10"
        : "indigo";
    },
    loggedInUser() {
      return this.$store.state.user.data;
    },
    data() {
      return [
        {
          name: "Event type",
          value:
            this.event && this.event.only_close_friends
              ? this.event.sport_type.charAt(0).toUpperCase() +
                this.event.sport_type.substring(1) +
                " - Close friends"
              : this.event && this.event.is_public
              ? this.event.sport_type.charAt(0).toUpperCase() +
                this.event.sport_type.substring(1) +
                " - Public"
              : this.event.sport_type.charAt(0).toUpperCase() +
                this.event.sport_type.substring(1) +
                " - Friends"
        },
        {
          name: "Guests",
          value: this.event && this.event.guests
        },
        {
          name: "Whats needed",
          value: this.event && this.event.whats_needed.join(" - ")
        },
        {
          name: "Created at",
          value:
            this.event &&
            this.getFullDate(this.event.created_at) +
              " @ " +
              this.getTime(this.event.created_at)
        }
      ];
    }
  },
  methods: {
    fetchEvent(id) {
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "primary",
        spinnerSize: 140,
        backgroundColor: "indigo",
        message: "Fetching event. Hang on...",
        messageColor: "primary"
      });
      this.$store
        .dispatch("events/fetchEvent", id)
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
    },
    signForThisEvent() {
      this.$store
        .dispatch("events/signForThisEvent", {
          event_id: this.event.id,
          probability: this.newParticipant.probability,
          be_there_at: this.newParticipant.be_there_at,
          guests: this.newParticipant.guests,
          will_bring: this.newParticipant.will_bring
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
              icon: "check",
              message: message
            });
          }
        });
    },
    cancelEvent() {
      this.$store
        .dispatch("events/cancelEvent", this.event.id)
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
              icon: "check",
              message: message
            });
            this.$router.push("/events");
          }
        });
    },
    getEventDate() {
      let today = new Date(Date.now());
      let event = new Date(this.event.happens_at);
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      if (
        today.getDate() === event.getDate() &&
        today.getMonth() === event.getMonth()
      ) {
        return "Today";
      } else if (
        today.getDate() === event.getDate() - 1 &&
        today.getMonth() <= event.getMonth()
      ) {
        return "Tomorrow";
      } else if (
        today.getDate() <= event.getDate() - 1 &&
        today.getDate() >= event.getDate() - 6 &&
        today.getMonth() <= event.getMonth()
      ) {
        return "This " + days[event.getDay()];
      } else if (
        today.getDate() <= event.getDate() - 7 &&
        today.getDate() >= event.getDate() - 13 &&
        today.getMonth() <= event.getMonth()
      ) {
        return "Next " + days[event.getDay()];
      } else {
        return days[event.getDay()];
      }
    },
    getMonthPlusDay() {
      let event = new Date(this.event.happens_at);
      return (
        [
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
        ][event.getMonth()] +
        " " +
        event.getDate()
      );
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
    getFullDateWithDashes(timestamp) {
      let date = new Date(timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    getTime(timestamp) {
      let date = new Date(timestamp);
      const minutes =
        date.getMinutes() / 10 < 1
          ? "0" + date.getMinutes()
          : date.getMinutes();
      const hours =
        date.getHours() / 10 < 1 ? "0" + date.getHours() : date.getHours();
      return hours + ":" + minutes;
    },
    getYear() {
      let event = new Date(this.event.happens_at);
      return event.getFullYear();
    }
  },
  // watch: {
  //   $route(to, from) {
  //     this.fetchEvent(to.params.id);
  //   }
  // },
  mounted() {
    this.fetchEvent(this.$route.params.id);
  }
};
</script>
