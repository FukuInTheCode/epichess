<template>
    <div ref="sketchContainer"></div>
  </template>
  
  <script>
  import p5 from "p5";
  import { MyClient } from '../scripts/client/client.js'
  
  export default {
    mounted() {
      this.sketch = new p5(this.createSketch, this.$refs.sketchContainer);
    },
    beforeUnmount() {
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
          sketch.client = new MyClient(sketch.imgs);
        };
  
        sketch.draw = () => {
          sketch.background(144);
          sketch.client.uiHandler.show(sketch);

        };

        sketch.mousePressed = () => {
          sketch.client.gameManager.handleMousePressed(sketch);
        }

        sketch.mouseReleased = () => {
          sketch.client.gameManager.handleMouseReleased(sketch);
        }  

      },
    },
  };
  </script>
  
  <style scoped>
  div {
    width: 100%;
    height: 100%;
  }
  </style>
  