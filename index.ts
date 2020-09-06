import express, {RequestHandler} from "express"
import path from "path"
import cookieParser from "cookie-parser"
import * as fs from "fs";
import {v4 as uuid} from "uuid"

const port = 3000

const server = express()
// const staticPath = path.join(__dirname, "./dist")
// server.use(express.static(staticPath,{
//     cacheControl: false
// }))
// server.get("/", (req, res) => {
//     // res.write("OK")
//     const indexFile = fs.readFileSync("./dist/index.html")
//     res.write(indexFile)
// })
server.use(cookieParser())
/**
 \* Cross-Origin Resource Sharingを有効にする記述（HTTPレスポンスヘッダの追加）
 \*/
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    next();
});

/**
 \* OPTIONSメソッドの実装
 \*/
server.options('*', function (req, res) {
    res.sendStatus(200);
})


const sessionHandler: RequestHandler = (req, res, next) => {
    console.log('Cookies: ', req.cookies)
    next()
}
server.use(sessionHandler)
server.get("/", (req, res) => {
    // res.write("OK")
    res.cookie('ByRoot', new Date().getMilliseconds(), {path: "/", httpOnly: true, secure: false})
    res.cookie('byRootNotHttpOnly', new Date().getMilliseconds(), {path: "/", httpOnly: false, secure: false})
    res.send(`
    <form action="http://localhost:3000/toBRedirect">
        <input type="submit" value="Redirect To B"/>
    </form>
        <form action="/">
            <input type="submit" value="Refresh">
        </form>
        <form action="http://192.168.1.31:3000/B">
            <input type="submit" value="Direct to B"/>
        </form>
    `)
})
server.get("/toBRedirect", (req, res) => {
    res.writeHead(302, {
        'Location': 'http://192.168.1.31:3000/B'
    })
    res.end()
})
const authsUUID: Array<string> = []
server.get("/B", (req, res) => {

    if (authsUUID.includes(req.cookies.sessionId)) {
        console.log(`auth ok`)
        // auth OK
        res.writeHead(302, {
            'Location': `http://192.168.10.8:3000/?sessionId=${req.cookies.sessionId}`
        })
        res.end()
        return
    }
    console.log(`auth ng`)
    console.log(`auth session`)
    console.log(`request session ${req.cookies.sessionId}`)
    authsUUID.forEach(e => console.log(e))

    res.cookie('byB', new Date().getMilliseconds(), {path: "/B", httpOnly: true, secure: false})
    res.cookie('byBNotHttpOnly', new Date().getMilliseconds(), {path: "/B", httpOnly: false, secure: false})

    const sessionId = uuid()
    authsUUID.push(sessionId)
    // res.cookie('sessionId', sessionId, {secure:true, httpOnly:true, sameSite: "lax"})
    res.cookie('sessionId', sessionId, {secure: false, httpOnly: true})
    res.cookie('sessionIdLax', sessionId, {sameSite: "lax"})
    res.cookie('sessionIdStrict', sessionId, {sameSite: "strict"})

    res.send(`
        <form action="http://localhost:3000/toARedirect">
            <input type="submit" value="Redirect to A"/>
        </form>
        <form action="/B">
            <input type="submit" value="Refresh">
        </form>
        <form action="http://192.168.10.8:3000/">
            <input type="submit" value="Direct to A"/>
        </form>
    `)
})
server.get("/toARedirect", (req, res) => {
    res.writeHead(302, {
        'Location': 'http://192.168.10.8:3000/'
    })
    res.end()
})

server.listen(port)
console.log(`http://localhost:${port}`)
console.log(`http://localhost:${port}/a`)
