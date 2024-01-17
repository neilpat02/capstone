
<script>
	import Footer from "./widget/Footer.svelte";
	import Navi from "./widget/Navi.svelte";
    let teamName = '';
    let email = '';
    let password = '';

    async function handleSubmit() {
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({teamName, email, password}),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Sign Up Successful!")
            } else {
                alert("Error: ${result.message}")
            }
        } catch (error) {
            alert("Error Occured: ${error.message}")
        }
    }
</script>

<Navi/>
<div class="signup-container">
    <h2>Create your account</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value={teamName} class="form-control" placeholder="Team Name" required>
        <input type="email" bind:value={email} class="form-control" placeholder="Email" required>
        <input type="password" bind:value={password} class="form-control" placeholder="Password" required>
        <button type="submit" class="signup-btn">Sign Up</button>
    </form>
    <button class="google-btn" on:click={() => console.log('Google Signup')}>Continue with Google</button>
</div>
<Footer/>