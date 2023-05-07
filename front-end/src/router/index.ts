import { createRouter, createWebHistory } from 'vue-router'
import Routes from './router-list'
import { useAuthStore } from '@/stores/auth'
import AuthStorage from "@/storage";

// const authStore = useAuthStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})
router.beforeEach(async (to, from) => {
  // const AutheStore = useAuthStore();
  // console.log("AutheStore.isAuthenticated", AutheStore.isAuthenticated);
  if (
    // make sure the user is authenticated
    
    !AuthStorage.data &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'login'
  ) {
    // redirect the user to the login page    
    return { name: 'login' }
  }
})


export default router
