import { fireEvent } from '@testing-library/svelte';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App.svelte';

describe('Tracklist Duration page', () => {
  test('should route and change html', async () => {
    const { getByRole, getByTestId } = renderWithRouter(App);

    await fireEvent.click(getByTestId('tracklist-duration-link'));

    expect(getByRole('heading', { level: 1 }).innerHTML).toBe(
      '⌛ Tracklist Duration'
    );

    await fireEvent.click(getByTestId('demo-button'));
    //input track time length
    expect(getByTestId('track-name-and-times-input').value).toContain(
      'The Great Gig In The Sky 04:47'
    );
    //output track position in album
    expect(getByTestId('track-name-and-times-output').value).toContain(
      '14:32 - The Great Gig In The Sky'
    );
  });
});
