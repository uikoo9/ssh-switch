import os from 'node:os';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { program } from 'commander';
import chalk from 'chalk';
import { getDB } from './util.js';

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
    const filePath = path.resolve(os.homedir(), './.ssh/config');
    const useKeychain = process.platform === 'darwin' ? '\n  UseKeychain yes' : '';
    const fileData = `
Host ${dbValue.Host}
  HostName ${dbValue.Host}
  User git
  AddKeysToAgent yes${useKeychain}
  IdentitiesOnly yes
  IdentityFile ${dbValue.IdentityFilePath}
`;
    await writeFile(filePath, fileData, 'utf8');
    console.log(chalk.blue('Write ~/.ssh/config: success'));
    console.log(chalk.gray(fileData));
  } catch (e) {
    console.error(chalk.red('Failed to use SSH config.'));
    console.error(e);
    process.exit(1);
  }
};

program.command('use <configName>').description('use ssh config').action(use);
