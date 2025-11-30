const { isValidElement } = require('react');
const React = require('react');

const {
    isCouponValidForUser,
    isCouponValidForCart,
    calculateDiscount,
    pickBestCoupon
} = require('../utils/couponMatcher');

// create coupon 
exports.createCoupon = (req, res) => {
    const coupon = req.body;

    const exists = global.coupons.find(c => c.code === coupon.code);
    if (exists) {
        return res.status(400).json({
            message: "Coupon code already exists"
        });
    }


    global.coupons.push(coupon);


    return res.status(201).json({
        message: "Coupon created successfully",
        data: coupon
    });
};

// Best coupon 

exports.getBestCoupon  = (req, res) => {
    const { user, cart } = req.body;

    // compute cart value 
    let cartValue = 0;
    cart.items.forEach(item => {
        cartValue += item.unitPrice * item.quantity;
    });

    // filter coupons 
    const validCoupons = [];

    global.coupons.forEach(coupon => {
        if (!isCouponValidForUser(coupon, user)) return;
        if (!isCouponValidForCart(coupon, cart, cartValue)) return;


        const discount = calculateDiscount(coupon, cartValue);

        validCoupons.push({ coupon, discount });
    });

    // no valid coupon 
    if (validCoupons.length === 0) {
        return res.json({ 
            coupon: null
        });
    }

    // pick best coupon 
    const best = pickBestCoupon(validCoupons);

    return res.json(best);
};

