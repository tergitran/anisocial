<script setup lang="ts">
import CommentBox from "@/components/CommentBox.vue";
import { ref, onMounted } from "vue";
import defaultAvatar from '@/assets/images/default-avatar.png'
import { useUserStore } from "@/stores/user";

const UserStore = useUserStore();

interface Comment {
  id: number,
  userName: string,
  userId: string,
  text: string,
  date: string,
  avatar: null,
  isShowedCommentBox: false,
  otherComment?: Comment  []
}

const showCmt = ref(false);
const comments = ref([
  {
    id: 1,
    userName: "Xxx",
    userId: "123abc",
    text: "Good job!",
    date: "19-02-2020 13:34:00",
    avatar: null,
    isShowedCommentBox: false,
    otherComments: [
      {
        id: 11,
        userName: "XxP",
        userId: "123abc",
        text: "Good job!",
        date: "19-02-2020 13:34:00",
        avatar: null,
        isShowedCommentBox: false,
      },
      // {
      //   id: 12,
      //   userName: "Tan Phong",
      //   userId: "123abc",
      //   text: "Hey man",
      //   date: "19-02-2020 13:34:00",
      //   isShowedCommentBox: false,
      // },
    ],
  },
  {
    id: 2,
    userName: "YYUyy",
    userId: "adv mcd lkd ladklsdf kjsdf la lksdjf lsdkf df",
    text: "Good job!",
    date: "20-02-2020 13:34:00",
    avatar: null,
    isShowedCommentBox: false,
    otherComments: [],
  },
]);
function reply(
  value: HTMLDivElement | null,
  comment: Comment,
  comments: Array<{}>
) {
  comment.isShowedCommentBox = false;
  comments.push({
    id: 13,
    userName: UserStore.user.username,
    userId: UserStore.user.id,
    avatar: UserStore.user.avatar,
    text: value?.innerHTML,
    date: "28-02-2020 13:34:00",
    isShowedCommentBox: false,
  });
}
</script>

<template>
  <div>
    <ul>
      <li v-for="comment in comments">
        <div class="flex gap-2 pt-2">
          <img
            class="h-8 w-8 border-stone-400 border-2 rounded-full"
            :src="comment.avatar ?? defaultAvatar"
            alt=""
          />
          <div class="flex-1">
            <div class="inline-block rounded-xl bg-slate-100 p-2 text-sm">
              <a class="font-bold" href="#">{{ comment.userName }}</a>
              <div v-html="comment.text"></div>
            </div>
            <div class="flex gap-4 text-xs text-neutral-600">
              <div class="font-bold">Like</div>
              <div @click="comment.isShowedCommentBox = true" class="font-bold">
                Reply
              </div>
            </div>
            <CommentBox
              v-if="comment.isShowedCommentBox"
              @cancel="comment.isShowedCommentBox = false"
              @reply="(el) => reply(el, comment as Comment, comment.otherComments)"
            ></CommentBox>
          </div>
        </div>
        <ul v-if="comment.otherComments.length">
          <li v-for="otherComment in comment.otherComments">
            <div class="flex gap-2 pt-2">
              <img
                class="h-8 w-8 border-stone-400 border-2 rounded-full"
                :src="otherComment.avatar ?? defaultAvatar"
                alt=""
              />
              <div class="flex-1">
                <div class="inline-block rounded-xl bg-slate-100 p-2 text-sm">
                  <a class="font-bold" href="#">{{ otherComment.userName }}</a>
                  <div v-html="otherComment.text"></div>
                </div>
                <div class="flex gap-4 text-xs text-neutral-600">
                  <div class="font-bold">Like</div>
                  <div
                    @click="otherComment.isShowedCommentBox = true"
                    class="font-bold"
                  >
                    Reply
                  </div>
                </div>
                <CommentBox
                  v-if="otherComment.isShowedCommentBox"
                  @cancel="otherComment.isShowedCommentBox = false"
                  @reply="
                    (el) => reply(el, otherComment as Comment, comment.otherComments)
                  "
                ></CommentBox>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<style>
ul li > :not(:first-child) {
  margin-left: 32px;
}
</style>
