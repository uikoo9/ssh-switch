// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

/**
 * now
 */
const now = async () => {
  try {
    // check
    const defaultConfigName = await db.config('default');
    if (!defaultConfigName) return;

    // r
    console.log(cli.colors.blue(`${defaultConfigName} is now in use`));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('Failed to get current SSH config.'));
    console.log();
    console.log(e);
  }
};

// cmd
cli.cmd.command('now').description('show current ssh config in use').action(now);
