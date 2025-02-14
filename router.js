//import express
const express=require('express')

// import usercontroller
const usercontroller=require('./controllers/usercontroller')

//instance router
const router=new express.Router

//register
router.post('/register',usercontroller.register)








module.exports=router