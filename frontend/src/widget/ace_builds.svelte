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
      editor.setValue(value);
  
      editor.session.on('change', () => {
        value = editor.getValue();
      });
    });
  
    $: if (editor && value !== editor.getValue()) {
  editor.setValue(value);
    }

  </script>
  
  <div bind:this={container} class="editor-container"></div>
  
  <style>
    .editor-container {
      width: 100%;
      height: 300px;
    }
  </style>
  