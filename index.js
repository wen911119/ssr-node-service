let headlessChrome
// 启动
(async function launch() {
    const puppeteer = require('puppeteer')
    headlessChrome = await puppeteer.launch()
})()

let pagesPool = {}
const http = require('http')


const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer(async (req, res) => {
    // const page = await chrome.newPage()
    
    console.log(req.headers)
    console.log(req.url)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n')
});

server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
})