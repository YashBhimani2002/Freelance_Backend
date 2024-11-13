const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
// Use cookie parser middleware
app.use(cookieParser());

const generateToken = (payload) => {
  let secretKey = process.env.JWT_SECRET;
  const options = {
    expiresIn: "5d",
  };

  return jwt.sign(payload, secretKey, options);
};

async function getAllProductslogin(req, res) {
  const { email, password } = req.body;
  // Placeholder validation logic
  if (!email || !password) {
    return res.json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    // Placeholder login logic
    const user = await userModel.findOne({ email: email });
    if (user?.google_id != null) {
      return res.json({
        success: false,
        error: "This account was created using google sign-in.",
      });
    } else if (user?.facebook_id != null) {
      return res.json({
        success: false,
        error: "This account was created using facebook sign-in",
      });
    } else if (user?.linkedin_id != null) {
      return res.json({
        success: false,
        error: "This account was created using linkedin sign-in",
      });
    } else if (!email || !password) {
      return res.json({
        success: false,
        error: "Email and password are required",
      });
    } else if (!user) {
      return res.json({
        success: false,
        error: "Login Failed, No account found. Please register to proceed ",
      });
    }

    // Use bcrypt to compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({
        success: false,
        error: "Login Failed, please check password",
      });
    }

    if (user.status === 2) {
      return res.json({ success: false, error: "Your account is closed. Please contact Praiki support at praiki@gmail.com."});
    }else if (user.status === 0) {
      // Additional status checks and logic for different login_as values
      // ...
      return res.json({ success: false, error: "Login Failed, Inactive User" });
    } else {
      if (user.is_verified_user === 0) {
        return res.json({
          success: false,
          error: "Your verification is incomplete. Complete registration.",
          incomplete_profile: 1,
        });
      } else {
        const token = generateToken(user.toObject()); // Convert Mongoose document to plain JavaScript object
        const options = {
          // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          expires: new Date(Date.now() + 12 * 60 * 60 * 1000),

          // httpOnly: true,
        };

        res.cookie("authToken", token, options);

        return res.status(200).json({
          success: true,
          message: "Login Successfully",
          id: user._id,
          token: token,
          login_as: user.login_as,
          first_name: user.first_name,
          last_name: user.last_name,
        });
      }
    }
  } catch (error) {
    // console.error('Error during login:', error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function logOut(req, res) {
  res.cookie("authToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
}

module.exports = { getAllProductslogin, logOut };
