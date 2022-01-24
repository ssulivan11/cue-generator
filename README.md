# 💿 Cue Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/55844e54-e253-4018-856e-6cf7dcbd9506/deploy-status)](https://app.netlify.com/sites/cue-generator/deploys)

A tool to build valid CUE files with helpful track list formatting. Click the demo button to see the expected formats if needed.

1. First provide your artist, album, and the desired file name.
2. The track list can be given in many formats. If any leftover characters, you can use the trim start or end controls.

   Option 1 - requires no trimming:

   ```md
   1. Track Name 01 00:00
   2. Track Name 02 02:50
   ```

   Option 2 - requires trimming of last 2 digits:

   ```md
   Track Name 01 (0:00)
   Track Name 02 (2:50)
   ```

   Option 3 - requires trimming of the first 5 digits:

   ```md
   0:00 - 1. Track Name 01
   2:50 - 2. Track Name 02
   ```

3. Now you can either click to select and copy all in the output or download a CUE file based on the file name you provided.

## ⌛ Track list Duration

Sometimes you are only have individual track lists lengths and not the combined start of each track in an album, eg:

```md
Track Name 01 02:30
Track Name 02 01:05
Track Name 03 01:30
```

With the duration login it will do the maths to tell you the overall start time for each track:

```md
00:00 - Track Name 01
02:30 - Track Name 02
03:35 - Track Name 03
```
