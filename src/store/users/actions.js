import axios from "axios";
import { apiUrl } from "../variables";
import userStore from "../user";
export async function fetchUsersList({ rootState, commit }, which) {
  commit("setUsersFetchPending", true);
  let type = "";
  if (which.type === "friends") {
    type = "/friends";
  } else {
    type = "";
  }
  return await axios
    .get(
      `${apiUrl}/users/list/${which.page}/${which.howMany}${type}/${which.searchText}`,
      {
        headers: {
          token: rootState.user.t
        }
      }
    )
    .then(
      res => {
        // console.log(res.data.users);
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
