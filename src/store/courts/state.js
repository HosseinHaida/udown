export default function() {
  return {
    list: null,
    locationsFetchPending: false,
    total: { pages: 1, count: 0 },
    thisCourt: null,
    updatePending: false,
    commentPending: false,
    photoUploadPending: false
  };
}
