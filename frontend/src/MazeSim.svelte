<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  import { userEmail } from './userStore.js';
  import { onMount } from 'svelte';
  import p5 from 'p5';

  // Maze configuration
  let mazeContainer;
  let editorText = ""; // Placeholder for Text Editor content
  let fileName = ""; // State for the file name
  let isSaving = false; // State to control the display of input for file name and OK button
  let serializedMaze = "";
  $: userCurrentEmail = $userEmail; // Reactive declaration for the current user email

  // Robot initial position and maze setup
  let robotRow = 0;
  let robotCol = 0;
  const mazeSize = 16;
  

  onMount(() => {
    new p5((p) => {
      let cols, rows;
      const wid = 25;
      let grid = [];

      p.setup = () => {
        p.createCanvas(400, 400);
        cols = p.floor(400 / wid);
        rows = p.floor(400 / wid);
        p.frameRate(30);

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j, p, wid, grid);
            grid.push(cell);
          }
        }

        let current = grid[0];
        let stack = [];

        do {
          current.visited = true;
          let next = current.checkNeighbors();
          if (next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;
          } else if (stack.length > 0) {
            current = stack.pop();
          }
        } while (stack.length > 0);

        // Serialize the maze configuration after generation
        serializedMaze = JSON.stringify(grid.map(cell => cell.serialize()));
      };

      p.draw = () => {
        p.background(255);
        for (let i = 0; i < grid.length; i++) {
          grid[i].show();
        }
      };

      function Cell(i, j, p, wid, grid) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;
        this.robotVisited = (i === robotRow && j === robotCol);

        this.checkNeighbors = function() {
          let neighbors = [];
          let top = grid[index(i, j - 1, cols, rows)];
          let right = grid[index(i + 1, j, cols, rows)];
          let bottom = grid[index(i, j + 1, cols, rows)];
          let left = grid[index(i - 1, j, cols, rows)];

          if (top && !top.visited) neighbors.push(top);
          if (right && !right.visited) neighbors.push(right);
          if (bottom && !bottom.visited) neighbors.push(bottom);
          if (left && !left.visited) neighbors.push(left);

          if (neighbors.length > 0) {
            let r = p.floor(p.random(0, neighbors.length));
            return neighbors[r];
          } else {
            return undefined;
          }
        };

        this.show = function() {
          let x = this.i * wid;
          let y = this.j * wid;
          p.stroke(0);
          if (this.walls[0]) p.line(x, y, x + wid, y);
          if (this.walls[1]) p.line(x + wid, y, x + wid, y + wid);
          if (this.walls[2]) p.line(x + wid, y + wid, x, y + wid);
          if (this.walls[3]) p.line(x, y + wid, x, y);

          if (this.visited) {
            p.noStroke();
            p.fill(255, 255, 255);
            p.rect(x, y, wid, wid);
          }
        };

        // Serialization method for a cell
        this.serialize = function() {
          return {
            i: this.i,
            j: this.j,
            walls: this.walls,
            isRobotHere: (this.i === robotRow && this.j === robotCol), // True for starting cell
            robotVisited: this.robotVisited 
          };
        };
      }

      function index(i, j, cols, rows) {
        if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;
        return i + j * cols;
      }

      function removeWalls(a, b) {
        let x = a.i - b.i;
        let y = a.j - b.j;
        if (x === 1) {
          a.walls[3] = false;
          b.walls[1] = false;
        } else if (x === -1) {
          a.walls[1] = false;
          b.walls[3] = false;
        } else if (y === 1) {
          a.walls[0] = false;
          b.walls[2] = false;
        } else if (y === -1) {
          a.walls[2] = false;
          b.walls[0] = false;
        }
      }
    }, mazeContainer);
  });

  function displaySerializedMaze() {
    console.log(serializedMaze); // For now, simply log the serialized maze to the console
    console.log(serializedMaze); // For now, just log the serialized maze to)
    alert(serializedMaze); // Alternatively, or in addition, display it in an alert for easy viewing
  }
  let showSoftware = true; // State to toggle between software and hardware views

  // Function to trigger the file name input and OK button for saving
  function promptForFileName() {
    isSaving = true; // Show input for file name and OK button
  }

  // Function to handle the actual saving logic
  async function saveText() {
    if (!fileName.trim()) {
      alert('File name is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/save-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userCurrentEmail,
          fileName,
          content: editorText,
        }),
      });

      if (response.ok) {
        alert('Text saved successfully!');
        fileName = ""; // Clear file name after successful save
        isSaving = false; // Hide the input and OK button
      } else {
        const errorData = await response.json();
        alert(`Failed to save text: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving text:', error);
      alert('Failed to save text due to an error.');
    }
  }

  // Toggle the software/hardware view
  function toggleSection() {
    showSoftware = !showSoftware;
  }

  // Placeholder function for future bot uploading logic
  function uploadToBot() {
    console.log('Uploading to the bot...');
  }
</script>

<Navi/>
<div class="logged-in-as">
  Logged in as: {$userEmail}
</div>

<div class="button-container-top">
  <button class="thin-button-top" on:click={toggleSection}>Software</button>
  <button class="thin-button-top" on:click={toggleSection}>Hardware</button>
</div>

{#if showSoftware}
  <div class="is-flex is-justify-content-center is-align-items-center is-square" id="software-section">
    <div class="has-text-centered">
      <h1 class="title is-1">Maze Simulator</h1>
    </div>
    <section class="section">
      <div bind:this={mazeContainer} class="maze-container"></div> <!-- Container for the p5 canvas -->
    </section>
    <section class="section">
      <div class="content">
        <AceEditor bind:value={editorText} />
      </div>
    </section>
  {#if isSaving}
    <div class="file-name-input">
      <input type="text" bind:value={fileName} placeholder="Enter file name here" />
      <button on:click={saveText}>OK</button>
    </div>
  {:else}
    <div class="button-container">
      <button class="thin-button" on:click={promptForFileName}>Save</button>
      <button class="thin-button">File</button>
      <button class="thin-button" on:click={displaySerializedMaze}>Run</button>
    </div>
  {/if}
  </div>
{/if}

{#if !showSoftware}
  <!-- Existing Hardware section code... -->
{/if}


<div class="content has-text-centered">
  <p style="color: white">
    UGA Maze Competition Official Site
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

  .maze-container {
    /* Styles to ensure the maze is displayed correctly */
    text-align: center; /* Center the canvas if needed */
    border:#B71234 5px solid;
  }
</style>