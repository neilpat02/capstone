<script>
  import Navi from "./widget/Navi.svelte";
  import Footer from "./widget/Footer.svelte";
  import AceEditor from "./widget/ace_builds.svelte";
  import { userEmail } from './userStore.js';
  import { onDestroy, onMount } from 'svelte';
  import p5 from 'p5';

  let showSoftware = true;
  let mazeContainer;
  let editorText = "";
  let fileName = "";
  let isSaving = false;
  var serializedMaze = []; // Use reactive to watch changes
  $: userCurrentEmail = $userEmail;

  let robotRow = 0;
  let robotCol = 0;

  let p5Sketch = null;

  // Example function to fetch or simulate initial serializedMaze data
  async function fetchSerializedMaze() {
    // Simulated fetch request
    serializedMaze = [
      {"i":0,"j":0,"walls":[true,false,true,true],"isRobotHere":true,"robotVisited":true},
      {"i":1,"j":0,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":0,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":0,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":0,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":0,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":0,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":0,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":0,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":0,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":0,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":0,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":0,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":0,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":0,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":0,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":1,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":1,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":1,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":1,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":1,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":1,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":1,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":1,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":1,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":1,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":1,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":1,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":1,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":1,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":1,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":1,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":2,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":2,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":2,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":2,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":2,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":2,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":2,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":2,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":2,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":2,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":2,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":2,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":2,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":2,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":2,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":2,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":3,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":3,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":3,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":3,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":3,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":3,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":3,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":3,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":3,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":3,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":3,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":3,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":3,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":3,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":3,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":3,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":4,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":4,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":4,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":4,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":4,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":4,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":4,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":4,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":4,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":4,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":4,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":4,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":4,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":4,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":4,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":4,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":5,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":5,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":5,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":5,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":5,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":5,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":5,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":5,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":5,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":5,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":5,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":5,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":5,"walls":[false,true,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":5,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":5,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":5,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":6,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":6,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":6,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":6,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":6,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":6,"walls":[false,true,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":6,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":6,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":6,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":6,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":6,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":6,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":6,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":6,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":6,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":6,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":7,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":7,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":7,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":7,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":7,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":7,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":7,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":7,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":7,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":7,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":7,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":7,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":7,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":7,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":7,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":7,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":8,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":8,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":8,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":8,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":8,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":8,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":8,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":8,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":8,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":8,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":8,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":8,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":8,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":8,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":8,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":8,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":9,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":9,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":9,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":9,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":9,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":9,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":9,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":9,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":9,"walls":[false,true,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":9,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":9,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":9,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":9,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":9,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":9,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":9,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":10,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":10,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":10,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":10,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":10,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":10,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":10,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":10,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":10,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":10,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":10,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":10,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":10,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":10,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":10,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":10,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":11,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":11,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":11,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":11,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":11,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":11,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":11,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":11,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":11,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":11,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":11,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":11,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":11,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":11,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":11,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":11,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":12,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":12,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":12,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":12,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":12,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":12,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":12,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":12,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":12,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":12,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":12,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":12,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":12,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":12,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":12,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":12,"walls":[true,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":13,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":13,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":13,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":13,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":13,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":13,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":13,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":13,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":13,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":13,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":13,"walls":[true,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":13,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":13,"walls":[false,true,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":13,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":13,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":13,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":14,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":14,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":14,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":14,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":14,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":14,"walls":[true,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":14,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":14,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":14,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":14,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":14,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":14,"walls":[false,false,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":14,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":14,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":14,"walls":[false,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":14,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":0,"j":15,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":1,"j":15,"walls":[true,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":2,"j":15,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":3,"j":15,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":4,"j":15,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":5,"j":15,"walls":[true,false,true,true],"isRobotHere":false,"robotVisited":false},
      {"i":6,"j":15,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":7,"j":15,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":8,"j":15,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":9,"j":15,"walls":[false,true,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":10,"j":15,"walls":[true,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":11,"j":15,"walls":[true,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":12,"j":15,"walls":[false,false,false,false],"isRobotHere":false,"robotVisited":false},
      {"i":13,"j":15,"walls":[false,true,true,false],"isRobotHere":false,"robotVisited":false},
      {"i":14,"j":15,"walls":[false,false,false,true],"isRobotHere":false,"robotVisited":false},
      {"i":15,"j":15,"walls":[false,true,false,true],"isRobotHere":false,"robotVisited":false}
    ];
    drawSerializedMaze(serializedMaze);
  }

  function drawSerializedMaze(serializedData) {
    if (p5Sketch) {
      p5Sketch.remove();
    }

    p5Sketch = new p5((p) => {
      const wid = 25;
      const cols = 16; // Assuming a 16x16 maze for simplicity
      const rows = 16;
      
      p.setup = () => {
        p.createCanvas(cols * wid, rows * wid);
        p.frameRate(30);

        serializedData.forEach(cellData => {
          let cell = new Cell(cellData.i, cellData.j, p, wid, cellData);
          // Assuming Cell function is adapted to draw based on cellData
        });
      };

      p.draw = () => {
        p.background(255);
        // Draw each cell based on the updated serializedMaze data
        serializedMaze.forEach(cellData => {
          let cell = new Cell(cellData.i, cellData.j, p, wid, cellData);
          cell.show();
        });
      };
    }, mazeContainer);
  }

  // Modified Cell function to accept and draw based on serialized data
  function Cell(i, j, p, wid, cellData) {
  const x = i * wid;
  const y = j * wid;
  
  // Draw walls based on the cell's data
  p.stroke(0); // Set stroke color for walls
  if (cellData.walls[0]) p.line(x, y, x + wid, y); // Top wall
  if (cellData.walls[1]) p.line(x + wid, y, x + wid, y + wid); // Right wall
  if (cellData.walls[2]) p.line(x + wid, y + wid, x, y + wid); // Bottom wall
  if (cellData.walls[3]) p.line(x, y + wid, x, y); // Left wall

  // Fill color based on robotVisited and isRobotHere properties
  if (cellData.isRobotHere) {
    p.fill(255, 0, 0); // Red for the robot's current position
    p.ellipse(x + wid / 2, y + wid / 2, wid / 2, wid / 2);
  } else if (cellData.robotVisited) {
    p.fill(0, 0, 255, 100); // Blue with some transparency for visited
    p.rect(x, y, wid, wid);
  }

  this.show = function() {
    // Drawing logic has been moved outside show function
    // because we draw immediately when creating the Cell instance.
  };
}

  onMount(() => {
    fetchSerializedMaze();
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
            <button class="thin-button">File</button>
            <button class="thin-button" on:click={displaySerializedMaze}>Run</button>
          </div>
        {/if}
      </div>
    </div>
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
    border: #B71234 5px solid;
    box-sizing: border-box;
    margin: 0 2rem 0 2rem;
  }
</style>
