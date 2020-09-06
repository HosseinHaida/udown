import axios from "axios";
import { apiUrl } from "../variables";
export async function fetchUsersList({ rootState, commit }, which) {
  commit("setUsersFetchPending", true);
  let type = "";
  if (which.type === "friends") {
    type = "/friends_only";
  } else {
    type = "";
  }
  const url = `${apiUrl}/users/list${type}/${which.page}/${which.howMany}/${which.searchText}`;
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
