import axios from "axios";
import { apiUrl } from "../variables";
export async function fetchUsersList({ state, commit }, which) {
  commit("setUsersFetchPending", true);
  return await axios
    .get(
      `${apiUrl}/users/list/${which.page}/${which.howMany}/${which.searchText}`
    )
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
