<script>
  import Footer from "./widget/Footer.svelte";
  import Navi from "./widget/Navi.svelte";
 


  let editorText = ""; // Placeholder for Text Editor content

  // Robot initial position and maze setup
  let robotRow = 0;
  let robotCol = 0;
  const mazeSize = 16;
  let maze = Array.from({ length: mazeSize }, () => new Array(mazeSize).fill(0));
  maze[robotRow][robotCol] = 1; // Place robot in the maze
</script>

<Navi/>
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

<div class="container is-flex is-justify-content-left is-align-items-center is-button-container">
  <div class="button">FILE</div>
  <div class="button">SAVE</div>
  <div class="button">RUN</div>
</div>

<div class="container is-flex is-justify-content-center is-align-items-center is-square">
  <section class="section">
    <div class="has-text-centered">
      <h1 class="title is-1">IDE</h1>
    </div>
    <textarea bind:value={editorText} class="text-editor"></textarea>
  </section>
</div>

<div class="container is-flex is-justify-content-left is-align-items-center is-button-container">
  <div class="button">UPLOAD</div>
</div>

<Footer/>

<style>
  /* Styles for the overall layout */
  .is-square {
    height: 70vh; /* Adjusted for larger size */
    background-color: lightgray;
    margin-top: 2rem;
  }

  .is-button-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }

  .button {
    width: 100px;
    height: 100px;
    margin: 10px;
    background-color: #B71234;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .button:hover {
    background-color: gray;
  }

  /* Styles for the Text Editor */
  .text-editor {
    width: 100%;
    height: 300px; /* Increased height for better visibility */
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 16px;
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

