import { screen, fireEvent } from '@testing-library/svelte';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App.svelte';

describe('Main page', () => {
  /**
   * TODO:
   * - add track times with missing starting 0s
   * - bad track time positions
   * - incorrect characters, NaN
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

  test('should show time error conditions', async () => {
    const { getByRole, getByTestId, debug } = renderWithRouter(App);
    
    await fireEvent.click(getByTestId('clear-button'));

    await fireEvent.change(getByTestId("tracklist-input"), {
      target: { value: "1:00 one\n2:00 two\n1:30 three" }
    });
    
    await fireEvent.keyUp(getByTestId("tracklist-input"), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });

    expect(getByTestId("tracklist-input").value).toContain("1:00");
  });
});
