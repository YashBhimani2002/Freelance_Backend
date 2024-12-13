const multer = require('multer');
const ProfessionalApplicationAttachment = require('../model/ProfessionalApplicationAttachment');
const User = require('../model/userModel');
exports.userProfileImageUpload = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploads/profile_attachments");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split(".").pop(); // Get the file extension
      cb(null, `profile-${uniqueSuffix}.${extension}`);
    },
  });
  const upload = multer({
    storage: storage,
  }).single('avatar'); // Change 'avatar' to match the field name in your form
  // Call the upload function
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err });
    }
    let userID;
     userID = req.body.userID;
    const filename = req.file ? req.file.filename : "";
    try {
      // Find the user with the corresponding userID
      const user = await User.findById({_id : userID});
      if (!user) {
     const user =  new User({
        avatar: filename,
       })
        await user.save()
        // return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ message: 'Avatar uploaded successfully' });
      }else{
          // Update the 'avatar' field with the filename
          user.avatar = filename;
          await user.save();
      }
      // Send a response indicating success
      return res.status(200).json({ message: 'Avatar uploaded successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
};
