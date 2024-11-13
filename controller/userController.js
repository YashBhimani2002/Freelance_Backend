const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
// const userModel = require('../model/userModel');
const Subscription = require("../model/Subscription");
const postmark = require("postmark");
const MailTemplate = require("../model/MailTemplate");
const jwt = require("jsonwebtoken");
const Country = require("../model/CountryModel");
const State = require("../model/StateModel");
const City = require("../model/CitiesModel");
const Skill = require("../model/SkillsModel");
const dotenv = require("dotenv");
const Category = require("../model/CategoriesModel");
const User = require("../model/userModel");
const Client = require("../model/ClientModel");
const categoryjob = require("../model/CategoryJobModel");
const { OAuth2Client } = require("google-auth-library");
const providertbl = require("../model/ProviderTblModel");
const crypto = require("crypto");
const fetch = require("node-fetch");
const Professionals = require("../model/Professional");
const Contact = require("../model/contactUs");
const storagePath = "public/uploads/contact_us";
const fs = require("fs");
const multer = require("multer");




dotenv.config();

const generateToken = (payload) => {
  let secretKey = process.env.JWT_SECRET;
  const options = {
    expiresIn: "15m",
  };

  return jwt.sign(payload, secretKey, options);
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    const secretKey = process.env.JWT_SECRET;

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return "Invalid Token";
      } else {
        resolve(decoded);
      }
    });
  });
};

exports.verifyTokenApi = async (req, res) => { };

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname.split(".")[0]}_${Date.now()}.${file.originalname.split(".")[1]
      }`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

exports.contactus = async (req, res) => {
  try {
    upload.single("files")(req, res, async function () {
      const {
        email,
        subject,
        contactReason,
        description,
        attachments,
      } = req.body
      const file = req.file;
      const filesName = file.filename;

      if (
        !email ||
        !subject ||
        !contactReason ||
        !description
      ) {
        return res
          .status(400)
          .json({ success: false, error: "All fields are required" });
      }

      const newUser = await Contact.create({
        email,
        subject,
        contactReason,
        description,
        filesName,
      });

      res.status(201).json({
        success: true,
        message: "Data Added Successfully",
        data: newUser,
      });
    })
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err: "Internal Server Error" });
  }
}

exports.registration = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      country,
      termsconditions,
      login_as,
      subscription,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !country ||
      !termsconditions
    ) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const newUser = await User.create({
      first_name: firstname,
      last_name: lastname,
      email,
      password: password,
      country,
      login_as,
      email_verified_at: new Date(),
      remember_token: req.body._token,
      is_verified_user: 1,
      status: 1,
      created_at: new Date(),
    });

    if (req.body.subscription) {
      const subscription = await Subscription.findOne({
        where: { subscriber_email: email },
      });
      if (!subscription) {
        await Subscription.create({ subscriber_email: email, status: "1" });
      }
    }

    res.status(201).json({
      success: true,
      message: "Data Added Successfully",
      data: { id: newUser.id, email },
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001) {
      return res.json({ success: false, error: "Email already exists" });
    }

    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.googleRegistration = async (req, res) => {
  try {
    const { userProfile } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res
        .status(201)
        .json({ success: false, error: "Email already exists" });
    }

    const newUser = await User.create({
      first_name: payload.given_name,
      last_name: payload.family_name,
      email: payload.email,
      login_as: userProfile,
      email_verified_at: new Date(),
      is_verified_user: 0,
      status: 1,
      google_id: payload.sub,
      created_at: new Date(),
    });
    sendEmailUser(payload.given_name, payload.family_name, payload.email, "google");
    const authTokenGenerate = generateToken(newUser.toObject());
    const authTokenOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    res.cookie("authToken", authTokenGenerate, authTokenOptions);

    return res.status(200).json({
      success: true,
      message: "SignUp Successful!",
      data: { authToken: authTokenGenerate, newUser: newUser },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

async function sendEmailUser(
  first_name,
  last_name,
  email,
  eventType
) {
  // const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

  try {
    // if (!email) {
    //   return { success: false, message: "Email is required" };
    // }

    // const client = new postmark.ServerClient(POSTMARK_TOKEN);

    // let subject = "";
    // let htmlBody = "";
    // switch (eventType) {
    //   case "google":
    //     subject = "Google Account Verification Successful";
    //     htmlBody = `<p>Hello ${first_name} ${last_name},</p>
    //       <p>I'm pleased to inform you that your Google account verification is complete. If you did not authorize this sign in, go to your Google account to change your password.</p>
    //       <p>Thank you.</p>
    //       <p>Praiki</p>`;
    //     break;
    //   case "facebook":
    //     subject = "Facebook Account Verification Successful";
    //     htmlBody = `<p>Hello ${first_name} ${last_name},</p>
    //       <p>I'm pleased to inform you that your Facebook account verification is complete. If you did not authorize this sign-in, please visit your Facebook account to change your password.</p>
    //       <p>Thank you.</p>
    //       <p>Praiki</p>`;
    //     break;
    //   case "linkedin":
    //     subject = "Linkedin Account Verification Successful";
    //     htmlBody = `<p>Hello ${first_name} ${last_name},</p>
    //       <p>I'm pleased to inform you that your LinkedIn account verification is complete. If you did not authorize this sign-in, please visit your LinkedIn account to change your password.</p>
    //       <p>Thank you.</p>
    //       <p>Praiki</p>`;
    //     break;
    //   default:
    //     return { success: false, message: "Invalid event type" };
    // }
    // const sendEmail = await client.sendEmail({
    //   From: `Praiki <noreply@praiki.com>`,
    //   To: email,
    //   Subject: subject,
    //   HtmlBody: htmlBody,
    // });

    return { success: false, message: "done" };
  }
  catch (error) {
    return { success: false, message: error.message };
  }
}

function atob(str) {
  return Buffer.from(str, "base64").toString("binary");
}

function btoa(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function parseSignedRequest(signedRequest, secret) {
  var encodedData = signedRequest.split(".");
  var sig = encodedData[0];
  var json = atob(encodedData[1]);
  var data = JSON.parse(json);

  if (!data.algorithm || data.algorithm.toUpperCase() !== "HMAC-SHA256") {
    throw Error(
      "Unknown algorithm: " + data.algorithm + ". Expected HMAC-SHA256"
    );
  }

  var expectedSig = crypto
    .createHmac("sha256", secret)
    .update(encodedData[1])
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace("=", "");
  if (sig !== expectedSig) {
    throw Error("Invalid signature: " + sig + ". Expected " + expectedSig);
  }

  return data;
}

exports.facebookRegistration = async (req, res) => {
  try {
    const { loginAs } = req.body;
    const authHeader = req.headers["authorization"];
    const accessToken = req.headers["authorizationaccess"];
    const token = authHeader && authHeader.split(" ")[1];
    const access_Token = accessToken && accessToken.split(" ")[1];
    const secret = process.env.FACEBOOK_SECRET;
    const data = parseSignedRequest(token, secret);

    // Make a request to the Facebook Graph API to get user details, including email
    const userDetailsResponse = await fetch(
      `https://graph.facebook.com/v14.0/${data.user_id}?fields=id,name,email,picture&access_token=${access_Token}`,
      {
        method: "GET",
      }
    );

    const userDetails = await userDetailsResponse.json();
    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser) {
      return res
        .status(201)
        .json({ success: false, error: "Email already exists" });
    }
    const nameParts = userDetails.name.split(" ");

    // Extract the first name and last name
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: userDetails.email,
      login_as: loginAs,
      email_verified_at: new Date(),
      is_verified_user: 0,
      status: 1,
      facebook_id: userDetails.id,
      created_at: new Date(),
    });
    sendEmailUser(firstName, lastName, userDetails.email, "facebook");

    const authTokenGenerate = generateToken(newUser.toObject()); // Convert Mongoose document to plain JavaScript object
    const authTokenOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    res.cookie("authToken", authTokenGenerate, authTokenOptions);

    res.status(200).json({
      success: true,
      message: "Data Added Successfully",
      data: {
        id: newUser.id,
        email: userDetails.email,
        authToken: authTokenGenerate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = req.headers["authorizationaccess"];
    const token = authHeader && authHeader.split(" ")[1];
    const access_Token = accessToken && accessToken.split(" ")[1];
    const secret = process.env.FACEBOOK_SECRET;

    const data = parseSignedRequest(token, secret);
    // Make a request to the Facebook Graph API to get user details, including email
    const userDetailsResponse = await fetch(
      `https://graph.facebook.com/v14.0/${data.user_id}?fields=id,email&access_token=${access_Token}`,
      {
        method: "GET",
      }
    );

    const userDetails = await userDetailsResponse.json();
    const user = await User.findOne({ email: userDetails.email });

    if (!user) {
      return res.status(201).json({ success: false, error: "User not found" });
    }
    if (user.status === 0) {
      return res.json({ success: false, error: "Login Failed, Inactive User" });
    }
    if (user.status === 2) {
      return res
        .status(201)
        .json({ success: false, error: "Your Account has been closed." });
    }
    const loginToken = generateToken(user.toObject()); // Convert Mongoose document to plain JavaScript object
    const authTokenOptions = {
      // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),

    };

    res.cookie("authToken", loginToken, authTokenOptions);
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      id: user._id,
      authToken: loginToken,
      login_as: user.login_as,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.linkedInRegister = async (req, res) => {
  try {
    const { loginAs } = req.body;
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        error: "Authorization code not found in query parameters",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!loginAs) {
      return res.status(400).json({
        success: false,
        error: "Sign up profile not found in query parameters",
      });
    }
    const accessTokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: token,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_SECRET,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        }),
      }
    );

    const accessTokenData = await accessTokenResponse.json();

    if (accessTokenData.error) {
      return res
        .status(400)
        .json({ success: false, error: accessTokenData.error_description });
    }

    const accessToken = accessTokenData.access_token;

    // Get user profile from LinkedIn
    const userProfileResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-li-format": "json",
        },
      }
    );

    const userData = await userProfileResponse.json();

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res
        .status(201)
        .json({ success: false, error: "Email already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      first_name: userData.given_name,
      last_name: userData.family_name,
      email: userData.email, // Fix: Use userData.email instead of userDetails.email
      login_as: loginAs,
      email_verified_at: new Date(),
      is_verified_user: 0,
      status: 1,
      facebook_id: userData.sub,
      created_at: new Date(),
    });

    sendEmailUser(userData.given_name, userData.family_name, userData.email, "sendEmailUser");

    const authTokenGenerate = generateToken(newUser.toObject()); // Convert Mongoose document to plain JavaScript object
    const authTokenOptions = {
      // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),

    };

    res.cookie("authToken", authTokenGenerate, authTokenOptions);

    // Send success response with user data
    res.status(200).json({
      success: true,
      message: "Data Added Successfully",
      data: {
        id: newUser.id,
        email: userData.email,
        authToken: authTokenGenerate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.linkedInLogin = async (req, res) => {
  try {
    const { loginAs } = req.body;
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        error: "Authorization code not found in query parameters",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];
    const accessTokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: token,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_SECRET,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        }),
      }
    );

    const accessTokenData = await accessTokenResponse.json();

    if (accessTokenData.error) {
      return res
        .status(400)
        .json({ success: false, error: accessTokenData.error_description });
    }

    const accessToken = accessTokenData.access_token;

    // Get user profile from LinkedIn
    const userProfileResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-li-format": "json",
        },
      }
    );

    const userData = await userProfileResponse.json();

    // Check if user with the same email already exists
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res.status(201).json({ success: false, error: "User not found" });
    }

    if (user.linkedin_id != userData.id) {
      return res.status(201).json({ success: false, error: "Invalid user" });
    }
    if (user.status === 0) {
      return res.json({ success: false, error: "Login Failed, Inactive User" });
    }
    if (user.status === 2) {
      return res
        .status(201)
        .json({ success: false, error: "Your Account has been closed." });
    }

    const loginToken = generateToken(user.toObject()); // Convert Mongoose document to plain JavaScript object
    const authTokenOptions = {
      // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),

    };

    res.cookie("authToken", loginToken, authTokenOptions);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      id: user._id,
      authToken: loginToken,
      login_as: user.login_as,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.userVerify = async (req, res) => {
  const { email } = req.body;

  const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

  
  try {
    const user = await User.findOne({ email });
    const email_to = user.email;
    if (email_to === email) {
      const activation_token = generateToken({ user });
      var verify_link;
      if (user.login_as === 1) {
        // verify_link = `${process.env.BASE_URL}/create-company-profile/${activation_token}`;
        verify_link = `${process.env.BASE_URL}/login?activation_token=${activation_token}`;
      } else if (user.login_as === 2) {
        // verify_link = `${process.env.BASE_URL}/company-profile/${activation_token}`;
        verify_link = `${process.env.BASE_URL}/login?activation_token=${activation_token}`;
      }

      const client = new postmark.ServerClient(
        "969cc657-e31a-4445-b65e-91baef9ad050"
      );
      console.log(verify_link, "....", user.login_as);
      
      const sendEmail = await client.sendEmail({
        From: "yashbhimani117@gmail.com",
        To: email_to,
        Subject: "Verify Email",
        HtmlBody: `<p>
        Hi ${user.first_name} ${user.last_name},
        <br />
        <br />
        Click the following link for email confirmation - <a href=${verify_link}>Click Here</a> and follow the prompt to login to your account. 
        <br />
        <br />
        A complete profile helps you get the best out of Praiki.
        <br />
        <br />
        Thanks,
        <br />
        Praiki
      </p>`,
      });
      return res.status(200).json(sendEmail);
    } else {
      return res.status(404).json({ error: "Email Not Found" });
    }
  } catch (error) {
    console.error(error);

    if (error instanceof postmark.Errors.InvalidAPIKeyError) {
      return res.status(401).json({ error: "Invalid API Key" });
    }

    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message || error}` });
  }
};
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;
  var decodedData = null;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    decodedData = decoded;
  });

  if (decodedData !== null) {
    try {
      const user = await User.findOne({ email: decodedData.user.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.email_verified_at = new Date().toISOString();
      user.is_verified_user = 1;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Email verified successfully. Login below." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: `Internal Server Error ${error.message || error}` });
    }
  }
};

exports.logOut = (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "Logout successful" });
};

exports.newPasswordProcess = async (req, res) => {
};

exports.forgotPasswordProcess = async (req, res) => {
  const { email } = req.body;

  const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }

    const user = await User.findOne({ email: email });

    // const generateToken = (payload) => {
    //   let secretKey = process.env.JWT_SECRET;
    //   const options = {
    //     expiresIn: "15m",
    //   };

    //   return jwt.sign(payload, secretKey, options);
    // };

    if (user) {
      const activationToken = generateToken({ email: email });

      const verifyLink = `https://localhost:3000/reset/${activationToken}`;
      const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;
      var client = new postmark.ServerClient(POSTMARK_TOKEN);

      const sendEmail = client.sendEmail({
        From: `yashbhimani117@gmail.com`,
        To: email,
        Subject: "Forgot Password",
        HtmlBody: `<p>Hello ${user.first_name} ${user.last_name},</p>

        <p>Please <a href=${verifyLink}>Click Here</a> for Change your Password.</p>
        
        <p>Thank you.</p>`,
      });

      return res.status(200).json({
        success: true,
        message: "Mail Sent Successfully",
        data: await sendEmail,
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "User does not exist." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.google_id) {
      return res.status(404).json({
        success: false,
        message:
          "This email is associated with a Google account. Please use the Gmail login option to access your account.",
      });
    }

    const resetToken = user.getResetPasswordToken();
    user.resetPasswordToken = resetToken;
    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(email, resetToken, user);

    res.status(200).json({
      success: true,
      message: `Email sent to ${email} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

const sendPasswordResetEmail = async (email, resetToken, user) => {
  try {
    const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;
    const client = new postmark.ServerClient(POSTMARK_TOKEN);
    const verifyLink = `http://localhost:3000/reset-password/${resetToken}`
    const message = {
      From: "yashbhimani117@gmail.com",
      To: email,
      Subject: "Password Recovery Email",
      HtmlBody: `<p>Hello ${user.first_name} ${user.last_name},</p>
      <p>Please <a href=${verifyLink}>Click Here</a> to Change your Password.</p>
      <p>Thank you.</p>`,
    };

    await client.sendEmail(message);
    return {
      success: true,
      message: `Email sent to ${email} successfully.`,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Email sending failed", 500);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email, password, token } = req.body;
    if (!email) {
      return res.status(400).json({ errors: "Email not found" });
    }

    const secrete = process.env.JWT_SECRET;

    jwt.verify(token, secrete, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid Token", error: err });
      }

      try {
        const user = await User.findOne({ email: email });
        if (!user || email !== decoded.email) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid token or user not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );

        return res
          .status(200)
          .json({ success: true, message: "Password changed successfully" });
      } catch (error) {
        console.error("Error finding user:", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = req.params.token;
  const newPassword = req.body.password;
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Reset Password Token is invalid or has been expired",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated Successful",
    });
  } catch (error) {
    next(error);
  }
};

exports.getCountries = async (req, res, next) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCountriesForSignup = async (req, res, next) => {
  try {
    const countries = await Country.find().select('name _id id emoji').lean();
    res.status(200).json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStates = async (req, res, next) => {
  try {
    const countryId = req.params.id;
    const countryExists = await Country.findOne({
      id: countryId,
    });

    if (!countryExists) {
      return res
        .status(404)
        .json({ error: "Resource not found: Country not found" });
    }

    const states = await State.find({
      country_id: countryId,
    });

    res.status(200).json(states);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCity = async (req, res, next) => {
  try {
    const stateId = req.params.id;

    const stateExists = await State.findOne({
      id: stateId,
    });

    if (!stateExists) {
      return res.status(404).json({ error: "State not found" });
    }

    exports.getAllSkills = async (req, res, next) => {
      try {
        const skills = await Skill.findAll();
        res.status(200).json(skills);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
    const cities = await City.find({
      state_id: stateId, // Assuming state_id is stored as ObjectId
    }).exec(); // Use exec() to execute the query and return a promise

    if (cities.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ status: 1 });
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.getCategories = async (req, res, next) => {
//   try {
//     const categories = await Category.find({ status: 1 });
//     res.status(200).json(categories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.getCategories = async (req, res, next) => {
  try {
    // Fetch only the required fields and status=1
    const categories = await Category.find({ status: { $in: [1, "1"] } })
      .select("_id name status createdAt")
      .lean();

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//create user google acount entry in user table
exports.handleGoogleCallback = async (req, res) => {
  try {
    const user = req.body;
    const findUser = await User.findOne({
      google_id: user.google_id,
      email: user.email,
    });

    if (findUser) {
      // Update user data
      const data = {
        google_id: user.google_id,
        google_token: user.google_token,
        login_as: findUser.login_as,
      };

      await User.findOneAndUpdate({ email: user.email }, data);

      if (findUser.status === 1) {
        if (findUser.login_as === 1 && findUser.client_profile_complete === 1) {
          return res.status(200).json({
            success: true,
            message: "Sign in successful",
            redirect: "/findjob",
          });
        } else if (
          findUser.login_as === 2 &&
          findUser.professional_profile_complete === 1
        ) {
          return res.status(200).json({
            success: true,
            message: "Sign in successful",
            redirect: "/findjob",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Sign in successful",
            redirect: "/users_edit_profile",
          });
        }
      } else {
        req.session.destroy();
        return res.json({ success: false, message: "Inactive user" });
      }
    } else if (user.user_type) {
      const newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        login_as: user.user_type,
        email: user.email,
        google_id: user.google_id,
        google_token: user.google_token,
        password: bcrypt.hashSync("123456", 10),
        country: "undefine",
        status: 1,
        client_profile_complete: user.user_type == 1 ? 1 : 0,
        professional_profile_complete: user.user_type == 2 ? 1 : 0,
      });

      await newUser.save().then((res) => {
        console.log(res);
      });

      if (user.user_type === 1) {
        const client = new Client({ user_id: newUser._id.toString() });
        await client.save();
      } else if (user.user_type === 2) {
        const provider = new providertbl({ user_id: newUser._id.toString() });
        await provider.save();
      }

      return res.status(200).json({
        success: true,
        message: "Login sucssefuly",
        redirect: "/users_edit_profile",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "You're not registered",
        redirect: "/get_started",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//Check user is logding useing google acount.
exports.googleLogin = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res
        .status(201)
        .json({ success: false, message: "User not found" });
    }

    if (
      (user.email === payload.email && user.google_id === null) ||
      user.google_id === undefined
    ) {
      return res.status(201).json({
        success: false,
        message:
          "User already signed up with Email and Password, Please use Email and Password",
      });
    }

    if (user.google_id === null || user.google_id === undefined) {
      return res.status(201).json({
        success: false,
        message:
          "User signed up with Email Password, Please use Email and Password",
      });
    }

    if (user.status === 2) {
      return res
        .status(201)
        .json({ success: false, message: "Your Account has been closed." });
    }
    if (user.status === 0) {
      return res.json({ success: false, error: "Login Failed, Inactive User" });
    }
    if (user.google_id != payload.sub) {
      return res.status(201).json({ success: false, message: "Invalid User" });
    }
    const authtoken = generateToken(user.toObject()); // Convert Mongoose document to plain JavaScript object
    const options = {
      // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
    };

    res.cookie("authToken", authtoken, options);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      id: user._id,
      token: authtoken,
      login_as: user.login_as,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    res.status(201).json({ success: false, error: error.message });
  }
};

exports.closeAccount = async (req, res) => {
  try {
    const id = req.body.userid;
    let user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    user.status = 2;
    await user.save();
    return res.status(200).json({ message: "Account closed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getJobCategories = async (req, res) => {
  try {
    const { id } = req.body;
    const jobs = await categoryjob.find({ category_id: id });
    const jobIds = jobs.map((job) => job.job_id);
    res.json({ jobIds: jobIds });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.switchaccount = async (req, res) => {
  try {
    const uid = req.user._id;
    const { login_as } = req.body;

    if (login_as == 1) {
      const clinet = await Client.findOne({ user_id: uid });
      const updateLoginStatus = await User.updateOne(
        { _id: uid },
        { $set: { login_as: 1 } }
      );
      const updatedUser = await User.findOne({ _id: uid });
      //Gnrete new token
      const newToken = await getNewTokent(updatedUser, res);
      ///.............
      if (clinet != null) {
        res.status(200).json({ route: "/projects", token: newToken });
      } else {
        const client = new Client({ user_id: uid });
        await client.save();
        res
          .status(200)
          .json({ route: "/profile/editprofile", token: newToken });
      }
    } else {
      const professional = await Professionals.findOne({ user_id: uid });
      const updateLoginStatus = await User.updateOne(
        { _id: uid },
        { $set: { login_as: 2 } }
      );
      const updatedUser = await User.findOne({ _id: uid });
      //Gnrete new token
      const newToken = await getNewTokent(updatedUser, res);
      ///.............
      if (professional != null) {
        res.status(200).json({ route: "/findjobs", token: newToken });
      } else {
        const newProfessionalId = await Professionals({ user_id: uid });
        await newProfessionalId.save();
        res
          .status(200)
          .json({ route: "/profile/editprofile", token: newToken });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getNewTokent = async (data, res) => {
  //Gnrete new token
  const authTokenGenerate = generateToken(data.toObject());
  const authTokenOptions = {
    // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
  };
  res.cookie("authToken", authTokenGenerate, authTokenOptions);
  return authTokenGenerate;
};

exports.changeStatus = async (req, res) => {
  try {
    const uid = req.user._id;
    
    const value = req.body.value;
    const filed = req.body.filed;
    await User.updateOne(
      { _id: uid },
      { $set: { [filed]: value } }
    );
    res.status(200).json({ status: true, message: 'successes' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
}