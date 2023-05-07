import { createApp, markRaw } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "./assets/main.css";

const pinia = createPinia();
const app = createApp(App);

// app.provide('isVisiable', (): string => {
//   const UserStore = useUserStore();
//   console.log(' UserStore.user.id',  UserStore.user.id);
  
//   return UserStore.user.id;
// })

pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

app.use(pinia);
app.use(router);

app.mount("#app");
