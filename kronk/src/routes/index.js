const { route } = require('./bus');

const router = require('express').Router();

// TODO: Add the rest of the routes here
router.use('/charger', require('./charger'));
router.use('/tpss', require('./tpss'));
router.use('/bus', require('./bus'));
router.use('/evr', require('./evr'))
router.use('/table', require('./table'));
router.use('/location', require('./location'));

module.exports = router;