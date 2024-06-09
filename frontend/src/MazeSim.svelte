<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  import { userEmail, userToken } from './userStore.js';
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
  let p5Sketch = null;
  let score = 0; // Initialize score

  async function uploadToBot() {
    alert("Code to upload:\n" + editorText);
    try {
      const response = await fetch("http://localhost:3000/api/upload-to-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userCurrentEmail, // Use the user's email to identify the team
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update timestamp");
      }

      const result = await response.json();
      console.log(result.message);
      alert("Upload to bot initiated and timestamp updated successfully.");
    } catch (error) {
      console.error("Error uploading to the bot:", error);
      alert("Error in uploading to the bot. Please try again.");
    }

    try {
      const flaskResponse = await fetch("http://localhost:5001/upload_to_bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm_code: editorText,
          serializedMaze: serializedMaze,
        }),
      });

      if (!flaskResponse.ok) {
        throw new Error("Failed to send code to Flask backend");
      }

      const flaskResult = await flaskResponse.json();
      console.log("Code sent to Flask backend:", flaskResult);
      alert("Code uploaded to bot successfully.");
    } catch (flaskError) {
      console.error("Error sending code to Flask backend:", flaskError);
      alert("Failed to upload code to bot. Please try again.");
    }
  }

  function generateMaze(cols, rows) {
    let grid = [];
    let robotPositions = [];

    while (robotPositions.length < 4) {
      let i = Math.floor(Math.random() * cols);
      let j = Math.floor(Math.random() * rows);
      let posKey = `${i}-${j}`;

      if (!robotPositions.includes(posKey)) {
        robotPositions.push(posKey);
      }
    }

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let cell = new Cell(i, j, cols, rows, grid);
        cell.robots = [
          { id: 1, isHere: robotPositions[0] === `${i}-${j}`, visited: robotPositions[0] === `${i}-${j}`, direction: null },
          { id: 2, isHere: robotPositions[1] === `${i}-${j}`, visited: robotPositions[1] === `${i}-${j}`, direction: null },
          { id: 3, isHere: robotPositions[2] === `${i}-${j}`, visited: robotPositions[2] === `${i}-${j}`, direction: null },
          { id: 4, isHere: robotPositions[3] === `${i}-${j}`, visited: robotPositions[3] === `${i}-${j}`, direction: null },
        ];
        grid.push(cell);
      }
    }

    let current = grid[0];
    current.visited = true;

    let stack = [];
    do {
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

    return grid.map((cell) => ({
      i: cell.i,
      j: cell.j,
      walls: cell.walls,
      robots: cell.robots.map((robot) => ({
        ...robot,
        direction: robot.isHere
          ? robot.id === 1
            ? "S"
            : robot.id === 2
              ? "N"
              : robot.id === 3
                ? "E"
                : "W"
          : null,
      })),
    }));
  }

  class Cell {
    constructor(i, j, cols, rows, grid) {
      this.i = i;
      this.j = j;
      this.walls = [true, true, true, true];
      this.visited = false;
      this.cols = cols;
      this.rows = rows;
      this.grid = grid;
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
      const wid = 30;
      const cols = 16;
      const rows = 16;

      p.setup = () => {
        p.createCanvas(cols * wid, rows * wid);
        p.noLoop();
      };

      p.draw = () => {
        p.background(255);

        serializedMaze.forEach((cellData) => {
          const x = cellData.i * wid;
          const y = cellData.j * wid;

          cellData.robots.forEach((robot) => {
            if (robot.visited) {
              let fillColor = "rgba(200, 200, 200, 100)";
              switch (robot.id) {
                case 1:
                  fillColor = "rgba(255, 102, 102, 100)";
                  break;
                case 2:
                  fillColor = "rgba(102, 204, 255, 100)";
                  break;
                case 3:
                  fillColor = "rgba(153, 255, 153, 100)";
                  break;
                case 4:
                  fillColor = "rgba(171, 141, 237, 100)";
                  break;
              }
              p.fill(fillColor);
              p.noStroke();
              p.rect(x, y, wid, wid);
            }
          });
        });

        serializedMaze.forEach((cellData) => {
          const x = cellData.i * wid;
          const y = cellData.j * wid;

          p.stroke(0);
          if (cellData.walls[0]) p.line(x, y, x + wid, y);
          if (cellData.walls[1]) p.line(x + wid, y, x + wid, y + wid);
          if (cellData.walls[2]) p.line(x + wid, y + wid, x, y + wid);
          if (cellData.walls[3]) p.line(x, y + wid, x, y);

          cellData.robots.forEach((robot) => {
            if (robot.isHere) {
              let fillColor = "rgba(200, 200, 200, 255)";
              switch (robot.id) {
                case 1:
                  fillColor = "rgba(200, 100, 0, 255)";
                  break;
                case 2:
                  fillColor = "rgba(0, 100, 200, 255)";
                  break;
                case 3:
                  fillColor = "rgba(100, 200, 0, 255)";
                  break;
                case 4:
                  fillColor = "rgba(108, 0, 255, 255)";
                  break;
              }
              p.fill(fillColor);
              p.ellipse(x + wid / 2, y + wid / 2, wid / 2, wid / 2);

              let lineEndX = x + wid / 2;
              let lineEndY = y + wid / 2;
              const directionLineLength = wid / 4;
              if (robot.direction) {
                switch (robot.direction) {
                  case "N":
                    lineEndY -= directionLineLength;
                    break;
                  case "E":
                    lineEndX += directionLineLength;
                    break;
                  case "S":
                    lineEndY += directionLineLength;
                    break;
                  case "W":
                    lineEndX -= directionLineLength;
                    break;
                }
                p.stroke(255);
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

  onMount(() => {
    socket.on('update_maze', (data) => {
      console.log('Received updated maze:', data);
      serializedMaze = data.updatedMaze;
      drawSerializedMaze();
    });

    socket.on('update_score', (data) => {
      score = data.score;
      console.log('Score updated:', score);
    });

    serializedMaze = generateMaze(16, 16);
    drawSerializedMaze();
  });
  
  onDestroy(() => {
    if (p5Sketch) {
      p5Sketch.remove();
    }
    socket.off('update_maze');
    socket.off('update_score');
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
      const response = await fetch('http://localhost:3000/api/save-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$userToken}`
        },
        body: JSON.stringify({
          userEmail: userCurrentEmail,
          fileName,
          content: editorText,
        }),
      });

      if (response.ok) {
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
    navigator.clipboard.writeText(JSON.stringify(serializedMaze, null, 2));
    alert(JSON.stringify(serializedMaze));
  }

  function toggleSection() {
    showSoftware = !showSoftware;
    if (showSoftware) {
      drawSerializedMaze();
    }
  }

  async function fetchSavedFiles() {
    const response = await fetch(
      `http://localhost:3000/api/get-texts?userEmail=${$userEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$userToken}`,
        },
      }
    );

    if (response.ok) {
      savedFiles = await response.json();
      console.log(savedFiles);
    } else {
      alert("Failed to fetch files.");
    }
  }

  async function loadFileContent(event) {
    const selectedFileName = event.target.value;
    const selectedFile = savedFiles.find(
      (file) => file.fileName === selectedFileName
    );
    if (selectedFile) {
      try {
        await navigator.clipboard.writeText(selectedFile.content);
        console.log("File content copied to clipboard.");
        alert("File content copied to clipboard.");
      } catch (error) {
        console.error("Could not copy text to clipboard", error);
        alert("Failed to copy file content to clipboard.");
      }
    } else {
      console.error("Selected file content not found");
    }
  }

  async function runSimulation() {
    const algorithmCode = editorText;
    const serializedMazeSent = serializedMaze;
    try {
      const response = await fetch("http://localhost:5001/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.log("Simulation result:", data);
    } catch (error) {
      console.error("Error running simulation:", error);
    }
  }

  async function handleRunButtonClick() {
    try {
      const serializedData = JSON.stringify(serializedMaze, null, 2);
      await navigator.clipboard.writeText(serializedData);
      alert("Serialized maze data has been copied to clipboard.");
    } catch (error) {
      console.error("Error copying serialized maze data to clipboard:", error);
      alert("Failed to copy serialized maze data to clipboard.");
    }
  }

  async function stopSimulation() {
    console.log(`Stopping simulation for user: ${$userEmail}`);
    alert(`Stopping simulation for user: ${$userEmail}`);

    try {
      const resetResponse = await fetch("http://localhost:5001/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resetResponse.ok) {
        throw new Error(`Reset failed with status: ${resetResponse.status}`);
      }

      const resetData = await resetResponse.json();
      console.log("Reset response:", resetData.message);

      const updateScoreResponse = await fetch(
        "http://localhost:3000/api/update-software-score",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: $userEmail,
            newScore: score,
          }),
        }
      );

      if (!updateScoreResponse.ok) {
        throw new Error(
          `Score update failed with status: ${updateScoreResponse.status}`
        );
      }

      const updateScoreData = await updateScoreResponse.json();
      console.log("Score update response:", updateScoreData);
      alert(
        `Score updated successfully. New Score: ${updateScoreData.softwareScore}`
      );
    } catch (error) {
      console.error("Error during simulation stop:", error);
      alert(`Failed to stop simulation or update score: ${error.message}`);
    }
  }

  async function resetSimulation() {
    score = 0;
    serializedMaze = generateMaze(16, 16);
    drawSerializedMaze();
  }

  onMount(fetchSavedFiles); // Fetch saved files when component mounts

</script>

<Navi/>
<div class="loggin">
  Logged in as: {$userEmail}
</div>

<div class="button-container-top">
  <button class="thin-button-top" on:click={toggleSection}>Software</button>
  <button class="thin-button-top" on:click={toggleSection}>Hardware</button>
</div>
{#if showSoftware}
  <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-square" id="software-section">
    <div class="has-text-centered">
      <h1 class="title is-1"style="padding:20px">Maze Simulator</h1>
    </div>
    <div class="score-container">
      <h2>Score: {score}</h2>
    </div>
    <div class="is-flex is-justify-content-space-between" style="flex: 1; width: 100%;">
      <div style="flex: 1;">
        <div bind:this={mazeContainer} class="maze-container"></div>
      </div>
      <div style="flex: 2;">
        <div class="content">
          <select on:change="{loadFileContent}" class="file-dropdown">
            <option value="">Select a file...</option>
            {#each savedFiles as file}
              <option value="{file.fileName}">{file.fileName}</option>
            {/each}
          </select>
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
            <button class="thin-button" on:click={runSimulation}>Run</button>
            <button class="thin-button" on:click={stopSimulation}>Stop</button>
            <button class="thin-button" on:click={resetSimulation}>Reset</button>
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
    <div class="button-container">
      <button class="thin-button" on:click={promptForFileName}>Save</button>
      <button class="thin-button-left" on:click={uploadToBot}>Upload to bot</button>
    </div>
  </div>
{/if}

<div class="content has-text-centered">
  <p style="color: white; padding: 50px;">
    UGA Maze Competition Official Site
  </p>
</div>

<style>
  .button-container-top {
    display: flex;
    width: calc(100% - 4rem);
    margin: 0 2rem;
  }

  .loggin {
    display: flex;
    width: calc(100% - 4rem);
    margin: 0 2rem;
    background-color: #B71234;
    border: #000 1px solid;
  }

  .thin-button-top {
    flex: 1;
    margin: 0;
    padding: 5px 10px;
    border: none;
    background-color: #B71234;
    color: #fff;
    cursor: pointer;
    border: #000 1px solid;
  }

  .button-container {
    display: flex;
    margin-left: 2rem;
  }

  .thin-button {
    margin: 0;
    padding: 5px 10px;
    border: none;
    background-color: #B71234;
    color: #fff;
    cursor: pointer;
  }

  .is-square {
    height: 100vh;
    background-color: lightgray;
    width: calc(100% - 4rem);
    margin: 0 2rem;
    border: #000 1px solid;
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

  .file-name-input {
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.5s ease-out;
  }

  .file-name-input input[type="text"] {
    padding: 8px 10px;
    border: 2px solid #B71234;
    border-radius: 4px;
    transition: border-color 0.3s;
    outline: none;
  }

  .file-name-input input[type="text"]:focus {
    border-color: #ff6363;
  }

  .file-name-input button {
    padding: 8px 15px;
    background-color: #B71234;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .file-name-input button:hover {
    background-color: #ff6363;
    transform: translateY(-2px);
  }

  .file-name-input button:active {
    transform: translateY(1px);
  }

  .file-dropdown {
    appearance: none;
    width: 100%;
    padding: 8px 12px;
    background-color: #f2f2f2;
    border: 2px solid #B71234;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s, border-color 0.3s;
  }

  .file-dropdown:hover {
    background-color: #e6e6e6;
  }

  .file-dropdown:focus {
    border-color: #ff6363;
  }

  .file-dropdown:active {
    background-color: #cccccc;
  }

  .thin-button-left {
    margin: 0;
    padding: 10px 20px;
    border: none;
    background-color: #B71234;
    color: white;
    cursor: pointer;
  }

  .thin-button-left:hover {
    background-color:gray;
  }

  .thin-button-left:active {
    transform: translateY(2px);
  }

  .camera-feed {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    padding: 20px;
    margin: 20px auto;
    border: 3px solid #ddd;
    max-width: 820px;
  }

  .camera-feed img {
    width: 100%;
    height: auto;
  }

  .title-container {
    text-align: center;
    width: 100%;
  }

  .title.is-1 {
    color: #ffffff;
  }

  .score-container {
    position:static;
    top: 10px;
    right: 10px;
    background-color: #010000;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 100;
  }

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
