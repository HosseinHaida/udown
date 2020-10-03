<template>
  <q-page class="q-pa-md">
    <div v-if="!user && newLocationMode" class="col-xs-12 text-center">
      <span class="text-subtitle1 q-py-sm q-px-md custom-warning-tip">
        Please login first
      </span>
    </div>
    <div class="row justify-evenly" v-if="court">
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!-- //////////////////// Photos ///////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <div
        v-if="!newLocationMode"
        class="col-xs-12 col-sm-6 col-md-4 q-pa-xs photos-column"
      >
        <div class="row">
          <!-- <div
            class="q-mb-md col-xs-12"
            style="border-radius: 4px 4px 0 0; min-height: 86px"
          >
            <div class="row full-height justify-start items-center q-px-md">
              <div class="col-auto" style="font-size: 28px">
                Photos
              </div>
            </div>
          </div> -->
          <div class="text-h5 q-mb-md q-mt-md text-grey-7 col-xs-12 q-px-sm">
            Photos
          </div>
          <div v-if="court.photo" class="col-xs-12 col-md-12 q-px-xs q-mb-sm">
            <q-img
              :src="court.photo"
              placeholder-src="placeholder-image.png"
              style="border-radius: 4px"
            >
              <q-btn
                class="absolute all-pointer-events"
                v-if="showElementIfAuthorized"
                icon="attach_file"
                color="white"
                text-color="black"
                dense
                style="top: 8px; left: 8px"
                size="13px"
                @click="showCoverPhotoInput = true"
              >
                <q-tooltip content-style="font-size: 13px">
                  Pick a cover photo
                </q-tooltip>
              </q-btn>
              <!-- /////////////////////// -->
              <q-btn
                style="top: 8px; right: 8px"
                class="absolute all-pointer-events"
                icon="aspect_ratio"
                color="white"
                text-color="black"
                dense
                size="13px"
                @click="expandThisPhoto(court.photo)"
              >
                <q-tooltip content-style="font-size: 13px">
                  Expand photo
                </q-tooltip>
              </q-btn>
              <div class="absolute-bottom text-subtitle1 text-center">
                Cover
              </div>
              <template v-slot:error>
                <div
                  class="fit row wrap justify-center items-end bg-primary text-subtitle2"
                  style="border-radius: 4px"
                >
                  <div class="text-subtitle1">
                    <q-icon
                      name="photo"
                      color="white"
                      style="margin-top: -4px"
                      size="lg"
                    />
                    <span style="color: white">Cover</span>
                  </div>
                  <q-btn
                    v-if="!showCoverPhotoInput"
                    class="col-xs-12"
                    color="white"
                    text-color="black"
                    label="Pick"
                    icon="expand_more"
                    dense
                    @click="showCoverPhotoInput = true"
                  />
                  <q-btn
                    v-else
                    class="col-xs-12"
                    color="white"
                    text-color="black"
                    label="Hide"
                    icon="close"
                    dense
                    @click="showCoverPhotoInput = false"
                  />
                </div>
              </template>
            </q-img>
            <q-form
              v-if="showCoverPhotoInput && showElementIfAuthorized"
              class="q-pt-sm"
            >
              <q-file
                v-model="pickedPhoto"
                filled
                color="indigo"
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
                    @click="onPhotoUploadClick('cover', court.id)"
                    round
                    outline
                    color="positive"
                    icon="check"
                    :loading="photoUploadPending"
                    ><q-tooltip
                      content-style="font-size: 13px"
                      :offset="[10, 10]"
                    >
                      Save photo
                    </q-tooltip></q-btn
                  >
                </template>
              </q-file>
            </q-form>
          </div>
          <!-- in case no photos could be shown as cover photo -->
          <div v-else class="col-xs-12 col-md-12 q-px-xs q-mb-sm">
            <div>
              <div
                class="fit row wrap justify-center bg-primary text-subtitle2 q-pa-xs"
                style="min-height: 200px; border-radius: 4px"
              >
                <div class="col-xs-12 self-start text-subtitle1 q-pt-xs">
                  <q-icon
                    name="photo"
                    color="white"
                    style="margin-top: -4px"
                    size="lg"
                  />
                  <span style="color: white">Cover</span>
                </div>
                <q-btn
                  v-if="!showCoverPhotoInput && showElementIfAuthorized"
                  class="col-xs-12 self-end"
                  color="white"
                  text-color="black"
                  label="Pick"
                  icon="expand_more"
                  dense
                  @click="showCoverPhotoInput = true"
                />
                <q-btn
                  v-if="showCoverPhotoInput && showElementIfAuthorized"
                  class="col-xs-12 self-end"
                  color="white"
                  text-color="black"
                  label="Hide"
                  icon="close"
                  dense
                  @click="showCoverPhotoInput = false"
                />
              </div>
            </div>
            <q-form
              v-if="showCoverPhotoInput && showElementIfAuthorized"
              class="q-pt-sm"
            >
              <q-file
                v-model="pickedPhoto"
                filled
                color="indigo"
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
                    @click="onPhotoUploadClick('cover', court.id)"
                    color="positive"
                    round
                    outline
                    icon="check"
                    :loading="photoUploadPending"
                    ><q-tooltip
                      content-style="font-size: 13px"
                      :offset="[10, 10]"
                    >
                      Save as cover photo
                    </q-tooltip></q-btn
                  >
                </template>
              </q-file>
            </q-form>
          </div>
          <!-- In case the photo couldnt be shown -->
          <div
            class="col-xs-12 col-md-12 q-px-xs q-mb-sm"
            v-for="(photo, index) in court.photos"
            :key="index"
          >
            <q-img
              :src="photo.url"
              placeholder-src="placeholder-image.png"
              style="border-radius: 4px"
            >
              <q-btn
                class="absolute all-pointer-events"
                v-if="showElementIfAuthorized"
                icon="delete"
                color="negative"
                dense
                size="13px"
                style="top: 8px; left: 8px"
                @click="deleteThisPhoto(photo.id)"
              >
                <q-tooltip content-style="font-size: 13px">
                  Delete
                </q-tooltip>
              </q-btn>
              <span
                style="top: 8px; right: 8px"
                class="absolute all-pointer-events"
              >
                <q-btn
                  icon="alternate_email"
                  color="white"
                  text-color="black"
                  round
                  dense
                  size="13px"
                >
                  <q-tooltip content-style="font-size: 13px; color: white">
                    By {{ photo.username }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  icon="aspect_ratio"
                  color="white"
                  text-color="black"
                  class="q-ml-sm"
                  dense
                  size="13px"
                  @click="expandThisPhoto(photo.url)"
                >
                  <q-tooltip content-style="font-size: 13px">
                    Expand photo
                  </q-tooltip>
                </q-btn>
              </span>
              <template v-slot:error>
                <q-btn
                  v-if="showElementIfAuthorized"
                  icon="delete"
                  color="negative"
                  dense
                  style="top: 8px; left: 8px"
                  @click="deleteThisPhoto(photo.id)"
                >
                  <q-tooltip content-style="font-size: 13px">
                    Delete
                  </q-tooltip>
                </q-btn>
              </template>
            </q-img>
          </div>
          <q-btn
            v-if="showElementIfAuthorized"
            class="col-xs-12"
            color="primary"
            push
            icon="add"
            label="Add photo"
            @click="showNewPhotoInput = true"
          />
          <div class="col-xs-12 col-md-12 q-px-xs q-mb-sm">
            <q-form
              v-if="showNewPhotoInput && showElementIfAuthorized"
              class="q-pt-sm"
            >
              <q-file
                v-model="pickedPhoto"
                filled
                color="indigo"
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
                    @click="onPhotoUploadClick('new', court.id)"
                    round
                    outline
                    color="positive"
                    icon="check"
                    :loading="photoUploadPending"
                    ><q-tooltip
                      content-style="font-size: 13px"
                      :offset="[10, 10]"
                    >
                      Add photo to collection
                    </q-tooltip></q-btn
                  >
                </template>
              </q-file>
            </q-form>
          </div>
        </div>
      </div>
      <q-dialog v-model="expandPhoto" :maximized="expandPhoto">
        <q-card class="bg-black" flat>
          <q-card-section class="row items-center q-pb-none">
            <!-- <div class="text-h6">Close icon</div> -->
            <q-space />
            <q-btn
              size="lg"
              color="white"
              text-color="black"
              icon="close"
              round
              dense
              v-close-popup
            />
          </q-card-section>

          <q-card-section>
            <q-img :src="expandedPhoto" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////// End of Photos ///////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!------------------------------------------------------->
      <!------------------------------------------------------->
      <!------------------------------------------------------->
      <!------------------------------------------------------->
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!-- //////////// View mode general info ///////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <!-- ///////////////////////////////////////////////// -->
      <div class="col-xs-12 col-md-8 data-column">
        <div v-if="!newLocationMode" class="row justify-center q-pa-xs">
          <div
            class="q-mb-md col-xs-12"
            style="border-radius: 4px 4px 0 0; min-height: 86px"
          >
            <div class="row full-height justify-center items-center">
              <div class="col-auto" style="font-size: 28px">
                <q-icon
                  name="beenhere"
                  color="positive"
                  v-if="court.verified"
                  size="20px"
                />
                {{ court.name }}
              </div>
              <!-- <div class="col-auto q-ml-xs">
                <q-btn
                  type="a"
                  :href="court.maps_url"
                  color="indigo"
                  label="Go to"
                  flat
                  icon="place"
                  class="q-ml-xs"
                />
              </div> -->
            </div>
          </div>
        </div>
        <div v-if="!newLocationMode" class="row justify-center">
          <div class="col-xs-12 col-md-11 q-mb-md">
            <div class="row items-start">
              <div class="col-xs-12 col-md-6 q-px-sm q-pb-md">
                <div class="q-my-xs row items-center">
                  <q-icon color="indigo" name="launch" size="25px"></q-icon>
                  <q-btn
                    type="a"
                    dense
                    :href="court.maps_url"
                    color="indigo"
                    flat
                    label="Google Maps"
                    no-caps
                    style="margin-left: 12px"
                  />
                </div>
                <div class="q-my-xs row items-center">
                  <q-icon name="payments" color="indigo" size="25px"></q-icon>
                  <span class="q-ml-md" style="font-size: 15px">{{
                    court.cost
                  }}</span>
                </div>
                <!-- <q-separator inset /> -->
                <div class="q-my-xs row items-center">
                  <q-icon color="indigo" name="map" size="25px"></q-icon>
                  <span class="q-ml-md" style="font-size: 15px">
                    {{ court.city + ", " + court.region }}
                  </span>
                </div>
                <!-- <q-separator inset /> -->
                <div class="q-my-xs row items-center">
                  <q-icon color="indigo" name="wc" size="25px"></q-icon>
                  <span class="q-ml-md" style="font-size: 15px">{{
                    court.girls_allowed
                      ? "Girls are allowed"
                      : "Girls aren't allowed"
                  }}</span>
                </div>
                <!-- <q-separator inset /> -->
                <div
                  v-if="court && court.sport_types"
                  class="q-my-xs q-pr-xs row items-center"
                >
                  <q-icon
                    name="sports"
                    color="indigo"
                    class="q-mr-sm"
                    size="28px"
                  ></q-icon>
                  <q-chip
                    v-for="(sport, index) in sports"
                    :key="index + 'included_sports'"
                    :color="sport.color"
                    outline
                    square
                    :label="sport.label"
                    dense
                    v-show="court.sport_types.includes(sport.val)"
                  />
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <q-input
                  type="textarea"
                  :value="court.meta"
                  readonly
                  style="font-size: 16px"
                  color="indigo"
                  outlined
                  ><template v-slot:prepend>
                    <q-icon size="26px" name="more_vert" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////// End of view mode general info ///////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////// Toggle between Edit and View ////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <div v-if="!newLocationMode" class="row justify-center q-mt-xs">
          <div class="col-xs-12 col-md-11 q-mb-lg">
            <div class="row justify-end items-center">
              <div>
                <q-btn
                  :to="'/events/new/' + court.id"
                  color="primary"
                  size="17px"
                  round
                  icon="event"
                />
                <q-btn-dropdown
                  flat
                  class="q-mx-sm q-pr-sm"
                  dropdown-icon="more_horiz"
                >
                  <q-btn
                    class="full-width"
                    :label="
                      court.verified ? 'Remove verification' : 'Verify location'
                    "
                    :icon="court.verified ? 'remove' : 'beenhere'"
                    color="positive"
                    @click="
                      court.verified
                        ? removeLocationVerification()
                        : verifyLocation()
                    "
                    :disable="
                      disableForNonAuthorized ||
                        !user.scopes.includes('verify_locations')
                    "
                  />
                  <!-- <br />
                  <q-btn
                    label="Delete location"
                    color="negative"
                    icon="delete"
                    :disable="disableForNonAuthorized"
                    class="full-width q-mt-xs"
                  /> -->
                </q-btn-dropdown>
                <q-btn-toggle
                  v-model="viewEditToggle"
                  toggle-color="indigo"
                  :disable="disableForNonAuthorized"
                  push
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
        </div>
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///// End of Toggle between Edit and View  ////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- /////////////////// Edit form /////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <q-form
          @submit="submitForm"
          v-if="viewEditToggle === 'edit' && showElementIfAuthorized"
          class="row justify-center"
        >
          <div class="col-xs-12 col-md-11">
            <div class="row">
              <div class="text-h5 text-grey-7 col-xs-12 q-px-sm">
                {{ newLocationMode ? "New location" : "Edit" }}
              </div>
              <div class="col-xs-12 q-px-sm q-pb-sm">
                <div class="row justify-end">
                  <q-toggle
                    class="col-auto"
                    label="Girls"
                    color="pink"
                    :value="court.girls_allowed"
                    @input="updateLocation('girls_allowed', $event)"
                    size="lg"
                  />
                </div>
              </div>
              <q-input
                class="col-xs-12 q-px-sm"
                bottom-slots
                :value="court.name"
                label="Name"
                filled
                color="indigo"
                @input="updateLocation('name', $event)"
              />
              <q-input
                class="col-xs-12 col-md-6 q-px-sm"
                bottom-slots
                :value="court.city"
                label="City"
                filled
                color="indigo"
                @input="updateLocation('city', $event)"
              >
                <template v-slot:prepend>
                  <q-icon name="location_city" />
                </template>
              </q-input>
              <q-input
                class="col-xs-12 col-md-6 q-px-sm"
                bottom-slots
                :value="court.region"
                label="Region"
                filled
                color="indigo"
                @input="updateLocation('region', $event)"
              >
              </q-input>
              <div class="col-xs-12">
                <div class="row">
                  <q-input
                    class="col-xs-12 col-md-6 q-px-sm q-mb-md"
                    bottom-slots
                    :value="court.maps_url"
                    label="Maps URL"
                    filled
                    color="indigo"
                    @input="updateLocation('maps_url', $event)"
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
                    :value="court.cost"
                    label="Cost"
                    filled
                    color="indigo"
                    @input="updateLocation('cost', $event)"
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
                @input="updateLocation('meta', $event)"
              >
                <template v-slot:prepend>
                  <q-icon name="more_vert" />
                </template>
              </q-input>
              <q-checkbox
                v-for="(sport, index) in sports"
                :key="index"
                class="q-mt-lg"
                :value="court.sport_types"
                :val="sport.val"
                :color="sport.color"
                @input="updateLocation('sport_types', $event)"
                ><q-icon
                  :color="sport.color"
                  style="margin-top: -5px"
                  class="q-mr-md"
                  size="25px"
                  :name="sport.icon"
                />
              </q-checkbox>
              <div class="col-xs-12">
                <div class="row justify-end">
                  <q-btn
                    :loading="updatePending"
                    label="Save"
                    type="submit"
                    :disable="disableForNonAuthorized"
                    class="q-mt-md q-mb-lg"
                    color="indigo"
                  ></q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-form>
        <div
          class="row items-center justify-center"
          v-if="
            newLocationMode &&
              user &&
              user.scopes &&
              !user.scopes.includes('add_locations')
          "
        >
          <span class="text-subtitle1 q-py-sm q-px-md custom-warning-tip">
            You are not authorized to add locations
          </span>
        </div>
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- /////////////// End of edit form //////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!------------------------------------------------------->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- /////////////////// Comments //////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <!-- ///////////////////////////////////////////////// -->
        <div v-if="!newLocationMode" class="row justify-center q-mt-md">
          <div
            v-if="court.comments && court.comments.length > 0"
            class="text-h5 q-mb-md text-grey-7 col-xs-12 col-md-11"
          >
            <q-toggle color="indigo" size="lg" v-model="showComments" />
            <span>Comments</span>
          </div>
          <q-card v-if="user" class="col-xs-12 col-md-11 q-mb-sm" flat bordered>
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
            <q-separator />
            <q-card-section class="q-pa-none">
              <div class="row">
                <div class="col-xs-12">
                  <q-input
                    class="full-width"
                    style="max-height: 200px; min-height: 60px"
                    type="textarea"
                    borderless
                    filled
                    color="indigo"
                    placeholder="Add comment ..."
                    v-model="newComment.text"
                  >
                    <template v-slot:prepend> <q-icon name="edit" /> </template>
                  </q-input>
                </div>
                <q-separator />
                <div class="col-xs-12">
                  <div class="row justify-end">
                    <q-btn
                      color="indigo"
                      class="q-ma-sm"
                      icon="comment"
                      label="Send"
                      @click="sendNewComment()"
                      :loading="commentPending"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <div
            class="col-xs-12 col-md-11 q-mt-sm"
            v-if="court.comments && court.comments.length > 0 && showComments"
          >
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
                    :value="comment.rating"
                    :max="4"
                    size="2.3em"
                    color="primary"
                    :icon="ratingIcons"
                  />
                </q-item-section>
              </q-item>

              <q-separator />

              <q-card-section class="q-pa-none">
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      class="full-width q-pl-md"
                      style="max-height: 200px; border-bottom: none; height: 100px"
                      readonly
                      square
                      type="textarea"
                      color="indigo"
                      borderless=""
                      :value="comment.text"
                    >
                      <template v-slot:append>
                        <div class="column items-end">
                          <q-chip
                            class="bg-grey-3"
                            square
                            dense
                            :label="getFullDate(comment.created_at)"
                          />
                          <q-chip
                            class="q-mt-none bg-grey-3"
                            square
                            dense
                            :label="getTime(comment.created_at)"
                          />
                        </div>
                      </template>
                      <template v-slot:prepend>
                        <q-btn-dropdown
                          color="indigo"
                          flat
                          dense
                          icon="more_horiz"
                        >
                          <q-btn
                            color="negative"
                            label="Delete"
                            icon="delete"
                            @click="deleteComment(comment.id, court.id)"
                            v-if="comment && user"
                          />
                        </q-btn-dropdown> </template
                    ></q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { QSpinnerFacebook } from "quasar";
import { sports } from "../store/sports";
export default {
  data() {
    return {
      showComments: true,
      expandPhoto: false,
      expandedPhoto: "",
      showCoverPhotoInput: false,
      showNewPhotoInput: false,
      pickedPhoto: null,
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
      viewEditToggle: "view",
      sports: sports,
      newLocationMode: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    },
    court() {
      if (this.$route.params.id === "new") {
        return this.$store.state.courts.newLocation;
      } else {
        return this.$store.state.courts.thisCourt;
      }
    },
    updatePending() {
      return this.$store.state.courts.updatePending;
    },
    commentPending() {
      return this.$store.state.courts.commentPending;
    },
    photoUploadPending() {
      return this.$store.state.courts.photoUploadPending;
    },
    disableForNonAuthorized() {
      return (
        !this.user ||
        !this.user.scopes ||
        (!this.user.scopes.includes("edit_locations") &&
          (!this.user.scopes.includes("add_locations") ||
            (this.user.id !== this.court.created_by && !this.newLocationMode)))
      );
    },
    showElementIfAuthorized() {
      return (
        this.user &&
        this.user.scopes &&
        (this.user.scopes.includes("edit_locations") ||
          (this.user.scopes.includes("add_locations") &&
            (this.user.id === this.court.created_by || this.newLocationMode)))
      );
    }
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== "new") {
        this.fetchCourt(to.params.id);
      } else {
        this.viewEditToggle = "edit";
        this.newLocationMode = true;
      }
    }
  },
  methods: {
    verifyLocation() {
      this.$store
        .dispatch("courts/verifyLocation", this.court.id)
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
    removeLocationVerification() {
      this.$store
        .dispatch("courts/removeLocationVerification", this.court.id)
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
    expandThisPhoto(url) {
      this.expandedPhoto = url;
      this.expandPhoto = true;
    },
    deleteComment(comment_id, location_id) {
      this.$store
        .dispatch("courts/deleteComment", {
          comment_id,
          location_id
        })
        .then(({ status, message }) => {
          this.newComment.text = "";
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
    sendNewComment() {
      if (
        this.newComment.text !== "" &&
        !this.newComment.text.trim().length == 0
      ) {
        this.$store
          .dispatch("courts/comment", {
            location_id: this.court.id,
            text: this.newComment.text,
            rating: this.newComment.rating
          })
          .then(({ status, message }) => {
            this.newComment.text = "";
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
    onPhotoUploadClick(index, courtId) {
      if (this.pickedPhoto) {
        const formData = new FormData();
        formData.append("photo", this.pickedPhoto);
        // formData.append("index", index);
        this.$store
          .dispatch("courts/uploadPhoto", {
            formData,
            index,
            location_id: courtId
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
            this.pickedPhoto = null;
            this.showCoverPhotoInput = false;
            this.showNewPhotoInput = false;
          });
      }
    },
    deleteThisPhoto(photoId) {
      this.$store
        .dispatch("courts/deletePhoto", { locationId: this.court.id, photoId })
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
    },
    updateLocation(key, value) {
      if (this.newLocationMode) {
        this.$store.commit("courts/updateNewLoactionObj", { key, value });
      } else {
        this.$store.commit("courts/updateLoactionObj", { key, value });
      }
    },
    submitForm() {
      if (this.newLocationMode) {
        this.$store
          .dispatch("courts/insert", this.court)
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
              this.$router.push("/");
            }
          });
      } else {
        this.$store
          .dispatch("courts/update", this.court)
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
    checkPhotoSize(files) {
      return files.filter(file => file.size < 2000000);
    },
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
    },
    getTime(timestamp) {
      let date = new Date(timestamp);
      return (
        date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds()
      );
    }
  },
  mounted() {
    if (this.$route.params.id !== "new") {
      this.fetchCourt(this.$route.params.id);
    } else {
      this.viewEditToggle = "edit";
      this.newLocationMode = true;
    }
  }
};
</script>
<style lang="sass" scoped>
.photos-column
  order: 0
.data-column
  order: 1
@media (max-width: 1023px)
  .photos-column
    order: 1
  .data-column
    order: 0
</style>
