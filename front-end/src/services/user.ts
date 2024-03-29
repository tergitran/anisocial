// const baseUrl = process.env.BASE_URL;
const baseUrl = import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : 'http://localhost:5000/api/v1';

import axios from "@/axios";

export default {
  getUserInfo(id: string) { // todo: need implicit type?
    return axios.get(baseUrl + '/user/' + id);
  },
  /**
   * 
   * @param params status 1: be friend, 2: request, 3: sent
   * @returns 
   */
  getFriendList(params: {status: number}) {
    return axios.get(baseUrl + '/friends', {params});
  },
  getAllPeople() {
    return axios.get(baseUrl + '/people');
  },
  sentFriendRequest(id: string) {
    return axios.post(baseUrl + '/friends/sent', {id});
  },
  cancelFriendRequest(id: string) {
    return axios.post(baseUrl + '/friends/cancel', {id});
  },
  acceptFriendRequest(id: string) {
    return axios.post(baseUrl + '/friends/accept', {id});
  },
  declineFriendRequest(id: string) {
    return axios.post(baseUrl + '/friends/decline', {id});
  },
  unfriend(id: string) {
    return axios.post(baseUrl + '/friends/unfriend', {id});
  },
  updateAvatar(file: string) {
    return axios.post(baseUrl + '/user', {file});
  },
  updateDescription(description: string) {
    return axios.post(baseUrl + '/user', {description});
  }
}