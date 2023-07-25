<template>
    <div id="login">
        <form >
            <h1>Login</h1>
            <p v-if="isError"> {{ errorStr }} </p>
            <input type="text" name="username" v-model="input.username" placeholder="Username" autocomplete="username"/>
            <input type="password" name="password" v-model="input.password" placeholder="Password" autocomplete="current-password" />
            <button type="button" v-on:click="login(input)">Login</button>

        </form>

    </div>
</template>


<script>
    export default {
        name: 'LoginForm',
        data() {
            return {
                isError: false,

                errorStr: '',

                input: {
                    username: "",
                    password: ""
                }
            }
        },

        props: {
          client: { type: Object, required: true, default: () => ({}) }
        },
        
        methods: {
          login(input){

            this.client.socket.once('loginFeedback', (err) => {
              if(err) {
                this.errorStr = err;
                this.isError = true;
                return;
              }
              // eslint-disable-next-line
              this.client.username = input.username;
              // eslint-disable-next-line
              this.client.isConnected = true;

              this.client.socket.once('userElo', (elo) => {
                // eslint-disable-next-line
                this.client.elo = elo;
              })

              this.client.socket.emit('getElo', this.client.username);

              this.$router.push('/');
            })

            this.client.socket.emit('userLogin', input.username, input.password);
          } 
        }
    }
</script>


<style scoped>
  /* LoginForm and SignupForm */
  #login, #signup {
    width: 400px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: auto;
    margin-top: 100px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  #login h1, #signup h1 {
    margin: 0 0 20px;
    font-size: 24px;
  }

  #login input[type="text"], #login input[type="password"],
  #signup input[type="text"], #signup input[type="password"] {
    width: 95%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  #login button, #signup button {
    width: 100%;
    padding: 10px;
    background-color: #007bff; /* Primary button color */
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  #login button:hover, #signup button:hover {
    background-color: #0056b3; /* Darker color on hover */
  }
</style>