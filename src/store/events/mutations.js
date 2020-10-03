export function setEventsFetchPending(state, status) {
  state.eventsFetchPending = status;
}
export function setEventsList(state, list) {
  state.list = list;
}
export function setEventsListTotals(state, { pages, count }) {
  state.total = { pages: Number(pages), count: Number(count) };
}
export function setEvent(state, event) {
  state.thisEvent = event;
}
export function setEventParticipants(state, participants) {
  state.thisEvent.participants = participants;
}
export function setEventInsertPending(state, status) {
  state.eventInsertPending = status;
}
