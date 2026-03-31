import { program } from 'commander';
import chalk from 'chalk';
import { getDB, printConfigs } from './util.js';

const db = getDB();

const remove = async (configName) => {
  try {
    if (configName === 'default') {
      console.error(chalk.red('"default" is a reserved name and cannot be removed.'));
      process.exit(1);
    }

    // check
    const dbValue = await db.config(configName);
    if (!dbValue) {
      console.error(chalk.red(`SSH config "${configName}" not found.`));
      process.exit(1);
    }

    // clear default pointer if removing the active config
    const activeConfig = await db.config('default');
    if (activeConfig === configName) {
      await db.config('default', null);
    }

    // del
    await db.config(configName, null);
    console.log(chalk.blue(`SSH config "${configName}" deleted successfully.`));
    console.log();

    // list
    const all = await db.all();
    const newActive = all.default || null;
    printConfigs(all, newActive);
  } catch (e) {
    console.error(chalk.red('Failed to delete SSH config.'));
    console.error(e);
    process.exit(1);
  }
};

program.command('remove <configName>').description('delete ssh config').action(remove);
