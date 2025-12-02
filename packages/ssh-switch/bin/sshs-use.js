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
      console.log(cli.colors.red('SSH config not found.'));
      return;
    }

    // default
    await db.config('default', configName);

    // write
    const filePath = path.resolve(os.homedir(), './.ssh/config');
    const fileData = `
Host ${dbValue.Host}
  HostName ${dbValue.Host}
  User git
  AddKeysToAgent yes
  UseKeychain yes
  IdentitiesOnly yes
  IdentityFile ${dbValue.IdentityFilePath}
`;
    const writeFileRes = await writeFile(filePath, fileData);
    console.log(cli.colors.blue(`Write ~/.ssh/config: ${writeFileRes ? 'success' : 'fail'}`));
    console.log(cli.colors.gray(fileData));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('Failed to use SSH config.'));
    console.log();
    console.log(e);
  }
};

// cmd
cli.cmd.command('use <configName>').description('use ssh config').action(use);
