<script setup lang="ts">
import { ref, onMounted } from "vue";
import defaultAvatar from "@/assets/images/default-avatar.png";
import { useUserStore } from "@/stores/user";

const textbox = ref<HTMLDivElement | null>(null);
const UserStore = useUserStore();

interface Props {
  isShowButtons?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isShowButtons: true,
});

// type-based
const emit = defineEmits<{
  (e: "reply", content: HTMLDivElement | null): void;
  (e: "cancel"): void;
}>();

let content = ref(false);
let isShowActionButtons = ref(false);
function onInput(evt: Event) {
  content.value = (evt.target as HTMLElement).innerText.trim().length > 0;
}

function setCaretToEnd(target: HTMLDivElement) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(target);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
  target.focus();
  range.detach(); // optimization

  // set scroll to the end if multiline
  target.scrollTop = target.scrollHeight;
}

const onFocus = () => {
  if (textbox.value) {
    setCaretToEnd(textbox.value);
  }
  isShowActionButtons.value = true;
};
let x = ref(100);
function onReply() {
  emit("reply", textbox.value);
}
function onCancel() {
  if (props.isShowButtons) {
    emit("cancel");
  } else {
    isShowActionButtons.value = false;
  }
}

onMounted(() => {
  if (props.isShowButtons) {
    textbox.value?.focus();
  }
});

defineExpose({
  textbox,
});
</script>

<template>
  <div class="mt-2 flex gap-2">
    <div>
      <img class="h-9 w-9 border-stone-400 border-2 rounded-full object-cover" :src="UserStore.user.avatar ?? defaultAvatar" alt="" />
    </div>
    <div class="flex-1">
      <div
        contenteditable
        @focus="onFocus"
        @input="onInput"
        ref="textbox"
        class="rounded-xl bg-neutral-100 py-2 px-3 focus:outline-none"
        placeholder="Write a public reply..."
      ></div>
      <div
        class="mt-1 flex justify-end gap-4"
        v-if="isShowActionButtons || isShowButtons"
      >
        <div
          @click="onCancel"
          class="btn-grey h-fit rounded-full py-1 px-2 font-semibold"
        >
          Cancel
        </div>
        <button
          :disabled="!content"
          @click="onReply"
          :class="!content && 'btn-disabled opacity-70'"
          class="btn-grey btn-dis h-fit rounded-full py-1 px-2 font-semibold"
        >
          Reply
        </button>
      </div>
    </div>
    <!-- <input type="checkbox" id="my-modal-4" class="modal-toggle" />
    <label for="my-modal-4" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
        <p class="py-4">
          You've been selected for a chance to get one year of subscription to
          use Wikipedia for free!
        </p>
      </label>
    </label> -->
  </div>
</template>
<style>
div[contenteditable]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>
