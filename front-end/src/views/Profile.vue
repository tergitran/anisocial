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
function onInputDescription(event: Event) {
  const context = (event.target as HTMLElement).innerHTML;
  if (userInfo.value) {
    userInfo.value.description = context;
  }
}
function handleUpdatePost(id: string, content: string) {
  console.log(id, content);
  const item = postList.value.find((item) => item.id === id);
  if (item) {
    item.content = content;
  }
}
function handleDeletePost(id: string) {
  const itemIndex = postList.value.findIndex((item) => item.id === id);
  console.log("itemIndex", itemIndex);
  if (itemIndex != -1) {
    postList.value.splice(itemIndex, 1);
    console.log("delete");
  }
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
    .catch((err) => {})
    .finally(() => {
      if (postWriter.value) {
        postWriter.value.innerHTML = "";
      }
    });
}

// onMounted(() => {
//   const elementHeight = sidebar.value?.clientHeight;
//   if (elementHeight && elementHeight > window.innerHeight) {
//     positionTop.value = elementHeight - window.innerHeight;
//   } else {
//     positionTop.value = -64;
//   }
// });

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
      <div
        class="cover-photo m-auto h-72 max-w-7xl rounded-b-2xl rounded-bl-2xl bg-gradient-to-r from-cyan-500 to-teal-500"
      ></div>
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
              class="group-hover: absolute bottom-0 z-10 hidden h-full w-full cursor-pointer items-center justify-center bg-teal-100/70 group-hover:flex"
            >
              <img
                class="h-10 w-10"
                src="@/assets/images/avatar-edit.png"
                alt=""
              />
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
            <div class="font-mono font-semibold">
              {{ `${userInfo?.no_friends} friends` }}
            </div>
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
        class="sticky max-h-[calc(100vh-72px)] min-h-[50vh] min-w-[260px] max-w-xs overflow-y-auto rounded-lg bg-yellow-100 p-4 shadow-md focus:outline-none"
        ref="sidebar"
        :style="{ top: 64 + 'px' }"
        contenteditable
        @input="onInputDescription"
      >
        <!-- Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem velit nostrum dicta, sit atque deleniti inventore iure exercitationem a dolores unde, itaque maiores suscipit repellat blanditiis ad alias architecto voluptatum ratione, optio fugiat perspiciatis sunt aut ipsum. Dolore obcaecati ipsum velit vero? Impedit magni, ad vel velit nobis unde provident soluta excepturi. Fugiat voluptate voluptatibus temporibus odio veritatis magnam fugit ducimus repellendus, impedit provident cum minima quo veniam ipsam explicabo rem est placeat eligendi quam qui optio sapiente beatae voluptates. Neque nemo ex quibusdam natus nam quis dicta, illum rem voluptates hic. Maxime aspernatur similique consequatur fugiat excepturi quia quod, ratione illum odio voluptas iure magni dignissimos nobis sed? Vel, laborum. Quasi, quas dolor praesentium ipsa iste eaque error porro earum fugit quaerat, ex ab voluptatem odit voluptas quisquam! Excepturi, voluptatum vero. Inventore nobis minus ab exercitationem, provident a doloremque commodi necessitatibus, dolorum quibusdam officiis. Ducimus suscipit sunt nam architecto quod doloremque quibusdam alias eaque dolore accusantium ratione rem itaque necessitatibus quam eos vel possimus assumenda laboriosam minus eum, laborum non. Illo aliquam, odit magnam itaque nemo harum, quae ipsa quos praesentium, provident assumenda velit fuga tempora architecto recusandae similique illum sint dolorum ratione culpa id nihil perferendis! Exercitationem suscipit sequi saepe dolorem asperiores quod! Voluptas ipsum in totam eos beatae, suscipit, quasi ut maxime provident accusantium ipsa ab rem eius necessitatibus fugiat repudiandae cupiditate! Totam vel rem excepturi atque possimus neque fugiat ea, minus quo rerum voluptatem, libero cupiditate sunt eum voluptate eveniet molestiae nulla placeat a? Ipsa, numquam facilis aliquam optio esse corrupti ipsam veritatis accusamus ut voluptate, dolore ea nam, iste sed. Hic ad ab labore dolorem debitis animi beatae voluptate! Delectus autem repellat dolores dignissimos aperiam eligendi cum veritatis animi nulla, consequuntur sapiente possimus adipisci praesentium iste sequi tenetur atque corrupti? Iure dolorem voluptatem ab, officiis molestias facilis, adipisci in ipsam natus atque quisquam expedita ipsum cupiditate itaque architecto consequatur aspernatur. Quasi, consequuntur delectus? Aut qui laboriosam doloremque corporis praesentium, dicta consequatur veniam animi nesciunt maiores libero vel obcaecati, eius dolore tempore iusto cumque odio amet fugiat delectus possimus eum eligendi accusantium recusandae. Esse, quidem corporis magnam harum eum, cum mollitia minima aliquam aperiam, natus consectetur ducimus. Quod, odit. Neque in placeat quis dolore asperiores voluptatem nihil consequuntur iure ducimus earum blanditiis, officia aspernatur vero soluta necessitatibus qui fugit et quidem, deserunt, distinctio ipsam laboriosam nostrum cum culpa. Molestiae aliquam accusamus deleniti debitis ipsa assumenda veniam nam quas laboriosam voluptatibus maxime quam fuga excepturi similique necessitatibus beatae, autem eveniet. Debitis et excepturi iste ea illo, aperiam cum architecto magni error! Blanditiis a, dolore ipsam aspernatur tempora perspiciatis sint tenetur amet accusantium debitis cum voluptate, ut, id ipsa? Quas laborum dolor excepturi autem rerum similique consectetur voluptatum voluptates voluptatibus, in nihil neque eligendi odit ipsum odio ea a atque aspernatur magni, culpa officiis vel fuga? Repellendus facere vel excepturi modi doloribus porro voluptatibus, atque quae rem neque corrupti sit dicta sint quis eaque minima minus veritatis non illum fugit dignissimos ut cupiditate? Veritatis minima alias nesciunt ratione. -->
        {{ userInfo?.description }}
        <!-- <div >
        </div> -->
      </div>
      <div class="flex max-w-2xl flex-1 flex-col gap-5 px-4">
        <div
          v-if="isAccessRight"
          class="flex gap-2 rounded-lg bg-white p-4 shadow-sm"
        >
          <div class="h-11 w-11 rounded-full border-4 border-teal-200">
            <img
              class="h-full w-full rounded-full object-cover"
              :src="UserStore.user.avatar ?? defaultAvatar"
              alt=""
            />
          </div>
          <div
            @click="modalStatus = !modalStatus"
            class="flex-1 cursor-pointer rounded-full bg-neutral-100 py-2 px-4"
          >
            What's on your mind?
          </div>
        </div>
        <!-- <Post v-for="i in 2"></Post> -->
        <TransitionGroup name="fade">
          <Post
            :post="postItem"
            @update="handleUpdatePost"
            @delete="handleDeletePost"
            :key="postItem.id"
            v-for="postItem in postList"
          ></Post>
        </TransitionGroup>
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
          @click="addNewPost"
          class="btn-blue mt-4 w-full font-bold text-white"
        >
          Post
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
div[contenteditable]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>
