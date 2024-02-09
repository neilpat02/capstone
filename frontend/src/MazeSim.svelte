<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  
  let editorText = ""; // Placeholder for Text Editor content

  // Robot initial position and maze setup
  let robotRow = 0;
  let robotCol = 0;
  const mazeSize = 16;
  const userId = $userId; // Ensure you have a way to access the logged-in user's ID
  let maze = Array.from({ length: mazeSize }, () => new Array(mazeSize).fill(0));
  maze[robotRow][robotCol] = 1; // Place robot in the maze

  let showSoftware = true;
  function toggleSection() {
    showSoftware = !showSoftware;
  }

  function uploadToBot() {
    // Your upload logic goes here
    console.log('Uploading to the bot...');
  }

  async function saveText() {
    const fileName = prompt('Enter the name of the file:');
    if (!fileName) {
      alert('Save cancelled.');
      return;
    }

    try {
      const content = editorText;
      
      const response = await fetch('/api/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, fileName, content })
      });

      if (response.ok) {
        alert('File saved successfully.');
      } else {
        const error = await response.json();
        alert(`Failed to save file: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file.');
    }
  }
</script>

<Navi/>
<div class="button-container-top">
  <button class="thin-button-top" on:click={toggleSection}>Software</button>
  <button class="thin-button-top" on:click={toggleSection}>Hardware</button>
</div>

{#if showSoftware}
  <div class="is-flex is-justify-content-center is-align-items-center is-square" id="software-section">
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
    <button class="thin-button-left">RUN</button>
  </div>
{/if}

{#if !showSoftware}
  <div class="is-flex is-justify-content-center is-align-items-center is-square" id="hardware-section">
    <section class="section hardware-section">
      <div style="background: darkgray;"class="has-text-centered">
        <h1 class="title is-1">Hardware Section</h1>
        <!-- Add your hardware-related content here -->
      </div>
    </section>
  </div>
  <div class="button-container">
    <button class="thin-button">File</button>
    <button class="thin-button">Save</button>
    <button class="thin-button-left" on:click={uploadToBot}>Upload to bot</button>
  </div>
  
{/if}



<div class="content">
    <AceEditor bind:value={editorText} />
</div>


<div style=""class="content has-text-centered">
  <p style="color: white">
    UGA Maze Competition Offical Site 
  </p>
</div>

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
    width: calc(100% - 4rem); /* Subtract 2rem on both sides for left and right margins */
    margin: 0 2rem;
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
