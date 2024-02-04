<script>
  import { onMount } from 'svelte';
  import ace from 'ace-builds/src-noconflict/ace';
  import 'ace-builds/src-noconflict/theme-monokai';
  import 'ace-builds/src-noconflict/mode-python';

  export let value = '';

  let editor;
  let container;

  onMount(() => {
    editor = ace.edit(container);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.setValue(value, 1); // Set value without moving cursor

    editor.session.on('change', () => {
      value = editor.getValue();
    });
  });

  // This ensures the editor updates its size when the value changes
  $: if(editor) {
    editor.resize();
  }
</script>

<!-- Ensure the container has a specific height and width -->
<div bind:this={container} class="editor-container"></div>

<style>
  .editor-container {
    height: 300px; /* Set a specific height */
    width: 100%; /* Use the full width of its parent */
  }
</style>
