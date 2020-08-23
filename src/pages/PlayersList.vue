<template>
  <q-page class="q-pa-md row q-gutter-md">
    <div class="column ">
      <q-input
        filled
        dense
        placeholder="Search"
        v-model="searchText"
        class="q-mb-sm"
      />
      <q-list class="rounded-borders q-py-sm">
        <!-- <q-item-label header>Google Inbox style</q-item-label> -->
        <div v-for="(user, index) in users" :key="index">
          <q-item>
            <q-item-section avatar top>
              <q-avatar>
                <img src="user-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section style="min-width: 118px" top class="col-2 q-mr-md">
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

            <q-item-section class="gt-sm" top>
              <q-item-label lines="1">
                <span class="text-grey-8"></span>{{ user.bio }}
                <!-- <span class="text-grey-8"> - GitHub repository</span> -->
              </q-item-label>
              <q-item-label caption lines="1">
                Joined {{ getYearPlusMonth(user.created_at) }}
              </q-item-label>
              <q-item-label
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
              >
                <q-btn
                  v-if="logedInUser.friends.includes(user.id)"
                  dense
                  flat
                  class="cursor-pointer"
                  label="VIEW"
                />
              </q-item-label>
            </q-item-section>

            <q-item-section top side class="q-ml-md gt-sm">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  v-if="logedInUser.id !== user.id"
                  style="width: 110px"
                  class="bg-grey-2 q-ml-sm"
                  size="12px"
                  flat
                  :label="
                    logedInUser.friends.includes(user.id)
                      ? 'FOLLOWING'
                      : 'FOLLOW'
                  "
                  :disabled="logedInUser.friends.includes(user.id)"
                />
              </div>
            </q-item-section>

            <q-item-section side class="lt-md">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  v-if="logedInUser.id !== user.id"
                  class="bg-grey-2"
                  size="12px"
                  flat
                  :icon="
                    logedInUser.friends.includes(user.id)
                      ? 'how_to_reg'
                      : 'person_add'
                  "
                  :disabled="logedInUser.friends.includes(user.id)"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </div>
      </q-list>
    </div>
  </q-page>
</template>
<script>
export default {
  name: "PlayersList",
  data() {
    return {
      searchText: ""
    };
  },
  computed: {
    logedInUser() {
      return this.$store.state.user.data;
    },
    users() {
      return this.$store.state.users.list;
    }
  },
  methods: {
    getYearPlusMonth(timestamp) {
      let date = new Date(Number(timestamp));
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
    }
  }
};
</script>
