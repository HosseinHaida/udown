import axios from "axios";
import { apiUrl } from "../variables";
export async function fetchUsersList({ state, commit }, which) {
  //   commit("setSignupPending", true);
  return await axios
    .get(`${apiUrl}/users/list/${which.page}/${which.howMany}`)
    .then(
      res => {
        // commit("setSignupPending", false);
        // if (res.data.user) {
        //   commit("setUserData", res.data.user);
        //   commit("setCookie", res.data.user);
        // }
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
        //   commit("setSignupPending", false);
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
