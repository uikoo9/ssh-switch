import { program } from 'commander';
import chalk from 'chalk';
import { getDB, writeSshConfig } from './util.js';

const db = getDB();

const use = async (configName) => {
  try {
    const dbValue = await db.config(configName);
    if (!dbValue) {
      console.error(chalk.red('SSH config not found.'));
      process.exit(1);
    }

    // default
    await db.config('default', configName);

    // write
    const fileData = await writeSshConfig(dbValue);
    console.log(chalk.blue('Write ~/.ssh/config: success'));
    console.log(chalk.gray(fileData));
  } catch (e) {
    console.error(chalk.red('Failed to use SSH config.'));
    console.error(e);
    process.exit(1);
  }
};

program.command('use <configName>').description('use ssh config').action(use);
