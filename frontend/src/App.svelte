<script>
  import { writable } from 'svelte/store';
  import { onDestroy, onMount } from 'svelte';
  import HomePage from "./HomePage.svelte";
  import SignUp from "./SignUp.svelte";
  import LoginPage from "./LoginPage.svelte";
  import LeaderBoard from "./LeaderBoard.svelte";
  import MazeSim from "./MazeSim.svelte";
  import Contact from "./Contact.svelte";
  import { userToken, clearToken } from './userStore.js';

  let showDropdown = false;
  export let menu = 1;
  const isLoggedIn = writable(false);

  // Check if user is already logged in when the app loads
  onMount(() => {
    const token = localStorage.getItem('jwtToken');
    isLoggedIn.set(!!token);
    userToken.set(token);
  });

  function handleLogout() {
    clearToken(); // Clear the token from local storage and the store
    isLoggedIn.set(false);
    menu = 1;
    showDropdown = false;
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown();
    }
  }
</script>

<nav id="menu" class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <!-- Existing brand content -->
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 1)}>Home</a>
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 4)}>Leaderboard</a>
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 5)}>Maze Simulator</a>
      <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 6)}>Contact</a>
    </div>

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

