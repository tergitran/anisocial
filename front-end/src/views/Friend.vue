<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
// icons
import friendIcon from "@/assets/images/essentials/friend.svg";
import friendPlusIcon from "@/assets/images/essentials/friend_add.svg";

const menu = ref([
  { label: "All Friends", path: "/friends", icon: friendIcon },
  { label: "All requests", path: "/friends/request", icon: friendPlusIcon },
  { label: "All sents", path: "/friends/sent", icon: friendPlusIcon },
  {
    label: "All suggestion",
    path: "/friends/suggestion",
    icon: friendPlusIcon,
  },
]);
</script>

<template>
  <div class="flex">
    <div
      class="group sticky top-14 h-[calc(100vh-3.5rem)] bg-white p-2 shadow-md"
    >
      <h1 class="px-2 text-2xl font-bold">Friends</h1>
      <div class="menu mt-2 flex h-full w-80 flex-col overflow-y-auto">
        <RouterLink
          v-for="item in menu"
          :to="item.path"
          class="overflow-hidden rounded-md"
        >
          <button
            class="btn-white h-fit w-full rounded-none p-3 text-left text-base font-bold"
          >
            <img :src="item.icon" alt="" />{{ item.label }}
          </button>
        </RouterLink>
      </div>
    </div>
    <div class="about mx-6 mt-6 flex-1">
      <RouterView />
    </div>
  </div>
</template>
<style>
.menu .router-link-exact-active button {
  @apply bg-teal-400;
}
</style>
