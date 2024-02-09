<script>
    import { onMount } from 'svelte';
    import Footer from "./widget/Footer.svelte";
    import Navi from "./widget/Navi.svelte";
  
    let leaderboardData = [];
    let leaderboardType = 'software'; // Default leaderboard type
  
    // Fetch leaderboard data on mount
    onMount(async () => {
        await fetchLeaderboard();
    });
  
    // Function to fetch leaderboard data based on type
    async function fetchLeaderboard() {
        try {
            const response = await fetch(`http://localhost:3000/api/leaderboard?type=${leaderboardType}`);
            if (response.ok) {
                leaderboardData = await response.json();
            } else {
                console.error('Error fetching leaderboard data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
  
    // Function to toggle between software and hardware leaderboard
    function toggleLeaderboard() {
        leaderboardType = leaderboardType === 'software' ? 'hardware' : 'software';
        fetchLeaderboard();
    }
  </script>
  
  
  <section class="hero is-small has-text-centered">
    <div class="hero-body">
        <p style="color: white" class="title">
            UGA Maze Competition
        </p>
        <p class="subtitle">
            <img src="/HeRoLab.png" alt="HeRo Lab logo"/>
        </p>
    </div>
</section>
  
  <div class="container p-5">
    <div class="content">
        <div class="title-container">
            <h1 style="color: white" >{leaderboardType.toUpperCase()} Leaderboard</h1>
            <button style="color: white; background: gray;" on:click={toggleLeaderboard}>Toggle Leaderboard</button>
        </div>
        <div class="leaderboard-container">
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {#each leaderboardData as { teamName, softwareScore, hardwareScore }, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td>{teamName}</td>
                            <td>{leaderboardType === 'software' ? softwareScore : hardwareScore}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="content has-text-centered">
    <p>
      UGA Maze Competition Offical Site 
    </p>
  </div>
  
  
  
  <style>
    .content {
        
        padding: 20px; 
    }
    .title-container {
        text-align: center;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
  
    .leaderboard-container {
        width: 80%;
        margin: 20px auto;
    }
  
    .leaderboard-table {
        width: 100%;
        border-collapse: collapse;
    }
  
    .leaderboard-table th, .leaderboard-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
  
    .leaderboard-table th {
        background-color: #f4f4f4;
    }
  
    button {
        cursor: pointer;
        padding: 10px 20px;
        margin-left: 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
    }
  
    button:hover {
        background-color: #0056b3;
    }
  </style>
  