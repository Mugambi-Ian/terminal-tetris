import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import gradient from 'gradient-string';
import {clear as refresh, log as print} from 'console';
import {NEW_LINE, sleep} from './constants/index.js';
import TetrisEngine from './engine/index.js';

let titleTile = 'Terminal Tetris';

async function welcome() {
  refresh();
  figlet(titleTile, launch);
}

async function launch(_err: Error | null, title?: string) {
  print(`${title} ${NEW_LINE}`);
  await sleep(500);
  refresh();
  titleTile = `${gradient.pastel.multiline(title)} ${NEW_LINE}`;
  print(titleTile);
  const spinner = createSpinner('Initializing...').start();
  await sleep(1000);
  spinner.success();
  await sleep(1500);
  const engine = new TetrisEngine(titleTile);
  engine.launch();
}

welcome();
