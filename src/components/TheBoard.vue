<template>

  <div class="container">

    <div class="users-board-container">
      
      <div class="user">
  
        <div class="user-info">
          <img class="user-profile-picture" src="../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_07.png">
          <p class="username"> {{ enemyUsername }}</p>
          <p class="user-elo"> ({{ enemyElo }})</p>
        </div>
  
        <div class="timer">
          <p> Timer </p>
        </div>
  
      </div>
      
      <div ref="sketchContainer" class="sketchContainer" oncontextmenu="return false"></div>

      <div class="user">
        <div class="user-info">
          <img class="user-profile-picture" src="../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_01.png">
          <p class="username"> {{ this.client.username }}</p>
          <p class="user-elo"> ({{ this.client.elo }})</p>
        </div>

        <div class="timer">
          <p> Timer </p>
        </div>

      </div>
  
    </div>

    <div class="button-or-Notation">
      <button  v-if="!(client.isPlaying[0])" class="PlayButton" ref="playButton" @click="clickPlayButton()">Play</button>
      <ul class="AlgebraicNotationMoves">
        <li v-for="(move, index) in client.AlgebraicNotationArray" :key="index" class="move-item">
          {{ (index + 1) + '. ' + move }}
        </li>
      </ul>
  
    </div>

  </div>

</template>

  
  <script>
  import { GameManager } from "@/scripts/client/game-manager";

  import { UIHandler } from "@/scripts/client/UIHandler";

  import p5 from "p5";

  const uiHandler = new UIHandler();

  const gameManager = new GameManager(uiHandler);



  export default {

    data() {
      return {
        enemyUsername: 'Black',
        enemyElo: 0,
      }
    },
    
    props: {
      client: { type: Object, required: true, default: () => ({})},
      // socket, username
    },

    mounted() {
      gameManager.initSocket(this.client.socket, this.client.isPlaying);

      this.client.socket.on('enemyHasPlayed', (listedBoard, AlgebraicNotation) => {
            // eslint-disable-next-line
            this.client.AlgebraicNotationArray.push(AlgebraicNotation);
            gameManager.updateBoard(listedBoard, AlgebraicNotation, this.client.socket, this.client.isPlaying);
            return;
        });

      this.sketch = new p5(this.createSketch, this.$refs.sketchContainer);
    },

    beforeUnmount() {
      this.sketch.remove();
    },

    methods: {

      clickPlayButton() {
        // eslint-disable-next-line
        this.client.AlgebraicNotationArray = [];
        gameManager.clickPlayButton(this.client.socket);
      },

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
          uiHandler.show(gameManager, sketch);
        };

        sketch.mousePressed = () => {
          gameManager.handleMousePressed(sketch);
        }

        sketch.mouseReleased = () => {
          gameManager.handleMouseReleased(sketch, this.client.socket, this.client.AlgebraicNotationArray);
        }  

      },
    }
  };
  </script>




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

.user-elo {
  margin-left: 10px;
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
list-style-type : none;

}
</style>
