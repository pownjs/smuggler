[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
![NPM](https://img.shields.io/npm/v/@pown/smuggler.svg)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/smuggler/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown Smuggler

HTTP request splitting / smuggling tool.

## Credits

This tool is part of [secapps.com](https://secapps.com) open-source initiative.

```
  ___ ___ ___   _   ___ ___  ___
 / __| __/ __| /_\ | _ \ _ \/ __|
 \__ \ _| (__ / _ \|  _/  _/\__ \
 |___/___\___/_/ \_\_| |_|  |___/
  https://secapps.com
```

### Authors

* [@pdp](https://twitter.com/pdp) - https://pdparchitect.github.io/www/

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown), but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Install smuggler:

```sh
$ pown modules install @pown/smuggler
```

Invoke directly from Pown:

```sh
$ pown smuggler
```

### Standalone Use

Install this module locally from the root of your project:

```sh
$ npm install @pown/smuggler --save
```

Once done, invoke pown cli:

```sh
$ POWN_ROOT=. ./node_modules/.bin/pown-cli smuggler
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown smuggler
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown-cli smuggler [target]

HTTP request smuggling tool

Options:
  --version                                                 Show version number  [boolean]
  --help                                                    Show help  [boolean]
  --connect-timeout, -t, --timeout                          Maximum time allowed for connection  [number] [default: 30000]
  --data-timeout, -T                                        Maximum time allowed for connection  [number] [default: 30000]
  --accept-unauthorized, -k, --insecure                     Accept unauthorized TLS errors  [boolean] [default: false]
  --connect-concurrency, -c                                 The number of connections to open at the same time  [number] [default: Infinity]
  --filter-response-code, --response-code, --filter-status  Filter responses with code  [string] [default: ""]
  --content-sniff-size, --content-sniff, --sniff-size       Specify the size of the content sniff  [number] [default: 5]
  --print-response-body, --print-body                       Print response body  [boolean] [default: false]
  --download-response-body, --download-body                 Download response body  [boolean] [default: false]
  --task-concurrency, -C                                    The number of smuggler tasks to run at the same time  [number] [default: Infinity]
  --header, -H                                              Custom header  [string]
  --data, -d                                                Data to send  [string]
  --json-data, -D                                           Data to send (json encoded string)  [string]
  --smuggled-method                                         HTTP method used for smuggled request  [string] [default: "GET"]
  --smuggled-host                                           HTTP host used for smuggled request  [string] [default: ""]
  --smuggled-path                                           HTTP path used for smuggled request  [string] [default: "/"]
  --smuggled-header                                         HTTP header used for smuggled request  [string] [default: "X-Ignore: X"]
  --smuggled-data                                           HTTP data used for smuggled request  [string]
  --smuggled-json-data                                      HTTP data used for smuggled request (json encoded string)  [string]
```
