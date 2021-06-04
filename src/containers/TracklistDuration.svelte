<script>
  import moment from 'moment';

  let times = '';
  let output = [];

  const handleChange = () => {
    output = [];
    const allTimes = times.split('\n');
    let combinedTime = '00:00:00';

    allTimes.map((track, index) => {
      /** Get song title  */
      const song = track.slice(0, -6);

      /** Return first track and start time  */
      if (index === 0)
        return output.push(`${combinedTime.substr(3)} - ${song}`);

      /** Every song starts at the end of the last time  */
      const i = index - 1;
      const time = `00:${allTimes[i].substr(allTimes[i].length - 5)}`;

      /** Combine old time and new time  */
      const combinedTimeDur = moment.duration(combinedTime);
      const newTimeDur = moment.duration(time);
      combinedTimeDur.add(newTimeDur);

      /** Combine old time and new time  */
      combinedTime = moment
        .utc(combinedTimeDur.asMilliseconds())
        .format('HH:mm:ss');

      return output.push(`${combinedTime.substr(3)} - ${song}`);
    });
  };

  const copyTextArea = () => {
    document.getElementById('output').select();
    document.execCommand('copy');
  };

  const demoEntries = () => {
    times = `Speak To Me 01:08\nBreathe 02:48\nOn The Run 03:31\nTime 07:05\nThe Great Gig In The Sky 04:47\nMoney 06:23\nUs And Them 07:48\nAny Colour You Like 03:25\nBrain Damage 03:50\nEclipse 02:06`;
    const tracklistId = document.getElementById('input');
    tracklistId.dispatchEvent(new Event('focus'));
    tracklistId.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
  };
</script>

<style lang="scss">
  .tracklist-forms {
    padding: 0 25px;
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: row;
    @media only screen and (max-width: 700px) {
      flex-direction: column;
    }

    &__form {
      width: 50%;
      overflow-y: auto;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;

      &:first-child {
        button {
          right: 15px;
        }
        label {
          width: calc(100% - 45px);

          textarea {
            background-color: var(--input-color);
            width: 100%;
          }
        }
      }
    }

    @media only screen and (max-width: 700px) {
      .tracklist-forms {
        &__form {
          width: 100%;
          min-height: 50%;

          &:first-child {
            button {
              right: 5px;
            }
            label {
              width: calc(100% - 35px);
            }
          }
        }
      }
    }

    label {
      height: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      font-weight: 600;
    }

    textarea {
      flex-grow: 1;
      width: auto;
      border: 1px solid var(--input-border);
      color: var(--primary-color);
      background-color: var(--bg-color);

      &:focus {
        border: 1px solid var(--secondary-color);
      }
    }

    button {
      position: absolute;
      right: 0;
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
</style>

<main>
  <h1>⌛ Tracklist Duration</h1>

  <div class="tracklist-forms">
    <div class="tracklist-forms__form">
      {#if !times}
        <button on:click={demoEntries}>Demo</button>
      {/if}
      <label>
        Track Name and Times
        <textarea id="input" on:keyup={handleChange} bind:value={times} />
      </label>

    </div>

    <div class="tracklist-forms__form">
      {#if times}
        <button on:click={copyTextArea}>Copy</button>
      {/if}
      <label>
        Output - READ ONLY
        <textarea id="output" value={output.join('\n')} />
      </label>

    </div>
  </div>
</main>
