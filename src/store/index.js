import Vue from "vue";
import Vuex from "vuex";

import main from "./main";
import courts from "./courts";
import user from "./user";
import users from "./users";
import events from "./events";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      main,
      courts,
      user,
      users,
      events
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
