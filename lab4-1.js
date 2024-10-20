const {program} = require('commander')
const { existsSync } = require('fs')
const fs = require('fs')
const http = require('http')
const path = require('path')
const superagent = require('superagent')


program
    .requiredOption('-h, --host <host>')
    .requiredOption('-p, --port <port>')
    .requiredOption('-c, --cache <path>')
    .action((options) => {
        const host = options.host;
        const port = options.port;
        const cache = options.cache;
        
        const server = http.createServer(async (req, res) => {
            const code = req.url.slice(1)
            const filePath = path.join(cache, `${code}.jpg`);

            if (req.method === 'GET') {
                fs.promises.readFile(filePath)
                    .then((image) => {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                        res.end(image);
                    })
                    .catch((error) => {
                        superagent.get(`https://http.cat/${code}`)
                            .then((response) => {
                                const image = response.body;
                                return fs.promises.mkdir(cacheDir)
                                    .then(() => fs.promises.writeFile(filePath, image))
                                    .then(() => {
                                        
                                        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                                        res.end(image);
                                    });
                            })
                            .catch(() => {
                                res.writeHead(404, { 'Content-Type': 'text/plain' });
                                res.end('404 Not Found');
                            });
                    });
            }

        });
        server.listen(port, host)
    });
    
program.parse();



    