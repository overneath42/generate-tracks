# Generate Tracks

A quick script for my personal use. Accepts an audio file and a CSV of track definitions, and generates a folder of files.

## Instructions

1. Save an audio file to [/input](input/) with a slugified name (`name-of-slug.m4a`). File should be a `m4a` file.
2. Save a CSV file to [/input](input/) with the same name as the audio file (`name-of-slug.csv`). The file should have three columns:
   - `title`: The track title
   - `start`: The start time in 00:00:00 format
   - `end`: The end time in 00:00:00 format
3. Run `npm run process <name-of-slug>` and drink a ☕️.