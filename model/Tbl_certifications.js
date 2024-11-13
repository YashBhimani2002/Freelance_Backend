const mongoose = require('mongoose');
const certifications = new mongoose.Schema({
    user_id: {
        ref: 'User',
        type: String,
        required: true,
    },
    certification_for: String,
    certificate_in: String,
    certificate_start_date: String,
    certificate_end_date: String,
}, { timestamps: true });

module.exports = mongoose.model('certifications', certifications);












// const { Sequelize, DataTypes } = require('sequelize');
// const config = require('../config');

// const sequelize = new Sequelize(config.development);


// const TblCertifications = sequelize.define('TblCertifications', {
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     certification_for: {
//       type: DataTypes.STRING,
//     },
//     certificate_in: {
//       type: DataTypes.STRING,
//     },
//     certificate_start_date: {
//       type: DataTypes.DATE,
//     },
//     certificate_end_date: {
//       type: DataTypes.DATE,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//     },
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//   }, {
//     tableName: 'tbl_certifications',
//     timestamps: false, // Assuming you have created_at and updated_at columns
//   });
  
//   // Now you can use TblCertifications to perform database operations
  
//   // Example: Retrieve all certifications
  
//   // Example: Create a new certification
//   TblCertifications.create({
//     user_id: 1,
//     certification_for: 'Some Certification',
//     certificate_in: 'Some Course',
//     certificate_start_date: new Date(),
//     certificate_end_date: new Date(),
//     created_at: new Date(),
//     updated_at: new Date(),
//   });
  
//   module.exports = TblCertifications;
