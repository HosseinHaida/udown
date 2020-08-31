const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/courts", component: () => import("pages/CourtsList.vue") },
      { path: "/players", component: () => import("pages/PlayersList.vue") },
      { path: "/profile", component: () => import("pages/UserProfile.vue") },
      { path: "", redirect: "/courts" }
    ]
  },
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "/login",
        component: () => import("pages/Login.vue")
      },
      {
        path: "/signup",
        component: () => import("pages/Signup.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
