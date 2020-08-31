export function setUsersList(state, list) {
  state.list = list;
}

export function setUsersListTotals(state, total) {
  state.total = { pages: Number(total.pages), count: Number(total.count) };
}
