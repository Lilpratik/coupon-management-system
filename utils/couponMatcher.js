// USER ELIGIBILITY CHECK
exports.isCouponValidForUser = (coupon, user) => {
  const e = coupon.eligibility || {};
  const code = coupon.code;
  const userId = user.userId;

  // usage limit
  if (coupon.usageLimitPerUser) {
    const usage = (global.userUsage[userId] || {})[code] || 0;
    if (usage >= coupon.usageLimitPerUser) return false;
  }

  // date validity
  const now = new Date();
  if (new Date(coupon.startDate) > now) return false;
  if (new Date(coupon.endDate) < now) return false;

  // allowed user tiers
  if (e.allowedUserTiers && e.allowedUserTiers.length > 0) {
    if (!e.allowedUserTiers.includes(user.userTier)) return false;
  }

  // min lifetime spend
  if (e.minLifetimeSpend) {
    if (user.lifetimeSpend < e.minLifetimeSpend) return false;
  }

  // min orders placed
  if (e.minOrdersPlaced) {
    if (user.ordersPlaced < e.minOrdersPlaced) return false;
  }

  // first order only
  if (e.firstOrderOnly === true) {
    if (user.ordersPlaced !== 0) return false;
  }

  // allowed countries
  if (e.allowedCountries && e.allowedCountries.length > 0) {
    if (!e.allowedCountries.includes(user.country)) return false;
  }

  return true;
};



// CART ELIGIBILITY CHECK

exports.isCouponValidForCart = (coupon, cart, cartValue) => {
  const e = coupon.eligibility || {};
  const items = cart.items;

  // min cart value
  if (e.minCartValue) {
    if (cartValue < e.minCartValue) return false;
  }

  // applicable categories
  if (e.applicableCategories && e.applicableCategories.length > 0) {
    const match = items.some(i => e.applicableCategories.includes(i.category));
    if (!match) return false;
  }

  // excluded categories
  if (e.excludedCategories && e.excludedCategories.length > 0) {
    const bad = items.some(i => e.excludedCategories.includes(i.category));
    if (bad) return false;
  }

  // minimum items count
  if (e.minItemsCount) {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    if (totalItems < e.minItemsCount) return false;
  }

  return true;
};



// DISCOUNT CALCULATION

exports.calculateDiscount = (coupon, cartValue) => {
  if (coupon.discountType === "FLAT") {
    return coupon.discountValue;
  }

  if (coupon.discountType === "PERCENT") {
    const raw = (cartValue * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount) {
      return Math.min(raw, coupon.maxDiscountAmount);
    }
    return raw;
  }

  return 0;
};


// BEST COUPON PICKER

exports.pickBestCoupon = (validCoupons) => {
  validCoupons.sort((a, b) => {

    // highest discount first
    if (b.discount !== a.discount) {
      return b.discount - a.discount;
    }

    // earlier end date
    const endA = new Date(a.coupon.endDate);
    const endB = new Date(b.coupon.endDate);
    if (endA - endB !== 0) return endA - endB;

    // lexicographically smallest code
    return a.coupon.code.localeCompare(b.coupon.code);
  });

  return validCoupons[0];
};
