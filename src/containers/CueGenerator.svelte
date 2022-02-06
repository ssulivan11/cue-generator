<script lang="ts">
  /* global document, localStorage */
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  onMount(async () => {
    setDefaults();
    return updateFileName();
  });

  let validTrackListTime = true;
  let validTrackNumbers = true;

  const cue_store = writable(
    localStorage.cue_store ? JSON.parse(localStorage.cue_store) : {}
  );
  cue_store.subscribe((val) =>
    localStorage.setItem('cue_store', JSON.stringify(val))
  );

  let trackOutput = '';
  const setDefaults = () => {
    if (typeof $cue_store.isAutoFileName === 'undefined') {
      $cue_store.isAutoFileName = true;
    }
    if (typeof $cue_store.addEndTrack === 'undefined') {
      $cue_store.addEndTrack = true;
    }
    if (typeof $cue_store.trimStart === 'undefined') {
      $cue_store.trimStart = 0;
    }
    if (typeof $cue_store.trimEnd === 'undefined') {
      $cue_store.trimEnd = 0;
    }
  };

  marked.setOptions({
    breaks: true
  });

  const artistUpdate = () => {
    updateTracks();
    return updateFileName();
  };

  const updateFileName = () => {
    updateTracks();
    if ($cue_store.isAutoFileName && $cue_store.artist && $cue_store.album) {
      $cue_store.fileName = `${$cue_store.artist || ''} - ${
        $cue_store.album || ''
      }`;
    }
  };

  const updateTracks = () => {
    trackOutput = '';
    const htmlTracks = marked.parse($cue_store.tracks);
    const cleanedUpTracks = htmlTracks
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
      .replace(/<ol>/g, '')
      .replace(/<\/ol>/g, '')
      .replace(/<ul>/g, '')
      .replace(/<\/ul>/g, '')
      .replace(/<li>/g, '')
      .replace(/<\/li>/g, '<br>')
      .replace(/^\s*<br\s*\/?>|<br\s*\/?>\s*$/g, '') // remove last BR
      .split('<br>');

    const insertTab = (tabs = 1) => {
      if (tabs === 2) return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
      return '&nbsp;&nbsp;&nbsp;&nbsp;';
    };

    // eslint-disable-next-line
    let trackTest: string[] = [];

    cleanedUpTracks.forEach((track: string, index: number) => {
      let trackTime: string;
      let trackTitle: string;

      const newTrack = () => {
        // if 00:00:00 (in Hour Format)
        if ((track.match(/:/g) || []).length > 1) {
          const hourTime = /\d{1,2}:\d{1,2}:\d{1,2}/g;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let trackDisplayTime: any = track && track.match(hourTime);

          // hour track time starts with 0 or not
          if (trackDisplayTime && trackDisplayTime.toString().length < 8) {
            trackDisplayTime = `0${track.match(hourTime)}:00`;
          } else {
            trackDisplayTime = `${track.match(hourTime)}:00`;
          }

          // ugly way to get hours to min in display from 1:30:15 to 90:15:00
          let minToHourDigit: number =
            trackDisplayTime && trackDisplayTime.split(':')[0] * 60;
          let minAndSec = trackDisplayTime.substring(3);
          let onlyMin = minAndSec.slice(0, -6);
          minToHourDigit = minToHourDigit + parseInt(onlyMin, 10);
          minAndSec = minAndSec && minAndSec.substring(3);

          trackTime = `${minToHourDigit}:${minAndSec}`;
          trackTitle = track.replace(hourTime, '');
        } else {
          // if 00:00 (in Min/Sec only Format)
          const minTime = /\d{1,2}:\d{1,2}/g;

          let trackDisplayTime: string | null | RegExpMatchArray =
            track.match(minTime);
          // min track time starts with 0 or not
          if (trackDisplayTime && trackDisplayTime.toString().length < 5) {
            trackDisplayTime = `0${track.match(minTime)}`;
          }

          trackTime = `${trackDisplayTime || '00:00'}:00`;
          trackTitle = track.replace(minTime, '');
        }

        trackTest.push(trackTime);

        // trim empty space from replace above
        trackTitle = trackTitle.trimStart().trimEnd();
        if ($cue_store.trimEnd > 0)
          trackTitle = trackTitle.slice(0, -$cue_store.trimEnd);
        if ($cue_store.trimStart > 0)
          trackTitle = trackTitle.substring($cue_store.trimStart);
        return trackTitle;
      };

      const trackString = `<li>${insertTab(1)}TRACK 0${
        index + 1
      } AUDIO</li><li>${insertTab(2)}PERFORMER "${
        $cue_store.artist || ''
      }"</li><li>${insertTab(2)}TITLE "${newTrack()}"</li><li>${insertTab(
        2
        //@ts-ignore: tracktime will have to be reassigned
      )}INDEX 01 ${trackTime}</li>`;
      return (trackOutput += trackString);
    });

    if ($cue_store.addEndTrack) {
      trackOutput += `<li>${insertTab(1)}TRACK 999 AUDIO</li><li>${insertTab(
        2
      )}PERFORMER "${$cue_store.artist || ''}"</li><li>${insertTab(
        2
      )}TITLE "EOF"</li><li>${insertTab(2)}INDEX 01 9999:59:59</li>`;
    }

    // validation of tracklist times and NaN issues
    const properTrackListTest = trackTest.slice().sort(
      (a: string, b: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a.replace(/:/g, '') as any) - (b.replace(/:/g, '') as any)
    );
    validTrackListTime =
      JSON.stringify(properTrackListTest) === JSON.stringify(trackTest);
    validTrackNumbers = !trackTest.includes('NaN:0');

    return trackOutput;
  };

  const downloadCueFile = () => {
    const element = document.createElement('a');
    const outputElement = document.getElementById('output') as HTMLInputElement;
    const file = new Blob([outputElement.innerText], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${$cue_store.fileName}.cue`;
    document.body.appendChild(element);
    element.click();
  };

  const changeEntries = (clear = false) => {
    $cue_store.artist = clear ? '' : 'Pink Floyd';
    $cue_store.album = clear ? '' : 'The Dark Side of the Moon';
    $cue_store.fileName = clear
      ? ''
      : 'The Dark Side of the Moon Full Album 1973';
    $cue_store.tracks = clear
      ? ''
      : `00:00 - Speak To Me\n01:08 - Breathe\n03:56 - On The Run\n07:27 - Time\n14:32 - The Great Gig In The Sky\n19:19 - Money\n25:42 - Us And Them\n33:30 - Any Colour You Like\n36:55 - Brain Damage\n40:45 - Eclipse`;
    $cue_store.trimStart = clear ? 0 : 2;
    $cue_store.trimEnd = 0;
    $cue_store.addEndTrack = true;
    $cue_store.isAutoFileName = clear;
    const tracklistId = document.getElementById('tracklist');
    tracklistId?.dispatchEvent(new Event('focus'));
    tracklistId?.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));

    if (clear) setDefaults();
  };

</script>

<style lang="scss">
  main {
    label {
      font-weight: 600;

      strong {
        color: var(--secondary-color);
      }

      button {
        float: right;
        background-color: var(--secondary-color);
        border: none;
        border-radius: 3px;
        color: var(--bg-color);
        padding: 4px 10px;
        text-align: center;
        text-decoration: none;
        font-weight: bold;
        font-size: 10px;
        cursor: pointer;
        transition: opacity 0.1s ease-in;

        &:focus,
        &:hover {
          outline: none;
          opacity: 0.6;
          cursor: pointer;
        }
      }
    }

    input,
    textarea {
      width: calc(100% - 45px);
      border: 1px solid var(--input-border);
      color: var(--primary-color);
      background-color: var(--input-color);

      &:focus {
        border: 1px solid var(--secondary-color);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    textarea {
      flex-grow: 1;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      margin: 3px 0 0;
    }

    .xs-6 {
      width: 50%;
      overflow-y: auto;
      min-height: 100%;
    }

    @media only screen and (max-width: 700px) {
      .cue-app {
        height: 100%;
        flex-direction: column;
        &__output {
          min-height: 500px;
        }
        &__toggles label:first-child input {
          width: calc(100% - 50px);
        }
        &__demo {
          margin-right: 0;
        }
      }

      textarea {
        min-height: 500px;
      }
      .xs-6 {
        min-width: 100%;
        height: 100%;
        min-height: 500px;
        padding-bottom: 30px;
      }

      input,
      textarea {
        width: calc(100% - 32px);
      }
    }
  }

  .cue-app {
    padding: 0 25px;
    height: calc(100vh - 150px);
    display: flex;

    &__entry {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    &__demo {
      margin-right: 15px;
    }

    &__checkboxes {
      display: flex;
    }

    &__checkbox {
      margin: 15px 0 0;
      padding-right: 15px;

      input {
        width: auto;
        margin-right: 5px;
        &:focus {
          outline: 1px solid var(--secondary-color);
        }
      }
    }

    &__small_error {
      color: var(--error-color);
      font-style: italic;
      float: right;
      padding-right: 15px;
    }

    &__toggles {
      margin: 0 0 5px;
      display: flex;
      input {
        margin-bottom: 0;
      }
    }

    &__output-select {
      font-size: 12px;
      padding: 15px;
      font-family: 'Courier New', Courier, monospace;
      user-select: all;
    }

    &__output {
      background-color: var(--bg-color);
      border: 1px solid var(--input-border);
      border-radius: 3px;
      margin-top: 3px;
      height: calc(100% - 30px);
      overflow-y: auto;
    }
  }

</style>

<main>
  <h1>💿 Cue Generator</h1>
  <div class="cue-app">
    <div class="xs-6">
      <div class="cue-app__entry">
        <label for="artist">
          Artist
          <strong>*</strong>
          {#if !$cue_store.artist && !$cue_store.fileName}
            <button
              class="cue-app__demo"
              on:click={() => changeEntries()}
              data-testid="demo-button"
            >
              Demo
            </button>
          {:else}
            <button
              class="cue-app__demo"
              on:click={() => changeEntries(true)}
              data-testid="clear-button"
            >
              Clear
            </button>
          {/if}
          <input
            id="artist"
            data-testid="artist-input"
            bind:value={$cue_store.artist}
            on:keyup={() => artistUpdate()}
          />
        </label>

        <label for="album">
          Album
          <strong>*</strong>
          <input
            id="album"
            data-testid="album-input"
            bind:value={$cue_store.album}
            on:keyup={() => updateFileName()}
          />
        </label>

        <label for="filename">
          File Name
          {#if !$cue_store.isAutoFileName}<strong>*</strong>{/if}
          <input
            id="filename"
            data-testid="filename-input"
            bind:value={$cue_store.fileName}
            disabled={$cue_store.isAutoFileName}
          />
        </label>

        <label for="tracklist">
          Tracklist
          <strong>*</strong>
          {#if validTrackListTime === false || validTrackNumbers === false}
            <small class="cue-app__small_error">
              {validTrackListTime === false ? 'check track list times' : ''}
              {validTrackListTime === false && validTrackNumbers === false ? ' & ' : ''}
              {validTrackNumbers === false ? 'invalid time present' : ''}
            </small>
          {/if}
        </label>
        <textarea
          id="tracklist"
          data-testid="tracklist-input"
          class:invalid={validTrackListTime === false || validTrackNumbers === false}
          bind:value={$cue_store.tracks}
          on:keyup={() => updateTracks()}
          on:input={() => updateTracks()}
        />

        <div class="cue-app__checkboxes">
          <label for="lasttrack" class="cue-app__checkbox">
            <input
              type="checkbox"
              id="lasttrack"
              data-testid="add-end-track-checkbox"
              bind:checked={$cue_store.addEndTrack}
              on:change={() => updateTracks()}
            />
            Add EOF
          </label>

          <label for="autofilename" class="cue-app__checkbox">
            <input
              type="checkbox"
              id="autofilename"
              data-testid="auto-file-name-checkbox"
              bind:checked={$cue_store.isAutoFileName}
              on:change={() => updateFileName()}
            />
            Auto File Name
          </label>
        </div>

        <div class="cue-app__toggles">
          <label for="trimstart">
            Trim Track Start
            <input
              type="number"
              id="trimstart"
              data-testid="trim-start-input"
              bind:value={$cue_store.trimStart}
              on:change={() => updateTracks()}
            />
          </label>
          <label for="trimend">
            Trim Track End
            <input
              type="number"
              id="trimend"
              data-testid="trim-end-input"
              bind:value={$cue_store.trimEnd}
              on:change={() => updateTracks()}
            />
          </label>
        </div>
      </div>
    </div>
    <div class="xs-6">
      <label for="track-output">
        Output - READ ONLY
        {#if trackOutput && $cue_store.artist && $cue_store.fileName}
          <button
            on:click={() => downloadCueFile()}
            data-testid="download-button"
          >Download</button>
        {/if}
      </label>
      <div class="cue-app__output" id="track-output">
        <div class="cue-app__output-select" id="output" data-testid="output">
          <ul>
            <li>
              {#if $cue_store.artist}PERFORMER "{$cue_store.artist}"{/if}
            </li>
            <li>
              {#if $cue_store.album}TITLE "{$cue_store.album}"{/if}
            </li>
            <li>
              {#if $cue_store.artist}FILE "" MP3{/if}
            </li>
          </ul>
          <ul>
            {#if trackOutput && $cue_store.artist}
              {@html marked.parse(trackOutput)}
            {/if}
          </ul>
        </div>
      </div>
    </div>
  </div>
</main>
