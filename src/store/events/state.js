export default function() {
  return {
    list: null,
    thisEvent: null,
    eventsFetchPending: false,
    eventInsertPending: false,
    total: { pages: 1, count: 0 }
  };
}
