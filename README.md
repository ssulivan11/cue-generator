# 💿 Cue Generator

> Live Site - [https://cue-generator.netlify.app/](https://cue-generator.netlify.app/)

A tool to build valid CUE files with helpful tracklist formatting. Click the demo button to see the expected formats if needed.

1. Firstly, provide your artist, album, and the desired file name.
2. The tracklist can be given in many formats. If any leftover characters, you can use the trim start or end controls.

   Option 1 - requires no trimming:

   ```
   1. Track Name 01 00:00
   2. Track Name 02 02:50
   ```

   Option 2 - requires trimming of last 2 digits:

   ```
   Track Name 01 (0:00)
   Track Name 02 (2:50)
   ```

   Option 3 - requires trimming of the first 5 digits:

   ```
   0:00 - 1. Track Name 01
   2:50 - 2. Track Name 02
   ```

3. Now can click to select all in the output or download a CUE file based on the name you provided.
