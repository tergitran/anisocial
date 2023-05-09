const baseUrl = import.meta.env.PROD ? import.meta.env.VITE_BASE_URL_AUTH : 'http://localhost:5500/auth/v1';
const env = import.meta.env;

import axios from "@/axios";

export default {
  login(username: string, password: string) {
    console.log('env', env);
    console.log('baseUrl', baseUrl);
    
    return axios.post(baseUrl + '/login', { username, password });
  },
  signUp(username: string, password: string) {
    return axios.post(baseUrl + '/sign-up', { username, password });
  },
  logout() {
    return axios.post(baseUrl + '/logout');
  }
}
