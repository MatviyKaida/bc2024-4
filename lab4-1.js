const {program} = require('commander')
const fs = require('fs')
const http = require('http')

program
    .command ('server')
    .requiredOption('-h, --host <host>')
    .requiredOption('-p, --port <port>')
    .requiredOption('-c, --cache <path>')
    .action((options) => {
        const host = options.host;
        const port = options.port;
        const cache = options.cache;
        const server = http.createServer((req, res) => {
            res.statusCode = 200
        });
        server.listen(port, host)
    })
program.parse();



    