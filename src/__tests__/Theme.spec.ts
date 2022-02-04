import { fireEvent } from '@testing-library/svelte';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App.svelte';

describe('About page', () => {
  const localStorageMock = () => {
    return {
      getItem: () => {
        return 'dark';
      },
      setItem: () => {
        return 'light';
      }
    };
  };

  Object.defineProperty(window, 'localStorage', { value: localStorageMock() });

  test('should route and change html', async () => {
    const { getByTestId } = renderWithRouter(App);
    const checkbox = getByTestId('theme-checkbox');

    expect(checkbox.checked).toEqual(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await fireEvent.click(checkbox);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(checkbox.checked).toEqual(false);
  });
});
