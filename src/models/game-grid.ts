import fs from 'fs/promises';
import {clear as refresh, log as print} from 'console';
import {NEW_LINE, replaceAll} from '../constants/index.js';
import chalk from 'chalk';
export default class Grid {
  titleTile = '';
  gridContent: string[] = [];

  setTitle(titleTile = '') {
    this.titleTile = titleTile;
  }

  async initializeGameGrid() {
    try {
      const data = await fs.readFile('build/grid.tetris', {encoding: 'utf8'});
      this.gridContent = data.split(NEW_LINE);
      const rowTemplate = new Array(12);
      rowTemplate.fill(12);
      this.printGame();
    } catch (error) {
      console.error(error);
    }
  }

  printGame() {
    const frame = this.titleTile + this.drawBoder();
    refresh();
    print(frame);
  }

  private drawBoder() {
    let value = this.gridContent.join(NEW_LINE);
    value = replaceAll(value, '-', chalk.blueBright('◌'));
    return value;
  }
}
