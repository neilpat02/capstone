<script>
  import { createEventDispatcher } from 'svelte';
  import Footer from "./widget/Footer.svelte";
  import Navi from "./widget/Navi.svelte";
  import { userEmail, userToken, setToken } from './userStore.js'; // Import userToken and setToken function

  const dispatch = createEventDispatcher();
  let email = '';
  let password = '';
  let loginMessage = '';

  async function handleSubmit() {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token); // Save the token using the setToken function
        userEmail.set(email); // Store the email in the Svelte store
        dispatch('login'); // Dispatch event for successful login
        alert(`Logged in as: ${email}`); // Alert the email to the user
        loginMessage = "Login successful";
      } else {
        loginMessage = `Error: ${result.message}`;
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      loginMessage = `Error: ${error.message}`;
      alert(`Error Occurred: ${error.message}`);
    }
  }

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        loginMessage = "Email sent";
        alert("Email sent");
      } else {
        loginMessage = `Error: ${result.message}`;
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      loginMessage = `Error: ${error.message}`;
      alert(`Error Occurred: ${error.message}`);
    }
  };
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

<div class="container p-5">
  <div class="content">
      <div class="login-container">
        <h3 style="color: gray">Login</h3>
          <form on:submit|preventDefault={handleSubmit}>
              <input type="email" bind:value={email} class="form-control" placeholder="Email" required>
              <input type="password" bind:value={password} class="form-control" placeholder="Password" required>
              <button type="submit" class="login-btn">Login In</button>
          </form>
          {#if loginMessage}
          <p class="login-message">{loginMessage}</p>
          {/if}
          <button class="forgot-password-btn" on:click={handleForgotPassword}>Forgot Password?</button>
      </div>
  </div>
</div>

<div style="padding: 20px" class="has-text-centered">
  <p style="color: white">
    UGA Maze Competition Offical Site 
  </p>
</div>

<style> 
    .login-container {
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

    .login-btn {
        padding: 10px 20px;
        width: 100%;
        background-color: #BA0C2F;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
    }

    .login-btn:hover {
        background-color: #BA0C2F;
    }

    .forgot-password-btn {
        margin-top: 10px;
        background: none;
        border: none;
        color: #BA0C2F;
        cursor: pointer;
        font-size: 16px;
    }

    .forgot-password-btn:hover {
        text-decoration: underline;
    }

    .login-message {
        margin-top: 10px;
        color: #BA0C2F;
        font-size: 16px;
    }
</style>
