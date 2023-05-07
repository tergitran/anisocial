<script setup lang="ts">
import BaseModal from "@/components/BaseModal.vue";
import Post from "@/components/Post.vue";

import defaultAvatar from "@/assets/images/default-avatar.png";

import { ref, onMounted, computed, inject } from "vue";
import postService from "@/services/post";
import userService from "@/services/user";
import { useAccessRight } from "@/composables/accessRights";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { formatTime } from "@/utils/moment";

import { toBase64 } from "@/utils/convert";

const sidebar = ref<HTMLInputElement | null>(null);
let positionTop = ref(0);
let modalStatus = ref(false);

const userId = computed(() => {
  return Array.isArray(useRoute().params.id)
    ? useRoute().params.id[0]
    : useRoute().params.id;
});

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

interface Post {
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

const UserStore = useUserStore();

let postContent = ref("");
let postList = ref<Post[]>([]);

const paramPost = { user_id: userId.value };

postService.getPostList(paramPost).then((res) => {
  postList.value = res.data.map((item: Post) => ({
    ...item,
    formatDate: formatTime(item.date),
  }));
});

 
let avatarImage = ref<HTMLImageElement | null>(null);
async function handleChangeAvatar(event: Event) {
    const el = event.target as HTMLInputElement;
    if (el.files) {
      console.log(el.files[0]);
      const file = URL.createObjectURL(el.files[0]);
      if (avatarImage.value) {
        avatarImage.value.src = file;
        const base64Image = await toBase64(el.files[0]);
        console.log(base64Image);
        await userService.updateAvatar(base64Image as string);
        UserStore.getUserInfo();
      }
    }
}

const postWriter = ref<HTMLDivElement | null>(null);
function onInput(event: Event) {
  const context = (event.target as HTMLElement).innerHTML;
  postContent.value = context;
}
function addNewPost() {
  interface payLoadPost {
    content: string;
  }
  const payload: payLoadPost = {
    content: postContent.value,
  };
  postService
    .createNewPost(payload)
    .then((res) => {
      const { date, id } = res.data;
      const postdata = {
        id,
        content: payload.content,
        authorInfor: {
          username: UserStore.user.username,
          avatar: UserStore.user.avatar,
          id: UserStore.user.id,
        },
        date,
        like: 0,
        isLiked: false,
        comments: [],
      };
      postList.value.unshift(postdata);
      modalStatus.value = false;
    })
    .catch((err) => {}).finally(() => {
      if (postWriter.value) {
        postWriter.value.innerHTML = '';
      }
    });
}

onMounted(() => {
  const elementHeight = sidebar.value?.clientHeight;
  if (elementHeight && elementHeight > window.innerHeight) {
    positionTop.value = elementHeight - window.innerHeight;
  } else {
    positionTop.value = -64;
  }
});

interface User {
  username: string;
  no_friends: number;
  id: string;
  avatar: string;
  description: string;
}
let userInfo = ref<User | null>();
userService
  .getUserInfo(userId.value as string)
  .then((res) => {
    userInfo.value = res.data;
  })
  .catch((err) => {
    userInfo.value = null;
  });

// using provide/injection
// const x: Function = inject('isVisiable')!;

let isAccessRight = useAccessRight(userId.value as string);
</script>

<template>
  <div class="bg-linear-1">
    <div class="bg-neutral-100 shadow-lg">
      <div class="cover-photo m-auto h-72 max-w-7xl bg-gradient-to-r from-cyan-500 to-teal-500 rounded-b-2xl rounded-bl-2xl"></div>
      <div
        class="cover-photo relative m-auto flex h-fit max-w-6xl justify-between bg-transparent p-4"
      >
        <div class="flex gap-6">
          <div class="w-40"></div>
          <div
            class="absolute -bottom-8 h-40 w-40 overflow-hidden rounded-full border-4 border-teal-600 bg-slate-200"
            :class="isAccessRight && 'group'"
          >
            <input
              class="hidden"
              type="file"
              id="avatar" 
              accept="image/png, image/jpeg"
              @change="handleChangeAvatar"
            />
            <label
              for="avatar"
              class="group-hover: absolute bottom-0 z-10 hidden h-full w-full bg-teal-100/70 group-hover:flex cursor-pointer justify-center items-center"
            >
              <img class="w-10 h-10" src="@/assets/images/avatar-edit.png" alt="">
            </label>
            <img
              ref="avatarImage"
              class="h-full w-full rounded-full object-cover"
              :src="userInfo?.avatar ? userInfo.avatar : defaultAvatar"
              alt=""
            />
          </div>
          <div class="flex flex-col justify-end gap-2">
            <div class="text-3xl font-bold">{{ userInfo?.username }}</div>
            <div class="font-semibold font-mono">{{ `${userInfo?.no_friends} friends` }}</div>
          </div>
        </div>
        <div v-if="!isAccessRight" class="flex gap-2 self-end">
          <button class="btn-grey btn">Message</button>
          <!-- <button class="btn-grey btn">Follow</button> -->
          <!-- <button class="btn-grey btn">Add friend</button> -->
        </div>
      </div>
    </div>
    <div class="container mx-auto mt-5 flex justify-center gap-4 px-4">
      <div
        class="sticky h-fit min-h-[50vh] min-w-[260px] max-w-xs rounded-lg bg-yellow-100 p-4 shadow-md"
        ref="sidebar"
        :style="{ top: -positionTop + 'px' }"
      >
        <div>{{ userInfo?.description }}</div>
      </div>
      <div class="flex max-w-2xl flex-1 flex-col gap-5 px-4">
        <div
          v-if="isAccessRight"
          class="flex gap-2 rounded-lg bg-white p-4 shadow-sm"
        >
          <div class="h-11 w-11 rounded-full border-4 border-teal-200">
              <img class="rounded-full w-full h-full object-cover" :src="UserStore.user.avatar ?? defaultAvatar" alt="" />
          </div>
          <div
            @click="modalStatus = !modalStatus"
            class="flex-1 cursor-pointer rounded-full bg-neutral-100 py-2 px-4"
          >
            What's on your mind?
          </div>
        </div>
        <!-- <Post v-for="i in 2"></Post> -->
        <Post :post="postItem" v-for="postItem in postList"></Post>
      </div>
    </div>

    <BaseModal
      id="3243"
      noCloseOnBackdrop
      headerTitle="Your Post"
      modal-box-class="min-h-[180px]"
      v-model:open="modalStatus"
    >
      <div
        class="min-h-[20vh] w-full rounded-xl bg-neutral-100 py-2 px-4 text-base focus:outline-none"
        placeholder="What's on your mind?"
        contenteditable
        ref="postWriter"
        @input="onInput"
      ></div>
      <template #modal-footer>
        <button
          @click="addNewPost"
          class="btn-blue mt-4 w-full font-bold text-white"
        >
          Post
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style>
div[contenteditable]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>
