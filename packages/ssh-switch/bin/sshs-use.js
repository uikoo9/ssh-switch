// os
const os = require('os');

// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

// file
const { writeFile } = require('qiao-file');

/**
 * use
 */
const use = async (configName) => {
  try {
    // check
    const dbKey = configName;
    const dbValue = await db.config(dbKey);
    if (!dbValue) {
      console.log(cli.colors.red('ssh config name not exists.'));
      return;
    }

    // write
    const filePath = path.resolve(os.homedir(), './.ssh/config');
    const fileData = `
Host ${dbValue.Host}
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ${dbValue.IdentityFilePath}
`;
    const writeFileRes = await writeFile(filePath, fileData);
    console.log(cli.colors.blue(`write ~/.ssh/config: ${writeFileRes}`));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('use ssh config error.'));
    console.log();
    console.log(e);
  }
};

// cmd
cli.cmd.command('use <configName>').description('use ssh config').action(use);
