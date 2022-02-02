import { screen, fireEvent } from '@testing-library/svelte';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App.svelte';

describe('About page', () => {
  test('should route and change html', async () => {
    const { getByRole, getByTestId } = renderWithRouter(App);

    await fireEvent.click(getByTestId('about-link'));

    expect(getByRole('heading', { level: 1 }).innerHTML).toBe('☕ About');
  });
});
