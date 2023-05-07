<script setup lang="ts">
import { ref } from "vue";
import defaultAvatar from '@/assets/images/default-avatar.png'

interface People {
  id: string;
  avatar?: string;
  username: string;
}

interface Props {
  // type text or password
  user: People
}

const props = defineProps<Props>();
</script>

<template>
  <div class="card rounded-lg bg-white shadow max-w-[280px]">
    <figure class="aspect-square bg-neutral-200">
      <router-link :to="`/profile/${user.id}`">
        <img
          :src="user.avatar ? user.avatar : defaultAvatar"
          alt=""
        />
      </router-link>
    </figure>
    <div class="card-body p-3">
      <router-link class="card-title text-lg" :to="`/profile/${user.id}`">
        {{ user.username }}
      </router-link>
      <div class="card-actions flex-col items-stretch">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
