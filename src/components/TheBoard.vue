<template>

  <div class="container">

    <div class="users-board-container">
      
      <div class="user">
  
        <div class="user-info">
          <img class="user-profile-picture" src="../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_01.png">
          <p class="username"> {{ this.client.uiHandler.username }}</p>
          
        </div>
  
        <div class="timer">
          <p> Timer </p>
        </div>
  
      </div>
      
      <div ref="sketchContainer" class="sketchContainer"></div>

      <div class="user">
        <div class="user-info">
          <img class="user-profile-picture" src="../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_01.png">
          <p class="username"> {{ client.uiHandler.enemyUsername }}</p>
        </div>

        <div class="timer">
          <p> Timer </p>
        </div>

      </div>

      
  
    </div>

    <div class="button-or-Notation">
      <button  v-if="!(client.isPlaying)" class="PlayButton" ref="playButton" @click="this.client.clickPlayButton()">Play</button>
      <ul class="AlgebraicNotationMoves">
        <li v-for="(move, index) in this.getAlgebraic" :key="index" class="move-item" >
          {{ (index + 1) + '. ' + move }}
        </li>
      </ul>
  
    </div>

  </div>

</template>

<style scoped>

.container {
  display: flex;
}

.users-board-container {
  display: flex;
  flex-direction: column;

}

.button-or-Notation {
  margin-top: 100px;
  margin-left: 50px;
}

.user {
  display: flex;
  justify-content: space-between;
  color:antiquewhite;

}

.timer {
  margin-top: 10px;
  margin-right: 10px;
}

.user-info {
  display: flex;
  margin: 10px;
}

.user-profile-picture {
  height: 50px;
}

.username {
  margin-left: 20px;
}

.sketchContainer {
  width: max-content;
  height: max-content;
}
/* PlayButton */
.PlayButton {
  background: #28a745; /* Green color */
  color: #fff;
  border: none;
  padding: 23px 50px;
  font-size: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.PlayButton:hover {
  background: #218838; /* Darker green color on hover */
}

/* Arrange li elements in a 2 by 2 grid layout */
.AlgebraicNotationMoves {
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-gap: 5px; /* Add some spacing between items */
}

.move-item {
box-sizing: border-box;
padding: 5px;
text-align: center;
color:antiquewhite;
}
</style>

  
  <script>
  import p5 from "p5";
  import { MyClient } from "@/scripts/client/client";

  export default {
    
    props: {
      client: {type: MyClient, required: true},
    },
    
    computed: {
      getAlgebraic() {
        return this.client.gameManager.board.AlgebraicNotationArray;
      }

    },

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

          let tmpSize = Math.min(720, sketch.windowHeight, sketch.windowWidth);

          tmpSize = tmpSize - tmpSize%8;

          sketch.tilesize = tmpSize/8;

          sketch.createCanvas(tmpSize, tmpSize);
        };

        sketch.windowResized = () => {

          let tmpSize = Math.min(720, sketch.windowHeight, sketch.windowWidth);

          tmpSize = tmpSize - tmpSize%8;

          sketch.tilesize = tmpSize/8;

          sketch.resizeCanvas(tmpSize, tmpSize);

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