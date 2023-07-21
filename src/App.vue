<template>
  <div id="app">

    <TheNavigation />

    <router-view :client="this.client"></router-view>
  </div>
</template>

<script>

import { MyClient } from './scripts/client/client.js';

import TheNavigation from './components/TheNavigation.vue';


export default {
  name: "App",
  components: {
    TheNavigation
  },

  data() {
    return {
      client: new MyClient()
    }
  }, 
  beforeUnmount() {
      this.client.disconnectSocket()
    },
};


</script>

<style>
  /* Global Styles */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  /* App Container */
  #app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #0f0035; /* Light background color */
  }
</style>