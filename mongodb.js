const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      // useNewUrlParser: true,
      tlsAllowInvalidCertificates: true,
    })
    .then(() => {
      console.log(`MongoDB connected to server: ${mongoose.connection.host}`);
    })
    .catch((error) => {
      // return res.status(500).json({ success: false, error: error });
    });
};

module.exports = connectDatabase;
