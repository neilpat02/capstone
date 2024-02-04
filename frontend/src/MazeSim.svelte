<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  
  let editorText = ""; // Placeholder for Text Editor content

  // Robot initial position and maze setup
  let robotRow = 0;
  let robotCol = 0;
  const mazeSize = 16;
  let maze = Array.from({ length: mazeSize }, () => new Array(mazeSize).fill(0));
  maze[robotRow][robotCol] = 1; // Place robot in the maze
</script>

<Navi/>
<div class="button-container-top">
  <button class="thin-button-top">Software</button>
  <button class="thin-button-top">Hardware</button>
</div>

<div class="container is-flex is-justify-content-center is-align-items-center is-square">
  <section class="section">
    <div class="has-text-centered">
      <h1 class="title is-1">Maze Simulator</h1>
    </div>
    <div class="maze">
      {#each maze as row, i}
        {#each row as cell, j}
          <div class="maze-cell {cell === 1 ? 'robot' : ''}"></div>
        {/each}
      {/each}
    </div>
  </section>
</div>

<div class="button-container">
  <button class="thin-button">File</button>
  <button class="thin-button">Save</button>
  <button class="thin-button">RUN</button>
  <button class="thin-button-left">Upload to the bot</button>
</div>


<div class="content">
    <AceEditor bind:value={editorText} />
</div>


<Footer/>

<style>
  .button-container-top {
    display: flex;
    width: calc(100% - 4rem); /* Subtract 2rem on both sides for left and right margins */
    margin: 0 2rem;
  }

  .thin-button-top {
    flex: 1; /* Make each button take up equal width */
    margin: 0; /* Remove default margin */
    padding: 5px 10px; /* Adjust padding for your desired thickness */
    border: none; /* Remove border */
    background-color: #B71234; /* Set background color */
    color: #fff; /* Set text color */
    cursor: pointer;
  }

  .button-container {
    display: flex;
    margin-left: 2rem;
  }

  .thin-button {
    margin: 0; /* Remove default margin */
    padding: 5px 10px; /* Adjust padding for your desired thickness */
    border: none; /* Remove border */
    background-color: #B71234; /* Set background color */
    color: #fff; /* Set text color */
    cursor: pointer;
  }
  .thin-button-left{
    margin: 0 2rem; /* Remove default margin */
    padding: 5px 10px; /* Adjust padding for your desired thickness */
    border: none; /* Remove border */
    background-color: #B71234; /* Set background color */
    color: #fff; /* Set text color */
    cursor: pointer;
    margin-left: auto;
    
  }

  /* Styles for the overall layout */
  .is-square {
    height: 70vh; /* Adjusted for larger size */
    background-color: lightgray;
    
  }


  .content {
    margin: 0 2rem 0 2rem;
  }

  
  .thin-button:hover {
    background-color: gray;
  }
  .thin-button-top:hover {
    background-color: gray;
  }

  /* Styles for the Maze and Robot */
  .maze {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    grid-template-rows: repeat(16, 1fr);
    gap: 2px;
    margin-top: 20px;
    max-width: 600px; /* Adjust the size as needed */
    max-height: 600px; /* Adjust the size as needed */
    border: 1px solid #ccc;
  }

  .maze-cell {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
  }

  .robot {
    background-color: blue;
  }
</style>
