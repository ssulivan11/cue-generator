<script lang="ts">
  import { Router, Route } from 'svelte-navigator';
  import CueGenerator from './containers/CueGenerator.svelte';
  import TracklistDuration from './containers/TracklistDuration.svelte';
  import About from './containers/About.svelte';
  import Navigation from './containers/Navigation.svelte';

</script>

<Router>
  <Navigation />

  <Route path="/">
    <CueGenerator />
  </Route>

  <Route path="tracklist-duration">
    <TracklistDuration />
  </Route>

  <Route path="about">
    <About />
  </Route>
</Router>
