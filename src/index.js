const fs = require('fs');
const { resolve } = require('path');
const prompt = require('prompt');

const chalk = require('chalk');
const parse = require('csv-parse/lib/sync');
const { execSync } = require('child_process');
const { prepareOptions } = require('./helpers/prepareOptions');
const { prepareMetadata } = require('./helpers/prepareMetadata');

const filename = process.argv[2];
const trackListPath = resolve(__dirname, `../input/${filename}.csv`);
const audioPath = resolve(__dirname, `../input/${filename}.m4a`);

const codec = ['codec:a', 'libvo_aacenc'];
const audioSettings = [
  ['ac', '2'],
  ['ar', '44100'],
  ['ab', '192k'],
]

if (!filename) {
  console.log(chalk.blue("File name not provided. Aborting."));
} else {
  if (fs.existsSync(trackListPath) && fs.existsSync(audioPath)) {
    prompt.get([{
      name: 'artist',
      description: 'Name of Album Artist',
      required: true,
    }, {
      name: 'album',
      description: 'Name of Album',
      required: true
    }], (error, result) => {
      const trackList = parse(fs.readFileSync(trackListPath), {
        columns: true
      });

      console.log(`${chalk.gray('Preparing the album')} ${chalk.blue(result.album)} ${chalk.gray('by')} ${chalk.blue(result.artist)}…`);
      trackList.forEach((track, index) => {
        const { start, end, title } = track;
        const options = prepareOptions([
          ['i', audioPath],
          codec,
          ...audioSettings,
          ['ss', start],
          ['to', end],
          ...prepareMetadata([
            ['track', index],
            ['title', title],
            ['album', result.album],
            ['album_artist', result.artist]
          ])
        ]);

        console.log(`${chalk.gray(`Exporting Track ${index} —`)} ${chalk.green(title)}${chalk.gray('…')}`)
        execSync(`ffmpeg ${options} ./output/${index}-${filename}.m4a`);
      });
    });
  } else {
    console.log(`${chalk.red('ERROR!')} Either source audio or track list are missing!`);
  }
}
