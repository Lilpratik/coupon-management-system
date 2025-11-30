# Coupon Management System

A simple backend service that manages ecommerce coupons and returns the best applicable coupon for a given user and cart.

---

## Tech Stack

- Node.js
- Express.js
- In-Memory Storage (no database)
- Postman for API testing

---

## Project Structure

coupon-system/
├── controllers/
│   └── couponController.js
├── routes/
│   └── couponRoutes.js
├── utils/
│   └── couponMatcher.js
├── server.js
├── package.json
└── README.md

---

## Features

- Create coupons with eligibility rules
- Check user attributes and cart attributes
- Compute flat or percentage discount
- Compare all coupons and return the best one
- In-memory store (resets on restart)
- Deterministic tie-breaking rules:
  1. Highest discount
  2. Earlier endDate
  3. Lexicographically smaller code

---

## How to Run Locally

### 1. Clone repository

git clone https://github.com/Lilpratik/coupon-management-system.git
cd coupon-system

### 2. Install dependencies

npm install

### 3. Start the server

npm start

Server runs at:
http://localhost:5000

---

# API Endpoints

---

## 1. Create Coupon  
POST /api/coupon

## LIVE BACKEND URL : https://coupon-management-system-production.up.railway.app/api/coupon

Example (Flat Discount):

{
  "code": "WELCOME100",
  "description": "Flat ₹100 off for new users",
  "discountType": "FLAT",
  "discountValue": 100,
  "startDate": "2024-01-01",
  "endDate": "2026-12-31",
  "usageLimitPerUser": 1,
  "eligibility": {
    "allowedUserTiers": ["NEW"],
    "minLifetimeSpend": 0,
    "minOrdersPlaced": 0,
    "firstOrderOnly": true,
    "allowedCountries": ["IN"],
    "minCartValue": 500,
    "applicableCategories": ["electronics", "fashion"],
    "excludedCategories": ["grocery"],
    "minItemsCount": 1
  }
}

Example (Percentage Discount):

{
  "code": "FASHION10",
  "description": "10% off on fashion",
  "discountType": "PERCENT",
  "discountValue": 10,
  "maxDiscountAmount": 300,
  "startDate": "2023-01-01",
  "endDate": "2026-12-31",
  "usageLimitPerUser": 5,
  "eligibility": {
    "allowedUserTiers": ["NEW", "REGULAR"],
    "allowedCountries": ["IN", "US"],
    "applicableCategories": ["fashion"]
  }
}

---

## 2. Get Best Coupon  
POST /api/coupon/best

## LIVE BACKEND URL : https://coupon-management-system-production.up.railway.app/api/coupon/best

{
  "user": {
    "userId": "u123",
    "userTier": "NEW",
    "country": "IN",
    "lifetimeSpend": 1000,
    "ordersPlaced": 0
  },
  "cart": {
    "items": [
      {
        "productId": "p1",
        "category": "fashion",
        "unitPrice": 800,
        "quantity": 2
      }
    ]
  }
}



Name:Pratik Mohite

GitHub Repo:(https://github.com/Lilpratik/coupon-management-system.git)

Live Demo Link:
https://coupon-management-system-production.up.railway.app/

--> use /api/coupon              --> to create coupons 


--> use /api/coupon/best         --> to get the best matching coupon or the cart


Tech Stack Used:

Node.js, Express.js, In-Memory Storage

Notes for Reviewer:

Built according to assignment requirements

Fully supports coupon creation, eligibility rules & deterministic coupon selection

Includes clear logic separation (controllers, routes, utils)

No DB used (per assignment instructions)

Example test inputs provided in README

In-memory storage resets on restart

