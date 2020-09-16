import axios from "axios";
import { apiUrl } from "../variables";
export async function fetchLocationsList({ commit }, which) {
  commit("setLocationsFetchPending", true);
  const url = `${apiUrl}/locations/list/${which.page}/${which.howMany}/${which.searchText}`;
  return await axios.get(url).then(
    res => {
      commit("setLocationsFetchPending", false);
      commit("setLocationsList", res.data.locations);
      commit("setLocationsListTotals", {
        pages: res.data.pages,
        count: res.data.total
      });
      return {
        status: "success",
        message: "Fetched List"
      };
    },
    error => {
      commit("setLocationsFetchPending", false);
      if (!error.response) {
        return {
          status: "error",
          message: "No connection"
        };
      }
      return {
        status: "error",
        message: error.response.data.error
      };
    }
  );
}

export async function fetchCourt({ commit }, id) {
  return await axios.get(apiUrl + "/location/fetch/" + id).then(
    res => {
      if (res.data && res.data.location) {
        commit("setCourtData", res.data.location);
      }
      return {
        status: "success",
        message: "Fetched court"
      };
    },
    error => {
      if (!error.response) {
        return {
          status: "error",
          message: "No connection"
        };
      }
      return {
        status: "error",
        message: error.response.data.error
      };
    }
  );
}

export async function update({ rootState, commit }, location) {
  commit("setUpdatePending", true);
  return await axios
    .post(apiUrl + "/location/update", location, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("setUpdatePending", false);
        if (res.data.location) {
          commit("fillThisLocation", res.data.location);
        }

        return {
          status: "success",
          message: "Updated " + res.data.location.name
        };
      },
      error => {
        commit("setUpdatePending", false);
        if (!error.response) {
          return {
            status: "error",
            message: "No connection"
          };
        }
        return {
          status: "error",
          message: error.response.data.error
        };
      }
    );
}

export async function insert({ rootState, commit }, newLocation) {
  commit("setUpdatePending", true);
  return await axios
    .post(apiUrl + "/location/insert", newLocation, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("setUpdatePending", false);
        if (res.data.location) {
          commit("fillThisLocation", res.data.location);
        }

        return {
          status: "success",
          message: "Successfully created new location"
        };
      },
      error => {
        commit("setUpdatePending", false);
        if (!error.response) {
          return {
            status: "error",
            message: "No connection"
          };
        }
        return {
          status: "error",
          message: error.response.data.error
        };
      }
    );
}

export async function comment({ rootState, commit }, comment) {
  commit("setUpdatePending", true);
  return await axios
    .post(apiUrl + "/location/comment", comment, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("setCommentPending", false);
        if (res.data.comments) {
          commit("fillThisLocationComments", res.data.comments);
        }

        return {
          status: "success",
          message: "Comment sent"
        };
      },
      error => {
        commit("setCommentPending", false);
        if (!error.response) {
          return {
            status: "error",
            message: "No connection"
          };
        }
        return {
          status: "error",
          message: error.response.data.error
        };
      }
    );
}

export async function deleteComment(
  { rootState, commit },
  { comment_id, location_id }
) {
  return await axios
    .delete(`${apiUrl}/location/comment/delete/${comment_id}/${location_id}`, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        if (res.data.comments) {
          commit("fillThisLocationComments", res.data.comments);
        }
        return {
          status: "success",
          message: res.data.message
        };
      },
      error => {
        if (!error.response) {
          return {
            status: "error",
            message: "No connection"
          };
        }
        return {
          status: "error",
          message: error.response.data.error
        };
      }
    );
}

export async function uploadPhoto(
  { rootState, commit },
  { formData, index, location_id }
) {
  commit("setPhotoUploadPending", true);
  return await axios
    .post(`${apiUrl}/location/set_photo/${location_id}/${index}`, formData, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("updateLocationPhoto", res.data.photo);
        if (res.data.photos) {
          commit("updateLocationPhotos", res.data.photos);
        }
        commit("setPhotoUploadPending", false);
        return {
          status: "success",
          message: "Successfully uploaded photo."
        };
      },
      error => {
        commit("setPhotoUploadPending", false);
        if (!error.response) {
          return {
            status: "error",
            message: "No connection"
          };
        }
        return {
          status: "error",
          message: error.response.data.error
        };
      }
    );
}

export async function deletePhoto(
  { rootState, commit },
  { locationId, photoId }
) {
  commit("setPhotoUploadPending", true);
  return await axios
    .delete(`${apiUrl}/location/photo/delete/${locationId}/${photoId}`, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("updateLocationPhoto", res.data.photo);
        if (res.data.photos) {
          commit("updateLocationPhotos", res.data.photos);
        }
        commit("setPhotoUploadPending", false);
        return {
          status: "success",
          message: "Successfully deleted photo."
        };
      },
      error => {
        commit("setPhotoUploadPending", false);
        if (!error.response) {
          return {
            status: "error",
            message: "No connection"
          };
        }
        return {
          status: "error",
          message: error.response.data.error
        };
      }
    );
}
