<script lang="ts">
  /* global document, localStorage */
  import { onMount } from 'svelte';

  const switchTheme = (event: Event) => {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      return localStorage.setItem('theme', 'dark');
    }
    document.documentElement.setAttribute('data-theme', 'light');
    return localStorage.setItem('theme', 'light');
  };

  onMount(async () => {
    const toggleSwitch = document.querySelector(
      '.theme-switch input[id="theme-checkbox"]'
    ) as HTMLInputElement;
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      if (currentTheme === 'dark') toggleSwitch.checked = true;
    }
  });

</script>

<style lang="scss">
  .theme-switch {
    display: flex;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.1s ease-in;

    &:focus,
    &:hover {
      outline: none;
      opacity: 1;
      cursor: pointer;
    }

    &__label {
      display: inline-block;
      height: 24px;
      position: relative;
      width: 40px;
    }
    &__input {
      display: none;

      &:checked + .theme-switch__slider {
        background-color: #eee;
      }
      &:checked + .theme-switch__slider:before {
        transform: translateX(16px);
        background-color: #333;
      }
    }
    &__slider {
      background-color: #333;
      bottom: 0;
      cursor: pointer;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      transition: 0.4s;
      border-radius: 24px;
    }
    &__slider:before {
      background-color: #eee;
      bottom: 4px;
      content: '';
      height: 16px;
      left: 4px;
      position: absolute;
      transition: 0.4s;
      width: 16px;
      border-radius: 50%;
    }
  }

</style>

<div class="theme-switch">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <label
    class="theme-switch__label"
    for="theme-checkbox"
    on:click={() => {
      switchTheme;
    }}
    on:keypress={() => {
      switchTheme;
    }}
  >
    <input
      class="theme-switch__input"
      type="checkbox"
      id="theme-checkbox"
      on:change={(event) => switchTheme(event)}
      data-testid="theme-checkbox"
    />
    <div class="theme-switch__slider" data-testid="theme-slider" />
  </label>
</div>
