export function setSearchType(state, type) {
  state.searchType = type;
}
export function setSearchText(state, payload) {
  state.searchText = payload;
}
export function setResults(state, events) {
  state.searchResults = events;
}
export function emptySearchResults(state) {
  state.searchResults = null;
}
export function setParticipants(state, participants) {
  state.participants = participants;
}
export function setEventsFetchPending(state, status) {
  state.eventsFetchPending = status;
}
export function setEventsList(state, list) {
  state.list = list;
}
export function setEventsListTotals(state, { pages, count }) {
  state.total = { pages: Number(pages), count: Number(count) };
}
