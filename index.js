//import express
const express = require('express')
//import cors
const cors=require('cors')

//import router
const router = require('./router')

const path = require("path"); // ✅ Import path module

const compression = require("compression");


//import connection
require('./connection')
const faqRoutes = require("./Routes/faqRoutes");
const clientRoutes = require('./Routes/clientRoutes');




const productRoutes = require("./Routes/productRoutes");
const purchaseRoutes = require("./Routes/purchaseRoutes");
const authRoutes = require("./Routes/authRoutes");

//create sever
const sat=express()

//server using cors
sat.use(cors())

sat.use("/uploads", express.static(path.join(__dirname, "uploads")));


//parse
sat.use(express.json())

//use router
sat.use(router)
sat.use(compression());

sat.use("/products", productRoutes); // Product-related routes
sat.use("/purchases", purchaseRoutes); // Purchase-related routes
sat.use("/faqs", faqRoutes);
sat.use('/clients', clientRoutes);
sat.use('/auth', authRoutes);


//set port
const PORT=4000 || process.env.PORT

//listen
sat.listen(PORT,()=>{
    console.log("Server Running Successfully");
    
})
