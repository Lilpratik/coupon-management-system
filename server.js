const express = require('express');
const app = express();

const couponRoutes = require('./routes/couponRoutes');

app.use(express.json());

// In memory storage 
global.coupons = [];
global.userUsage = {};

app.use('/api', couponRoutes);


// starting the server 
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/`);
});

