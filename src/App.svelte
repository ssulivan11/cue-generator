<script>
  import { Router, Route, Link } from 'svelte-navigator';
  import ThemeToggle from './components/Theme.svelte';
  import CueGenerator from './components/CueGenerator.svelte';
  import TracklistDuration from './components/TracklistDuration.svelte';
</script>

<style lang="scss">
  header {
    width: 100%;
    position: fixed;
    padding: 10px 0;
  }
  .header {
    margin: 0 auto;
    max-width: 950px;
    padding: 0 40px;
    display: flex;
    justify-content: flex-end;
  }

  :global(.header__link) {
    padding: 10px 15px;
  }
</style>

<Router>
  <header>
    <div class="header">
      <nav>
        <Link class="header__link" to="/">Cue Generator</Link>
        <Link class="header__link" to="tracklist-duration">
          Tracklist Duration
        </Link>
      </nav>
      <ThemeToggle />
    </div>
  </header>

  <Route path="/">
    <CueGenerator />
  </Route>

  <Route path="tracklist-duration">
    <TracklistDuration />
  </Route>
</Router>
