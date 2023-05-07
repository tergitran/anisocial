<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Tool from "@/components/icons/IconTooling.vue";
import defaultAvatar from "@/assets/images/default-avatar.png";

import { ref } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import AuthStorage from "@/storage";

const AuthStore = useAuthStore();
const UserStore = useUserStore();

const isMainMenu = ref(true);

function closeDropdown(params: any) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

UserStore.getUserInfo();

let id = AuthStorage.data.id;
</script>

<template>
  <header class="sticky top-0 z-50">
    <div
      class="z-10 flex h-[56px] w-full items-center justify-between bg-white/95 px-8 shadow-md"
    >
      <div class="flex items-center gap-2">
        <img class="h-8 w-8" src="@/assets/images/app-logo/logo.png" alt="" />
        <div class="flex items-center rounded-full bg-slate-100 px-3">
          <div class="left-1 text-slate-500">
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="h-6 w-6"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            class="bg-transparent px-3 py-2 focus:outline-none"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
      <nav class="flex gap-2 text-base">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/friends">Friends</RouterLink>
      </nav>
      <div class="flex gap-3">
        <div class="dropdown-end dropdown">
          <label
            tabindex="0"
            class="inline-block h-10 w-10 cursor-pointer rounded-full bg-slate-200"
          >
            <div
              class="flex h-full w-full items-center justify-center text-slate-600"
            >
              <Tool></Tool>
            </div>
          </label>
          <div
            tabindex="0"
            class="dropdown-content mt-2 w-fit min-w-[120px] rounded-lg bg-base-100 p-2 shadow-xl"
          >
            <Transition :name="isMainMenu ? 'left' : 'right'">
              <ul v-if="isMainMenu" class="menu w-56 bg-base-100">
                <RouterLink :to="`/profile/${id}`">
                  <div
                    class="mx-1 my-2 cursor-pointer p-1 shadow-md hover:bg-slate-200"
                    @click="closeDropdown"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="h-11 w-11 border-4"
                      >
                        <img
                          class="h-full w-full object-cover"
                          :src="UserStore.user.avatar ?? defaultAvatar"
                          alt=""
                        />
                      </div>
                      <div class="text-base font-bold">
                        {{ UserStore.user.username }}
                      </div>
                    </div>
                  </div>
                </RouterLink>
                <li>
                  <div class="active:bg-teal-300">Menu-1</div>
                </li>
                <li>
                  <div
                    class="flex justify-between active:bg-teal-300"
                    @click="isMainMenu = false"
                  >
                    <div>Settings</div>
                    <img
                      class="w-4"
                      src="@/assets/images/essentials/arrow_forward.svg"
                      alt=""
                    />
                  </div>
                </li>
                <li>
                  <button @click="AuthStore.logout">Log Out</button>
                </li>
              </ul>
              <ul v-else class="menu w-56 bg-base-100">
                <div class="m-3 flex gap-2 text-lg">
                  <img
                    @click="isMainMenu = true"
                    class="w-4 cursor-pointer"
                    src="@/assets/images/essentials/arrow_back.svg"
                    alt=""
                  />
                  <h1>Detail Menu</h1>
                </div>
                <li>
                  <div class="active:bg-teal-300">Menu-detail-1</div>
                </li>
                <li>
                  <div class="active:bg-teal-300">Menu-detail-2</div>
                </li>
              </ul>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </header>
  <slot></slot>
</template>

<style scoped>
nav a {
  @apply px-4 py-2 hover:rounded hover:bg-slate-200;
}

nav a.router-link-active {
  @apply border-b-4 border-teal-500 text-teal-500;
}

.right-enter-active,
.left-enter-active {
  transition: all 0.6s ease;
}
.right-leave-active,
.left-leave-active {
  transition: all 0s;
}

.left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
