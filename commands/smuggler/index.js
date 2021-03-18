exports.yargs = {
    command: 'smuggler [target]',
    describe: 'HTTP request smuggling tool',

    builder: {
        ...require('@pown/connect/commands/connect/options/connect'),
        ...require('@pown/connect/commands/connect/options/scheduler'),

        ...require('@pown/request/commands/request/options/output'),

        'task-concurrency': {
            alias: ['C'],
            type: 'number',
            describe: 'The number of smuggler tasks to run at the same time',
            default: Infinity
        },

        'header': {
            alias: ['H'],
            type: 'string',
            describe: 'Custom header'
        },

        'data': {
            alias: ['d'],
            type: 'string',
            describe: 'Data to send'
        },

        'json-data': {
            alias: ['D'],
            type: 'string',
            describe: 'Data to send (json encoded string)'
        },

        'smuggled-method': {
            alias: [],
            type: 'string',
            describe: 'HTTP method used for smuggled request',
            default: 'GET'
        },

        'smuggled-host': {
            alias: [],
            type: 'string',
            describe: 'HTTP host used for smuggled request',
            default: ''
        },

        'smuggled-path': {
            alias: [],
            type: 'string',
            describe: 'HTTP path used for smuggled request',
            default: '/'
        },

        'smuggled-header': {
            alias: [],
            type: 'string',
            describe: 'HTTP header used for smuggled request',
            default: 'X-Ignore: X'
        },

        'smuggled-data': {
            alias: [],
            type: 'string',
            describe: 'HTTP data used for smuggled request'
        },

        'smuggled-json-data': {
            alias: [],
            type: 'string',
            describe: 'HTTP data used for smuggled request (json encoded string)'
        }
    },

    handler: async(argv) => {
        const { taskConcurrency, header, data, jsonData, smuggledMethod, smuggledHost, smuggledPath, smuggledHeader, smuggledData, smuggledJsonData, target } = argv

        const { Scheduler } = require('@pown/connect/lib/scheduler')

        const scheduler = new Scheduler()

        require('@pown/connect/commands/connect/options/connect/handler').init(argv, scheduler)
        require('@pown/connect/commands/connect/options/scheduler/handler').init(argv, scheduler)

        require('@pown/request/commands/request/options/output/handler').init(argv, scheduler)

        const url = require('url')
        const http = require('@pown/http')

        scheduler.on('connect-finished', (request, response) => {
            const req = http.parseRequest(request.data)
            const res = { ...req, ...http.parseResponse(response.responseData) }

            // TODO: use http.parseUrl and http.buildUrl for normalized URLs

            res.uri = url.format({
                protocol: request.tls ? 'https:' : 'http:',
                hostname: request.host,
                port: request.port,
                path: request.path
            })

            scheduler.emit('request-finished', req, res)
        })

        const headersToSend = Array.isArray(header) ? header : [header]

        const bodyToSend = data ? data : jsonData ? JSON.parse(`"${jsonData}"`) : ''

        const smuggledHeadersToSend = Array.isArray(smuggledHeader) ? smuggledHeader : [smuggledHeader]

        const smuggledBodyToSend = smuggledData ? smuggledData : smuggledJsonData ? JSON.parse(`"${smuggledJsonData}"`) : ''

        const { smuggle } = require('../../lib/smuggler')

        const { makeLineIterator } = require('@pown/cli/lib/line')
        const { eachOfLimit } = require('@pown/async/lib/eachOfLimit')

        const it = makeLineIterator(target)

        await eachOfLimit(it(), taskConcurrency, async(target) => {
            if (!target) {
                return
            }

            target = target.trim()

            if (!target) {
                return
            }

            const { protocol, hostname, port, path } = url.parse(target)

            try {
                await smuggle({
                    port: port || (protocol === 'https:' ? 443 : 80),

                    tls: protocol === 'https:',

                    host: hostname,
                    path: path,
                    headers: headersToSend.join('\r\n'),
                    body: bodyToSend,

                    smuggledMethod: smuggledMethod,
                    smuggledHost: smuggledHost || hostname,
                    smuggledPath: smuggledPath,
                    smuggledHeaders: smuggledHeadersToSend.join('\r\n'),
                    smuggledBody: smuggledBodyToSend,

                    scheduler: scheduler
                })
            }
            catch (e) {
                console.error(e)
            }
        })
    }
}
