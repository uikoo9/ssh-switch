// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

/**
 * remove
 */
const remove = async () => {
  try {
    // q a
    const questions = [
      {
        type: 'input',
        name: 'SSHConfigName',
        message: 'ssh config name',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // del
    const dbKey = answers.SSHConfigName;
    await db.config(dbKey, null);
    console.log(cli.colors.blue('delete ssh config success.'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('delete ssh config error.'));
    console.log();

    console.log(e);
  }
};

// cmd
cli.cmd.command('remove').description('delete ssh config').action(remove);
