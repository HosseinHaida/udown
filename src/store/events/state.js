export default function() {
  return {
    list: null,
    eventsFetchPending: false,
    total: { pages: 1, count: 0 },
    searchType: null,
    // searchTypes: byCourtId || byUserId
    searchText: null,
    searchResults: null
  };
}
