// const baseUrl = process.env.BASE_URL;
const baseUrl = import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : 'http://localhost:5000/api/v1';

import axios from "@/axios";

export default {
  getPostList(params?: any) { // todo: need implicit type?
    return axios.get(baseUrl + '/posts', {params});
  },
  createNewPost(data : any) { // todo: need implicit type?
    return axios.post(baseUrl + '/post/', data);
  },
  updatePost(id: string, content: string) { // todo: need implicit type?
    return axios.post(baseUrl + '/post/' + id, { content });
  },
  deletePost(id: string) { // todo: need implicit type?
    return axios.delete(baseUrl + '/post/' + id);
  },
}
