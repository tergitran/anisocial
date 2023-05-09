import { defineStore } from "pinia";
import auth from '@/services/auth';
import AuthStorage from "@/storage";
import jwtDecode from "jwt-decode";

import { useRouter } from 'vue-router'
const router = useRouter()

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      access_token: AuthStorage.data?.accessToken,
      refresh_token: AuthStorage.data?.refreshToken,
      id: AuthStorage.data?.id,
      $router: router
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.access_token;
    }
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const res = await auth.login(username, password);
        const { id } = jwtDecode(res.data.accessToken) as any;
        res.data.id = id;
        AuthStorage.data = res.data;        
        this.id = id;
        this.access_token = res.data.accessToken;
        this.refresh_token = res.data.refreshToken;
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    logout() {      
      try {
        auth.logout();        
        this.$router.push('/login');
        AuthStorage.delete();
        this.$reset();
      } catch (error) {
        console.log(error);
      }
    }
  }
});