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
        if(!existsSync(cache)){
            fs.promises.mkdir(cache);
        }

        const server = http.createServer((req, res) => {
            const code = req.url
            const filePath = path.join(cache, `${code}.jpg`);
            console.log(filePath)
            if (req.method === 'GET') {
                if(existsSync(filePath)){
                fs.promises.readFile(filePath)
                    .then((image) => {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                        res.end(image);
                    })
                }
                    else {
                        superagent.get(`https://http.cat/${code}`)
                            .then((response) => {
                                const image = response.body;
                                fs.promises.writeFile(filePath, image)
                                .then(()=>{
                                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                                    res.end(image);
                                })
                            })
                            .catch(() =>{
                                res.writeHead(404, { 'Content-Type': 'text/plain' });
                                res.end('404 Not Found');
                            })
                    }
                
                
            }
            else if (req.method === 'PUT'){
                let body = [];
                req.on('data', chunk => {body.push(chunk)});
                req.on('end', () => {
                    const buffer = Buffer.concat(body);
                    fs.promises.writeFile(path.join(cache, `${req.url}.jpg`), buffer)
                        .then(() => {
                            res.writeHead(201);
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(404);
                            res.end();
                        });
                    });
            }
            else if(req.method === 'DELETE'){
                fs.promises.rm(`${cache}${code}.jpg`);
                res.writeHead(200);
                res.end();
            }
            else {
                res.writeHead(405)
                res.end()
            }
        
        
    });
    server.listen(port, host)
});
    
program.parse();



    