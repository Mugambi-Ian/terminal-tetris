/* eslint-disable no-empty */
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import gradient from 'gradient-string';
import {clear as refresh, log as print} from 'console';
import {
  initializeGameGrid,
  launchGame,
  NEW_LINE,
  readLine,
  readSaveFile,
  setGameClock,
  setGameGridContent,
  sleep,
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
  if (savedGame.saveGame && savedGame.saveGame.length !== 0) {
    refresh();
    print(`${titleTile}${NEW_LINE}${chalk.green(
      '?'
    )} A game save was detected do you want to resume!${NEW_LINE}${chalk.blue(
      '[1]'
    )} Yes${NEW_LINE}${chalk.blue('[2]')} No
    ${NEW_LINE}`);
    readLine.question('Answer: ', name => {
      const grid =
        name.includes('1') && !name.includes('2')
          ? savedGame.saveGame
          : initializeGameGrid();
      setGameGridContent(grid);
      readLine.close();
      start(titleTile, savedGame.highScore, true);
    });
  } else {
    setGameGridContent();
    start(titleTile, savedGame.highScore);
  }
}

function start(titleTile: string, highScore: number, skipClockSetup?: boolean) {
  if (!skipClockSetup)
    setGameClock(titleTile, () => launchGame(titleTile, highScore));
  else launchGame(titleTile, highScore);
}

try {
  refresh();
  figlet(titleTile, launch);
} catch (error) {}
