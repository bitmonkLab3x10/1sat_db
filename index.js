//import express
const express = require('express')
//import cors
const cors=require('cors')

//import router
const router = require('./router')

//import connection
require('./connection')


//create sever
const sat=express()

//server using cors
sat.use(cors())


//parse
sat.use(express.json())

//use router
sat.use(router)

//set port
const PORT=4000 || process.env.PORT

//listen
sat.listen(PORT,()=>{
    console.log("Server Running Successfully");
    
})
