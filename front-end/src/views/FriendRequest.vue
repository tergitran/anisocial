<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import userService from "@/services/user";
import BaseUserCard from "@/components/BaseUserCard.vue";
import BaseSpinner from "@/components/BaseSpinner.vue";

interface People {
  id: string;
  avatar?: string;
  username: string;
  isLoadingDecline?: boolean,
  isLoadingAccept?: boolean
}
let users = ref<People[]>([]);
let isLoading = ref(true);

function acceptFriend(user: People, index: number) {
  user.isLoadingAccept = true;
  userService.acceptFriendRequest(user.id).then(()=> {
    users.value.splice(index, 1);
  }).catch(err=>{}).finally(()=> {
    user.isLoadingAccept = false;
  })
}

function declineFriend(user: People, index: number) {
  user.isLoadingDecline = true;
  userService.declineFriendRequest(user.id).then(()=> {
    users.value.splice(index, 1);
  }).catch(err=>{}).finally(()=> {
    user.isLoadingDecline = false;
  })
}

userService
  .getFriendList({ status: 2 })
  .then((res) => {
    console.log(res);
    users.value = res.data.map((item: People) => ({...item, isLoadingAccept: false, isLoadingDecline: false}));
  })
  .catch((err) => {}).finally(()=> {
    isLoading.value = false;
  });
</script>

<template>
  <div class="grid grid-cols-user-card gap-3">
    <BaseSpinner v-if="isLoading" />
    <BaseUserCard v-else :user="user" v-for="(user, index) in users">
      <button @click="() => acceptFriend(user, index)" class="btn-blue" :class="user.isLoadingAccept && 'btn loading'">Accept</button>
      <button @click="() => declineFriend(user, index)" class="btn-grey" :class="user.isLoadingDecline && 'btn loading'">Decline</button>
    </BaseUserCard>
  </div>
</template>

<style></style>
