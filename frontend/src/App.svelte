<script>
	import { writable } from 'svelte/store'; // necessary import statements for the application
	import HomePage from "./HomePage.svelte";
	import SignUp from "./SignUp.svelte";
	import LoginPage from "./LoginPage.svelte";
	import LeaderBoard from "./LeaderBoard.svelte";
	import MazeSim from "./MazeSim.svelte";
	import Contact from "./Contact.svelte";


  let showDropdown = false; //show the dropdown menu for all of the webpages
  export let menu = 1;
  const isLoggedIn = writable(false); //track the state of the user's login / sign out

    function handleLogout() {  //function to handle when the user presses "sign out"
        isLoggedIn.set(false); 
        menu = 1; // Navigate to HomePage
        showDropdown = false; // Close dropdown on logout
    }

    function toggleDropdown() { //function to toggle dropdown
        showDropdown = !showDropdown;
    }

    function handleKeyDown(event) {
        // Toggle dropdown on Enter or Space key press
        if (event.key === 'Enter' || event.key === ' ') {
            toggleDropdown();
        }
    }
</script>

<nav id="menu" class="navbar" role="navigation" aria-label="main navigation">
  <!-- Navbar Brand -->
  <div class="navbar-brand">
    <!-- Existing brand content -->
  </div>

  <!-- Navbar Menu -->
  <div id="navbarBasicExample" class="navbar-menu">
    <!-- Left-aligned items -->
    <div class="navbar-start">
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 1)}>Home</a>
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 4)}>Leaderboard</a>
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 5)}>Maze Simulator</a>
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 6)}>Contact</a>
    </div>

    <!-- Right-aligned items -->
    <div class="navbar-end">
      {#if $isLoggedIn}
        <a class="navbar-item" href="/" on:click|preventDefault={handleLogout}>Sign Out</a>
      {:else}
        <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 2)}>Sign Up</a>
        <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 3)}>Login</a>
      {/if}
    </div>
  </div>
</nav>

<!-- Content based on menu selection -->
{#if menu === 1}
  <HomePage />
{:else if menu === 2}
  <SignUp on:login={() => isLoggedIn.set(true)} />
{:else if menu === 3}
  <LoginPage on:login={() => isLoggedIn.set(true)} />
{:else if menu === 4}
  <LeaderBoard />
{:else if menu === 5}
  <MazeSim />
{:else if menu === 6}
  <Contact />
{:else}
  <h1>404 Page Not Found</h1>
{/if}
  


  <style>
    
   
    
</style>