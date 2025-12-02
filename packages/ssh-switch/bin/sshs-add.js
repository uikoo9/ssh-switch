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
        message: 'Enter a name for this SSH config:',
      },
      {
        type: 'input',
        name: 'Host',
        message: 'Host:',
      },
      {
        type: 'input',
        name: 'IdentityFilePath',
        message: 'Path to SSH private key file:',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // check
    const dbKey = answers.Name;
    const dbValue = await db.config(dbKey);
    if (dbValue) {
      console.log(cli.colors.red('SSH config name already exists.'));
      return;
    }

    // set
    await db.config(dbKey, answers);
    console.log(cli.colors.blue('SSH config added successfully.'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('Failed to add SSH config.'));
    console.log();
    console.log(e);
  }
};

// cmd
cli.cmd.command('add').description('add ssh config').action(add);
