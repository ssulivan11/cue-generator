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
    const { getByRole, getByTestId } = renderWithRouter(App);
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
      },
      filename: {
        input: 'filename-input',
        value: 'King Geedorah - Take Me to Your Leader'
      }
    };
    const { artist, album, filename } = testVals;

    await fireEvent.change(getByTestId(artist.input), {});
    await fireEvent.input(getByTestId(artist.input), {
      target: { value: artist.value }
    });
    await fireEvent.keyUp(getByTestId(artist.input), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });
    expect(getByTestId(artist.input).value).toBe(artist.value);

    await fireEvent.change(getByTestId(album.input), {});
    await fireEvent.input(getByTestId(album.input), {
      target: { value: album.value }
    });
    await fireEvent.keyUp(getByTestId(album.input), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });
    expect(getByTestId(album.input).value).toBe(album.value);

    await fireEvent.change(getByTestId(filename.input), {});
    await fireEvent.input(getByTestId(filename.input), {
      target: { value: filename.value }
    });
    await fireEvent.keyUp(getByTestId(filename.input), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });
    expect(getByTestId(filename.input).value).toBe(filename.value);
  });

  test('should show time error conditions', async () => {
    const { getByTestId } = renderWithRouter(App);

    // valid
    await fireEvent.click(getByTestId('clear-button'));
    await fireEvent.click(getByTestId('demo-button'));
    expect(getByTestId('tracklist-input').getAttribute('class').length).toBe(
      14
    );

    // invalid
    await fireEvent.change(getByTestId('tracklist-input'), {});
    await fireEvent.input(getByTestId('tracklist-input'), {
      target: { value: '1:00 one\n2:00 two\n1:30 three' }
    });
    expect(getByTestId('tracklist-input').getAttribute('class')).toContain(
      'invalid'
    );
    expect(getByTestId('tracklist-input').getAttribute('class').length).toBe(
      22
    );
  });

  test('should show validation error conditions', async () => {
    const { getByTestId } = renderWithRouter(App);

    // valid
    await fireEvent.click(getByTestId('clear-button'));
    await fireEvent.click(getByTestId('demo-button'));
    expect(getByTestId('tracklist-input').getAttribute('class').length).toBe(
      14
    );

    // invalid
    await fireEvent.change(getByTestId('tracklist-input'), {});
    await fireEvent.input(getByTestId('tracklist-input'), {
      target: { value: '1:00 one\n2:00:: two\n1:30 three' }
    });
    expect(getByTestId('tracklist-input').getAttribute('class')).toContain(
      'invalid'
    );
    expect(getByTestId('tracklist-input').getAttribute('class').length).toBe(
      22
    );
  });

  test('should show default route and interactions', async () => {
    const { getByTestId } = renderWithRouter(App);

    await fireEvent.click(getByTestId('clear-button'));
    await fireEvent.click(getByTestId('demo-button'));

    await fireEvent.change(getByTestId('add-end-track-checkbox'));
    await fireEvent.change(getByTestId('auto-file-name-checkbox'));
    expect(getByTestId('filename-input').value).toBe(
      'The Dark Side of the Moon Full Album 1973'
    );

    await fireEvent.change(getByTestId('auto-file-name-checkbox'));

    await fireEvent.change(getByTestId('filename-input'), {});
    await fireEvent.input(getByTestId('filename-input'), {
      target: { value: 'The Dark Side of the Moon' }
    });

    expect(getByTestId('filename-input').value).toBe(
      'The Dark Side of the Moon'
    );

    expect(getByTestId('output').innerHTML).toContain('TITLE "EOF"');
    expect(getByTestId('output').innerHTML).toContain('INDEX 01 9999:59:59');
  });
});
