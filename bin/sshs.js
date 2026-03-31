#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { program } from 'commander';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

program.version(pkg.version, '-v, --version').description('ssh switch').usage('<command>');

// cmds
import './sshs-add.js';
import './sshs-list.js';
import './sshs-now.js';
import './sshs-remove.js';
import './sshs-use.js';

// parse
program.parse(process.argv);
