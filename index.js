// //import express
// const express = require('express')
// //import cors
// const cors=require('cors')

// //import router
// const router = require('./router')

// const path = require("path"); // ✅ Import path module

// const compression = require("compression");


// //import connection
// require('./connection')
// const faqRoutes = require("./Routes/faqRoutes");
// const clientRoutes = require('./Routes/clientRoutes');




// const productRoutes = require("./Routes/productRoutes");
// const purchaseRoutes = require("./Routes/purchaseRoutes");
// const authRoutes = require("./Routes/authRoutes");

// //create sever
// const sat=express()

// //server using cors
// sat.use(cors())

// sat.use("/uploads", express.static(path.join(__dirname, "uploads")));


// //parse
// sat.use(express.json())

// //use router
// sat.use(router)
// sat.use(compression());

// sat.use("/products", productRoutes); // Product-related routes
// sat.use("/purchases", purchaseRoutes); // Purchase-related routes
// sat.use("/faqs", faqRoutes);
// sat.use('/clients', clientRoutes);
// sat.use('/auth', authRoutes);


// //set port
// const PORT= process.env.PORT || 4000;
// // const port = process.env.PORT
// //listen
// sat.listen(PORT,()=>{
//     console.log("Server Running Successfully  ${port}");
    
// })


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

// Import routes
const router = require('./router');
const faqRoutes = require("./Routes/faqRoutes");
const clientRoutes = require('./Routes/clientRoutes');
const productRoutes = require("./Routes/productRoutes");
const purchaseRoutes = require("./Routes/purchaseRoutes");
const authRoutes = require("./Routes/authRoutes");

// Initialize app
const sat = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = 'https://onesatui.onrender.com';
require('./connection')
// CORS Configuration
// const allowedOrigins = [
//   FRONTEND_URL,
//   'http://localhost:3000',
//   'https://onesatui.onrender.com'
// ];

// sat.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));
// sat.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
// sat.use(cors({
//   origin: FRONTEND_URL,
//   credentials: true
// }));
sat.use(cors());

// Middleware
sat.use(express.json());
sat.use(compression());
sat.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
sat.use(router);
sat.use("/products", productRoutes);
sat.use("/purchases", purchaseRoutes);
sat.use("/faqs", faqRoutes);
sat.use('/clients', clientRoutes);
sat.use('/auth', authRoutes);

// Health Check
sat.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    frontend: FRONTEND_URL,
    version: '1.0.0'
  });
});

// Start Server
sat.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});
