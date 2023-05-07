<script setup lang="ts">
import { ref } from "vue";
import userService from "@/services/user";
import BaseUserCard from "@/components/BaseUserCard.vue";
import BaseSpinner from "@/components/BaseSpinner.vue";

interface People {
  id: string;
  avatar?: string;
  username: string;
  isLoading?: boolean
}
let users = ref<People[]>([]);
let isLoading = ref(true);

function cancelRequest(user: People, index: number) {
  user.isLoading = true;
  userService.cancelFriendRequest(user.id).then(()=> {
    users.value.splice(index, 1);
  }).catch(err=>{}).finally(()=> {
    user.isLoading = false;
  })
}

userService
  .getFriendList({ status: 3 })
  .then((res) => {
    console.log(res);
    users.value = res.data.map((item: People) => ({...item, isLoading: false}));
  })
  .catch((err) => {}).finally(()=> {
    isLoading.value = false;
  });
</script>

<template>
  <div class="grid grid-cols-user-card gap-3">
    <BaseSpinner v-if="isLoading" />
    <BaseUserCard v-else :user="user" v-for="(user, index) in users">
      <button @click="() => cancelRequest(user, index)" class="btn-grey" :class="user.isLoading && 'btn loading'">Cancel</button>
    </BaseUserCard>
  </div>
</template>

<style></style>
