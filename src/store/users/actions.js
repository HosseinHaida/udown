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
