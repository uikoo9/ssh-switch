// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

/**
 * list
 */
const list = async () => {
  try {
    // list
    const all = await db.all();
    console.log(cli.colors.blue('ssh-switch / list'));
    console.log();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('ssh-switch / list / error'));
    console.log();

    console.log(e);
  }
};

// cmd
cli.cmd.command('list').description('list ssh configs').action(list);
