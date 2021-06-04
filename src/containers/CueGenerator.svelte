<script>
  import marked from 'marked';

  let artist = '';
  let album = '';
  let fileName = '';
  let tracks = '';
  let trackOutput = '';
  let addEndTrack = true;
  let isAutoFileName = true;

  let trimStart = 0;
  let trimEnd = 0;

  marked.setOptions({
    breaks: true
  });

  const artistUpdate = () => {
    updateTracks();
    return updateFileName();
  };

  const updateFileName = () => {
    if (isAutoFileName) {
      fileName = `${artist || ''} - ${album || ''}`;
    }
  };

  const updateTracks = () => {
    trackOutput = '';
    const htmlTracks = marked(tracks);

    const cleanedUpTracks = htmlTracks
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('<ol>', '')
      .replaceAll('</ol>', '')
      .replaceAll('<ul>', '')
      .replaceAll('</ul>', '')
      .replaceAll('<li>', '')
      .replaceAll('</li>', '<br>')
      .replace(/^\s*<br\s*\/?>|<br\s*\/?>\s*$/g, '') // remove last BR
      .split('<br>');

    const insertTab = (tabs = 1) => {
      if (tabs === 2) return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
      return '&nbsp;&nbsp;&nbsp;&nbsp;';
    };

    cleanedUpTracks.forEach((track, index) => {
      let trackTime;
      let trackTitle;

      const newTrack = () => {
        // if 00:00:00 (in Hour Format)
        if ((track.match(/\:/g) || []).length > 1) {
          const hourTime = /\d{1,2}:\d{1,2}:\d{1,2}/g;
          let trackDisplayTime = track.match(hourTime);

          // hour track time starts with 0 or not
          if (trackDisplayTime && trackDisplayTime.toString().length < 8) {
            trackDisplayTime = `0${track.match(hourTime)}:00`;
          } else {
            trackDisplayTime = `${track.match(hourTime)}:00`;
          }
          console.warn(trackDisplayTime);

          // ugly way to get hours to min in display from 1:30:15 to 90:15:00
          let minToHourDigit =
            trackDisplayTime && trackDisplayTime.split(':')[0] * 60;
          let minAndSec = trackDisplayTime.substring(3);
          let onlyMin = minAndSec.slice(0, -6);
          minToHourDigit = minToHourDigit + parseInt(onlyMin, 10);
          minAndSec = minAndSec && minAndSec.substring(3);

          // console.warn(trackDisplayTime)
          trackTime = `${minToHourDigit}:${minAndSec}`;
          trackTitle = track.replace(hourTime, '');
        } else {
          // if 00:00 (in Min/Sec only Format)
          const minTime = /\d{1,2}:\d{1,2}/g;

          let trackDisplayTime = track.match(minTime);
          // min track time starts with 0 or not
          if (trackDisplayTime && trackDisplayTime.toString().length < 5) {
            trackDisplayTime = `0${track.match(minTime)}`;
          }

          trackTime = `${trackDisplayTime || '00:00'}:00`;
          trackTitle = track.replace(minTime, '');
        }
        // trim empty space from replaceAll above
        trackTitle = trackTitle.trimStart().trimEnd();
        if (trimEnd > 0) trackTitle = trackTitle.slice(0, -trimEnd);
        if (trimStart > 0) trackTitle = trackTitle.substring(trimStart);
        return trackTitle;
      };

      const trackString = `<li>${insertTab(1)}TRACK 0${
        index + 1
      } AUDIO</li><li>${insertTab(2)}PERFORMER "${
        artist || ''
      }"</li><li>${insertTab(2)}TITLE "${newTrack()}"</li><li>${insertTab(
        2
      )}INDEX 01 ${trackTime}</li>`;
      return (trackOutput += trackString);
    });

    if (addEndTrack) {
      trackOutput += `<li>${insertTab(1)}TRACK 999 AUDIO</li><li>${insertTab(
        2
      )}PERFORMER "${artist || ''}"</li><li>${insertTab(
        2
      )}TITLE "EOF"</li><li>${insertTab(2)}INDEX 01 9999:59:59</li>`;
    }

    return trackOutput;
  };

  const downloadCueFile = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('output').innerText], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.cue`;
    document.body.appendChild(element);
    element.click();
  };

  const demoEntries = () => {
    artist = 'Pink Floyd';
    album = 'The Dark Side of the Moon';
    fileName = 'The Dark Side of the Moon Full Album 1973';
    tracks = `00:00 - Speak To Me\n01:08 - Breathe\n03:56 - On The Run\n07:27 - Time\n14:32 - The Great Gig In The Sky\n19:19 - Money\n25:42 - Us And Them\n33:30 - Any Colour You Like\n36:55 - Brain Damage\n40:45 - Eclipse`;
    trimStart = 2;
    const tracklistId = document.getElementById('tracklist');
    tracklistId.dispatchEvent(new Event('focus'));
    tracklistId.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
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
          {#if !trackOutput && !artist && !fileName}
            <button class="cue-app__demo" on:click={() => demoEntries()}>
              Demo
            </button>
          {/if}
          <input
            id="artist"
            bind:value={artist}
            on:keyup={() => artistUpdate()} />
        </label>

        <label for="album">
          Album
          <strong>*</strong>
          <input
            id="album"
            bind:value={album}
            on:keyup={() => updateFileName()} />
        </label>

        <label for="filename">
          File Name
          <strong>*</strong>
          <input
            id="filename"
            bind:value={fileName}
            disabled={isAutoFileName} />
        </label>

        <label for="tracklist">
          Tracklist
          <strong>*</strong>
        </label>
        <textarea
          id="tracklist"
          bind:value={tracks}
          on:keyup={() => updateTracks()}
          on:input={() => updateTracks()} />

        <div class="cue-app__checkboxes">
          <label for="lasttrack" class="cue-app__checkbox">
            <input
              type="checkbox"
              id="lasttrack"
              bind:checked={addEndTrack}
              on:change={() => updateTracks()} />
            Add EOF
          </label>

          <label for="autofilename" class="cue-app__checkbox">
            <input
              type="checkbox"
              id="autofilename"
              bind:checked={isAutoFileName}
              on:change={() => updateFileName()} />
            Auto File Name
          </label>
        </div>

        <div class="cue-app__toggles">
          <label for="trimstart">
            Trim Track Start
            <input
              type="number"
              id="trimstart"
              bind:value={trimStart}
              on:change={() => updateTracks()} />
          </label>
          <label for="trimend">
            Trim Track End
            <input
              type="number"
              id="trimend"
              bind:value={trimEnd}
              on:change={() => updateTracks()} />
          </label>
        </div>

      </div>

    </div>
    <div class="xs-6">
      <label>
        Output - READ ONLY
        {#if trackOutput && artist && fileName}
          <button on:click={() => downloadCueFile()}>Download</button>
        {/if}
      </label>
      <div class="cue-app__output">
        <div class="cue-app__output-select" id="output">
          <ul>
            <li>
              {#if artist}PERFORMER "{artist}"{/if}
            </li>
            <li>
              {#if album}TITLE "{album}"{/if}
            </li>
            <li>
              {#if artist}FILE "" MP3{/if}
            </li>
          </ul>
          <ul>
            {#if trackOutput && artist}
              {@html marked(trackOutput)}
            {/if}
          </ul>
        </div>
      </div>
    </div>

  </div>
</main>
