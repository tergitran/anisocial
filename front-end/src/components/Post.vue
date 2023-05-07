<script setup lang="ts">
import CommentDisplay from "@/components/CommentDisplay.vue";
import CommentBox from "@/components/CommentBox.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseLink from "@/components/BaseLink.vue";
import defaultAvatar from "@/assets/images/default-avatar.png";

import { onMounted, ref } from "vue";
import { fromNow } from "@/utils/moment";

import postService from "@/services/post";
import { useAccessRight } from "@/composables/accessRights";

function closeDropdown(params: any) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

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

const props = defineProps<{
  post: Post;
}>();

let modalPost = ref(false);
const commentboxref = ref<null | InstanceType<typeof CommentBox>>(null);

const onClickComment = () => {
  commentboxref.value?.textbox?.focus();
};

let isAccessRight = useAccessRight(props.post.authorInfor.id);

onMounted(() => {});
</script>
<template>
  <div class="rounded-lg bg-white p-3 shadow-md">
    <div class="flex justify-between">
      <div class="flex gap-1">
        <div class="h-11 w-11 rounded-full border-4 border-y-stone-300">
          <BaseLink :path="'/profile/' + post.authorInfor.id">
            <img
              class="h-full w-full rounded-full object-cover"
              :src="
                post.authorInfor.avatar
                  ? post.authorInfor.avatar
                  : defaultAvatar
              "
              alt=""
            />
          </BaseLink>
        </div>
        <div class="mt-1">
          <BaseLink :path="'/profile/' + post.authorInfor.id">
            <div class="text-sm font-bold">
              {{ `${post.authorInfor.username}` }}
            </div>
          </BaseLink>
          <div class="text-xs">{{ fromNow(post.date) }}</div>
        </div>
      </div>
      <label
        v-if="isAccessRight"
        for="my-modal-4"
        class="btn-grey btn h-9 w-9 rounded-full bg-transparent p-0"
      >
        <!-- <img class="" src="@/assets/images/essentials/more.svg" alt="" /> -->
        <div class="dropdown-left dropdown">
          <label
            tabindex="0"
            class="inline-block h-10 w-10 cursor-pointer rounded-full"
          >
            <div
              class="flex h-full w-full items-center justify-center text-slate-600"
            >
              <img class="" src="@/assets/images/essentials/more.svg" alt="" />
            </div>
          </label>
          <div
            tabindex="0"
            class="dropdown-content mt-1 w-fit rounded-lg bg-base-100 shadow-gray-400 shadow-md p-1"
          >
            <div class="flex flex-col">
              <button @click="closeDropdown" class="py-2 px-3 hover:bg-slate-200 rounded">Edit</button>
              <button @click="closeDropdown" class="py-2 px-3 hover:bg-slate-200 rounded">Delete</button>
            </div>
          </div>
        </div>
      </label>
    </div>
    <div class="mt-1" v-html="post.content"></div>
    <div class="flex border-y-2 border-base-300 p-1">
      <div class="btn-grey btn h-9 flex-1 bg-transparent normal-case">
        <img
          class="mr-2 w-5"
          src="@/assets/images/essentials/like.svg"
          alt=""
        />
        Like
      </div>
      <!-- like -->
      <div
        @click="onClickComment"
        class="btn-grey btn h-9 flex-1 bg-transparent normal-case"
      >
        <img
          class="mr-2 w-5"
          src="@/assets/images/essentials/comment.svg"
          alt=""
        />
        Commnent
      </div>
      <!-- comment -->
      <!-- <div class="btn-grey btn flex-1 bg-transparent normal-case">
        <img
          class="mr-2 w-5"
          src="@/assets/images/essentials/share.svg"
          alt=""
        />
        Share
      </div> -->
      <!-- share -->
    </div>
    <CommentBox ref="commentboxref" :is-show-buttons="false"></CommentBox>
    <CommentDisplay></CommentDisplay>
    <button @click="modalPost = true" class="mt-1 font-semibold">
      Show more...
    </button>
  </div>
  <BaseModal
    :id="'post-modal'"
    no-close-on-backdrop
    header-title="Username's Post"
    modal-box-class="max-w-3xl h-[100vh]"
    v-model:open="modalPost"
  >
    <div class="rounded-lg bg-white p-3 shadow-md">
      <div class="flex justify-between">
        <div class="flex gap-1">
          <div class="h-11 w-11 rounded-full">
            <img class="w-full" :src="defaultAvatar" alt="" />
          </div>
          <div class="mt-1">
            <BaseLink :path="post.authorInfor.id">
              <div class="text-sm font-bold">
                {{ `${post.authorInfor.username}` }}
              </div>
            </BaseLink>
            <div class="text-xs">{{ fromNow(post.date) }}</div>
          </div>
        </div>
        <label
          for="my-modal-4"
          class="btn-grey btn h-9 w-9 rounded-full bg-transparent p-0"
        >
          <img class="" src="@/assets/images/essentials/more.svg" alt="" />
        </label>
      </div>
      <div class="mt-1" v-html="post.content"></div>
      <div class="flex border-y-2 border-base-300 p-1">
        <div class="btn-grey btn flex-1 bg-transparent normal-case">
          <img
            class="mr-2 w-5"
            src="@/assets/images/essentials/like.svg"
            alt=""
          />
          Like
        </div>
        <!-- like -->
        <div
          @click="onClickComment"
          class="btn-grey btn flex-1 bg-transparent normal-case"
        >
          <img
            class="mr-2 w-5"
            src="@/assets/images/essentials/comment.svg"
            alt=""
          />
          Commnent
        </div>
        <!-- comment -->
        <div class="btn-grey btn flex-1 bg-transparent normal-case">
          <img
            class="mr-2 w-5"
            src="@/assets/images/essentials/share.svg"
            alt=""
          />
          Share
        </div>
        <!-- share -->
      </div>
      <CommentDisplay></CommentDisplay>
      <button @click="modalPost = true" class="mt-1 font-semibold">
        Show more...
      </button>
    </div>
    <template #modal-footer>
      <CommentBox ref="commentbox2" :is-show-buttons="false"></CommentBox>
    </template>
  </BaseModal>
</template>
