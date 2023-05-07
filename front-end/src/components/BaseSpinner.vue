<script setup lang="ts">
// interface Props {
//   isLoading: boolean;
// }

// const props = defineProps<Props>();
</script>

<template>
  <div class="load-icon center">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
  /* Load Icon */
.load-icon {
	width: 30px;
	height: 6px;
}
.load-icon span {
	position: absolute;
	display: inline-block;
	background: #222;
	width: 20%;
	height: 100%;
	border-radius: 100px;
}
.load-icon span:nth-of-type(1) {
	left: 0;
}
.load-icon span:nth-of-type(2) {
	left: 40%;
}
.load-icon span:nth-of-type(3) {
	right: 0;
}

/* Animation */
.load-icon span {
	animation-name: loading;
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
	animation-fill-mode: both;
}
.load-icon span:nth-of-type(2) {
	animation-delay: .2s;
}
.load-icon span:nth-of-type(3) {
	animation-delay: .4s;
}

/* Keyframes */
@keyframes loading {
	0% { opacity: 1; }
	50% { opacity: 0; }
	100% { opacity: 1; }
}

/* This isn't needed, just styling pen. */
body {
  font-family: sans-serif;
  background: #ddd;
}
.center {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
