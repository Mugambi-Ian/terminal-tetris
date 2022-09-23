#!/usr/bin/env node
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import gradient from 'gradient-string';
import {clear as refresh, log as print} from 'console';
import {
  initializeGameGrid,
  NEW_LINE,
  readLine,
  readSaveFile,
  setGameClock,
  setGameGridContent,
  sleep,
} from './constants/index.js';
import chalk from 'chalk';
import TetrisEngine from './engine/index';

let gameTitle = 'Terminal Tetris';

async function launch(_err: Error | null, title?: string) {
  refresh();
  gameTitle = `${gradient.pastel.multiline(title)} ${NEW_LINE}`;
  print(gameTitle);
  const spinner = createSpinner('Initializing...').start();
  await sleep(1000);
  spinner.success();
  const savedGame = readSaveFile();
  if (savedGame.score) {
    refresh();
    print(`${gameTitle}${NEW_LINE}${chalk.green(
      '?'
    )} A engine save was detected do you want to resume!${NEW_LINE}${chalk.blue(
      '[1]'
    )} Yes${NEW_LINE}${chalk.blue('[2]')} No
    ${NEW_LINE}`);
    readLine.question('Answer: ', name => {
      const grid =
        name.includes('1') && !name.includes('2')
          ? savedGame.gameGrid
          : initializeGameGrid();
      setGameGridContent(grid);
      if (name.includes('1') && !name.includes('2')) {
        readLine.close();
        start(gameTitle, savedGame.highScore, `${savedGame.score}`);
      } else start(gameTitle, savedGame.highScore);
    });
  } else {
    setGameGridContent();
    start(gameTitle, savedGame.highScore);
  }
}

function start(gameTitle: string, highScore: number, score?: string) {
  if (!score)
    setGameClock(gameTitle, () => new TetrisEngine(gameTitle, highScore));
  else new TetrisEngine(gameTitle, highScore, parseInt(score));
}

try {
  refresh();
  figlet(gameTitle, launch);
} catch (error) {
  // eslint-disable-next-line no-empty
}
