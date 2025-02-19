//import express
const express=require('express')

// import usercontroller
const usercontroller=require('./controllers/usercontroller')

//instance router
const router=new express.Router

//Login
router.post('/login',usercontroller.login)
router.post("/add", usercontroller.addUser);



//register 
router.post('/register',usercontroller.register)








module.exports=router