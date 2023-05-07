// import { useUserStore } from "@/stores/user";
import AuthStorage from "@/storage";
import { ref } from "vue";

export function useAccessRight(id: string | null | undefined) {
  // const UserStore = useUserStore();  
  let isAccessRight = ref(false);
  isAccessRight.value = id ? AuthStorage.data.id === id : false;
  return isAccessRight;
}