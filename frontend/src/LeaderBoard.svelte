<script>
  import Footer from "./widget/Footer.svelte";
  import Navi from "./widget/Navi.svelte";

  // Temporary sample data (from old component)
  const leaderboardData = [
      {teamName: 'Team Alpha', score: 150},
      {teamName: 'Team Beta', score: 100},
      {teamName: 'Team Gamma', score: 50}
  ];

  // Future MongoDB fetch logic placeholder (from old component)
  //... {add code here to fetch data}
</script>

<Navi/>

<div class="container p-5">
  <div class="content">
    
      <!-- Leaderboard section (from old component) -->
      <div class="title-container">
          <h1>Leaderboard</h1>
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
                  {#each leaderboardData as { teamName, score }, index}
                      <tr>
                          <td>{index + 1}</td>
                          <td>{teamName}</td>
                          <td>{score}</td>
                      </tr>
                  {/each}
              </tbody>
          </table>
      </div>
  </div>
</div>

<Footer/>

<style>
  /* Existing styles from new component */
  /* ... */

  /* Leaderboard styles (from old component) */
  .title-container {
      text-align: center;
      margin-top: 20px;
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
</style>
