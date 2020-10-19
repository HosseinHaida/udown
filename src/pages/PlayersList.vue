<template>
  <q-page class="q-px-md">
    <div class="row">
      <q-btn-toggle
        v-model="usersType"
        v-if="user"
        class="col-auto q-mt-md full-height"
        toggle-color="indigo"
        push
        size="13px"
        @input="fetchInboundRequestsCount()"
        :options="[
          { value: 'all', icon: 'list', slot: 'all' },
          {
            value: 'friends',
            icon: 'group',
            slot: 'friends',
            textColor: 'positive'
          },
          {
            value: 'close',
            icon: 'loyalty',
            slot: 'close',
            textColor: 'accent'
          },
          {
            label: 'Requests',
            value: 'requests',
            icon: 'pending_actions',
            slot: 'reqs',
            class: 'q-pb-xs'
          }
        ]"
      >
        <template v-slot:reqs>
          <q-badge
            v-if="inboundRequestsCount > 0"
            color="indigo"
            floating
            :label="inboundRequestsCount"
          />
        </template>

        <template v-slot:friends>
          <q-tooltip content-style="font-size: 13px">Friends</q-tooltip>
        </template>

        <template v-slot:close>
          <q-tooltip content-style="font-size: 13px">Close friends</q-tooltip>
        </template>

        <template v-slot:all>
          <q-tooltip content-style="font-size: 13px">All users</q-tooltip>
        </template>
      </q-btn-toggle>
      <players-component
        class="col-xs-12"
        :type="usersType"
        :howMany="25"
      ></players-component>
    </div>
  </q-page>
</template>
<script>
import PlayersComponent from "../components/Players.vue";
export default {
  name: "PlayersList",
  components: { "players-component": PlayersComponent },
  data() {
    return {
      usersType: "all"
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    },
    inboundRequestsCount() {
      return this.$store.state.user.inboundRequestsCount;
    }
  },
  methods: {
    fetchInboundRequestsCount() {
      this.$store
        .dispatch("user/fetchInboundRequestsCount")
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
  mounted() {
    if (this.user) {
      this.fetchInboundRequestsCount();
    }
  }
};
</script>
