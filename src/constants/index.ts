import Pixel from '../models/tetris-pixel.js';
import ITetris from '../models/tetris-i.js';
import JTetris from '../models/tetris-j.js';
import LTetris from '../models/tetris-l.js';
import OTetris from '../models/tetris-o.js';
import STetris from '../models/tetris-s.js';
import TTetris from '../models/tetris-t.js';
import ZTetris from '../models/tetris-z.js';
import {createInterface} from 'readline';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {clear, log} from 'console';

const ROWS = 26;
const COLS = 22;
const NEW_LINE = '\n';
let GAME_CLOCK = 1000;
let gameGrid: string[][] = [];
const SAVE_FILE = '/save.tetris';
let playTetris: NodeJS.Timeout | undefined;
const readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export {GAME_CLOCK, ROWS, COLS, NEW_LINE, gameGrid, playTetris, readLine};

export function initializeGameGrid() {
  const rows: string[][] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!rows[y]) {
        rows[y] = [];
      }
      rows[y]![x] = ' ';
      if (x === COLS - 1) rows[y]![x + 1] = '-';
    }
  }
  rows.push('---------------------------------------------'.split(''));
  return rows;
}

export function setGameGridContent(param?: string[][]) {
  gameGrid = param ?? initializeGameGrid();
}
export function initPlayTetris(cb: () => void) {
  playTetris = setInterval(cb, GAME_CLOCK);
}

export function clearPlayTetris() {
  clearInterval(playTetris);
  playTetris = undefined;
}
export function setGameClock(title: string, cb: () => void) {
  clear();
  log(
    `${title}${NEW_LINE}${chalk.green(
      '!'
    )} Current Game Clock is set to ${GAME_CLOCK}ms Press enter to proceed.${NEW_LINE}${chalk.green(
      '!'
    )} To change this enter any interger greater than ${chalk.bgGreen(
      ' 10 '
    )}${NEW_LINE}`
  );
  readLine.removeAllListeners();
  readLine.question('Game Clock (ms): ', name => {
    const val = parseInt(name);
    if (val >= 10) {
      GAME_CLOCK = val;
    }
    readLine.close();
    clear();
    cb();
  });
}
export function readSaveFile(): {
  score?: number;
  highScore: number;
  gameGrid: string[][];
} {
  const file = getSaveFile();
  const save = JSON.parse(fs.readFileSync(file, 'utf-8'));
  GAME_CLOCK = save.GAME_CLOCK;
  clearSaveFile(save.highScore);
  return save;
}

function getSaveFile(): string {
  let appDir = '';
  const plat = process.platform;
  const homeDir = `${process.env[plat === 'win32' ? 'USERPROFILE' : 'HOME']}`;
  if (plat === 'win32') {
    appDir = path.join(homeDir, 'Documents', 'terminal-tetris');
  } else {
    appDir = path.join(homeDir, '.' + 'terminal-tetris');
  }
  if (!fs.existsSync(appDir + SAVE_FILE)) {
    fs.mkdirSync(appDir);
    fs.writeFileSync(
      appDir + SAVE_FILE,
      JSON.stringify({highScore: 0, gameGrid: [], GAME_CLOCK}),
      'utf8'
    );
    return appDir + SAVE_FILE;
  }
  return appDir + SAVE_FILE;
}

export function writeSaveFile(highScore?: number, score?: string) {
  const file = getSaveFile();
  let val = {};
  if (score) val = {highScore, gameGrid, GAME_CLOCK, score};
  else val = {highScore, gameGrid, GAME_CLOCK};
  fs.writeFileSync(file, JSON.stringify(val), 'utf-8');
}

export function clearSaveFile(highScore: number) {
  const file = getSaveFile();
  fs.writeFileSync(
    file,
    JSON.stringify({highScore, gameGrid: [], GAME_CLOCK}),
    'utf-8'
  );
}

export function bingo() {
  const pick = Math.floor(Math.random() * 7) + 1;
  let val = new Pixel();
  switch (pick) {
    case 1:
      val = new OTetris();
      val.x = 10;
      val.y = 0;
      break;
    case 2:
      val = new ITetris();
      val.x = 12;
      val.y = 0;
      break;
    case 3:
      val = new JTetris();
      val.x = 10;
      val.y = 0;
      break;

    case 4:
      val = new STetris();
      val.x = 10;
      val.y = 0;
      break;

    case 5:
      val = new LTetris();
      val.x = 10;
      val.y = 0;
      break;

    case 6:
      val = new ZTetris();
      val.x = 10;
      val.y = 0;
      break;

    case 7:
      val = new TTetris();
      val.x = 10;
      val.y = 0;
      break;
  }
  return val;
}
export function makeUnique<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}
export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(find, 'g'), replace);
}
export function sleep(ms = 2000) {
  return new Promise(r => setTimeout(r, ms));
}

// eslint-disable-next-line no-useless-escape
export const FOOTER = () => `
${NEW_LINE}Game Clock Speed: ${chalk.bgGreen(
  `  ${GAME_CLOCK}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ms  '
)}
${NEW_LINE + NEW_LINE + NEW_LINE}Devoloped by ${chalk.bgYellow(
  '  Ian Mugambi  '
)}.${NEW_LINE + NEW_LINE}GitHub ${chalk.green(
  'https://github.com/Mugambi-Ian'
)}.${NEW_LINE}Project Repo ${chalk.green(
  'https://github.com/Mugambi-Ian/terminal-tetris'
)}.${NEW_LINE}Source Code Boilerplate ${chalk.green(
  'https://github.com/Mugambi-Ian/NodeJS-CLI-App-Boilerplate---TypeScript'
)} `;
