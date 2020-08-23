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
