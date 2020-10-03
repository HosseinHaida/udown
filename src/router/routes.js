const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/courts", component: () => import("pages/CourtsList.vue") },
      { path: "/courts/:id", component: () => import("pages/Court.vue") },
      { path: "/events", component: () => import("pages/EventsList.vue") },
      {
        path: "/events/new/:location_id",
        component: () => import("pages/NewEvent.vue")
      },
      { path: "/events/:id", component: () => import("pages/Event.vue") },
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
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
