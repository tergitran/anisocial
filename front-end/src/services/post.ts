// const baseUrl = process.env.BASE_URL;
const baseUrl = 'http://localhost:5000';

import axios from "@/axios";

export default {
  getPostList(params?: any) { // todo: need implicit type?
    return axios.get(baseUrl + '/posts', {params});
  },
  createNewPost(data : any) { // todo: need implicit type?
    return axios.post(baseUrl + '/post/', data);
  },
}
