const fs = require('fs');
const { resolve } = require('path');
const prompt = require('prompt');
const _ = require('lodash');
const chalk = require('chalk');
const parse = require('csv-parse/lib/sync');
const { execSync } = require('child_process');
const { prepareOptions, prepareMetadata } = require('./helpers');

const filename = process.argv[2];
const trackListPath = resolve(__dirname, `../input/${filename}.csv`);
const audioPath = resolve(__dirname, `../input/${filename}.m4a`);
const outputDir = `./output/${filename}`;

// set a codec here
const codec = 'aac';

// set audio encoding settings
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

      console.log(`${chalk.gray(`Preparing the album ${chalk.blue(result.album)} by ${chalk.blue(result.artist)} …`)}`);

      trackList.forEach((track, index) => {
        const { start, end, title } = track;
        const options = prepareOptions([
          ['i', audioPath],
          ['loglevel', 'fatal'],
          ['codec:a', codec],
          ...audioSettings,
          ['ss', start],
          ['to', end],
          ...prepareMetadata([
            ['track', index + 1],
            ['title', title],
            ['album', result.album],
            ['album_artist', result.artist]
          ])
        ]);

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }

        console.log(`${chalk.gray(`Exporting Track ${index + 1} —`)} ${chalk.green(title)}`)
        execSync(`ffmpeg ${options} ${outputDir}/${index + 1}-${_.kebabCase(title)}.m4a`);
      });
      console.log(`${chalk.gray('…and')} ${chalk.yellowBright('finished')} 🎉`);
    });
  } else {
    console.log(`${chalk.red('ERROR!')} ${chalk.gray('Either source audio or track list are missing!')}`);
  }
}
