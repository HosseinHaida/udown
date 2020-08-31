<template>
  <div>
    <q-select
      filled
      v-model="searchText"
      use-input
      input-debounce="0"
      label="Filter Courts"
      :options="options"
      @filter="filterFn"
      style="width: 100%"
      behavior="dialog"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
      <template v-if="searchText" v-slot:append>
        <q-icon
          name="cancel"
          @click.stop="emptySearch()"
          class="cursor-pointer"
        />
      </template>
    </q-select>

    <div class="" v-if="searchResults">
      <q-list class="rounded-borders">
        <q-expansion-item
          v-for="(event, index) in searchResults"
          :key="index"
          expand-separator
          :label="getDay(event.happens_at)"
          :caption="getTime(event.happens_at)"
          icon="event"
        >
          <q-card class="bg-grey-2">
            <q-card-section>
              <span
                ><q-chip dense size="15px">
                  <q-avatar
                    color="indigo"
                    style="width: 50px"
                    text-color="white"
                    >{{ getTime(event.happens_at) }}</q-avatar
                  >
                  <span
                    class="q-ml-xs"
                    :class="event.guests ? 'q-mr-lg' : 'q-mr-xs'"
                    >{{ event.username }}</span
                  >
                  <q-badge v-if="event.guests" color="primary" floating
                    >+{{ event.guests }}</q-badge
                  >
                </q-chip></span
              >
              <span v-for="(participant, index) in participants" :key="index">
                <q-chip
                  v-if="participant.event_id === event.id"
                  dense
                  size="15px"
                >
                  <q-avatar
                    color="indigo"
                    style="width: 50px"
                    text-color="white"
                    >{{ getTime(participant.be_there_at) }}</q-avatar
                  >
                  <span
                    class="q-ml-xs"
                    :class="participant.guests ? 'q-mr-lg' : 'q-mr-xs'"
                    >{{ participant.username }}</span
                  >
                  <q-badge v-if="participant.guests" color="primary" floating
                    >+{{ participant.guests }}</q-badge
                  >
                </q-chip></span
              >
            </q-card-section>
            <q-card-section>
              <q-card-actions class="row">
                <div class="col"></div>
                <q-btn
                  icon="sports_basketball"
                  class="q-mb-sm"
                  label="ENTER"
                  color="positive"
                />
                <div class="col"></div>
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <div class="row">
      <div class="col"></div>
      <q-btn push class="q-mt-lg q-mx-md" icon="add" label="CREATE EVENT" />
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import events from "src/store/events";
export default {
  name: "Events",
  data() {
    return {
      options: null,
      date: null
    };
  },
  computed: {
    courtNames() {
      return this.$store.getters["courts/getCourtNames"];
    },
    searchResults() {
      return this.$store.state.events.searchResults;
    },
    participants() {
      return this.$store.getters["events/getParticipants"];
    },
    searchText: {
      set: function(courtName) {
        if (courtName) {
          this.$store.commit("events/setSearchText", courtName);
          let id = this.$store.commit(
            "courts/findCourtIdByCourtName",
            courtName
          );
          this.$store.commit("events/setSearchType", "courtId");
          this.$store.dispatch("events/findEventsByCourtId", id);
        } else {
          this.$store.commit("events/setSearchText", courtName);
          return;
        }
      },
      get: function() {
        return this.$store.state.events.searchText;
      }
    }
  },
  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.courtNames;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.courtNames.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    getDay(timestamp) {
      let today = new Date(Date.now());
      let event = new Date(timestamp);
      var days = [
        "Yekshanbe",
        "Doshanbe",
        "Seshanbe",
        "Chaharshanbe",
        "Panjshanbe",
        "Jome",
        "Shanbe"
      ];
      if (today.getFullYear() === event.getFullYear()) {
        if (
          today.getDate() === event.getDate() &&
          today.getMonth() === event.getMonth()
        ) {
          return "Emrooz";
        } else if (
          today.getDate() === event.getDate() - 1 &&
          today.getMonth() <= event.getMonth()
        ) {
          return "Farda";
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
          return "Hafteye Baad " + days[event.getDay()];
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
            event.getDay()
          );
        }
      } else {
        return event.getFullYear();
      }
    },
    emptySearch() {
      this.searchText = null;
      this.$store.commit("events/emptySearchResults");
    },
    getTime(timestamp) {
      let event = new Date(timestamp);
      return event.getHours() + ":" + event.getMinutes();
    }
  }
};
</script>
