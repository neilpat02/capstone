<script>
	import { Router, Link, Route } from "svelte-routing";
  	import Login from "./routes/LoginPage.svelte";
</script>

<main>
	<h1>hey</h1>
  
  <Router>
    <nav>
      <div class="--bs-body-color-rgb">
        <Link to="/login">Login</Link>
      </div>
    </nav>

    <Route path="/login" component={Login} />
  </Router>
</main>
