var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { userRegister } = require('../models/registerModels');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const auth = require("../authorization");
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const { token } = require('morgan');

mongoose.connect(process.env.MONGO_URL)

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function (req, res, next) {

  try {
    console.log(req.body);
    console.log("register entered");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const hashConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

    const checkUser = await userRegister.find({ userFirstName: req.body.userFirstName });
    const checkUser2 = await userRegister.find({ userFirstName: req.body.userLastName });

    if (checkUser.length > 0 || checkUser2.length > 0) {
      res.status(401).json({ message: "User already exists. Change data to register." });
    }

    else if (hashPassword === hashConfirmPassword) {
      req.body.password = hashPassword
      req.body.confirmPassword = hashPassword
      const { userFirstName, userLastName, emailId, password, confirmPassword } = req.body;
      const newUserRegister = new userRegister({
        userFirstName,
        userLastName,
        emailId,
        password,
        confirmPassword
      });
      const registeredUser = await newUserRegister.save();
      console.log(registeredUser);
      res.status(201).send("Registered successfully !");


    } else {
      res.json({ message: "Passwords do not match" });

    }
  } catch (error) {
    console.log("Error", error);
    res.json({ message: "Something went wrong",errorOccured:error });
    res.json({ message: "Something went wrong", error:error });
  }

});



router.post('/login', async (req, res) => {
  try {
    const user = await userRegister.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      console.log(token);

      user.token = token;
      await user.save();

      res.json({ token, user, message: "Login Successfully" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/userData/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // console.log(userId);
    const user = await userRegister.findOne({ _id: userId });
    // console.log(user);
    if (!user) {
      res.status(401).json({ message: "Invalid User" })
    } else {
      res.status(200).json(user);
    }

  } catch (error) {
    console.error("Error", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
})




router.put("/updateUser/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userRegister.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await userRegister.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json({ message: " Profile Updated Successfully ! " });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/userData", auth, async (req, res) => {
  try {
    const user = await userRegister.find({ token: req.headers.authorization });
    if (!user) {
      res.status(401).json({ message: "Invalid User" })

    } else {
      res.status(200).json(user);
    }

  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


 
router.get("/forgetPassword/checkEmail/:id",async(req,res)=>{
  try {
    // console.log(req.params.id);
    const user = await userRegister.findOne({emailId:req.params.id});
   
    // console.log(user);
    if(!user){
      res.status(404).json({message:"User not found"})
    }else{

      const link = `http://localhost:3000/resetPassword/${user._id}`;

      const transporter = nodemailer.createTransport({
        service :"gmail",
        auth:{
          user : process.env.EMAIL,
          pass : process.env.PASSWORD
        }
      })

      const sendMail = async()=>{
        await transporter.sendMail({
          from : process.env.EMAIL,
          to : user.emailId,
          subject : "Reset Password",
          text : "Reset Your Password by using the mail linked",
          html : `<a href=${link} style={{color:"blue"}}>Click Here : ${link}</a> to reset your password`
        })
      }
    
sendMail()
.then(()=>{
  console.log("Email sent successfully");
  res.status(200).json({message:"mail has been send to reset the password "});
})
.catch((err)=>{
  console.log("Error", err);
  res.status(500).json({error:"Internal Server Error"});
});

     
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  

})



router.put("/forgetPassword/resetPassword/:id",async(req,res)=>{
  try {
    const user = await userRegister.findOne({_id:req.params.id});
    if(!user){
      res.status(404).json({message:"User not found"})
    }else{
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const hashConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);
      if(hashPassword === hashConfirmPassword){
        req.body.password = hashPassword
        req.body.confirmPassword = hashPassword
        const updatedUser = await userRegister.findByIdAndUpdate(user._id, req.body, { new: true });
        res.status(200).json({ message: " Password Updated Successfully ! " });
      }else{
        res.status(400).json({message:"Passwords do not match"})
      }
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  


})



// router.get("/data",async(req,res)=>{
//   try{
//     let sort = req.query.sort;
//     if(sort === "asc"){
//       sort = 1;
//     }else{
//       sort = -1;
//     }
//     const user = await userRegister.find().sort({userFirstName:sort});
//     res.status(200).json(user);
//   }catch(error){
//     console.error("Error", error);
//         res.status(500).json({ error: "Internal Server Error" });
//   }
// })



router.get("/data",async(req,res)=>{
    try{
      let page = parseInt(req.query.page) || 1;
      let perpage = 2;
      let skip = (page - 1) * perpage;
      let sort = req.query.sort;
      if(sort === "asc"){
        sort = 1;
      }
      else{
        sort = -1;
      }
 
      const user = await userRegister.find({},{userFirstName:1}).sort({userFirstName:sort}).skip(skip).limit(perpage);
      res.status(200).json(user);
    }catch(error){
      console.error("Error", error);
          res.status(500).json({ error: "Internal Server Error" });
    }
  });






module.exports = router;


























