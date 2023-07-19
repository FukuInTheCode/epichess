<template>
  <button class="PlayButton" ref="playButton" @click="this.client.clickPlayButton()">Play</button>
  <p id="PlayerGameStatus">{{ this.client.clientStatus }}</p>
  <div ref="sketchContainer"></div>
</template>
  
  <script>
  import p5 from "p5";
  import { MyClient } from '../scripts/client/client.js';
  
  export default {

    
    data() {
      return {
        clientStatus: "HelloWorld",
        client: new MyClient()
      }
    },

    mounted() {
      this.sketch = new p5(this.createSketch, this.$refs.sketchContainer);
    },

    beforeUnmount() {
      this.client.disconnectSocket()
      this.sketch.remove();
    },

    methods: {

      createSketch(sketch) {

        sketch.preload = () => {
          sketch.imgs = [];

          let i;
          for(i = 1; i<=9;i++) {
            sketch.imgs.push(sketch.loadImage('../../../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_0'+ i +'.png'))
          }
          for(i = 10; i<=12;i++) {
            sketch.imgs.push(sketch.loadImage('../../../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_'+ i +'.png'))
          }
        }


        sketch.setup = () => {
          sketch.createCanvas(800, 800);
          this.client.setup(sketch.imgs);
        };
  
        sketch.draw = () => {
          sketch.background(144);
          this.client.uiHandler.show(this.client, sketch);

        };

        sketch.mousePressed = () => {
          this.client.gameManager.handleMousePressed(this.client, sketch);
        }

        sketch.mouseReleased = () => {
          this.client.gameManager.handleMouseReleased(this.client, sketch);
        }  

      },
    }
  };
  </script>
  
  <style scoped>
  div {
    width: 100%;
    height: 100%;
  }

  .PlayButton {
    background: 255;
  }
  </style>
  