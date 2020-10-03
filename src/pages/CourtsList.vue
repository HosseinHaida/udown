<template>
  <q-page class="q-pa-md" v-if="courts">
    <div class="row items-center">
      <div class="col-xs-12">
        <div class="row">
          <q-input
            filled
            dense
            placeholder="Search"
            v-model="searchText"
            @input="fetchCourts(true)"
            debounce="200"
            class="q-mb-md col"
            :loading="locationsFetchPending"
            hint="Name, city, region"
            bottom-slots
          >
            <template v-slot:prepend> <q-icon name="search"/></template
          ></q-input>
          <div class="col-auto">
            <q-btn class="q-ml-sm" icon="add" to="/courts/new" color="indigo" />
          </div>
        </div>
      </div>
      <div
        class="court-card col-md-4 col-sm-6 col-xs-12 q-pa-sm"
        v-for="(court, index) in courts"
        :key="index"
      >
        <q-card>
          <q-badge
            v-if="court.verified === true"
            style="z-index: 1; border-radius: 4px"
            floating
            class="q-pa-xs"
            color="positive"
          >
            <q-icon size="17px" name="beenhere" color="white"></q-icon>
          </q-badge>
          <q-img
            :ratio="4 / 3"
            placeholder-src="placeholder-image.png"
            class="court-poster"
            :src="court.photo"
          />

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
            <q-btn
              flat
              icon="event"
              :to="'/events/new/' + court.id"
              color="primary"
              label="New event"
            >
            </q-btn>
            <q-btn flat color="indigo" :to="'/courts/' + court.id">
              View
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
      <div class="col-xs-12 q-mt-md">
        <div class="row">
          <q-pagination
            v-model="which.page"
            :max="total.pages"
            @input="fetchCourts"
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
            ><span class="q-ml-xs">
              Locations
            </span></q-chip
          >
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "CourtsList",
  data() {
    return {
      which: {
        page: 1,
        howMany: 6
      },
      searchText: ""
    };
  },
  methods: {
    fetchCourts(goToFirstPage) {
      if (goToFirstPage === true) {
        this.which.page = 1;
      }
      this.$store
        .dispatch("courts/fetchLocationsList", {
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
    }
  },
  computed: {
    courts() {
      return this.$store.state.courts.list;
    },
    total() {
      return this.$store.state.courts.total;
    },
    locationsFetchPending() {
      return this.$store.state.courts.locationsFetchPending;
    }
  },
  mounted() {
    this.fetchCourts(true);
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
