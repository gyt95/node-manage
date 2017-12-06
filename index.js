const Koa = require('koa');

const bodyParser = require('koa-bodyparser');
const config = require('./config/default.js');
const controller = require('./controller.js')

const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const jwt = require('koa-jwt')
const app = new Koa();

app.use(jwt({secret: config.jwt_secret}).unless(
    {
        path:[
        /^\/api\/users\/signin/, 
        /^\/api\/users\/signup/]
    }
))


// session存储配置
const sessionMysqlConfig = {
    user: config.USERNAME,
    password: config.PASSWORD,
    database: config.DATABASE,
    host: config.HOST,
}

app.use(session({
    key: 'USER_SID', 
    store: new MysqlStore(sessionMysqlConfig) //指定存储方式，存储到mysql
}))

// 解析POST请求的请求体
app.use(bodyParser());

app.use(controller());

app.listen(7000);
console.log('Listening on port 7000... ')