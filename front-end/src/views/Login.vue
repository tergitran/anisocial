<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { auth } from "@/services";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";


const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

enum STEP {
  SIGN_UP,
  LOGIN,
  FORGOTTEN_PW,
  SIGN_UP_SUCCESSFUL
}

let step = ref<number>(STEP.LOGIN);

const username = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const loading = ref<boolean>(false);
let errorMessage = ref<string>('');

watch(step, (newOld, oldVal)=>{
   errorMessage.value = '';
   username.value = '';
   password.value = '';
   confirmPassword.value = '';
});

function login() {
  errorMessage.value = '';
  if (username.value == '') {
    errorMessage.value = 'User name must be not empty';
    return;
  }
  if (password.value == '') {
    errorMessage.value = 'Password must be not empty';
    return;
  }
  loading.value = true;
  authStore.login(username.value, password.value).then(res => {
    router.push('/')
  }).catch(err => {
    console.log('323', err);
    
    errorMessage.value = err.data?.message;
  }).finally(()=>{
    loading.value = false;
  })
}

function signUp() {
  errorMessage.value = '';
  if (username.value == '') {
    errorMessage.value = 'User name must be not empty';
    return;
  }
  if (password.value == '') {
    errorMessage.value = 'Password must be not empty';
    return;
  }
  console.log(password.value, confirmPassword.value);
  
  if (password.value !== confirmPassword.value) {
    console.log(1);
    
    errorMessage.value = 'Confirm password is different password';
    return;
  }
  console.log(2);
  
  loading.value = true;
  auth.signUp(username.value, password.value).then(res => {
    step.value = STEP.SIGN_UP_SUCCESSFUL;
  }).catch(err => {
    errorMessage.value = err.response?.data?.message;
  }).finally(() => {
    loading.value = false;
  })
}

</script>

<template>
  <div v-if="step == STEP.LOGIN" class="h-screen flex">
    <div class="w-fit m-auto h-[50vh]">
      <div class="max-w-sm w-[480px] bg-white rounded-lg shadow-md flex flex-col gap-2 px-4 py-6">
        <h1 class="font-semibold text-xl mb-4 text-center">Login to AniSocial</h1>
        <div class="font-semibold mb-2 text-center text-red-600 text-sm">{{ errorMessage }}</div>
        <input v-model="username" type="text" placeholder="User Name" class="input input-bordered input-accent w-full" />
        <input v-model="password" type="password" placeholder="Password" class="input input-bordered input-accent w-full" />
        <button @click="login" :class="loading && 'btn loading'" class="btn-blue no-animation h-10 font-semibold">LOGIN</button>
        <div class="text-center cursor-pointer hover:text-teal-700">Forgotten password?</div>
        <hr>
        <button @click="step=STEP.SIGN_UP" class="btn-grey h-10 font-semibold">Create new account</button>
      </div>
    </div>
  </div>
  <div v-else-if="step == STEP.SIGN_UP" class="h-screen flex">
    <div class="w-fit m-auto h-[50vh]">
      <div class="max-w-sm w-[480px] bg-white rounded-lg shadow-md flex flex-col gap-2 px-4 py-6">
        <h1 class="font-semibold text-xl mb-4 text-center">Sign up to AniSocial</h1>
        <div class="font-semibold mb-2 text-center text-red-600 text-sm">{{ errorMessage }}</div>
        <input v-model="username" type="text" placeholder="User Name" class="input input-bordered input-accent w-full" />
        <input v-model="password" type="password" placeholder="Password" class="input input-bordered input-accent w-full" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="input input-bordered input-accent w-full" />
        <button @click="signUp" :class="loading && 'btn loading'" class="btn-blue no-animation h-10 font-semibold">SIGN UP</button>
      </div>
    </div>
  </div>
  <div v-else-if="step == STEP.SIGN_UP_SUCCESSFUL" class="h-screen flex">
    <div class="w-fit m-auto h-[50vh]">
      <div class="max-w-sm w-[480px] bg-white rounded-lg shadow-md flex flex-col gap-2 px-4 py-6">
        <h1 class="font-semibold text-xl mb-4 text-center">Congratulate! You have create successful account</h1>
        <button @click="step=STEP.LOGIN" class="btn-blue h-10 font-semibold">Back to login</button>
      </div>
    </div>
  </div>
</template>

<style></style>
