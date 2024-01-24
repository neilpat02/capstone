<script>
	import { writable } from 'svelte/store';
	import HomePage from "./HomePage.svelte";
	import SignUp from "./SignUp.svelte";
	import LoginPage from "./LoginPage.svelte";
	import LeaderBoard from "./LeaderBoard.svelte";
	import MazeSim from "./MazeSim.svelte";
	import Contact from "./Contact.svelte";
  
	export let menu = 1;
	const isLoggedIn = writable(false);
  
	function handleLogout() {
	  isLoggedIn.set(false);
	  menu = 1; // Navigate to HomePage
	}
  </script>
  
  <nav id="menu" class="navbar" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
	  <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 1)}>
		<img alt="logo" src="/logo.png" />
	  </a>
	  <button role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
		<span aria-hidden="true"></span>
		<span aria-hidden="true"></span>
		<span aria-hidden="true"></span>
	  </button>
	</div>
	<div id="navbarBasicExample" class="navbar-menu">
	  <div class="navbar-start">
		<a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 1)}>Home</a>
		{#if $isLoggedIn}
		  <a class="navbar-item" href="/" on:click|preventDefault={handleLogout}>Log Out</a>
		{:else}
		  <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 2)}>Sign Up</a>
		  <a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 3)}>Login</a>
		{/if}
		<a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 4)}>Leaderboard</a>
		<a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 5)}>Maze Simulator</a>
		<a class="navbar-item" href="/" on:click|preventDefault={() => (menu = 6)}>Contact</a>
	  </div>
	</div>
  </nav>
  
  {#if menu === 1}
	<HomePage />
  {:else if menu === 2}
	<SignUp />
  {:else if menu === 3}
  	<LoginPage on:login={() => isLoggedIn.set(true)} /> <!-- Updated line -->
  {:else if menu === 4}
	<LeaderBoard />
  {:else if menu === 5}
	<MazeSim />
  {:else if menu === 6}
	<Contact />
  {:else}
	<h1>404 Page Not Found</h1>
  {/if}
  