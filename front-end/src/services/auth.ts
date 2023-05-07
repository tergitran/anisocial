// const baseUrl = process.env.BASE_URL;
const baseUrl = 'http://localhost:5500';

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
