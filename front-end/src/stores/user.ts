import { defineStore } from "pinia";
import userService from '@/services/user';
import AuthStorage from "@/storage";

interface User {
  username: string,
  no_friends: number,
  id: string,
  avatar: string,
  description: string
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {} as User
    }
  },
  getters: {

  },
  actions: {
    async getUserInfo() {
      try {        
        const res = await userService.getUserInfo(AuthStorage.data?.id);
        this.user = res.data;
      } catch (error) {
      }
    }
  }
});