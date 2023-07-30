<template>
  <div id="app">

    <TheNavigation :client="client"/>

    <router-view :client="client"></router-view>
  </div>
</template>

<script>

import TheNavigation from './components/TheNavigation.vue';

import io from 'socket.io-client'


export default {
  name: "App",
  components: {
    TheNavigation
  },

  data() {
    return {
      client: {
        username: 'Anonymous156',
        socket: io('http://192.168.1.34:3000', { transports: ['websocket'] }),
        AlbegraicNotationArray: [],
        isPlaying: [false],
        isConnected: false,
        elo: 0,
      }
    }
  },

  mounted() {
    this.$route.socket = this.client.socket;
  },

  beforeUnmount() {
      this.client.socket.disconnect()
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