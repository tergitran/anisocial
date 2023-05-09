const baseUrl = import.meta.env.VITE_BASE_URL_AUTH ?? 'http://localhost:5500/api/v1';

import axios from "@/axios";

export default {
  login(username: string, password: string) {
    return axios.post(baseUrl + '/login', { username, password });
  },
  signUp(username: string, password: string) {
    return axios.post(baseUrl + '/sign-up', { username, password });
  },
  logout() {
    return axios.post(baseUrl + '/logout');
  }
}
