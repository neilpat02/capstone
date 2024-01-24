<script>
	import Footer from "./widget/Footer.svelte";
	import Navi from "./widget/Navi.svelte";
  let mazeText = "Placeholder for Maze Simulator";
  let editorText = "Placeholder for Text Editor";


</script>

<Navi/>
<div class="container is-flex is-justify-content-center is-align-items-center is-square">
  <section class="section">
    <div class="has-text-centered">
      <h1 class="title is-1">Maze Simulator</h1>
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
  </section>
</div>

<div class="container is-flex is-justify-content-left is-align-items-center is-button-container">
  <div class="button">UPLOAD</div>
</div>
<Footer/>

<style>
  .is-square {
    height: 70vh;
    background-color: lightgray;
    margin-top: 2rem;
  }

  .is-button-container{
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
     background-color:#B71234;
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
</style>
