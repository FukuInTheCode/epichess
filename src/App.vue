<template>
  <div id="app">
    <CursorCircle />
  </div>
</template>

<script>
import CursorCircle from "./components/CursorCircle.vue";

export default {
  name: "App",
  components: {
    CursorCircle,
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
