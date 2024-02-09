<script>
    import Footer from "./widget/Footer.svelte";
	import Navi from "./widget/Navi.svelte";
</script>


<section class="hero is-danger is-fullheight">
    <div class="hero-head">
        <header class="navbar">
            <div class="container">
            </div>
        </header>
    </div>
    <div class="hero-body">
        <div class="container has-text-centered">
            <p class="title">
                UGA Maze Competition
            </p>
            <p class="subtitle">
                <img src="/HeRoLab.png" alt="HeRo Lab logo"/>
            </p>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h1 class="title">
            What is the UGA Maze Competition?
        </h1>
        <p class="subtitle">
            The UGA Maze Competition is a competition that will allow students to compete against each other in a 2D maze.
        </p>
        <div class="tile is-ancestor">
            <div class="tile is-vertical is-8">
                <div class="tile">
                    <div class="tile is-parent is-vertical">
                        <article class="tile is-child notification is-black">
                            <p class="title">Why This Matters:</p>
                            <figure class="image is-4by3">
                                <img src="/wrench.png" alt="wrench in curly braces"/>
                            </figure>
                            <p class="subtitle">Our project holds immense relevance in the realm of autonomous navigation. While our primary focus is on maze-solving, our vision extends far beyond this initial challenge. By demonstrating proof of concept, we aim to validate advanced algorithms that can revolutionize autonomous vehicle navigation, path planning in logistics, and warehousing.</p>
                        </article>
                        <article class="tile is-child notification is-danger">
                            <p class="title">Scoring</p>
                            <p style="font-weight: bold;">Maze Mapping:</p>
                            <ul class="bullet-list">
                                <li>Accuracy: +50, +30, +10 points</li>
                                <li>Mapping Speed: +30, +20, +10 points</li>
                            </ul>
                            <p style="font-weight: bold;">Penalties:</p>
                            <ul class="bullet-list">
                                <li>Touch Penalty: -10 points</li>
                                <li>Crash Penalty: -10 points</li>
                            </ul>
                        </article>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification is-darkgray">
                            <p style="color: black"class="title">Our Vision</p>
                            <p style="color: black"class="subtitle">Looking to the future.</p>
                            <figure class="image is-4by3">
                                <img src="/Robot Maze Final.PNG" alt="Robot Maze Final">
                            </figure>
                            <p style="color: black"class="subtitle">Dedicated to fueling innovation, we present a unique competition testbed aimed at inspiring breakthroughs in algorithms and robotics. This dynamic platform challenges brilliant minds to create and test maze-solving algorithms and groundbreaking robotic designs, paving the way for the future of autonomous systems.</p>
                            <p style="color: black"class="subtitle">Beyond the competition, we foster continuous learning and collaboration, creating a vibrant community poised to shape the technological landscape.</p>
                        </article>
                    </div>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child notification is-black">
                        <p class="title">The Team</p>
                        <p class="subtitle">Neil Patel, George Tharpe, Evan Culbertson, Sean Payne, Mrudang Patel</p>
                        <div class="content">
                            <!-- Content -->
                        </div>
                    </article>
                </div>
            </div>
            <div class="tile is-parent">
                <article class="tile is-child notification is-danger">
                    <div class="content">
                        <p class="title">Our Journey</p>
                        <p class="subtitle">Through a modern world.</p>
                        <figure class="image is-2by1">
                            <img src="/UGAg.png" alt="UGA G">
                        </figure>
                        <p class="subtitle">In a world driven by groundbreaking technology, the possibilities for innovation are limitless. Our project is at the forefront of this exciting journey, focusing on the dynamic intersection of autonomous navigation, AI, algorithmic development, and robotics engineering.</p>
                        <p class="subtitle">As we delve into the heart of this multifaceted journey, our pursuit extends beyond the conventional boundaries, reaching into the uncharted territories of possibility. Fueled by an unwavering commitment to pushing the limits of what can be achieved, we strive to unlock new dimensions of creativity and ingenuity.</p>
                        <div class="content">
                            <!-- Content -->
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</section>


<div class="content has-text-centered">
    <p>
      UGA Maze Competition Offical Site 
    </p>
  </div>

<style>
    .content {
        padding: 20px; 
    }
    :global(body), :global(html) {
        height: 100%;
        margin: 0;
        overflow-x: hidden; /* Prevent horizontal scroll */
        background: radial-gradient(circle, rgba(128,0,0,1) 0%, rgba(0,0,0,1) 100%);
        color: white; /* Set default text color to white */
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes rotateBackground {
        from { background-position: 0 0; }
        to { background-position: -10000px 5000px; }
    }

    @keyframes rollIn {
        from { transform: translateX(-100%) rotate(-360deg); opacity: 0; }
        to { transform: translateX(0) rotate(0deg); opacity: 1; }
    }

    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        80% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
    }

    .hero, .title, .subtitle, .notification, .bullet-list li, .footer, .content, p, h1, ul, li {
        animation-duration: 1s;
        animation-fill-mode: both;
        color: white; /* Ensure all text within these elements is white */
    }

    .hero {
        animation-name: fadeIn;
    }

    .title, .subtitle {
        animation-name: fadeIn;
        animation-delay: 0.3s;
    }

    .notification {
        animation-name: slideUp;
        animation-delay: 0.5s;
    }

    .tile img {
        animation-name: rollIn;
        animation-delay: 0.7s;
    }

    .bullet-list li {
        animation-name: popIn;
        animation-duration: 0.5s;
        /* Delay each bullet's animation by an increasing factor */
        animation-delay: calc(var(--bullet-index) * 0.2s);
    }

    /* Utility to set --bullet-index custom property on each li */
    .bullet-list li {
        --bullet-index: 0; /* Default to 0 */
    }
    .bullet-list li:nth-child(1) { --bullet-index: 1; }
    .bullet-list li:nth-child(2) { --bullet-index: 2; }
    .bullet-list li:nth-child(3) { --bullet-index: 3; }
</style>
