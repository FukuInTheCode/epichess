<template>
    <nav class="navbar">
        <router-link to="/">
          <!-- <img src="/path/to/your-home-icon.png" alt="Home" class="nav-icon"> -->
          <span class="nav-text">Home</span>
        </router-link>
        <router-link v-if="!client.isConnected" to="/login">
          <!-- <img src="/path/to/your-login-icon.png" alt="Login" class="nav-icon"> -->
          <span class="nav-text">Login</span>
        </router-link>
        <router-link v-if="!client.isConnected" to="/signup">
          <!-- <img src="/path/to/your-signup-icon.png" alt="Sign Up" class="nav-icon"> -->
          <span class="nav-text">Sign Up</span>
        </router-link>
      </nav>
</template>

<script>
export default {
  props: {
    client: { type: Object, required: true, default: ()=> ({}) },
  }
}

</script>

<style>
/* Navigation Column Styles */
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333; /* Dark navigation bar */
  width: 10%; /* Adjust the width of the column */
  position: fixed; /* Fix the column to the left */
  height: 100%; /* Make the column cover the full height of the viewport */
  top: 0; /* Position the column from the top */
  left: 0; /* Position the column from the left */
}

.navbar a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  margin: 10px 0; /* Adjust the margin between navigation items */
}

.nav-icon {
  width: 2em; /* Adjust the size of the icons proportionally */
  height: 2.5em;
  margin-bottom: 5px;
}

.nav-text {
  font-size: 1em; /* Adjust the font size proportionally */
  text-align: center;
  color: #fff; /* White text color */
  transition: color 0.2s; /* Smooth transition on hover */
}

/* Hover Styles */
.navbar a:hover .nav-text {
  color: #2911df; /* Change to the color you want on hover */
}

/* Add some box-shadow and border-radius for a card-like appearance */
.navbar a {
  padding: 0.5em 1em; /* Adjust the padding for proportional spacing */
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(231, 12, 12, 0.1);
}

/* Add a slight opacity to the icons when not hovered */
.navbar a:not(:hover) .nav-icon {
  opacity: 0.8;
}

</style>