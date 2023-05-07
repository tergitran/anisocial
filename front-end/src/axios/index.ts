import axios from "axios";
import AuthStorage from "@/storage";
import router from "../router";
import { useAuthStore } from "@/stores/auth";

axios.defaults.timeout = 30000;

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (AuthStorage.data) {
      config.headers.Authorization = `Bearer ${AuthStorage.data.accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function ({config, response}) {
  if (response) {
    switch (response.status) {
      case 401:
        if (!config.url.includes('login')) {
          const AuthStore = useAuthStore();
          AuthStore.logout();
        }
        break;
      default:
        break;
    }
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(response);
});

console.log("running in axios");

export default axios;
