const express = require('express');
const router = express.Router();

const {
    createCoupon,
    getBestCoupon
} = require("../controllers/couponController");

router.post('/coupon', createCoupon);
router.post('/coupon/best', getBestCoupon);


module.exports = router;