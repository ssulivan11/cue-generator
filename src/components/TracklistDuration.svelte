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
    times = `As the Story Goes 00:30\nGold Rush 02:32\nWillis Creek 01:38\nHotbox Cabin 01:27\nSmooth Sailing 02:28\nVillain Theme Song 01:50\nDrinks at the Penny Slot 01:54\nMichelin Star 02:28\nWishful Drinking 01:45\nTen Cent Beer Night 02:46\nHazel Part Five 01:37\nThe Cigarette Bandit 01:31\nCan't Live 01:15\nEdible in a Hot Tub 01:17\nLast Call in the Monastery 02:50`;
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
      background-color: var(--input-color);

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
