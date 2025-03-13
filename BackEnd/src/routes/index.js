const Router = require('koa-router');
const cart = require('./cart.js');

const router = new Router();

router.use('/cart', cart.routes());

module.exports = router;