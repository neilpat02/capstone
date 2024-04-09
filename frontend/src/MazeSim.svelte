<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  import { userEmail } from './userStore.js';
  import { onDestroy, onMount } from 'svelte';
  import p5 from 'p5'; //p5 library for the graphical representation of the maze
  import io from 'socket.io-client'; 

  const socket = io('http://localhost:5001'); 
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
  let robot2Row = 15;
  let robot2Col = 15;

  // When generating the initial maze or robot positions
  // Initialize robot positions more flexibly, potentially within a single structure
  let robotPositions = [
    { row: 0, col: 0, direction: 'N' },
    { row: 15, col: 15, direction: 'S' } // Example second robot initialized at the opposite corner
  ];

  async function uploadToBot() {
  // Since you already have userCurrentEmail reactive variable
  alert('Code to upload:\n' + editorText);
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

  try {
      const flaskResponse = await fetch('http://localhost:5001/upload_to_bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm_code: editorText, // Send the code from the editor
          serializedMaze: serializedMaze, // Assuming serializedMaze is also required by your Flask backend
        }),
      });

      if (!flaskResponse.ok) {
        throw new Error('Failed to send code to Flask backend');
      }

      const flaskResult = await flaskResponse.json();
      console.log('Code sent to Flask backend:', flaskResult);
      alert('Code uploaded to bot successfully.');
    } catch (flaskError) {
      console.error('Error sending code to Flask backend:', flaskError);
      alert('Failed to upload code to bot. Please try again.');
    }

}


function generateMaze(cols, rows) {
    let grid = [];
    let stack = [];

    // Initialize all cells with the new robots structure
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j, cols, rows, grid);
            // Modify cell initialization to include robots data with conditional direction
            cell.robots = [
              {
                id: 1,
                isHere: i === 0 && j === 0,
                visited: i === 0 && j === 0,
                direction: (i === 0 && j === 0) ? 'N' : null // Set to null if robot is not here
              },
              {
                id: 2,
                isHere: i === 15 && j === 15,
                visited: i === 15 && j === 15,
                direction: (i === 15 && j === 15) ? 'S' : null // Set to null if robot is not here
              }
            ];
            grid.push(cell);
        }
    }

    let current = grid[0]; // Start the maze generation from the first cell
    current.visited = true;

    do {
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            stack.push(current); // Push the current cell to the stack
            removeWalls(current, next); // Remove the walls between the current cell and the next cell
            current = next; // Move to the next cell
        } else if (stack.length > 0) {
            current = stack.pop(); // Backtrack if there are no unvisited neighbors
        }
    } while (stack.length > 0);

    // Serialize the maze with updated properties, including the conditional robots' direction data
    return grid.map(cell => ({
        i: cell.i,
        j: cell.j,
        walls: cell.walls,
        robots: cell.robots.map(robot => ({
          ...robot,
          direction: robot.isHere ? robot.direction : null // Ensure direction is null if robot is not here
        })) // Map each robot to include conditional direction
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
    p5Sketch.remove();
    p5Sketch = null;
  }

  p5Sketch = new p5((p) => {
    const wid = 30; // Width and height of each cell
    const cols = 16; // Number of columns
    const rows = 16; // Number of rows

    p.setup = () => {
      p.createCanvas(cols * wid, rows * wid);
      p.noLoop(); // Ensures that the draw function is called only once
    };

    p.draw = () => {
      p.background(255);

      // First, draw the visited shading for each cell
      serializedMaze.forEach(cellData => {
        const x = cellData.i * wid;
        const y = cellData.j * wid;

        cellData.robots.forEach(robot => {
          // Apply shading only if the robot has visited, excluding the current position
          if (robot.visited) {
            const fillColor = robot.id === 1 ? 'rgba(255, 102, 102, 100)' : 'rgba(153, 153, 255, 100)';
            p.fill(fillColor);
            p.noStroke();
            p.rect(x, y, wid, wid);
          }
        });
      });

      // Then, draw walls and robots to ensure they are not covered by the shading
      serializedMaze.forEach(cellData => {
        const x = cellData.i * wid;
        const y = cellData.j * wid;

        // Draws the walls of the cell
        p.stroke(0);
        if (cellData.walls[0]) p.line(x, y, x + wid, y);
        if (cellData.walls[1]) p.line(x + wid, y, x + wid, y + wid);
        if (cellData.walls[2]) p.line(x + wid, y + wid, x, y + wid);
        if (cellData.walls[3]) p.line(x, y + wid, x, y);

        // Draw each robot in its current cell
        cellData.robots.forEach(robot => {
          if (robot.isHere) {
            const fillColor = robot.id === 1 ? 'rgba(255, 0, 0, 255)' : 'rgba(0, 0, 255, 255)';
            p.fill(fillColor);
            p.ellipse(x + wid / 2, y + wid / 2, wid / 2, wid / 2);

            // Optional: Direction line for the robot
            let lineEndX = x + wid / 2;
            let lineEndY = y + wid / 2;
            const directionLineLength = wid / 4;
            if (robot.direction) {
              switch (robot.direction) {
                case 'N':
                  lineEndY -= directionLineLength;
                  break;
                case 'E':
                  lineEndX += directionLineLength;
                  break;
                case 'S':
                  lineEndY += directionLineLength;
                  break;
                case 'W':
                  lineEndX -= directionLineLength;
                  break;
              }
              p.stroke(255); // White for visibility
              p.line(x + wid / 2, y + wid / 2, lineEndX, lineEndY);
            }
          }
        });
      });
    };
  }, mazeContainer);
}










  $: if (serializedMaze && mazeContainer) {
    drawSerializedMaze();
  }
  


  // Modified Cell function to accept and draw based on serialized data

  onMount(() => {
  // Listen for 'update_maze' event from the server
  socket.on('update_maze', (data) => {
    console.log('Received updated maze:', data);
    serializedMaze = data.updatedMaze; // Update your maze data
    drawSerializedMaze(); // Re-draw the maze with the updated data
  });

  serializedMaze = generateMaze(16, 16); // Initial maze generation, you can remove this if you'll receive the initial state from the server as well
  drawSerializedMaze(); // You might want to comment this out if you're expecting the initial state from the server
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
    if (showSoftware) {
      drawSerializedMaze();
    }
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



  async function runSimulation() {
      const algorithmCode = editorText; // Your algorithm code here)
      const serializedMazeSent = serializedMaze;
      try {
          const response = await fetch('http://localhost:5001/run', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  algorithm_code: algorithmCode,
                  serializedMaze: serializedMazeSent,
              }),
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Simulation result:', data);
          // Update your front-end accordingly with the received data
      } catch (error) {
          console.error('Error running simulation:', error);
      }
  }

  async function handleRunButtonClick() {
    try {
      // Serialize the maze data to a JSON string
      const serializedData = JSON.stringify(serializedMaze, null, 2);
      // Copy the serialized data to the clipboard
      await navigator.clipboard.writeText(serializedData);
      // Alert the user that the data has been copied
      alert('Serialized maze data has been copied to clipboard.');
    } catch (error) {
      console.error('Error copying serialized maze data to clipboard:', error);
      // Alert the user in case of an error
      alert('Failed to copy serialized maze data to clipboard.');
    }
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
            <!-- <button class="thin-button" on:click={runSimulation}>Run</button> -->
            <button class="thin-button" on:click={handleRunButtonClick}>Run</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if !showSoftware}
  <div class="hardware-section">
    <div class="title-container">
      <h1 class="title is-1">Hardware Section</h1>
    </div>
    <div class="camera-feed">
      <img src="http://192.168.1.78:8000/" alt="Live Camera Feed" />
    </div>
    <!-- Camera feed integration ends here -->
    
    <!-- Buttons -->
    <div class="button-container">
      <button class="thin-button" on:click={promptForFileName}>Save</button>
      <button class="thin-button" on:click={handleFileButtonClick}>File</button>
      <button class="thin-button-left" on:click={uploadToBot}>Upload to bot</button>
    </div>
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

.camera-feed {
  display: flex;
  justify-content: center; /* Keeps the content centered */
  align-items: center; /* Aligns items vertically */
  background-color: #000; /* Black background */
  padding: 20px; /* Padding around the video feed */
  margin: 20px auto; /* Centers the container and adds margin around it */
  border: 3px solid #ddd; /* Optional border for the camera feed container */
  max-width: 820px; /* Adjust this value based on the camera feed size */
}

.camera-feed img {
  width: 100%; /* Makes the image fill the container */
  height: auto; /* Maintains the aspect ratio */
}
.title-container {
  text-align: center; /* Centers the title text */
  width: 100%; /* Ensure the container spans the full width */
}
  .title.is-1 {
  color: #ffffff; /* Sets the title color to white */
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