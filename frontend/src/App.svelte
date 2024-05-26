<script>
  /**
   * This code imports various Svelte components and a utility function from a userStore module.
   * The imported components include the HomePage, SignUp, LoginPage, LeaderBoard, MazeSim, and Contact components.
   * The userToken and clearToken functions are imported from the userStore module.
   * These imports are likely used throughout the application to provide functionality and navigation.
   */
  import { writable } from "svelte/store";
  import { onDestroy, onMount } from "svelte";
  import HomePage from "./HomePage.svelte";
  import SignUp from "./SignUp.svelte";
  import LoginPage from "./LoginPage.svelte";
  import LeaderBoard from "./LeaderBoard.svelte";
  import MazeSim from "./MazeSim.svelte";
  import Contact from "./Contact.svelte";
  import { userToken, clearToken } from "./userStore.js";

  let showDropdown = false;
  export let menu = 1;
  const isLoggedIn = writable(false);

  /**
   * Initializes the user's login state and token when the component mounts.
   * This function retrieves the JWT token from the browser's local storage,
   * sets the `isLoggedIn` store to `true` if a token is present, and sets
   * the `userToken` store to the retrieved token value.
   */
  onMount(() => {
    const token = localStorage.getItem("jwtToken");
    isLoggedIn.set(!!token);
    userToken.set(token);
  });

  /**
   * Handles the logout process by clearing the authentication token, setting the logged-in state to false, and resetting the menu and dropdown state.
   */
  function handleLogout() {
    clearToken(); // Clear the token from local storage and the store
    isLoggedIn.set(false);
    menu = 1;
    showDropdown = false;
  }

  /**
   * Toggles the visibility of a dropdown menu.
   */
  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  /**
   * Handles the key down event on the dropdown trigger.
   * If the user presses Enter or Space, toggles the dropdown.
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDropdown();
    }
  }
</script>

<!-- 
* @description This code snippet is responsible for rendering different components based on the value of the `menu` variable.
 * @param {number} menu - A number representing the currently selected menu item.
 * @returns {JSX.Element} The rendered component based on the value of `menu`.
 *
 * The purpose of this code is to display different sections or pages of the application based on the user's selection or navigation.
 *
 * The code uses a series of conditional statements (`if`/`else if`/`else`) to check the value of the `menu` variable.
 * Each condition corresponds to a specific value of `menu`, and if the condition is true, the associated component is rendered.
 *
 * Here's a breakdown of the logic flow:
 *
 * 1. If `menu` is 1, the `HomePage` component is rendered.
 * 2. If `menu` is 2, the `SignUp` component is rendered.
 * 3. If `menu` is 3, the `LoginPage` component is rendered.
 * 4. If `menu` is 4, the `LeaderBoard` component is rendered.
 * 5. If `menu` is 5, the `MazeSim` component is rendered.
 * 6. If `menu` is 6, the `Contact` component is rendered.
 * 7. If `menu` doesn't match any of the above values, a default message "404 Page Not Found" is displayed.
 *

 -->
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

