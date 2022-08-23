import Pixel from '../models/tetris-pixel.js';
import TetrisEngine from '../engine/index.js';
import ITetris from '../models/tetris-i.js';
import JTetris from '../models/tetris-j.js';
import LTetris from '../models/tetris-l.js';
import OTetris from '../models/tetris-o.js';
import STetris from '../models/tetris-s.js';
import TTetris from '../models/tetris-t.js';
import ZTetris from '../models/tetris-z.js';
import rl from 'readline';
import path from 'path';
import fs from 'fs';

export const readLine = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const ROWS = 26;
export const COLS = 22;
export const NEW_LINE = '\n';
export const SCORE_WORTH = 10;
export const GAME_CLOCK = 1000;
const SAVE_FILE = 'save.tetris';
export const BLOCK_SIDE_LENGTH = 30;

let grid: string[][] = [];

export function start(titleTile: string) {
  new TetrisEngine(titleTile);
}
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
export function getGridContent() {
  return grid;
}
export function setGridContent(param?: string[][]) {
  grid = param ?? initializeGameGrid();
}
export function readSaveFile(): string[][] | void {
  const file = getSaveFile();
  const save = fs.readFileSync(file, 'utf-8');
  if (save) {
    fs.writeFileSync(file, '');
    return JSON.parse(save);
  }
}
function getSaveFile(): string {
  let appDir = '';
  const plat = process.platform;
  const homeDir = `${process.env[plat === 'win32' ? 'USERPROFILE' : 'HOME']}`;
  if (plat === 'win32') {
    appDir = path.join(homeDir, 'AppData', 'terminal-tetris');
  } else {
    appDir = path.join(homeDir, '.' + 'terminal-tetris');
  }
  if (!fs.existsSync(appDir + SAVE_FILE)) {
    fs.mkdirSync(appDir);
    fs.writeFileSync(appDir + SAVE_FILE, '', 'utf8');
    return appDir + SAVE_FILE;
  }
  return appDir + SAVE_FILE;
}

export function writeSaveFile() {
  const file = getSaveFile();
  fs.writeFileSync(file, JSON.stringify(grid));
}
export function clearSaveFile() {
  const file = getSaveFile();
  fs.writeFileSync(file, JSON.stringify(grid));
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
