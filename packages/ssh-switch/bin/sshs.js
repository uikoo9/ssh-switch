#!/usr/bin/env node

// qiao
const cli = require('qiao-cli');

// cmds
require('./sshs-add.js');
require('./sshs-list.js');
require('./sshs-remove.js');
require('./sshs-use.js');
require('./sshs-version.js');

// parse
cli.cmd.parse(process.argv);
