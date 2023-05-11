<script setup lang="ts">
import Post from "@/components/Post.vue";
import { ref, watchEffect, onBeforeMount } from "vue";
import postService from "@/services/post";
import BaseSpinner from "@/components/BaseSpinner.vue";

interface Comment {
  id: string;
  content: string;
  authorInfor: {
    username: string;
    avatar: string;
    id: string;
  };
  date: string;
}

interface PostType {
  id: string;
  content: string;
  authorInfor: {
    username: string;
    avatar: string;
    id: string;
  };
  date: string;
  like: number;
  isLiked: boolean;
  comments: Comment[];
}

let posts = ref<PostType[]>([]);
let isLoading = ref(false);
isLoading.value = true;
postService
  .getPostList()
  .then((res) => {
    posts.value = res.data;
  })
  .catch((err) => {})
  .finally(() => {
    isLoading.value = false;
  });

function handleUpdatePost(id: string, content: string) {
  const item = posts.value.find((item) => item.id === id);
  if (item) {
    item.content = content;
  }
}
function handleDeletePost(id: string) {
  const itemIndex = posts.value.findIndex((item) => item.id === id);
  if (itemIndex != -1) {
    posts.value.splice(itemIndex, 1);
  }
}
</script>

<template>
  <main class="container mx-auto mt-3 flex max-w-3xl flex-col gap-4">
    <BaseSpinner v-if="isLoading"></BaseSpinner>
    <TransitionGroup v-else name="fade">
      <Post
        :post="postItem"
        @update="handleUpdatePost"
        @delete="handleDeletePost"
        :key="postItem.id"
        v-for="postItem in posts"
      ></Post>
    </TransitionGroup>
  </main>
</template>

<style>
div[contenteditable]:empty:not(:focus):before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>
