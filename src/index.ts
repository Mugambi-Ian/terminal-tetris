import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import gradient from 'gradient-string';
let playerName = '';

const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms));

async function welcome() {
  console.clear();
  figlet('Terminal Template', async (_err: any, data: any) => {
    console.log(data + '\n');
    await sleep(500);
    console.clear();
    console.log(gradient.pastel.multiline(data) + '\n');
    const spinner = createSpinner('Initializing...').start();
    await sleep(5000);
    spinner.success();
    await askName();
    await finalPrompt();
  });
}

async function askName() {
  const answers = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Micheal Scott';
    },
  });
  playerName = answers.player_name;
  const spinner = createSpinner('Checking answer...').start();
  await sleep();
  spinner.success({text: `Nice work ${playerName}`});
}

function finalPrompt() {
  console.clear();
  figlet(`Dear ${playerName},`, (_err: any, data: any) => {
    console.log(gradient.pastel.multiline(data) + '\n');
    console.log(
      chalk.green(
        "Programming isn't about what you know; it's about making the command line look cool"
      )
    );
    console.log('\n \n \n \n');
    console.log(chalk.bgGreen('Yours Techinically,'));
    console.log(chalk.bgGreen('Fireship IO.'));
    process.exitCode = 1;
  });
}

welcome();
