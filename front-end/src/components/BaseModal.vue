<script setup lang="ts">
import { ref } from "vue";

interface Props {
  id: string;
  hideHeader?: boolean;
  hideHeaderClose?: boolean;
  noCloseOnBackdrop?: boolean;
  headerTitle?: string;
  open?: boolean;
  modalBoxClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hideHeader: false,
  hideHeaderClose: false,
  noCloseOnBackdrop: false,
  open: false,
});

const emit = defineEmits<{
  (e: "update:open", status: boolean): void;
}>();

const updateStatus = (event: Event) => {
  emit("update:open", (event.target as HTMLInputElement).checked);
};
</script>

<template>
  <div class="">
    <input
      type="checkbox"
      @input="updateStatus"
      :id="id"
      :checked="open"
      class="modal-toggle"
    />
    <component
      :is="!noCloseOnBackdrop ? 'label' : 'div'"
      :for="id"
      class="modal"
      :class="!noCloseOnBackdrop && 'cursor-pointer'"
    >
      <component
        :is="!noCloseOnBackdrop ? 'label' : 'div'"
        class="modal-box relative flex flex-col rounded-xl"
        :class="[headerTitle ? 'p-0' : 'p-3', modalBoxClass]"
        for=""
      >
        <div v-if="headerTitle" class="relative">
          <h1
            class="border-b-[1px] border-gray-200 p-4 text-center text-xl font-bold"
          >
            {{ headerTitle }}
          </h1>
          <label :for="id" class="btn-sm btn-circle btn absolute right-3 top-3"
            >✕</label
          >
        </div>

        <div class="flex flex-1 flex-col overflow-hidden p-4">
          <div class="flex-1 overflow-y-auto"><slot></slot></div>
          <slot name="modal-footer"></slot>
        </div>
      </component>
    </component>
  </div>
</template>
