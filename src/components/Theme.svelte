<script>
  import { onMount } from 'svelte';
  onMount(async () => {
    const toggleSwitch = document.querySelector(
      '.theme-switch input[type="checkbox"]'
    );
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      if (currentTheme === 'dark') toggleSwitch.checked = true;
    }
    const switchTheme = (event) => {
      if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        return localStorage.setItem('theme', 'dark');
      }
      document.documentElement.setAttribute('data-theme', 'light');
      return localStorage.setItem('theme', 'light');
    };
    toggleSwitch.addEventListener('change', switchTheme, false);
  });
</script>

<style lang="scss">
  .theme-switch {
    display: flex;
    align-items: center;
    // flex-grow: 1;
    // justify-content: flex-end;

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
  <label class="theme-switch__label" for="checkbox">
    <input class="theme-switch__input" type="checkbox" id="checkbox" />
    <div class="theme-switch__slider" />
  </label>
</div>
