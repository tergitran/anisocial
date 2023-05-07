<script setup lang="ts">
import Post from "@/components/Post.vue";
import { ref, watchEffect, onBeforeMount } from "vue";
import postService from "@/services/post";
import BaseSpinner from "@/components/BaseSpinner.vue";

interface Comment {
  id: string,
  content: string,
  authorInfor: {
    username: string,
    avatar: string,
    id: string
  },
  date: string
}

interface PostType {
    id: string,
    content: string,
    authorInfor: {
      username: string,
      avatar: string,
      id: string
    },
    date: string,
    like: number,
    isLiked: boolean,
    comments: Comment[],
}

let posts = ref<PostType[]>([]);
let isLoading = ref(false);
isLoading.value = true;
postService.getPostList().then(res => {
  posts.value = res.data;
}).catch(err => {}).finally(() => {
  isLoading.value = false;
});

</script>

<template>
  <main class="container mx-auto mt-3 flex max-w-3xl flex-col gap-4">
    <BaseSpinner v-if="isLoading"></BaseSpinner>
    <Post v-else :post="post" v-for="post in posts"></Post>
  </main>
</template>

<style>
  div[contenteditable]:empty:not(:focus):before {
    content: attr(placeholder);
    pointer-events: none;
    display: block; /* For Firefox */
  }
</style>
