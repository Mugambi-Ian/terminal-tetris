/* eslint-disable no-empty */
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import gradient from 'gradient-string';
import {clear as refresh, log as print} from 'console';
import {
  initializeGameGrid,
  NEW_LINE,
  readLine,
  readSaveFile,
  setGridContent,
  sleep,
  start,
} from './constants/index.js';
import chalk from 'chalk';

let titleTile = 'Terminal Tetris';

async function launch(_err: Error | null, title?: string) {
  refresh();
  titleTile = `${gradient.pastel.multiline(title)} ${NEW_LINE}`;
  print(titleTile);
  const spinner = createSpinner('Initializing...').start();
  await sleep(1000);
  spinner.success();
  const savedGame = readSaveFile();
  if (savedGame) {
    refresh();
    print(`${titleTile}${NEW_LINE}${chalk.green(
      '?'
    )} A game save was detected do you want to resume!${NEW_LINE}${chalk.blue(
      '[1]'
    )} Yes${NEW_LINE}${chalk.blue('[2]')} No
    ${NEW_LINE}`);
    readLine.question('Answer: ', async name => {
      const loading =
        name.includes('1') && !name.includes('2')
          ? 'Resuming...'
          : 'Starting Game';

      print(NEW_LINE);
      const spinner = createSpinner(loading).start();
      await sleep(1000);
      spinner.success();
      const grid = name.includes('1') ? savedGame : initializeGameGrid();
      setGridContent(grid);
      readLine.close();
      start(titleTile);
    });
  } else {
    setGridContent(initializeGameGrid());
    start(titleTile);
  }
}

try {
  refresh();
  figlet(titleTile, launch);
} catch (error) {
  console.log(error);
}
