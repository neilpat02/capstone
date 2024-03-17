<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  import { userEmail } from './userStore.js';
  import { onDestroy, onMount } from 'svelte';
  import p5 from 'p5'; //p5 library for the graphical representation of the maze 

  let showSoftware = true; //show the software section by default
  let mazeContainer;
  let editorText = ""; //track the code that is written
  let fileName = ""; // name of the file 
  let isSaving = false;
  let savedFiles = [];
  var serializedMaze = []; // Use reactive to watch changes
  $: userCurrentEmail = $userEmail; 
  let initialized = false;
  let robotRow = 0;
  let robotCol = 0;

  let p5Sketch = null;

  async function uploadToBot() {
  // Since you already have userCurrentEmail reactive variable
  try {
    const response = await fetch('http://localhost:3000/api/upload-to-bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userCurrentEmail, // Use the user's email to identify the team
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update timestamp');
    }

    const result = await response.json();
    console.log(result.message); // Log the success message
    alert('Upload to bot initiated and timestamp updated successfully.');
  } catch (error) {
    console.error('Error uploading to the bot:', error);
    alert('Error in uploading to the bot. Please try again.');
  }
}


  function generateMaze(cols, rows) {
    let grid = [];
    let stack = [];

    // Initialize all cells
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j, cols, rows, grid);
            // Check if the cell is the initial robot position
            cell.isRobotHere = i === robotRow && j === robotCol;
            cell.robotVisited = cell.isRobotHere; // Assume robot starts here and marks it as visited
            cell.robotDirection = cell.isRobotHere ? 'N' : null; // Robot faces North initially
            grid.push(cell);
        }
    }

    let current = grid[0]; // Start the maze generation from the first cell
    current.visited = true;

    do {
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            // Push the current cell to the stack
            stack.push(current);
            // Remove the walls between the current cell and the next cell
            removeWalls(current, next);
            // Move to the next cell
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        }
    } while (stack.length > 0);

    // Serialize the maze with updated properties
    return grid.map(cell => ({
        i: cell.i,
        j: cell.j,
        walls: cell.walls,
        isRobotHere: cell.isRobotHere,
        robotVisited: cell.robotVisited,
        robotDirection: cell.robotDirection // Include the robot's direction
    }));
}


class Cell {
    constructor(i, j, cols, rows, grid) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true]; // Top, right, bottom, left walls
        this.visited = false; // Flag to mark if the cell has been visited during maze generation
        this.cols = cols; // Total columns in the maze
        this.rows = rows; // Total rows in the maze
        this.grid = grid; // Reference to the entire grid for checking neighbors
        // Initialize isRobotHere and robotVisited properties
        this.isRobotHere = false;
        this.robotVisited = false;
    }

    checkNeighbors() {
        let neighbors = [];

        let top = this.index(this.i, this.j - 1);
        let right = this.index(this.i + 1, this.j);
        let bottom = this.index(this.i, this.j + 1);
        let left = this.index(this.i - 1, this.j);

        if (top !== -1 && !this.grid[top].visited) neighbors.push(this.grid[top]);
        if (right !== -1 && !this.grid[right].visited) neighbors.push(this.grid[right]);
        if (bottom !== -1 && !this.grid[bottom].visited) neighbors.push(this.grid[bottom]);
        if (left !== -1 && !this.grid[left].visited) neighbors.push(this.grid[left]);

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    index(i, j) {
        if (i < 0 || j < 0 || i >= this.cols || j >= this.rows) {
            return -1;
        }
        return i + j * this.cols;
    }
}

function removeWalls(a, b) {
    let x = a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    let y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}
  

function drawSerializedMaze() {
    if (p5Sketch) {
        p5Sketch.remove(); // Ensure no duplicate sketches
    }
    new p5((p) => {
        const wid = 30; // Width and height of each cell
        const cols = 16; // Number of columns
        const rows = 16; // Number of rows

        p.setup = () => {
            p.createCanvas(cols * wid, rows * wid);
            p.background(255);

            // Iterate over each cell in the serialized maze data
            for (let cellData of serializedMaze) {
                const x = cellData.i * wid;
                const y = cellData.j * wid;
                p.stroke(0); // Set stroke color for drawing walls

                // Draw walls based on the cell data
                if (cellData.walls[0]) p.line(x, y, x + wid, y); // Top wall
                if (cellData.walls[1]) p.line(x + wid, y, x + wid, y + wid); // Right wall
                if (cellData.walls[2]) p.line(x + wid, y + wid, x, y + wid); // Bottom wall
                if (cellData.walls[3]) p.line(x, y + wid, x, y); // Left wall

                // Check if the cell is the robot's current position
                if (cellData.isRobotHere) {
                    p.fill(255, 0, 0); // Set fill color to red
                    p.ellipse(x + wid / 2, y + wid / 2, wid / 2, wid / 2); // Draw a circle in the middle of the cell

                    // Draw a line for the robot's direction
                    const directionLineLength = wid / 4; // Length of the direction indicator line
                    let lineEndX = x + wid / 2;
                    let lineEndY = y + wid / 2 - directionLineLength; // Default direction up (North)

                    // Modify lineEndX and lineEndY based on robotDirection if available
                    // Example: If the robot is facing East, adjust the line end point accordingly
                    if (cellData.robotDirection) { // Assume 'robotDirection' is set to 'N', 'E', 'S', 'W'
                        switch (cellData.robotDirection) {
                            case 'E': // East
                                lineEndX += directionLineLength;
                                lineEndY += directionLineLength;
                                break;
                            case 'S': // South
                                lineEndX -= directionLineLength;
                                lineEndY += directionLineLength;
                                break;
                            case 'W': // West
                                lineEndX -= directionLineLength;
                                lineEndY -= directionLineLength;
                                break;
                            // Add more cases if needed
                        }
                    }

                    p.stroke(255); // Set line color to white for visibility
                    p.line(x + wid / 2, y + wid / 2, lineEndX, lineEndY); // Draw the direction line
                }
            }
        };
    }, mazeContainer);
}

$: if (showSoftware) {
  if (p5Sketch) {
    p5Sketch.remove(); // Remove existing sketch if any
  }
  // Delay the sketch initialization to ensure `mazeContainer` is available
  setTimeout(() => {
    drawSerializedMaze();
  }, 0);
} else {
  if (p5Sketch) {
    p5Sketch.remove();
    p5Sketch = null;
  }
}


  // Modified Cell function to accept and draw based on serialized data

  onMount(() => {
    serializedMaze = generateMaze(16, 16); // Generate maze with 16x16 grid
    console.log(JSON.stringify(serializedMaze, null, 2));
    //drawSerializedMaze();
  });

  onDestroy(() => {
    if (p5Sketch) {
      p5Sketch.remove();
    }
  });

 
  function promptForFileName() {
    isSaving = true;
  }

  async function saveText() {
    if (!fileName.trim()) {
      alert('File name is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/save-text', { // await the a response (button press) from the user 
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

      if (response.ok) { //text is saved successfully
        alert('Text saved successfully!');
        fileName = "";
        isSaving = false;
      } else {
        const errorData = await response.json();
        alert(`Failed to save text: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving text:', error);
      alert('Failed to save text due to an error.');
    }
  }

  function displaySerializedMaze() {
    console.log(JSON.stringify(serializedMaze, null, 2));
    alert(JSON.stringify(serializedMaze));
  }

  function toggleSection() {
    showSoftware = !showSoftware;
  }



  async function fetchSavedFiles() {
    const response = await fetch(`http://localhost:3000/api/get-texts?userEmail=${$userEmail}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        savedFiles = await response.json();
        console.log(savedFiles); // Correctly logging the fetched files
    } else {
        alert('Failed to fetch files.');
    }
  }

  async function loadFileContent(event) {
    const selectedFileName = event.target.value;
    const selectedFile = savedFiles.find(file => file.fileName === selectedFileName);
    if (selectedFile) {
      try {
        await navigator.clipboard.writeText(selectedFile.content);
        console.log('File content copied to clipboard.');
        alert('File content copied to clipboard.'); // Optional: Inform the user
      } catch (error) {
        console.error('Could not copy text to clipboard', error);
        alert('Failed to copy file content to clipboard.');
      }
    } else {
      console.error('Selected file content not found');
    }
  }
  function toggleDropdownAnimation() {
    const dropdown = document.querySelector('.file-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show'); // Toggle the 'show' class to apply the animation
    }
}

async function handleFileButtonClick() {
  await fetchSavedFiles();
  toggleDropdownAnimation();
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
  <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-square" id="software-section">
    <div class="has-text-centered">
      <h1 class="title is-1">Maze Simulator</h1>
    </div>
    <div class="is-flex is-justify-content-space-between" style="flex: 1; width: 100%;">
      <div style="flex: 1;">
        <div bind:this={mazeContainer} class="maze-container"></div>
      </div>
      <div style="flex: 2;">
        <div class="content">
          {#if savedFiles.length > 0}
            <select on:change="{loadFileContent}" class="file-dropdown">
              <option value="">Select a file...</option>
              {#each savedFiles as file}
                <option value="{file.fileName}">{file.fileName}</option>
              {/each}
            </select>
          {/if}
          <AceEditor bind:value={editorText} />
        </div>
        {#if isSaving}
          <div class="file-name-input">
            <input type="text" bind:value={fileName} placeholder="Enter file name here" />
            <button on:click={saveText}>OK</button>
          </div>
        {:else}
          <div class="button-container">
            <button class="thin-button" on:click={promptForFileName}>Save</button>
            <button class="thin-button" on:click={handleFileButtonClick}>File</button>
            <button class="thin-button" on:click={displaySerializedMaze}>Run</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if !showSoftware}
  <div class="is-flex is-justify-content-center is-align-items-center is-square" id="hardware-section">
    <section class="section hardware-section">
      <div style="background: darkgray;"class="has-text-centered">
        <h1 class="title is-1">Hardware Section</h1>
        <!-- Add  hardware-related content here when the time comes  -->
      </div>
    </section>
  </div>
  <div class="button-container">
    <button class="thin-button">File</button>
    <button class="thin-button">Save</button>
    <button class="thin-button-left" on:click={uploadToBot}>Upload to bot</button>
  </div>
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
    display: flex;
    justify-content: center;
    align-items: center;
    border: #B71234 5px solid;
    margin: 0 2rem 0 2rem;
  }

  .file-dropdown {
  margin: 10px 0;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* Add a keyframe for the appearance animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-name-input {
  display: flex;
  align-items: center;
  gap: 10px; /* Add some space between the text box and the button */
  animation: slideIn 0.5s ease-out; /* Use the defined animation */
}

.file-name-input input[type="text"] {
  padding: 8px 10px;
  border: 2px solid #B71234; /* A solid border to match the button color */
  border-radius: 4px; /* Rounded corners for the text box */
  transition: border-color 0.3s; /* Smooth transition for border color */
  outline: none; /* Remove default focus outline */
}

.file-name-input input[type="text"]:focus {
  border-color: #ff6363; /* Change border color on focus */
}

.file-name-input button {
  padding: 8px 15px;
  background-color: #B71234;
  color: white;
  border: none;
  border-radius: 4px; /* Rounded corners for the button */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s; /* Smooth transitions for hover effects */
}

.file-name-input button:hover {
  background-color: #ff6363; /* Lighten the button color on hover */
  transform: translateY(-2px); /* Slight lift effect */
}

.file-name-input button:active {
  transform: translateY(1px); /* Push effect on click */
}

.file-dropdown {
  appearance: none; /* Remove default browser styling */
  width: 100%; /* Make dropdown full-width */
  padding: 8px 12px;
  background-color: #f2f2f2; /* Light background color */
  border: 2px solid #B71234; /* Match the theme */
  border-radius: 5px; /* Rounded corners */
  font-size: 16px; /* Increase font size for better readability */
  cursor: pointer; /* Change cursor to indicate it's clickable */
  outline: none; /* Remove default focus outline */
  transition: background-color 0.3s, border-color 0.3s; /* Smooth transition for background and border */
}

.file-dropdown:hover {
  background-color: #e6e6e6; /* Slightly darker background on hover */
}

.file-dropdown:focus {
  border-color: #ff6363; /* Highlighted border when focused */
}

.file-dropdown:active {
  background-color: #cccccc; /* Even darker background when clicked */
}

.thin-button-left {
  margin: 0; /* Remove default margin */
  padding: 10px 20px; /* Adjust padding to make the button more prominent */
  border: none; /* Remove border */
  background-color: #4CAF50; /* A distinct, eye-catching color */
  color: white; /* Set text color to white for contrast */
  cursor: pointer; /* Change cursor to pointer to indicate it's clickable */
  transition: background-color 0.3s, box-shadow 0.2s, transform 0.1s; /* Smooth transitions for interactive effects */
  border-radius: 5px; /* Rounded corners for a modern look */
}

.thin-button-left:hover {
  background-color: #45a049; /* Darken the button color slightly on hover */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19); /* Add shadow for depth */
}

.thin-button-left:active {
  transform: translateY(2px); /* Slight push effect when clicked */
}

/* Animation for dropdown appearance */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



</style>