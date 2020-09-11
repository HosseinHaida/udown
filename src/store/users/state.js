export default function() {
  return {
    list: null,
    usersFetchPending: false,
    userScopesUpdatePending: false,
    total: { pages: 1, count: 0 }
  };
}
