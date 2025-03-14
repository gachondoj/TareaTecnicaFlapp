const Router = require('koa-router');
const cart = require('./cart.js');

const router = new Router();

router.use('/api/cart', cart.routes());

module.exports = router;