<script>
    let email = '';
    let password = '';

    function handleSubmit() {
        // Here, you would typically handle form submission, like sending data to a server
        // For this example, we'll just log the input values
        console.log({ email, password });
    }
</script>


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
</style>

<div class="login-container">
    <h2>Welcome Back</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="email" bind:value={email} class="form-control" placeholder="Email" required>
        <input type="password" bind:value={password} class="form-control" placeholder="Password" required>
        <button type="submit" class="login-btn">Login In</button>
    </form>
    <button class="google-btn" on:click={() => console.log('Google Login')}>Continue with Google</button>
</div>
