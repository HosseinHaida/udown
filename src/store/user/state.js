export default function() {
  return {
    signupPending: false,
    signinPending: false,
    userFetchPending: false,
    updatePending: false,
    photoUploadPending: false,
    friendRequestPending: false,
    inboundRequestsCountPending: false,
    inboundRequestsCount: null,
    userTCookieName: "t=",
    data: null,
    t: null
  };
}
