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

const modalStatus = ref(false);
const postWriter = ref<HTMLElement | null>(null);
const emit = defineEmits<{
  (event: "update", id: string, content: string): void;
  (event: "delete", id: string): void;
}>();
const updatePost = async () => {
  try {
    await postService.updatePost(props.post.id, postContent.value);
    emit("update", props.post.id, postContent.value);
    modalStatus.value = false;
  } catch (error) {
  } finally {
  }
};
const deletePost = async (e: Event) => {
  try {
    await postService.deletePost(props.post.id);
    closeDropdown(e);
    emit("delete", props.post.id);
  } catch (error) {}
};

const postContent = ref(props.post.content);
function onInput(event: Event) {
  const context = (event.target as HTMLElement).innerHTML;
  postContent.value = context;
}

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
      <div v-if="isAccessRight">
        <!-- <img class="" src="@/assets/images/essentials/more.svg" alt="" /> -->
        <div class="dropdown-left dropdown">
          <label
            tabindex="0"
            class="inline-block h-10 w-10 cursor-pointer hover:rounded-full hover:bg-stone-100"
          >
            <div
              class="flex h-full w-full items-center justify-center text-slate-600"
            >
              <img class="" src="@/assets/images/essentials/more.svg" alt="" />
            </div>
          </label>
          <div
            tabindex="0"
            class="dropdown-content mt-1 w-fit rounded-lg bg-base-100 p-1 shadow"
          >
            <div class="flex flex-col">
              <button
                @click="
                  (e) => {
                    modalStatus = true;
                    closeDropdown(e);
                    if (postWriter) {
                      postWriter.innerHTML = post.content;
                    }
                  }
                "
                class="rounded py-2 px-3 hover:bg-slate-200"
              >
                Edit
              </button>
              <button
                @click="deletePost"
                class="rounded py-2 px-3 hover:bg-slate-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <BaseModal
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
              @click="updatePost"
              class="btn-blue mt-4 w-full font-bold text-white"
            >
              Update
            </button>
          </template>
        </BaseModal>
      </div>
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
    <BaseModal
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
  </div>
</template>
<style scoped>
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
