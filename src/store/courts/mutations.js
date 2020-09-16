export function findCourtIdByCourtName(state, name) {
  let desiredCourtObj = state.list.find(o => o.name === name);
  return desiredCourtObj.id;
}
export function setLocationsFetchPending(state, status) {
  state.locationsFetchPending = status;
}
export function setLocationsList(state, list) {
  state.list = list;
}
export function setLocationsListTotals(state, { pages, count }) {
  state.total = { pages: Number(pages), count: Number(count) };
}
export function setCourtData(state, court) {
  state.thisCourt = court;
}
export function updateLoactionObj(state, { key, value }) {
  state.thisCourt[key] = value;
}
export function updateNewLoactionObj(state, { key, value }) {
  state.newLocation[key] = value;
}
export function setUpdatePending(state, status) {
  state.updatePending = status;
}
export function fillThisLocation(state, location) {
  state.thisCourt = location;
}
export function setCommentPending(state, status) {
  state.commentPending = status;
}
export function fillThisLocationComments(state, comments) {
  state.thisCourt.comments = comments;
}
export function setPhotoUploadPending(state, status) {
  state.photoUploadPending = status;
}
export function updateLocationPhoto(state, path) {
  state.thisCourt.photo = path;
}
export function updateLocationPhotos(state, photos) {
  state.thisCourt.photos = photos;
}
