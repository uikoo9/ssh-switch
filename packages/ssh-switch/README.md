## ssh-switch

[![npm version](https://img.shields.io/npm/v/ssh-switch.svg?style=flat-square)](https://www.npmjs.org/package/ssh-switch)
[![npm downloads](https://img.shields.io/npm/dm/ssh-switch.svg?style=flat-square)](https://npm-stat.com/charts.html?package=ssh-switch)

A lightweight CLI tool to manage and switch between multiple SSH configurations easily.

## Installation

```shell
# Install as dev dependency
npm i -D ssh-switch

# Install globally
npm i -g ssh-switch
```

## Usage

```shell
# Show help
sshs
sshs -h

# Add a new SSH config
sshs add

# List all SSH configs
sshs list

# Show current SSH config in use
sshs now

# Switch to a specific config
sshs use <configName>

# Remove a config
sshs remove <configName>
```

## Example

```shell
# Add your work GitHub account
$ sshs add
? Enter a name for this SSH config: work
? Host: github-work
? Path to SSH private key file: ~/.ssh/id_rsa_work

# Add your personal GitHub account
$ sshs add
? Enter a name for this SSH config: personal
? Host: github-personal
? Path to SSH private key file: ~/.ssh/id_rsa_personal

# Switch to work account
$ sshs use work

# Check current config
$ sshs now
work is now in use
```

## License

MIT
