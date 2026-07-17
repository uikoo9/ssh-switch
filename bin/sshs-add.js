import { program } from 'commander';
import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { getDB, printConfigs } from './util.js';

const db = getDB();

// Optionally collect proxy settings (Proxy / HostName / Port).
const promptProxy = async (Host) => {
  const wantProxy = await confirm({ message: 'Configure a proxy for this host?', default: false });
  if (!wantProxy) {
    return {};
  }
  const Proxy = await input({
    message: 'Proxy address (host:port, e.g. 127.0.0.1:7897):',
    validate: (v) => (v.trim() ? true : 'Proxy cannot be empty.'),
  });
  const HostName = await input({ message: `HostName override (empty to keep "${Host}"):` });
  const Port = await input({ message: 'Port (empty for default):' });
  return {
    Proxy: Proxy.trim(),
    ...(HostName.trim() ? { HostName: HostName.trim() } : {}),
    ...(Port.trim() ? { Port: Port.trim() } : {}),
  };
};

const add = async () => {
  try {
    const Name = await input({
      message: 'Enter a name for this SSH config:',
      validate: (v) => (v.trim() ? true : 'Name cannot be empty.'),
    });
    if (Name === 'default') {
      console.error(chalk.red('"default" is a reserved name. Please choose another.'));
      process.exit(1);
    }

    const Host = await input({
      message: 'Host:',
      validate: (v) => (v.trim() ? true : 'Host cannot be empty.'),
    });
    const IdentityFilePath = await input({
      message: 'Path to SSH private key file:',
      validate: (v) => (v.trim() ? true : 'Path cannot be empty.'),
    });
    const proxyFields = await promptProxy(Host);
    console.log();

    // check
    const dbValue = await db.config(Name);
    if (dbValue) {
      console.error(chalk.red('SSH config name already exists.'));
      process.exit(1);
    }

    // set
    await db.config(Name, { Name, Host, IdentityFilePath, ...proxyFields });
    console.log(chalk.blue('SSH config added successfully.'));
    console.log();

    // list
    const all = await db.all();
    printConfigs(all, all.default);
  } catch (e) {
    console.error(chalk.red('Failed to add SSH config.'));
    console.error(e);
    process.exit(1);
  }
};

program.command('add').description('add ssh config').action(add);
