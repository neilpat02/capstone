<script>
  import Footer from "./widget/Footer.svelte";
  import Navi from "./widget/Navi.svelte";
  import AceEditor from "./widget/ace_builds.svelte";

  let editorText = "";
</script>

<Navi/>
<!-- Your other content -->
<AceEditor bind:value={editorText} />
<Footer/>
