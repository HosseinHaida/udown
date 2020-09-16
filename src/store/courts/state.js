export default function() {
  return {
    list: null,
    locationsFetchPending: false,
    total: { pages: 1, count: 0 },
    thisCourt: null,
    newLocation: {
      name: "",
      maps_url: "",
      city: "",
      region: "",
      cost: "",
      photo: "",
      meta: "",
      sport_types: [],
      girls_allowed: true
    },
    updatePending: false,
    commentPending: false,
    photoUploadPending: false
  };
}
