<script>
    let firstName = '';
    let lastName = '';
    let email = '';
    let password = '';

    function handleSubmit() {
        // Here, you would typically handle form submission, like sending data to a server
        // For this example, we'll just log the input values
        console.log({ firstName, lastName, email, password });
    }
</script>


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

<div class="signup-container">
    <h2>Create your account</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value={firstName} class="form-control" placeholder="First Name" required>
        <input type="text" bind:value={lastName} class="form-control" placeholder="Last Name" required>
        <input type="email" bind:value={email} class="form-control" placeholder="Email" required>
        <input type="password" bind:value={password} class="form-control" placeholder="Password" required>
        <button type="submit" class="signup-btn">Sign Up</button>
    </form>
    <button class="google-btn" on:click={() => console.log('Google Signup')}>Continue with Google</button>
</div>
