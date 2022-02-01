import { render, screen, fireEvent } from '@testing-library/svelte';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App.svelte';
import { debug } from 'svelte/internal';

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return { default: moment };
});

describe('Main App route', () => {
  /**
   * TODO:
   * - add track times with missing starting 0s
   * - bad track time positions
   * - incorrect characeters, NaN
   */
  test('should show default route and interactions', async () => {
    const { getByRole, getByTestId, debug } = renderWithRouter(App);
    expect(getByRole('heading', { level: 1 }).innerHTML).toBe(
      '💿 Cue Generator'
    );

    await fireEvent.click(getByTestId('demo-button'));

    [
      'PERFORMER "Pink Floyd"',
      'PERFORMER "Pink Floyd"',
      'TITLE "The Dark Side of the Moon"',
      'TITLE "Breathe"',
      'INDEX 01 01:08:00'
    ].forEach((containMatch) =>
      expect(screen.getByTestId('output').innerHTML).toContain(containMatch)
    );

    const testVals = {
      artist: {
        input: 'artist-input',
        value: 'King Geedorah'
      },
      album: {
        input: 'album-input',
        value: 'Take Me to Your Leader'
      }
    };
    const { artist, album } = testVals;

    await fireEvent.change(getByTestId(artist.input), {
      target: { value: artist.value }
    });
    await fireEvent.keyUp(getByTestId(artist.input), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });
    expect(getByTestId(artist.input).value).toBe(artist.value);

    await fireEvent.change(getByTestId(album.input), {
      target: { value: album.value }
    });
    await fireEvent.keyUp(getByTestId(album.input), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });
    expect(getByTestId(album.input).value).toBe(album.value);
  });
});

describe('Tracklist Duration route', () => {
  test('should route and change html', async () => {
    const { getByRole, getByTestId, debug } = renderWithRouter(App);

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

describe('About route', () => {
  test('should route and change html', async () => {
    const { getByRole, getByTestId } = renderWithRouter(App);

    await fireEvent.click(getByTestId('about-link'));

    expect(getByRole('heading', { level: 1 }).innerHTML).toBe('☕ About');
  });
});
