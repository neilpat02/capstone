<script>
  import { createEventDispatcher } from 'svelte';
  import Footer from "./widget/Footer.svelte";
  import Navi from "./widget/Navi.svelte";

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
        loginMessage = "Login successful";
        dispatch('login'); // Dispatch event for successful login
      } else {
        loginMessage = `Error: ${result.message}`;
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      loginMessage = `Error: ${error.message}`;
      alert(`Error Occurred: ${error.message}`);
    }
  }

  function handleForgotPassword() {
    // Forgot Password Logic
  }
</script>

<Navi/>

<div class="container p-5">
  <div class="content">
      <h1>Login</h1>

      <!-- Login form from the old LoginPage -->
      <div class="login-container">
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

<Footer/>

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
