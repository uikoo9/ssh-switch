import os from 'node:os';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import { createStore } from './config-store.js';

export function getDB() {
  const dbPath = path.resolve(os.homedir(), './sshs.json');
  return createStore(dbPath);
}

// Build the ~/.ssh/config block for a single config entry.
// Optional fields: HostName (override), Port, Proxy (host:port -> ProxyCommand).
export function buildSshConfigBlock(cfg) {
  const lines = [`Host ${cfg.Host}`, `  HostName ${cfg.HostName || cfg.Host}`, '  User git', '  AddKeysToAgent yes'];
  if (process.platform === 'darwin') {
    lines.push('  UseKeychain yes');
  }
  lines.push('  IdentitiesOnly yes', `  IdentityFile ${cfg.IdentityFilePath}`);
  if (cfg.Port) {
    lines.push(`  Port ${cfg.Port}`);
  }
  if (cfg.Proxy) {
    lines.push(`  ProxyCommand nc -X connect -x ${cfg.Proxy} %h %p`);
  }
  return `\n${lines.join('\n')}\n`;
}

// Write the active config block to ~/.ssh/config and return the written text.
export async function writeSshConfig(cfg) {
  const filePath = path.resolve(os.homedir(), './.ssh/config');
  const block = buildSshConfigBlock(cfg);
  await writeFile(filePath, block, 'utf8');
  return block;
}

export function printConfigs(all, activeConfig) {
  const names = Object.keys(all).filter((k) => k !== 'default');
  if (names.length === 0) {
    console.log(chalk.gray('  No SSH configs found.'));
    return;
  }
  for (const name of names) {
    const prefix = name === activeConfig ? chalk.green('* ') : '  ';
    const cfg = all[name];
    const proxy = cfg.Proxy ? chalk.cyan(` [proxy ${cfg.Proxy}]`) : '';
    console.log(`${prefix}${chalk.bold(name)} ${chalk.gray(`(${cfg.Host} -> ${cfg.IdentityFilePath})`)}${proxy}`);
  }
}
