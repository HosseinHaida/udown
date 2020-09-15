import axios from "axios";
import { apiUrl } from "../variables";
export async function signup({ state, commit }, newUser) {
  commit("setSignupPending", true);
  return await axios.post(apiUrl + "/auth/signup", newUser).then(
    res => {
      commit("setSignupPending", false);
      if (res.data.user) {
        commit("setUserData", res.data.user);
        commit("setCookie", res.data.user);
      }
      return {
        status: "success",
        message: "Created account and signed in as " + res.data.user.username
      };
    },
    error => {
      commit("setSignupPending", false);
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

export async function signin({ state, commit }, userCredentials) {
  commit("setSigninPending", true);
  return await axios.post(apiUrl + "/auth/signin", userCredentials).then(
    res => {
      commit("setSigninPending", false);
      if (res.data.user) {
        commit("setUserData", res.data.user);
        commit("setCookie", res.data.user);
      }

      return {
        status: "success",
        message: "Signed in as " + res.data.user.username
      };
    },
    error => {
      commit("setSigninPending", false);
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

export async function fetchUserData({ state, commit }) {
  var name = state.userTCookieName;
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  var t = null;
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      t = c.substring(name.length, c.length);
    }
  }
  if (t) {
    return await axios
      .get(apiUrl + "/auth/fetch", {
        headers: {
          token: t
        }
      })
      .then(
        res => {
          if (res.data && res.data.user) {
            commit("setUserData", res.data.user);
            commit("setToken", t);
          }
          return {
            status: "success",
            message: "Fetched meta for " + res.data.user.username
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
  } else {
    return false;
  }
}

export async function uploadPhoto({ state, commit }, photo) {
  commit("setPhotoUploadPending", true);
  return await axios
    .post(`${apiUrl}/auth/set_photo`, photo, {
      headers: {
        token: state.t
      }
    })
    .then(
      res => {
        commit("updateUserPhoto", res.data.photo_path);
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

export async function update({ state, commit }, user) {
  commit("setUpdatePending", true);
  return await axios
    .post(apiUrl + "/auth/update", user, {
      headers: {
        token: state.t
      }
    })
    .then(
      res => {
        commit("setUpdatePending", false);
        if (res.data.user) {
          commit("setUserData", res.data.user);
          commit("setToken", res.data.user.token);
          commit("setCookie", res.data.user);
        }

        return {
          status: "success",
          message: "Updated " + res.data.user.username
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

export async function sendFriendRequestTo({ state, commit }, id) {
  commit("setFriendRequestPending", true);
  return await axios
    .post(
      apiUrl + "/auth/friend/request",
      { requestee_id: id },
      {
        headers: {
          token: state.t
        }
      }
    )
    .then(
      res => {
        commit("setFriendRequestPending", false);
        if (res.data) {
          if (res.data.user_friends) {
            commit("setUserFriends", res.data.user_friends);
          }
          if (res.data.outbound_requests) {
            commit("setUserRequests", res.data.outbound_requests);
          }
          if (res.data.inbound_requests) {
            commit("setUserRequestsInbound", res.data.inbound_requests);
          }
          if (res.data.inbound_requests_count) {
            commit(
              "setUserInboundRequestsCount",
              res.data.inbound_requests_count
            );
          }
        }
        return {
          status: "success",
          message: res.data.message ? res.data.message : "Sent request"
        };
      },
      error => {
        commit("setFriendRequestPending", false);
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

export async function fetchInboundRequestsCount({ state, commit }) {
  return await axios
    .get(apiUrl + "/auth/inbound_requests_count", {
      headers: {
        token: state.t
      }
    })
    .then(
      res => {
        if (res.data) {
          if (res.data.inbound_requests_count) {
            commit(
              "setUserInboundRequestsCount",
              res.data.inbound_requests_count
            );
          }
        }
        return {
          status: "success",
          message: res.data.message
            ? res.data.message
            : "Fetched inbound requests count"
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
