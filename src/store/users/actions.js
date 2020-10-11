import axios from "axios";
import { apiUrl } from "../variables";
export async function fetchUsersList({ rootState, commit }, which) {
  commit("setUsersFetchPending", true);
  if (which.type === "all") which.type = "";
  const url = `${apiUrl}/users/list/${which.type}?page=${which.page}&how_many=${which.howMany}&search_text=${which.searchText}`;
  return await axios
    .get(url, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("setUsersFetchPending", false);
        commit("setUsersList", res.data.users);
        commit("setUsersListTotals", {
          pages: res.data.pages,
          count: res.data.total
        });
        return {
          status: "success",
          message: "Fetched List"
        };
      },
      error => {
        commit("setUsersFetchPending", false);
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

export async function fetchUsersListAsOptions({ commit }, searchText) {
  const url = `${apiUrl}/users/list/options/${searchText}`;
  return await axios.get(url).then(
    res => {
      // let users = [];
      if (res.data && res.data.users) {
        commit("setUsersOptions", res.data.users);
      }
      return {
        status: "success",
        message: "Fetched List"
        // users
      };
    },
    error => {
      if (!error.response) {
        return {
          status: "error",
          message: "No connection"
          // users: []
        };
      }
      return {
        status: "error",
        message: error.response.data.error
        // users: []
      };
    }
  );
}

export async function updateUserScopes({ rootState, commit }, { scopes, id }) {
  commit("setUserScopesUpdatePending", true);
  return await axios
    .post(
      `${apiUrl}/user/scopes`,
      { scopes, id },
      {
        headers: {
          token: rootState.user.t
        }
      }
    )
    .then(
      res => {
        commit("setUserScopesUpdatePending", false);
        commit("setUserScopes", { scopes: res.data.scopes, id: id });
        let message = "Updated";
        if (id === rootState.user.data.id) {
          message = "Reload page to have your new scopes in effect";
        }
        return {
          status: "success",
          message
        };
      },
      error => {
        commit("setUserScopesUpdatePending", false);
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

export async function verifyUser({ rootState, commit }, id) {
  return await axios
    .post(
      apiUrl + "/auth/verify",
      { id },
      {
        headers: {
          token: rootState.user.t
        }
      }
    )
    .then(
      res => {
        if (res.data) {
          commit("setUserVerificationStatus", { id, status: true });
        }
        return {
          status: "success",
          message: "Verified"
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

export async function removeUserVerification({ rootState, commit }, id) {
  return await axios
    .delete(apiUrl + "/auth/remove/verification/" + id, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        if (res.data) {
          commit("setUserVerificationStatus", { id, status: false });
        }
        return {
          status: "success",
          message: "Removed verification"
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
