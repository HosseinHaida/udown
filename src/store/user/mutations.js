export function setSignupPending(state, status) {
  state.signupPending = status;
}

export function setSigninPending(state, status) {
  state.signinPending = status;
}

export function setUpdatePending(state, status) {
  state.updatePending = status;
}

export function setFriendRequestPending(state, status) {
  state.friendRequestPending = status;
}

export function setUserData(state, userPayload) {
  state.data = userPayload;
}

export function setToken(state, t) {
  state.t = t;
}

export function updateUserPhoto(state, path) {
  state.data.photo = path;
}

export function updateUserObj(state, { key, value }) {
  state.data[key] = value;
}

export function setPhotoUploadPending(state, status) {
  state.photoUploadPending = status;
}

export function logout(state) {
  state.data = null;
  document.cookie = "t=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}

export function setCookie(state, user) {
  let d = new Date();
  d.setTime(d.getTime() + 14 * 24 * 60 * 60 * 1000);
  let expires = d.toUTCString();
  document.cookie = "t=" + user.token + ";expires=" + expires + ";path=/";
}

export function setUserFriends(state, userFriends) {
  state.data.friends = userFriends;
}
export function setUserRequests(state, requests) {
  state.data.outbound_requests = requests;
}

export function setUserRequestsInbound(state, requests) {
  state.data.inbound_requests = requests;
}

export function setUserInboundRequestsCount(state, count) {
  state.inboundRequestsCount = count;
}
