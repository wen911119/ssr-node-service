let headlessChrome
// 启动
(async function launch() {
    const puppeteer = require('puppeteer')
    headlessChrome = await puppeteer.launch()
})()

const http = require('http')


const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer(async (req, res) => {
    if (/favicon/.test(req.url)) {
        res.statusCode = 404
        res.end()
    } else {
        const fullUrl = req.headers.host + req.url
        console.log(fullUrl)
        let page = await headlessChrome.newPage()
        page.waitForSelector('#app').then(async function () {
            await page.evaluate(() => {
                Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
                    get() {
                        return {
                            emit: function (event, payload) {
                                if (event === 'vuex:init') {
                                    window._state_w_j = payload.state
                                }
                            },
                            on: function () { }
                        }
                    }
                });
            })
        })
        await page.goto('http://127.0.0.1:8887/#/ssrtest', { waitUntil: 'networkidle0' })
        let state = await page.evaluate(() => {
            document.getElementById('app').dataset.serverRendered = true
            return window._state_w_j
        })
        await page.addScriptTag({
            content: `window.__INITIAL_STATE__=${JSON.stringify(state)}`
        })
        const htmlString = await page.content()
        // 关闭页面回收资源
        await page.close()
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(htmlString)
    }
});

server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
})