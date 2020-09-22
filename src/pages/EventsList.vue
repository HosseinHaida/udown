<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-xs-12">
        <div class="row">
          <q-input
            filled
            dense
            placeholder="Search"
            v-model="searchText"
            hint="Location, sport, creator"
            @input="fetchEvents(true)"
            class="q-mb-sm col"
            debounce="200"
            :loading="eventsFetchPending"
            bottom-slots
          >
            <template v-slot:prepend><q-icon name="search"/></template
          ></q-input>
          <div class="col-auto">
            <q-btn icon="event" class="q-ml-sm" color="indigo">
              <q-popup-proxy
                @before-show="updateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date color="indigo" v-model="proxyDate">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="save"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
              <q-tooltip content-style="font-size: 13px">Select date</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-list class="rounded-borders">
          <q-item-label v-if="date" header
            ><q-chip icon="event" :label="date"
          /></q-item-label>
          <div v-if="user">
            <span v-for="(event, index) in list" :key="index">
              <q-item clickable class="q-py-md">
                <q-badge
                  v-if="isExpired(event.happens_at)"
                  class="q-py-xs"
                  color="negative"
                  floating
                  ><q-icon
                    name="warning"
                    class="q-mr-xs"
                    color="white"
                  />Expired</q-badge
                >
                <q-item-section avatar top>
                  <q-chip
                    dense
                    square
                    text-color="white"
                    color="indigo"
                    size="xl"
                    class="time-chip"
                    :label="getTime(event.happens_at)"
                  />
                  <q-item-label
                    class="q-mt-xs text-center "
                    style="border-radius: 4px"
                  >
                    <q-chip
                      class="text-weight-medium"
                      dense
                      outline
                      square
                      :label="getDay(event.happens_at)"
                    />
                  </q-item-label>
                </q-item-section>

                <q-item-section top class="col-auto q-ml-md q-mr-lg gt-sm">
                  <!-- <q-item-label class="q-mt-sm">GitHub</q-item-label> -->
                  <q-avatar>
                    <q-img :ratio="1" :src="event.photo" />
                    <span class="user-photo-placeholder">{{
                      event.first_name.charAt(0).toUpperCase() +
                        event.last_name.charAt(0).toUpperCase()
                    }}</span>
                  </q-avatar>
                </q-item-section>

                <q-item-section top>
                  <q-item-label lines="1">
                    <span
                      class="text-weight-medium text-primary text-subtitle1"
                    >
                      {{ event.username }}</span
                    ><q-icon
                      name="verified"
                      class="q-ml-xs"
                      color="positive"
                      v-if="event.verified"
                    />
                  </q-item-label>
                  <q-item-label class="text-subtitle2" lines="1">
                    <q-icon name="place" color="accent" size="xs" /><span
                      class="q-ml-xs"
                      >{{ event.name }}</span
                    >
                  </q-item-label>
                  <q-item-label lines="1">
                    <q-icon
                      name="location_city"
                      color="indigo"
                      size="xs"
                    /><span class="q-ml-xs">{{ event.city }}</span>
                  </q-item-label>
                  <q-item-label lines="1" class="text-body2 text-subtitle1">
                    <q-chip square dense class="q-pr-sm" color="grey-3">
                      {{
                        event.sport_type.charAt(0).toUpperCase() +
                          event.sport_type.substring(1)
                      }}
                    </q-chip>
                    <!-- @<q-chip :label="event.name" dense square color="grey-3" /> -->
                  </q-item-label>
                </q-item-section>

                <!-- <q-item-section side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
              <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
              <q-btn size="12px" flat dense round icon="more_vert" />
            </div>
          </q-item-section> -->
              </q-item>

              <q-separator spaced />
            </span>
          </div>
          <div class="row justify-center" v-else>
            <span class="text-subtitle1 q-py-sm q-px-md custom-warning-tip">
              You can't view events unless you sign in
            </span>
          </div>
        </q-list>
        <div class="row">
          <q-pagination
            v-model="which.page"
            :max="total.pages"
            @input="fetchEvents"
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
            ><span class="q-ml-xs">Events</span></q-chip
          >
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "EventsList",
  data() {
    return {
      date: null,
      proxyDate: "2019/02/20",
      searchText: "",
      howMany: 25,
      which: {
        page: 1
      }
    };
  },
  computed: {
    list() {
      return this.$store.state.events.list;
    },
    eventsFetchPending() {
      return this.$store.state.events.eventsFetchPending;
    },
    total() {
      return this.$store.state.events.total;
    },
    user() {
      return this.$store.state.user.data;
    }
  },
  methods: {
    fetchEvents(goToFirstPage) {
      if (goToFirstPage === true) {
        this.which.page = 1;
      }
      this.$store
        .dispatch("events/fetchEventsList", {
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
    },
    updateProxy() {
      this.proxyDate = this.date;
    },

    save() {
      this.date = this.proxyDate;
    },
    isExpired(timestamp) {
      let now = new Date(Date.now());
      let date = new Date(timestamp);
      return now > date;
    },
    getDay(timestamp) {
      let today = new Date(Date.now());
      let event = new Date(timestamp);
      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      if (today.getFullYear() === event.getFullYear()) {
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
          return days[event.getDay()];
        } else if (
          today.getDate() <= event.getDate() - 7 &&
          today.getDate() >= event.getDate() - 13 &&
          today.getMonth() <= event.getMonth()
        ) {
          return "Next " + days[event.getDay()];
        } else {
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
            ". " +
            event.getDay() +
            "."
          );
        }
      } else {
        return event.getFullYear();
      }
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
    }
  },
  mounted() {
    this.fetchEvents(true);
  }
};
</script>
<style lang="sass" scoped>
.time-span
  background-color: $indigo
  border-radius: 4px
.time-chip
  font-family: monospace
</style>
