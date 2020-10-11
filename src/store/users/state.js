export default function() {
  return {
    list: null,
    usersFetchPending: false,
    userScopesUpdatePending: false,
    usersOptions: null,
    total: { pages: 1, count: 0 }
  };
}
