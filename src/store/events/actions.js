import axios from "axios";
import { apiUrl } from "../variables";

export async function fetchEventsList({ rootState, commit }, which) {
  commit("setEventsFetchPending", true);
  const url = `${apiUrl}/events/list/${which.type}?page=${which.page}&how_many=${which.howMany}&search_text=${which.searchText}`;
  return await axios
    .get(url, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("setEventsFetchPending", false);
        commit("setEventsList", res.data.events);
        commit("setEventsListTotals", {
          pages: res.data.pages,
          count: res.data.total
        });
        return {
          status: "success",
          message: "Fetched List"
        };
      },
      error => {
        commit("setEventsFetchPending", false);
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

export async function fetchEvent({ rootState, commit }, id) {
  return await axios
    .get(apiUrl + "/event/fetch/" + id, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        if (res.data && res.data.event) {
          commit("setEvent", res.data.event);
        }
        return {
          status: "success",
          message: "Event fetched"
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

export async function signForThisEvent({ rootState, commit }, participant) {
  return await axios
    .post(apiUrl + "/event/sign", participant, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        if (res.data && res.data.participants) {
          commit("setEventParticipants", res.data.participants);
        }
        const message = res.data.updated ? "Updated your status" : "Signed";
        return {
          status: "success",
          message
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

export async function createNewEvent({ rootState, commit }, event) {
  commit("setEventInsertPending", true);
  return await axios
    .post(apiUrl + "/event/new", event, {
      headers: {
        token: rootState.user.t
      }
    })
    .then(
      res => {
        commit("setEventInsertPending", false);
        return {
          status: "success",
          message: "Created"
        };
      },
      error => {
        commit("setEventInsertPending", false);
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

export async function cancelEvent({ rootState }, id) {
  return await axios
    .post(
      apiUrl + "/event/cancel",
      { id },
      {
        headers: {
          token: rootState.user.t
        }
      }
    )
    .then(
      res => {
        return {
          status: "success",
          message: "Successfully canceled this event"
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
