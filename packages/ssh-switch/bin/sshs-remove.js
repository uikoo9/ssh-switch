// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

/**
 * remove
 */
const remove = async (configName) => {
  try {
    // del
    const dbKey = configName;
    await db.config(dbKey, null);
    console.log(cli.colors.blue('SSH config deleted successfully.'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('Failed to delete SSH config.'));
    console.log();

    console.log(e);
  }
};

// cmd
cli.cmd.command('remove <configName>').description('delete ssh config').action(remove);
