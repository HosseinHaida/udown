<template>
  <q-page class="q-pa-md row items-start">
    <div
      class="court-card col-md-4 col-sm-6 col-xs-12 q-pa-sm"
      v-for="(court, index) in courts"
      :key="index"
    >
      <q-card>
        <q-img class="court-poster" :src="court.photo" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
            type="a"
            :href="court.maps_url"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ court.name }}
            </div>
            <div
              class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
            >
              <q-icon size="xs" name="map" />
              Google
            </div>
          </div>

          <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            <q-icon
              style="color: #85bb65"
              class="q-mr-sm"
              size="sm"
              name="payments"
            />{{ court.cost }}
          </div>
          <div class="text-caption text-grey">
            <div class="q-mt-sm text-h6">
              <q-chip
                square
                dense
                :label="court.city"
                text-color="white"
                color="indigo"
                style="padding-top: 1px"
              />
              <q-chip
                square
                dense
                :label="court.region"
                text-color="white"
                color="indigo"
                style="padding-top: 1px"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <!-- <q-btn flat round icon="event" /> -->
          <q-btn flat color="primary" @click="thisCourt(court.name, court.id)">
            I'm Down
          </q-btn>
          <q-space />
          <q-icon
            class="q-ma-sm"
            size="sm"
            name="wc"
            :color="court.girls_allowed ? 'positive' : 'negative'"
          />
          <q-icon
            class="q-mr-sm"
            size="xs"
            :name="court.girls_allowed ? 'check' : 'close'"
            :color="court.girls_allowed ? 'positive' : 'negative'"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "CourtsList",
  data() {
    return {};
  },
  methods: {
    thisCourt(courtName, courtId) {
      this.$store.commit("main/setRightDrawerStatus", true);
      if (courtName) {
        this.$store.commit("events/setSearchText", courtName);
        this.$store.commit("events/setSearchType", "courtId");
        this.$store.dispatch("events/findEventsByCourtId", courtId);
      } else {
        this.$store.commit("events/setSearchText", courtName);
        return;
      }
    }
  },
  computed: {
    courts() {
      return this.$store.state.courts.list;
    }
  }
};
</script>

<style lang="sass" scoped>
// .court-card
  // max-width: 300px
  // .court-poster
    // max-height: 2900px

// @media only screen and (max-width: 414px)
//   .court-card
//     max-width: 100%

// @media only screen and (max-width: 768px) and (min-width: 414px)
//   .court-card
//     max-width: 330px
</style>
