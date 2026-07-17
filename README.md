## ssh-switch

[![npm version](https://img.shields.io/npm/v/ssh-switch.svg?style=flat-square)](https://www.npmjs.org/package/ssh-switch)
[![npm downloads](https://img.shields.io/npm/dm/ssh-switch.svg?style=flat-square)](https://npm-stat.com/charts.html?package=ssh-switch)

A lightweight CLI tool to manage and switch between multiple SSH configurations easily.

## Installation

```shell
# Install globally
npm i -g ssh-switch

# Or install as dev dependency
npm i -D ssh-switch
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

# Set or clear a proxy for a config
sshs proxy <configName> <host:port>   # e.g. 127.0.0.1:7897
sshs proxy <configName> off           # disable proxy

# Remove a config
sshs remove <configName>
```

## Proxy

Each config can carry optional proxy settings, useful when SSH to a host is slow
or blocked and you want it to go through a local HTTP/SOCKS proxy (Clash, etc.):

| Field      | Meaning                                                      |
| ---------- | ------------------------------------------------------------ |
| `Proxy`    | `host:port` — emitted as `ProxyCommand nc -X connect -x ...` |
| `HostName` | override the connect host (e.g. `ssh.github.com`)            |
| `Port`     | override the port (e.g. `443`)                               |

Set them interactively via `sshs add`, or afterwards with `sshs proxy`:

```shell
# Route GitHub SSH through a local proxy on port 7897, over port 443
# (--github expands to HostName ssh.github.com + Port 443)
$ sshs proxy work 127.0.0.1:7897 --github

# Custom host/port
$ sshs proxy work 127.0.0.1:7897 --hostname ssh.github.com --port 443

# Disable the proxy
$ sshs proxy work off
```

If the target config is the active one, `sshs proxy` re-writes `~/.ssh/config`
immediately; otherwise run `sshs use <configName>` to apply.

## Example

```shell
# Add your work GitHub account
$ sshs add
? Enter a name for this SSH config: work
? Host: github.com
? Path to SSH private key file: ~/.ssh/id_rsa_work

# Add your personal GitHub account
$ sshs add
? Enter a name for this SSH config: personal
? Host: github.com
? Path to SSH private key file: ~/.ssh/id_rsa_personal

# Switch to work account
$ sshs use work

# Check current config
$ sshs now
work is now in use
```

## License

MIT
