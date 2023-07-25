<template>
    <div class="container">
        <div class="user-info">
            <img class="user-profile-picture" src="../assets/chess-pieces-sprites/2000px-Chess_Pieces_Sprite_02.png">
            <p class="username"> {{ username }}</p>
        </div>
        <div class="user-stats">
            <p class="user-elo"> {{ elo }}</p>
        </div>
        <div class="user-games-record">
            <ul>
                <li v-for="(game, index) in games" :key="index">
                    {{ game }}
                </li>
            </ul>

        </div>
    </div>

</template>

<script>

export default {
    data() {
        return {
            games: [],
            username: this.$route.params.username,
            elo: 0,
        }
    },

    props: {
        client: { type: Object, required:true, default: ()=> ({})}
    },

    beforeRouteEnter(to, from, next) {
        from.socket.once('ResponceToUserExists', (Exists)=>{
            if(!Exists) next('/');
            else next();
        });
        from.socket.emit('userExists', to.params.username);
    },  

    mounted() {

        this.client.socket.once('userGames', (games)=>{
            this.games = games;
        })

        this.client.socket.emit('getGames', this.username);

        this.client.socket.once('userElo', (elo)=>{
            this.elo = elo;
        })

        this.client.socket.emit('getElo', this.username);
    }
}
</script>

<style scoped>

.container {
    background: rgb(27, 26, 38);
    box-shadow: 0 4px 80px rgba(10, 1, 52, 0.2);
    padding: 10px;

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
    color:aliceblue;
}

.user-stats {
    color:aliceblue;
    height: 500px;
}

.user-games-record {
    width: 750px;
}

</style>