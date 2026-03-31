import { program } from 'commander';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import { getDB, printConfigs } from './util.js';

const db = getDB();

const add = async () => {
  try {
    const Name = await input({
      message: 'Enter a name for this SSH config:',
      validate: (v) => (v.trim() ? true : 'Name cannot be empty.'),
    });
    if (Name === 'default') {
      console.error(chalk.red('"default" is a reserved name. Please choose another.'));
      process.exit(1);
    }

    const Host = await input({
      message: 'Host:',
      validate: (v) => (v.trim() ? true : 'Host cannot be empty.'),
    });
    const IdentityFilePath = await input({
      message: 'Path to SSH private key file:',
      validate: (v) => (v.trim() ? true : 'Path cannot be empty.'),
    });
    console.log();

    // check
    const dbValue = await db.config(Name);
    if (dbValue) {
      console.error(chalk.red('SSH config name already exists.'));
      process.exit(1);
    }

    // set
    await db.config(Name, { Name, Host, IdentityFilePath });
    console.log(chalk.blue('SSH config added successfully.'));
    console.log();

    // list
    const all = await db.all();
    printConfigs(all, all.default);
  } catch (e) {
    console.error(chalk.red('Failed to add SSH config.'));
    console.error(e);
    process.exit(1);
  }
};

program.command('add').description('add ssh config').action(add);
