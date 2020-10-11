export function setUsersList(state, list) {
  state.list = list;
}

export function setUsersFetchPending(state, status) {
  state.usersFetchPending = status;
}

export function setUsersListTotals(state, total) {
  state.total = { pages: Number(total.pages), count: Number(total.count) };
}

export function setUserScopesUpdatePending(state, status) {
  state.userScopesUpdatePending = status;
}

export function setUserScopes(state, { scopes, id }) {
  state.list.filter(user => {
    if (user.id === id) {
      user.scopes = scopes;
    }
  });
}

export function setUserVerificationStatus(state, { id, status }) {
  state.list.filter(user => {
    if (user.id === id) {
      user.verified = status;
    }
  });
}

export function setUsersOptions(state, users) {
  if (users.length < 1) {
    state.usersOptions = null;
  } else {
    state.usersOptions = users.map(user => {
      return {
        label: `<span class="text-subtitle2">${user.username}</span>
      <span class="text-grey-7 q-px-xs">-</span>
      <span class="text-grey-7">${user.first_name} ${user.last_name}</span>`,
        value: user.id
      };
    });
  }
}
// export function setLoggedInUserScopes(rootState, scopes) {
//   rootState.user.data.scopes = scopes;
// }
