const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const fetchUser = require('../middlewares/fetchUser');

const router = express.Router();

const JWT_SECRET = '#11%6@2001';

// Create user : POST "/api/auth/createuser" : Not login require

router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
    body("name", "Enter a valid Name").isLength({ min: 3 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      // IF errors then return bad request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let user = await User.findOne(
        { email: req.body.email },
        { email: 1, _id: 0 }
      );

      if (user) return res.status(400).json({ error: "User Already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashPasswprd = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPasswprd,
      });
      
      const data = {
        user:{
          id : user._id
        }
      }

      const authToken = jwt.sign(data,JWT_SECRET);

      res.json({authToken});


    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Internal server Error Occured!" });    }
  }
);




// Authenticate a user : POST "/api/auth/login"

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can't be empty").exists(),
  ],
  async (req, res, next) => {

    // IF errors then return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email , password} = req.body;
    try{

      const user = await User.findOne({email : email});

      if(!user){
        return res.status(400).json({"error" : "Please, Try to login with correct credentials"});
      }

      const passwordCompare = await bcrypt.compare(password , user.password);

      if(!passwordCompare){
        return res.status(400).json({"error" : "Please, Try to login with correct credentials"});
      }

      const data = {
        user:{
          id : user._id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET);
      res.json({authToken});


    }catch(err){
      console.log(err.message);
      res.status(500).json({ error: "Internal server Error Occured!" });
    }

  });




// Get Logged in user's detail : POST "/api/auth/getuser"


router.post('/getuser' , fetchUser , async (req,res,next) => {
  
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password"); // gives everything accepts password
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server Error Occured!" });
  }
})


module.exports = router;
