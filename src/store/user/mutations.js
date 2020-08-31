export function setSignupPending(state, status) {
  state.signupPending = status;
}

export function setSigninPending(state, status) {
  state.signinPending = status;
}

export function setUserData(state, userPayload) {
  state.data = userPayload;
}

export function setToken(state, t) {
  state.t = t;
}

export function updateUserPhoto(state, path) {
  state.data.photo = null;
  state.data.photo = path;
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
  // document.cookie = "uname=" + user.username;
  // document.cookie = "uid=" + user.id;
  // document.cookie = "ufname=" + user.first_name;
  // document.cookie = "ulname=" + user.last_name;
  // document.cookie = "ubio=" + user.bio;
}
