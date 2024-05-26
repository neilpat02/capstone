<script>
	import Footer from "./widget/Footer.svelte";
	import Navi from "./widget/Navi.svelte";
    import { createEventDispatcher } from 'svelte';
    import { userEmail, userToken, setToken } from './userStore.js'; // Include setToken and userToken
  /**
   * Declares variables for team name, email, and password, and creates an event dispatcher.
   */
  let teamName = "";
  let email = "";
  let password = "";
  const dispatch = createEventDispatcher();
    
  /**
   * Handles the submission of the sign-up form.
   *
   * This function sends a POST request to the server's sign-up API endpoint with the user's team name, email, and password. If the sign-up is successful, it stores the token received from the server, updates the user email in the store, displays a success message, and dispatches a 'login' event. If there is an error, it displays an error message.
   */
  async function handleSubmit() {
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamName, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token); // Store the token from the server
        userEmail.set(email); // Update the user email in the store
        alert("Sign Up Successful!");
        dispatch("login"); // Dispatch login event
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert(`Error Occurred: ${error.message}`);
    }
  }
</script>

<section class="hero is-small has-text-centered">
    <div class="hero-body">
        <p class="title" style="color: white">
            UGA Maze Competition
        </p>
        <p class="subtitle">
            <img src="/HeRoLab.png" alt="HeRo Lab logo"/>
        </p>
    </div>
</section>
<div class="signup-container">
    <h2 style="color: gray">Create your account</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value={teamName} class="form-control" placeholder="Team Name" required>
        <input type="email" bind:value={email} class="form-control" placeholder="Email" required>
        <input type="password" bind:value={password} class="form-control" placeholder="Password" required>
        <button type="submit" class="signup-btn">Sign Up</button>
    </form>
</div>
<div style="padding: 20px" class="has-text-centered">
    <p style="color: white">
      UGA Maze Competition Official Site 
    </p>
</div>

<style>
    .signup-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        background-color: #fff;
        box-shadow: 1px 1px 5px rgba(0,0,0,0.1);
        margin-top: 50px;
        border-radius: 5px;
    }

    .form-control {
        margin-bottom: 10px;
        padding: 10px;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .form-control:focus {
        border-color: #BA0C2F;
        outline: none;
        box-shadow: 0 0 5px rgba(0,123,255,.25);
    }

    .signup-btn {
        padding: 10px 20px;
        width: 100%;
        background-color: #BA0C2F;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
    }

    .signup-btn:hover {
        background-color: #BA0C2F;
    }

    .google-btn {
        margin-top: 20px;
        padding: 10px;
        width: 100%;
        border: 2px solid #BA0C2F;
        background-color: #fff;
        color: #BA0C2F;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
        text-align: center;
    }

    .google-btn:hover {
        background-color: #BA0C2F;
        color: #fff;
    }
</style>
