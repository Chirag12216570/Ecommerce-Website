const express = require('express');
const router = express.Router();
const { getProductTrends, getVisitorLogs } = require('../controllers/dashboard');

router.get('/products', getProductTrends);
router.get('/visitors', getVisitorLogs);

module.exports = router;
