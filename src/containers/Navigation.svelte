<script lang="ts">
  import { Link } from 'svelte-navigator';
  import ThemeToggle from './Theme.svelte';

</script>

<style lang="scss">
  nav {
    display: flex;
    align-items: center;
  }
  header {
    width: 100%;
    position: fixed;
    padding: 10px 0;
  }
  .header {
    margin: 0 auto;
    max-width: 950px;
    padding: 0 25px;
    display: flex;
    justify-content: flex-end;

    &__github {
      height: 21px;
      width: 21px;
      margin-right: 10px;
      border-radius: 100%;
      overflow: hidden;
      display: flex;
      opacity: 0.6;
      transition: opacity 0.1s ease-in;

      &:focus,
      &:hover {
        outline: none;
        opacity: 1;
        cursor: pointer;
      }
    }
  }

  :global(.header__link) {
    padding: 4px 10px;
    font-weight: bold;
    border-radius: 3px;
    background-color: var(--primary-color);
    color: var(--bg-color);
    font-size: 10px;
    margin-right: 10px;
    text-decoration: none;
    opacity: 0.6;
    transition: opacity 0.1s ease-in;

    &:focus,
    &:hover {
      outline: none;
      opacity: 1;
      cursor: pointer;
    }
  }

  :global([aria-current]:not([aria-current='false'])) {
    background-color: var(--secondary-color);
    opacity: 1;
    cursor: default;
  }

</style>

<header>
  <div class="header">
    <nav>
      <Link class="header__link" to="/" data-testid="cue-generator-link">
        Cue Generator
      </Link>
      <Link
        class="header__link"
        to="tracklist-duration"
        data-testid="tracklist-duration-link">
        Tracklist Duration
      </Link>
      <Link class="header__link" to="about" data-testid="about-link">
        About
      </Link>
      <a
        href="https://github.com/ssulivan11/cue-generator"
        class="header__github"
        target="_blank">
        <img
          alt="github"
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
      </a>
    </nav>
    <ThemeToggle />
  </div>
</header>
