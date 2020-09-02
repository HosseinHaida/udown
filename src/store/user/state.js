export default function() {
  return {
    signupPending: false,
    signinPending: false,
    userFetchPending: false,
    updatePending: false,
    photoUploadPending: false,
    userTCookieName: "t=",
    data: null,
    t: null
  };
}
