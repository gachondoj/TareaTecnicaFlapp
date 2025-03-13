const Koa = require('koa');
const Logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const cors = require('@koa/cors');
require('dotenv').config();


const app = new Koa();

app.use(cors());
app.use(Logger());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());;

app.listen(3000);