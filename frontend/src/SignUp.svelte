
<script>
	import Footer from "./widget/Footer.svelte";
	import Navi from "./widget/Navi.svelte";
    import { createEventDispatcher } from 'svelte';
    let teamName = '';
    let email = '';
    let password = '';
    const dispatch = createEventDispatcher();
    
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
                dispatch('login');
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
    
</div>
<Footer/>

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