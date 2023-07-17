<template>
  <div id="app">
    <SketchChessBoard />
  </div>
</template>

<script>
import SketchChessBoard from "./components/SketchChessBoard.vue";

export default {
  name: "App",
  components: {
    SketchChessBoard,
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
