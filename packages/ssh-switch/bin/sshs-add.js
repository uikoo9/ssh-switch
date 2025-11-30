// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

/**
 * add
 */
const add = async () => {
  try {
    // q a
    const questions = [
      {
        type: 'input',
        name: 'Name',
        message: 'Custom SSH Config Name',
      },
      {
        type: 'input',
        name: 'Host',
        message: 'Host',
      },
      {
        type: 'input',
        name: 'IdentityFilePath',
        message: 'IdentityFilePath',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // check
    const dbKey = answers.Name;
    const dbValue = await db.config(dbKey);
    if (dbValue) {
      console.log(cli.colors.red('ssh config name already exists.'));
      return;
    }

    // set
    await db.config(dbKey, answers);
    console.log(cli.colors.blue('add ssh config success.'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('add ssh config error.'));
    console.log();
    console.log(e);
  }
};

// cmd
cli.cmd.command('add').description('add ssh config').action(add);
