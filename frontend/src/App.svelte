<script>
	import { Router, Link, Route } from "svelte-routing";
    import Login from "./routes/LoginPage.svelte";
    import Signup from "./routes/SignupPage.svelte";
	import Home from "./routes/HomePage.svelte";
    import Leaderboard from "./routes/Leaderboard.svelte";
</script>

<main>
	<Router>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-brand">
                <p>Maze-Competition TestBed</p>
                <img src="/assets/images/logo.png" alt="UGA logo" class="img-fluid" style="max-width: 100px;">
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item mr-3">
                        <Link class="nav-link" to="/">Home</Link>
                    </li>
                    <li class="nav-item mr-3">
                        <Link class="nav-link" to="/login">Login</Link>
                    </li>
                    <li class="nav-item mr-3">
                        <Link class="nav-link" to="/signup">Sign Up</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/leaderboard">Leaderboard</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

		<Route path="/" component={Home} />
		<Route path="/login" component={Login} />
		<Route path="/signup" component={Signup} />
    <Route path= "/leaderboard" component={Leaderboard} />
		
	</Router>
</main>

