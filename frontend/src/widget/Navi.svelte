<script>
    // Any script content remains here
</script>

<section class="hero is-small is-danger has-text-centered" id="naviHero">
    <div class="hero-body">
        <p class="title">
            UGA Maze Competition
        </p>
        <p class="subtitle">
            <img src="/HeRoLab.png" alt="HeRo Lab logo"/>
        </p>
    </div>
</section>

<style>
    /* Applying styles with increased specificity */
    #naviHero.hero {
        background: radial-gradient(circle at center, #8B0000 0%, #000000 100%);
        color: white; /* Ensures text is visible against the dark background */
    }

    @keyframes fadeInBackground {
        from {
            background-size: 200% 200%;
        }
        to {
            background-size: 100% 100%;
        }
    }

    /* Utilizing the ID for specificity and applying the animation */
    #naviHero.hero.is-small {
        animation: fadeInBackground 2s ease-out forwards;
    }

    #naviHero .title, #naviHero .subtitle {
        color: #ffffff; /* Adjust text color for better visibility */
    }

    #naviHero .subtitle img {
        /* Enhancing logo visibility against the dark gradient */
        border: 2px solid white;
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
    }
</style>
