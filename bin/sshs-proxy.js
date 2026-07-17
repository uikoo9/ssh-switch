import { program } from 'commander';
import chalk from 'chalk';
import { getDB, writeSshConfig } from './util.js';

const db = getDB();

// sshs proxy <configName> <proxy>
//   <proxy>  host:port to enable, or "off" to disable
//   --github shorthand for GitHub over 443 (HostName ssh.github.com, Port 443)
//   -H, --hostname <hostname>  override HostName
//   -p, --port <port>          set Port
const proxy = async (configName, proxyValue, options) => {
  try {
    const cfg = await db.config(configName);
    if (!cfg) {
      console.error(chalk.red(`SSH config "${configName}" not found.`));
      process.exit(1);
    }

    const next = { ...cfg };
    if (proxyValue === 'off') {
      delete next.Proxy;
      delete next.HostName;
      delete next.Port;
      console.log(chalk.blue(`Proxy disabled for "${configName}".`));
    } else {
      next.Proxy = proxyValue;
      const hostname = options.github ? 'ssh.github.com' : options.hostname;
      const port = options.github ? '443' : options.port;
      if (hostname) {
        next.HostName = hostname;
      }
      if (port) {
        next.Port = port;
      }
      console.log(chalk.blue(`Proxy set for "${configName}": ${proxyValue}`));
    }

    await db.config(configName, next);

    // re-apply immediately if this is the active config
    const active = await db.config('default');
    if (active === configName) {
      const block = await writeSshConfig(next);
      console.log(chalk.blue('Re-applied to ~/.ssh/config (active config).'));
      console.log(chalk.gray(block));
    } else {
      console.log(chalk.gray(`Run "sshs use ${configName}" to apply.`));
    }
  } catch (e) {
    console.error(chalk.red('Failed to update proxy.'));
    console.error(e);
    process.exit(1);
  }
};

program
  .command('proxy <configName> <proxy>')
  .description('set or clear a proxy for an ssh config ("off" to disable)')
  .option('--github', 'preset for GitHub over 443 (HostName ssh.github.com, Port 443)')
  .option('-H, --hostname <hostname>', 'override HostName')
  .option('-p, --port <port>', 'set Port')
  .action(proxy);
