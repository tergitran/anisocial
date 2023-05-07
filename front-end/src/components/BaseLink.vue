<script setup lang="ts">

interface Props {
  path: string;
}

const props = withDefaults(defineProps<Props>(), {
  path: '',
});

</script>

<template>
  <RouterLink :to="path"><slot></slot></RouterLink>
</template>
