<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-md-3 q-pa-xs">
        <div class="row">
          <div class="text-h5 q-mb-lg q-mt-md text-grey-7 col-xs-12 q-px-sm">
            Photos
          </div>
          <div
            class="col-xs-12 col-md-12 q-px-xs q-mb-sm"
            v-for="(photo, index) in photos"
            :key="index"
          >
            <q-img
              :src="photo"
              placeholder-src="placeholder-image.png"
              style="border-radius: 4px"
            >
              <q-btn
                class="absolute all-pointer-events"
                icon="attach_file"
                color="white"
                text-color="black"
                dense
                style="top: 8px; left: 8px"
                push
                @click="photosInputToShow = index"
              >
                <q-tooltip content-style="font-size: 12px">
                  Pick a photo
                </q-tooltip>
              </q-btn>
              <template v-slot:error>
                <div
                  class="fit row wrap justify-center items-end bg-primary text-subtitle2"
                >
                  <div class="text-subtitle1">
                    <q-icon
                      v-if="index > 0"
                      :name="index <= 9 ? 'filter_' + index : ''"
                      style="margin-top: -4px"
                      size="30px"
                    />
                    <q-icon name="photo" style="margin-top: -4px" size="30px" />
                    {{ index === 0 ? "Cover" : "" }}
                  </div>
                  <q-btn
                    v-if="photosInputToShow !== index"
                    class="col-xs-12"
                    color="white"
                    text-color="black"
                    label="Pick"
                    icon="expand_more"
                    dense
                    @click="photosInputToShow = index"
                  />
                  <q-btn
                    v-else
                    class="col-xs-12"
                    color="white"
                    text-color="black"
                    label="Hide"
                    icon="close"
                    dense
                    @click="photosInputToShow = null"
                  />
                </div>
              </template>
            </q-img>
            <q-form v-if="photosInputToShow === index" class="q-pt-sm">
              <q-file
                v-model="pickedPhoto"
                filled
                color="indigo"
                dense
                label="Pick a photo"
                accept=".jpg, image/*"
                :filter="checkPhotoSize"
                @rejected="onRejected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template v-slot:after>
                  <q-btn
                    @click="onPhotoUploadClick"
                    round
                    flat
                    icon="send"
                    :loading="photoUploadPending"
                    ><q-tooltip
                      content-style="font-size: 12px"
                      :offset="[10, 10]"
                    >
                      Save photo
                    </q-tooltip></q-btn
                  >
                </template>
                <template v-slot:before>
                  <q-btn
                    v-if="photo !== ''"
                    @click="onPhotoUploadClick"
                    round
                    flat
                    icon="delete"
                    :loading="photoUploadPending"
                  >
                    <q-tooltip
                      content-class="bg-red-5"
                      content-style="font-size: 14px"
                      :offset="[10, 10]"
                    >
                      Delete current photo
                    </q-tooltip>
                  </q-btn>
                </template>
              </q-file>
            </q-form>
          </div>
          <q-btn
            class="col-xs-12"
            color="primary"
            push
            icon="add"
            label="Add photo"
            @click="photos.length <= 9 ? photos.push('') : noMorePhotosDialog()"
          />
        </div>
      </div>
      <div class="col-xs-12 col-md-9 q-mt-lg">
        <div class="row justify-center q-mb-lg q-pa-lg">
          <div class="text-h4">
            {{ court.name }}
          </div>
          <!-- <div class="q-mt-sm q-mx-sm text-h6">
            <q-chip square dense :label="court.city" />
            <q-chip square dense :label="court.region" />
          </div> -->
        </div>
        <div class="row justify-center ">
          <div class="col-xs-12 col-md-11">
            <div class="row items-start">
              <div class="col-xs-12 col-md-6 q-mb-md">
                <div>
                  <q-icon name="payments" color="indigo" size="26px"></q-icon>
                  <span
                    class="text-subtitle-1 q-ml-md"
                    style="font-size: 16px"
                    >{{ court.cost }}</span
                  >
                </div>
                <div class="q-pt-sm">
                  <q-icon name="wc" color="indigo" size="26px"></q-icon>
                  <span
                    class="text-subtitle-1 q-ml-md"
                    style="font-size: 16px"
                    >{{
                      court.girls_allowed
                        ? "Girls are allowed"
                        : "Girls aren't allowed"
                    }}</span
                  >
                </div>
                <div class="q-pt-sm">
                  <q-icon name="person" color="indigo" size="26px"></q-icon>
                  <span class="text-subtitle-1 q-ml-md" style="font-size: 16px">
                    {{ court.city + ", " + court.region }}
                  </span>
                </div>
                <div class="q-mt-md">
                  <q-icon
                    v-for="(sport, index) in court.sport_types"
                    :key="index"
                    :name="'sports_' + sport"
                    :color="
                      sport === 'basketball'
                        ? 'primary'
                        : sport === 'volleyball'
                        ? 'blue'
                        : sport === 'soccer'
                        ? 'black'
                        : sport === 'badminton'
                        ? 'grey-9'
                        : 'indigo'
                    "
                    size="30px"
                    class="q-mr-xs"
                    ><q-tooltip content-style="font-size: 12px">{{
                      sport.charAt(0).toUpperCase() + sport.substring(1)
                    }}</q-tooltip></q-icon
                  >
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <q-input
                  type="textarea"
                  :value="court.meta"
                  readonly
                  style="font-size: 16px"
                  color="indigo"
                  borderless
                  ><template v-slot:prepend>
                    <q-icon size="26px" name="more_vert" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>
        <!-- Toggle between Edit mode and View mode -->
        <div class="row justify-center q-mt-lg">
          <div class="col-xs-12 col-md-11">
            <div
              v-if="
                user && user.scopes && user.scopes.includes('edit_locations')
              "
              class="row justify-end"
            >
              <q-btn-toggle
                v-model="viewEditToggle"
                class="col-auto q-mb-sm"
                toggle-color="indigo"
                push
                size="13px"
                :options="[
                  {
                    label: 'Edit',
                    value: 'edit',
                    class: 'q-pb-xs'
                  },
                  { value: 'view', label: 'View' }
                ]"
              />
            </div>
          </div>
        </div>
        <q-form v-if="viewEditToggle === 'edit'" class="row justify-center">
          <div class="col-xs-12 col-md-11">
            <div class="row">
              <div class="text-h5 text-grey-7 col-xs-12 q-px-sm">
                Edit
              </div>
              <div class="col-xs-12 q-px-sm q-pb-sm">
                <div class="row justify-end">
                  <q-toggle
                    class="col-auto"
                    label="Girls"
                    color="pink"
                    v-model="court.girls_allowed"
                    @input="show()"
                    size="lg"
                  />
                </div>
              </div>
              <q-input
                class="col-xs-12 q-px-sm"
                bottom-slots
                v-model="text"
                label="Name"
                filled
                color="indigo"
              />
              <q-input
                class="col-xs-12 col-md-6 q-px-sm"
                bottom-slots
                v-model="text"
                label="City"
                filled
                color="indigo"
              >
                <template v-slot:prepend>
                  <q-icon name="location_city" />
                </template>
              </q-input>
              <q-input
                class="col-xs-12 col-md-6 q-px-sm"
                bottom-slots
                v-model="text"
                label="Region"
                filled
                color="indigo"
              >
              </q-input>
              <div class="col-xs-12">
                <div class="row">
                  <q-input
                    class="col-xs-12 col-md-6 q-px-sm q-mb-md"
                    bottom-slots
                    v-model="court.maps_url"
                    label="Maps URL"
                    filled
                    color="indigo"
                  >
                    <template v-slot:hint>
                      example: https://goo.gl/maps/yu1X8cn5KcSuYndv6
                    </template>

                    <template v-slot:prepend>
                      <q-icon name="link" />
                    </template>
                  </q-input>
                  <q-input
                    class="col-xs-12 col-md-6 q-px-sm q-mb-md"
                    bottom-slots
                    v-model="text"
                    label="Cost"
                    filled
                    color="indigo"
                  >
                    <template v-slot:append>
                      <q-icon name="payments" />
                    </template>
                  </q-input>
                </div>
              </div>
              <q-input
                class="col-xs-12 q-px-sm"
                type="textarea"
                :value="court.meta"
                label="Meta"
                filled
                color="indigo"
              >
                <template v-slot:prepend>
                  <q-icon name="more_vert" />
                </template>
              </q-input>
              <!-- @input="updateUser('sport_types', $event)" -->
              <q-checkbox
                class="q-mt-lg"
                :value="court.sport_types"
                val="basketball"
                color="primary"
                ><q-icon
                  color="primary"
                  style="margin-top: -5px"
                  class="q-mr-md"
                  size="25px"
                  name="sports_basketball"
                />
              </q-checkbox>
              <q-checkbox
                class="q-mt-lg"
                :value="court.sport_types"
                val="volleyball"
                color="blue"
              >
                <q-icon
                  color="blue"
                  style="margin-top: -5px"
                  class="q-mr-md"
                  size="25px"
                  name="sports_volleyball"
                />
              </q-checkbox>
              <q-checkbox
                class="q-mt-lg"
                :value="court.sport_types"
                val="soccer"
                color="black"
                ><q-icon
                  color="black"
                  style="margin-top: -5px"
                  class="q-mr-md"
                  size="25px"
                  name="sports_soccer"
                />
              </q-checkbox>
              <q-checkbox
                class="q-mt-lg"
                :value="court.sport_types"
                val="badminton"
                color="grey-9"
                ><q-icon
                  style="margin-top: -5px"
                  class="q-mr-md"
                  size="25px"
                  name="img:badminton.png"
                />
              </q-checkbox>
              <div class="col-xs-12">
                <div class="row justify-end">
                  <q-btn
                    label="Save"
                    :disable="
                      !user ||
                        !user.scopes ||
                        !user.scopes.includes('edit_locations')
                    "
                    class="q-mt-md"
                    color="indigo"
                  ></q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-form>
        <div class="row justify-center q-mt-md">
          <div class="text-h5 q-mb-lg text-grey-7 col-xs-12 col-md-11">
            Comments
          </div>
          <div class="col-xs-12 col-md-11" v-if="court.comments">
            <q-card
              v-for="(comment, index) in court.comments"
              :key="index + comment.username"
              class="q-mb-md"
              flat
              bordered
            >
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <q-img :ratio="1" :src="comment.photo" />
                    <span class="user-photo-placeholder">{{
                      comment.first_name.charAt(0).toUpperCase() +
                        comment.last_name.charAt(0).toUpperCase()
                    }}</span>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ comment.username }}</q-item-label>
                  <q-item-label caption>
                    {{ comment.first_name + " " + comment.last_name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-rating
                    v-model="comment.rating"
                    :max="4"
                    size="2.3em"
                    color="primary"
                    :icon="ratingIcons"
                  />
                </q-item-section>
              </q-item>

              <!-- <q-separator /> -->

              <q-card-section class="q-pa-none">
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      class="full-width"
                      style="max-height: 200px; min-height: 60px; border-bottom: none"
                      readonly
                      square
                      type="textarea"
                      color="indigo"
                      filled
                      :value="comment.text"
                    >
                      <template v-slot:append>
                        <q-chip
                          dense
                          square
                          style="background-color: white"
                          :label="getFullDate(comment.created_at)"
                        ></q-chip> </template
                    ></q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <q-card class="col-xs-12 col-md-11 q-mb-lg" flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-img :ratio="1" :src="user.photo" />
                  <span class="user-photo-placeholder">{{
                    user.first_name.charAt(0).toUpperCase() +
                      user.last_name.charAt(0).toUpperCase()
                  }}</span>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ user.username }}</q-item-label>
                <q-item-label caption>
                  {{ user.first_name + " " + user.last_name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-rating
                  v-model="newComment.rating"
                  :max="4"
                  size="2.3em"
                  color="primary"
                  :icon="ratingIcons"
                />
              </q-item-section>
            </q-item>

            <!-- <q-separator /> -->

            <q-card-section class="q-pa-none">
              <div class="row">
                <div class="col-xs-12">
                  <q-input
                    class="full-width"
                    style="max-height: 200px; min-height: 60px"
                    filled
                    type="textarea"
                    color="indigo"
                    placeholder="Add comment ..."
                    :value="newComment.text"
                  >
                    <template v-slot:prepend>
                      <q-icon name="edit"></q-icon> </template
                  ></q-input>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div></div
  ></q-page>
</template>
<script>
export default {
  data() {
    return {
      newComment: {
        text: ``,
        rating: 3
      },
      ratingModel: 3,
      ratingIcons: [
        "sentiment_very_dissatisfied",
        "sentiment_dissatisfied",
        "sentiment_satisfied",
        "sentiment_very_satisfied"
      ],
      photosInputToShow: null,
      photos: ["kejsc_pic_1.jpg", "kejsc_pic_2.PNG"],
      viewEditToggle: "view",
      text: "",
      court: {
        id: 12315,
        name: "Bagh Ghadir",
        maps_url: "https://goo.gl/maps/yu1X8cn5KcSuYndv6",
        city: "Esfahan",
        region: "Bagh Ghadir",
        photo: "bagh_ghadir.png",
        cost: "120,000t Entrance Fee",
        // created_at: Date.new(),
        created_by: 1122,
        sport_types: ["basketball", "volleyball", "soccer"],
        photos: ["kejsc_pic_1.jpg", "kejsc_pic_2.PNG"],
        updated_at: "",
        updated_by: "",
        girls_allowed: false,
        meta: `No WC,
Good environment
One rim 3m high, the other 2.80`,
        comments: [
          {
            username: "Hossein",
            text: `Such nice people
it's mostly overpopulated tho.`,
            rating: 4,
            created_at: "2020-05-19 10:00:40",
            photo: "http://localhost:3060/users/hossein4563022476681.png",
            first_name: "Hossein",
            last_name: "Heidari"
          }
        ]
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    }
  },
  methods: {
    onRejected(rejectedEntries) {
      this.$q.notify({
        color: "red-5",
        icon: "warning",
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      });
    },
    noMorePhotosDialog() {
      const dialog = this.$q
        .dialog({
          title: "Alert",
          message: "No more than 9 photos enabled"
        })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          clearTimeout(timer);
          // console.log('I am triggered on both OK and Cancel')
        });

      const timer = setTimeout(() => {
        dialog.hide();
      }, 3000);
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
    }
  }
};
</script>
