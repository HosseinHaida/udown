const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/courts", component: () => import("pages/CourtsList.vue") },
      { path: "/players", component: () => import("pages/PlayersList.vue") },
      { path: "", redirect: "/courts" }
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
