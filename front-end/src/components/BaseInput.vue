<script setup lang="ts">
import { ref } from "vue";

interface Props {
  // type text or password
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'password',
});

const emit = defineEmits<{
  (e: "update:open", status: boolean): void;
}>();

const updateStatus = (event: Event) => {
  emit("update:open", (event.target as HTMLInputElement).checked);
};
</script>

<template>
  <input type="text">
</template>
