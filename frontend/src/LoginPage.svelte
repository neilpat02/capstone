<script>
  import Footer from "./widget/Footer.svelte";
  import Navi from "./widget/Navi.svelte";

  // Variables and function from the old LoginPage
  let email = '';
  let password = '';

  function handleSubmit() {
      // Here, handle form submission logic
      console.log({ email, password });
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
          <button class="google-btn" on:click={() => console.log('Google Login')}>Continue with Google</button>
      </div>
  </div>
</div>

<Footer/>


