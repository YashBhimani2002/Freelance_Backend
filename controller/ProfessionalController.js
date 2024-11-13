/* eslint-disable */

const { json } = require("body-parser");
const express = require("express");
// const { Model } = require('objection');
const multer = require("multer");
const User = require("../model/userModel");
const Client = require("../model/ClientModel");
const JobModel = require("../model/JobsModel");
const JobInvitees = require("../model/JobIinviteesModel");
const skilljobs = require("../model/SkillJobModel");
const app = express();
const pool = require("../config");
const bcrypt = require("bcrypt");
const Professional = require("../model/Professional");
const Education = require("../model/Education_tblModel");
const Experience = require("../model/Experience_tblModel");
const Certification = require("../model/Tbl_certifications");
const Portfolio = require("../model/professional_portfolios");
const SkillProfessional = require("../model/Skill_professionalModel");
const MyContracts = require("../model/MyContractsModel");
const MilestoneJob = require("../model/MilestoneJobModel");
const Professional_Application_Attachment = require("../model/ProfessionalApplicationAttachment");
const Messages = require("../model/MessageModel");
const notification = require("../model/NotificationModel");
const category = require("../model/CategoriesModel");
// const Sitesettings = require('../model/SitesSettingsModel');
const Jobs = require("../model/JobsModel");
const SkillJob = require("../model/SkillJobModel");
const SkillModel = require("../model/SkillsModel");
const PraikiFees = require("../model/praikifeesModel");
const Sequelize = require("sequelize");
const { SiteSettings, getDataSite } = require("../model/SitesSettingsModel");
const JobFeedback = require("../model/job_feedbacks");
const Transaction = require("../model/TransactionModel");
const BankDetail = require("../model/BankDetailModel");
const mongoose = require("mongoose");
const fsPromises = require("fs").promises;
const fs = require("fs");
const Skill = require("../model/SkillsModel");
const BookmarkedProfessional = require("../model/BookmarkProfessionalModel");
const DraftProfessionalApplicationModel = require("../model/DraftProfessionalApplicationModel");
const { ObjectId } = require("mongodb");
const bankdetails = require("../model/BankDetailModel");
const axios = require("axios");
const Notification = require("../model/NotificationModel");
const EmailTemplate = require("../model/MailTemplate");
const https = require("https");
const storagePath = "public/uploads/job_attachment";
const profileStoragePath = "public/uploads/profile_attachments";
const path = require("path");
const AppliedJobs = require("../model/AppliedJobs");
const { getbankdetail } = require("./BankController");
const Flutterwave = require("flutterwave-node-v3");
const request = require("request");
const Country = require("../model/CountryModel");
// Create the destination directory if it doesn't exist
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname.split(".")[0]}_${Date.now()}.${
      file.originalname.split(".")[1]
    }`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const getAllProducts = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    country,
    termsconditions,
    sendsub,
    login_as,
  } = req.body;

  const activation_token = Math.random().toString(36).substring(2, 62);
  const email_verified_at = new Date();
  const remember_token = req.body._token;
  const is_verified_user = 0;
  const status = 0;
  const created_at = new Date();
  const org_password = password;

  try {
    const query = `
            INSERT INTO users (
                first_name,
                last_name,
                email,
                password,
                country,
                login_as,
                email_verified_at,
                activation_token,
                remember_token,
                is_verified_user,
                status,
                created_at,
                org_password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      firstname,
      lastname,
      email,
      password,
      country,
      login_as,
      email_verified_at,
      activation_token,
      remember_token,
      is_verified_user,
      status,
      created_at,
      org_password,
    ];

    const result = await pool.query(query, values);

    // Your additional logic for subscription
    // Uncomment and modify as needed
    /*
    if (sendsub !== '') {
        const subQuery = 'INSERT INTO subscriptions (subscriber_email, status) VALUES (?, ?)';
        const subValues = [email, '1'];
        await pool.query(subQuery, subValues);
    }
    */

    res.json({
      success: "Data Added Successfully",
      data: { id: result.insertId, email },
      error: false,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllProductsUsers = async (req, res) => {
  try {
    const users = await User.query();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const change_password_process_users = async (req, res) => {
  const { c_password, new_password, id } = req.body;

  try {
    const user = await User.findById(id);
    if (!bcrypt.compareSync(c_password, user.password)) {
      return res
        .status(200)
        .json({ success: false, message: "password does not match" });
    } else {
      const newHashedPassword = bcrypt.hashSync(new_password, 10);
      await User.updateOne(
        { _id: id },
        { $set: { password: newHashedPassword } }
      );
      return res
        .status(200)
        .json({ success: true, message: "Password updated successful" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const edit_profile_process = async (req, res) => {
  try {
    const user_type = 2;
    const user_id = 143;
    const userId = user_id; // Add this line

    console.log("..logs");

    // Include necessary validations and model definitions here
    // const { validationResult } = require('express-validator');

    // Example of validation using express-validator
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array(), success: false });
    // }

    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };

    const data1 = {
      phone: req.body.phone,
      location: req.body.address,
      country_id: req.body.countryd,
    };

    // Handle file upload
    if (req.file) {
      const imagePath = req.file.path;
      const imageName = req.file.filename;
      data1.profile_img = imageName;

      if (user_type == 1 || user_type == "1") {
        // Handle storage for company and provider profiles
        // Assuming 'uploads/company_profile' and 'uploads/provider_profile' are the storage paths
        req
          .file("profile_img")
          .storeAs("uploads/company_profile", imageName, "public");
        req
          .file("profile_img")
          .storeAs("uploads/provider_profile", imageName, "public");
      } else {
        req
          .file("profile_img")
          .storeAs("uploads/company_profile", imageName, "public");
        req
          .file("profile_img")
          .storeAs("uploads/provider_profile", imageName, "public");
      }
    }

    if (user_type == 1 || user_type == "1") {
      data1.company_name = req.body.comp_name;
      data1.web_address = req.body.web_add;
      data1.company_desc = req.body.comp_desc;
      data1.designation = req.body.comp_design;

      const cl = await Client.findOne({ where: { user_id: userId } });
      const pdt = await Professional.findOne({ where: { user_id: userId } });

      if (pdt) {
        if (req.file) {
          await Professional.update(
            { profile_img: imageName },
            { where: { user_id } }
          );
        } else {
          if (cl && cl.profile_img) {
            await Professional.update(
              { profile_img: cl.profile_img },
              { where: { user_id } }
            );
          }
        }
      }

      if (cl) {
        await Client.update(data1, { where: { user_id } });
      } else {
        data1.user_id = user_id;
        await Client.create(data1);
      }
    } else {
      data1.bio_title = req.body.comp_design;
      data1.bio_brief = req.body.description;
      data1.experience_level = req.body.explev;

      const cl = await Professional.findOne({ user_id });
      const cdt = await Client.findOne({ user_id });

      if (cdt) {
        if (req.file) {
          await Client.updateOne({ user_id }, { profile_img: imageName });
        } else {
          if (cl && cl.profile_img) {
            await Client.update(
              { profile_img: cl.profile_img },
              { where: { user_id } }
            );
          }
        }
      }

      if (cl) {
        await Professional.update(data1, { where: { user_id } });
      } else {
        data1.user_id = user_id;
        await Professional.create(data1);
      }
    }

    // Update Education records
    if (req.body.school && Array.isArray(req.body.school)) {
      for (const [i, value] of req.body.school.entries()) {
        if (value) {
          await Education.create({
            school: value,
            deg: req.body.degree[i],
            from_date: new Date(req.body.start_date[i]),
            to_date: new Date(req.body.end_date[i]),
            user_id: userId,
          });
        }
      }
    } else {
      // Handle the case where req.body.school is not an array (log, throw an error, etc.)
      console.error("req.body.school is not an array:", req.body.school);
      // Handle accordingly based on your application's requirements
    }

    // Update Experience records
    await Experience.destroy({ where: { user_id: userId } });
    if (Array.isArray(req.body.school)) {
      for (const [i, value] of req.body.school.entries()) {
        if (value) {
          await Experience.create({
            exp_title: value,
            company: req.body.company[i],
            month: req.body.start_month[i],
            year: req.body.start_year[i],
            end_month: req.body.end_month[i] || null,
            end_year: req.body.end_year[i] || null,
            user_id: userId,
          });
        }
      }
    } else {
      // Handle the case where req.body.school is not an array (log, throw an error, etc.)
      console.error("req.body.school is not an array:", req.body.school);
      // Handle accordingly based on your application's requirements
    }

    // Update Certification records
    await Certification.destroy({ where: { user_id: userId } });
    if (Array.isArray(req.body.certification_for)) {
      for (const [i, value] of req.body.certification_for.entries()) {
        if (value) {
          await Certification.create({
            user_id: userId,
            certification_for: value,
            certificate_in: req.body.certificate_in[i],
            certificate_start_date: new Date(
              req.body.certificate_start_date[i]
            ),
            certificate_end_date: new Date(req.body.certificate_end_date[i]),
          });
        }
      }
    } else {
      // Handle the case where req.body.certification_for is not an array
      console.error(
        "req.body.certification_for is not an array:",
        req.body.certification_for
      );
      // Handle accordingly based on your application's requirements
    }

    // Update Portfolio records
    await Portfolio.destroy({ where: { user_id: userId } });
    if (Array.isArray(req.body.portfolio_title)) {
      for (const [i, value] of req.body.portfolio_title.entries()) {
        if (value) {
          await Portfolio.create({
            title: value,
            portfolio_image: req.body.portfolio_image[i] || null,
            portfolio_link: req.body.portfolio_link[i],
            user_id: userId,
          });
        }
      }
    } else {
      // Handle the case where req.body.portfolio_title is not an array
      console.error(
        "req.body.portfolio_title is not an array:",
        req.body.portfolio_title
      );
      // Handle accordingly based on your application's requirements
    }

    // Update User record

    if (user_type == 1 || user_type == "1") {
      data.client_profile_complete = "1";
    }
    if (user_type == 2 || user_type == "2") {
      data.professional_profile_complete = "1";
    }

    await User.update(data, { where: { id: userId } });

    // Update Skill records for professional users
    if (user_type == 2 || user_type == "2") {
      const skillId = req.body.skill;
      const professionalId = await Professional.findOne({
        where: { user_id: userId },
      })?.id;

      if (professionalId) {
        const existingSkill = await SkillProfessional.findOne({
          where: { professional_id: professionalId },
        });
        const skillData = {
          skill_id: skillId,
          professional_id: professionalId,
        };

        if (existingSkill) {
          await SkillProfessional.update(skillData, {
            where: { professional_id: professionalId },
          });
        } else {
          await SkillProfessional.create(skillData);
        }
      } else {
        console.error("Professional ID not found");
        // Handle accordingly based on your application's requirements
      }
    }
    res
      .status(200)
      .json({ success: true, message: "Profile update successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileStoragePath);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname.split(".")[0]}_${Date.now()}.${
      file.originalname.split(".")[1]
    }`;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const portfolioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, portfolioStoragePath); // Set your portfolio storage path here
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname.split(".")[0]}_${Date.now()}.${
      file.originalname.split(".")[1]
    }`;
    cb(null, fileName);
  },
});

const profileUpload = multer({ storage: profileStorage });

const update_profile = async (req, res) => {
  try {
    // Handle file upload
    profileUpload.single("avatar")(req, res, async function (err) {
      // Extract data from request body
      const {
        id: userId,
        education,
        experience,
        certificate,
        user_type,
        pid,
        check,
      } = req.body;

      console.log("body", req.body);

      let skiles = req.body.skills || [];
      const flattenedAndJoinedSkills = skiles.flatMap((skill) =>
        skill.join("")
      );
      const fileName = req.fileName;
      // Extract portfolio images file names
      // Update basic user information
      const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        country: req.body.country,
        user_timezone: req.body.timeZone,
        avatar: fileName,
      };

      if (user_type == 1 || user_type == "1") {
        userData.client_profile_complete = "1";
      }
      if (user_type == 2 || user_type == "2") {
        userData.professional_profile_complete = "1";
      }
      await User.updateOne({ _id: userId }, userData);

      // Update specific user type information
      const additionalData = {
        phone: req.body.phone,
        location: req.body.address,
        country_id: req.body.country,
        // hourly_rate: req.body.hourly_rate,
        // hourly_available: req.body.hourly_available,
      };

      if (user_type == 1 || user_type == "1") {
        additionalData.company_name = req.body.company_name;
        additionalData.web_address = req.body.webaddress;
        additionalData.company_desc = req.body.company_desc;
        additionalData.designation = req.body.designation;
        additionalData.profile_img = "";
        const existingClient = await Client.findOne({ user_id: userId });
        if (existingClient) {
          await Client.updateOne({ user_id: userId }, additionalData);
        } else {
          additionalData.user_id = userId;
          await Client.create(additionalData);
        }
      } else {
        additionalData.designation = req.body.designation;
        additionalData.bio_brief = req.body.company_desc;
        additionalData.experience_level = req.body.experienceLevel;
        additionalData.company = req.body.company_name;

        let professional = await Professional.findOne({ user_id: userId });
        console.log("test");
        if (professional) {
          await Professional.updateOne({ user_id: userId }, additionalData);
          // let skillProfessional = await SkillProfessional.findOne({
          //   professional_id: pid,
          // });
          // if (skillProfessional) {
          //   await SkillProfessional.updateOne(
          //     { professional_id: pid },
          //     { $set: { skill_id: req.body.skills } }
          //   );
          // } else {
          //   skillProfessional = new SkillProfessional({
          //     professional_id: pid,
          //     skill_id: req.body.skills,
          //   });
          //   await skillProfessional.save();
          // }

          await SkillProfessional.findOneAndUpdate(
            { professional_id: pid },
            { $set: { skill_id: flattenedAndJoinedSkills } },
            { upsert: true }
          );
        } else {
          professional = new Professional({
            user_id: userId,
            ...additionalData,
          });
          await professional.save();

          // Find and update skillProfessional or create a new one
          await SkillProfessional.findOneAndUpdate(
            { professional_id: professional._id },
            { $set: { skill_id: flattenedAndJoinedSkills } },
            { upsert: true }
          );
        }
      }

      if (user_type == 2 || user_type == "2") {
        if (education) {
          // Delete existing education records for the user ID
          await Education.deleteMany({ user_id: userId });

          // Add new education records
          for (const entry of education) {
            await Education.create({
              school: entry.college_school,
              degree: entry.degree,
              from_date: new Date(entry.start_date),
              to_date: new Date(entry.end_date),
              user_id: userId,
            });
          }
        }
      }

      if (certificate) {
        // Delete existing certificate records for the user ID
        await Certification.deleteMany({ user_id: userId });

        // Add new certificate records
        for (const entry of certificate) {
          await Certification.create({
            certification_for: entry.certificate_for,
            certificate_in: entry.certificate_in,
            certificate_start_date: entry.start_date,
            certificate_end_date: entry.end_date,
            user_id: userId,
          });
        }
      }

      // Send response

      if (user_type == 2 || user_type == "2") {
        if (experience) {
          // Delete existing portfolio records for the user ID
          await Experience.deleteMany({ user_id: userId });
          const validMonths = [
            "Month",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          // Add new portfolio records
          for (const entry of experience) {
            // let check = false; // Default value for check

            let endMonth = null; // Default value for end_month
            if (entry.end_month && entry.end_month.trim() !== "") {
              const endMonthIndex = validMonths.indexOf(entry.end_month);
              endMonth =
                typeof endMonthIndex === "number" ? endMonthIndex : null;
              // check = check; // Set check to true if end_month is present
            }

            await Experience.create({
              exp_title: entry.title,
              company: entry.company_name,
              end_month: endMonth,
              month: entry.start_month,
              end_year:
                entry.end_year && entry.end_year !== "null"
                  ? parseInt(entry.end_year)
                  : null,
              // end_year: entry.end_year ? parseInt(entry.end_year) : null,
              year: parseInt(entry.start_year),
              check: check ? check : false, // Set check field
              user_id: userId,
            });
          }
        }
      }

      res
        .status(200)
        .json({ success: true, message: "Profile update successful" });
    });
    // });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Validation function using Joi (you'll need to install Joi)
const validateRequest = (data) => {
  const Joi = require("joi");

  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    countryd: Joi.number().required(),
  });

  return schema.validate(data);
};

const jobApply = async (req, res) => {
  const id = req.user._id;
  try {
    upload.single("file")(req, res, async (err) => {
      let { milestones, pitch, jobid, typebtn, selpay, type, totalBudget } =
        req.body;
      milestones = JSON.parse(milestones);

      const userId = id;

      // req.session.draft_app = '';
      let milestoneCount = 1;
      if (req.body.task) {
        milestoneCount = req.body.task.length;
      }

      const jobData = await JobModel.findOne({ _id: jobid });
      const professionalData = await Professional.findOne({ user_id: userId });
      const userData = await User.findById(jobData.user_id);
      const appliedUserData = await User.findById(userId);
      const jobInviteData = {
        job_id: jobid,
        client_id: jobData.user_id,
        professional_id: professionalData !== null ? professionalData._id : "",
      };
      if (req.body.typebtn && req.body.typebtn !== "") {
        jobInviteData.proposal_status = "1";
        jobInviteData.invite_status = "2";
      } else {
        jobInviteData.invite_status = "1";
      }

      const jobInviteExists = await JobInvitees.findOne({
        job_id: jobid,
        professional_id: professionalData.id,
      });
      if (jobInviteExists) {
        await JobInvitees.updateOne(
          { job_id: jobid, professional_id: professionalData.id },
          jobInviteData
        );
      } else {
        await JobInvitees.create(jobInviteData);
      }

      const contractData = {
        contract_title: jobData.job_title,
        contract_desc: pitch,
        job_id: jobid,
        client_id: jobData.user_id,
        user_id: userId,
        professional_id: userId,
        contact_type: "pending",
        bargaining_option: "",
        start_date: "",
        end_date: "",
        budget: totalBudget,
        status:
          req.body.typebtn && req.body.typebtn !== "" ? "shortlisted" : "",
        type: type,
        milestone_type: selpay,
      };
      if (selpay == 1) {
        contractData.bargaining_option = "multiple";
      } else {
        contractData.bargaining_option = "single";
      }
      await MyContracts.create(contractData);

      milestones.map(async (value, index) => {
        const milestoneData = {
          job_id: jobid,
          professional_id: id,
          milestone_task: "",
          milestone_hours: "",
          submit_task_status: "",
          milestone_price: "",
          milestone_start_date: "",
          milestone_end_date: "",
          milestone_original_start_date: "",
          milestone_original_end_date: "",
          status: "",
          current_status: "",
        };

        if (value.task) {
          milestoneData.milestone_task = value.task;
          milestoneData.milestone_hours = value.hours;
        } else {
          milestoneData.milestone_task =
            selpay == 2 ? "Whole Project" : "Whole Project";
        }

        milestoneData.submit_task_status = index === 0 ? "0" : "0";
        milestoneData.milestone_price = parseInt(value.bidAmount);
        milestoneData.milestone_hours = parseInt(value.hours);
        milestoneData.milestone_start_date = new Date(value.startDate);
        milestoneData.milestone_end_date = new Date(value.endDate);
        (milestoneData.milestone_original_start_date = new Date(
          value.startDate
        )),
          (milestoneData.milestone_original_end_date = new Date(value.endDate)),
          (milestoneData.status = "0");
        milestoneData.current_status = "0";
        milestoneData.price_withdrowed = "0";
        milestoneData.created_at = new Date();
        await MilestoneJob.create(milestoneData);
      });

      const file = req.file; // multer will add the 'file' property to req
      if (file) {
        const path = "public/uploads/job_attachment"; // Specify your upload path
        const attachmentData = {
          job_id: jobid,
          file_name: file.filename,
          user_id: userId,
        };

        await Professional_Application_Attachment.create(attachmentData);
      }

      if (typebtn && parseInt(typebtn) == 1) {
        const msgData = {
          user_id: professionalData.user_id,
          user_type: "2",
          sender_id: professionalData.user_id,
          receiver_id: jobData.user_id,
          message: `${appliedUserData?.first_name} ${appliedUserData?.last_name} has applied for "${jobData.job_title}"`,
          message_type: "1",
          job_id: jobid,
          reading_status: "0",
          send_message_date: new Date(),
          updated_at: new Date(),
          created_at: new Date(),
        };
      }

      const newAppliedJob = await AppliedJobs.create({
        job_id: jobid,
        professional_id: id,
        client_id: jobData.user_id,
      });

      const redirectPath = typebtn && typebtn == 1 ? "applied" : "dashboard";

      if (newAppliedJob) {
        res.status(200).json({ success: true, message: "Job successful" });
      } else {
        res
          .status(201)
          .json({ success: false, message: "Failed to apply job" });
      }
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const edit_job_apply = async (req, res) => {
  const rdata = req.body;
  if (req.user_id && req.session.pro_user_id) {
    const pid = req.session.pro_user_id;
    const id = req.session.user_id;
    const jid = req.body.jobid;

    if (req.body.typebtn && req.body.typebtn === "review") {
      req.session.cjdpostion = "cslist";
      res.status(200).send("Professional Reviewed Successfully");
    } else {
      res.status(200).send("Edit Apply Milestone Successfully");
    }
  } else {
    if (req.body.typebtn && req.body.typebtn === "1") {
      const str = "applied";
      res.status(200).send(`Job successfully`);
    } else {
      res.status(200).send("Draft saved successfully");
    }
  }
};

const bookmark = async (req, res) => {
  try {
    //textid pass to frontend
    //uid pass to middleware
    const textid = req.body.textid || "";
    const job_id = req.body.job_id;
    const uid = req.user._id; // Assuming you are using session middleware
    const pid = await Professional.findOne({ user_id: uid }).select("_id");

    if (!pid) {
      throw new Error("Professional not found");
    }
    // const client_id = await Client.findOne({ user_id: uid }).select('_id');
    const pro_id = pid;

    const dt = await JobInvitees.findOne({
      job_id: job_id,
      professional_id: pro_id._id.toString(),
      // client_id: client_id,
    });

    if (dt) {
      if (dt.bookmark === "1") {
        await JobInvitees.findByIdAndUpdate(dt.id, {
          bookmark: "0",
          bookmarkUpdatedAt: new Date(),
        });
        res.json({ sign: "n", textid: textid });
      } else {
        await JobInvitees.findByIdAndUpdate(dt.id, {
          bookmark: "1",
          bookmarkUpdatedAt: new Date(),
        });
        res.json({ sign: "f", textid: textid });
      }
    } else {
      const data = {
        job_id: job_id,
        professional_id: pro_id._id.toString(),
        invite_status: "-1",
        bookmark: "1",
        bookmarkUpdatedAt: new Date(),
      };
      await JobInvitees.create(data);
      res.status(200).json({ textid: textid });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const bookmarkProfessional = async (req, res) => {
  try {
    const { clientId, professionalId } = req.body;

    const existingBookmark = await BookmarkedProfessional.findOne({
      clientId,
      professionalId,
    });

    if (existingBookmark) {
      return res.status(400).json({ error: "Professional already bookmarked" });
    }

    const newBookmark = new BookmarkedProfessional({
      clientId,
      professionalId,
    });
    await newBookmark.save();

    res
      .status(200)
      .json({ success: true, message: "Professional bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeProfessionalBookmark = async (req, res) => {
  try {
    const { clientId, professionalId } = req.body;

    await BookmarkedProfessional.findOneAndRemove({ clientId, professionalId });

    res
      .status(200)
      .json({ success: true, message: "Bookmark removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBookmarkedProfessionals = async (req, res) => {
  try {
    const { clientId } = req.body;
    const bookmarks = await BookmarkedProfessional.find({ clientId });
    // Extract professional IDs from bookmarks
    const professionalIds = bookmarks.map(
      (bookmark) => bookmark.professionalId
    );
    // Query professionals with the extracted IDs
    const bookmarkedProfessionals = await Professional.find({
      _id: { $in: professionalIds },
    });
    res.status(200).json({ success: true, data: bookmarkedProfessionals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const invitation_bookmark = async (req, res) => {
  try {
    const _id = req.user._id;
    if (_id) {
      const searchjob = req.body.searchjob || "";
      const searchjob1 = req.body.searchjob1 || "";
      const short = req.body.short || "";
      const short1 = req.body.short1 || "";
      const dataType = req.body.dataType;
      const data = await invitationBookmarkList(
        _id,
        searchjob,
        searchjob1,
        short,
        short1,
        dataType
      );
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function invitationBookmarkList(
  id,
  searchjob,
  searchjob1,
  short,
  short1,
  dataType
) {
  try {
    const pid = await Professional.findOne({ user_id: id }).select("_id");
    let data = {
      active_tab: "home",
      bookmark: [],
      invite: [],
      bookmarkCount: 0,
      inviteCount: 0,
    };

    if (pid) {
      var pro_id = pid._id.toString();
      let bookmarkQuery = [];
      let jobinvitessdata = [];

      // Fetch bookmark count
      data.bookmarkCount = await JobInvitees.countDocuments({
        professional_id: pro_id,
        bookmark: "1",
      });
      // Fetch invitation count
      data.inviteCount = await JobInvitees.countDocuments({
        professional_id: pro_id,
        invite_status: "0",
      });
      if (dataType === "bookmark") {
        jobinvitessdata = await JobInvitees.find({
          professional_id: pro_id,
          bookmark: "1",
        })
          .select("job_id invite_status _id")
          .sort({ createdAt: -1 });
      } else if (dataType === "invitation") {
        jobinvitessdata = await JobInvitees.find({
          professional_id: pro_id,
          invite_status: "0",
        })
          .select("job_id invite_status _id")
          .sort({ updatedAt: -1 });
      }
      let newjobData;

      for (const item of jobinvitessdata) {
        let jobData = await Jobs.findOne({
          _id: item.job_id,
          status: { $ne: 4 },
        })
          .select(
            "_id job_title budget_type budget_from budget_to job_description created_at type "
          )
          .populate({
            path: "user_id",
            select: "_id first_name last_name email",
            populate: {
              path: "country",
              model: "Country",
              select: "_id name",
            },
          })
          .exec();
        const review = await JobFeedback.find({ rate_to: jobData.user_id._id });
        // Calculate the average rating for the user
        let averageRating = 0;
        if (review.length > 0) {
          const totalRating = review.reduce((acc, curr) => acc + curr.rate, 0);
          averageRating = totalRating / review.length;
        }
        let skillIds = await SkillJob.find({
          job_id: jobData._id.toString(),
        }).select("skill_id");
        let skilllist = [];
        await Promise.all(
          skillIds.map(async (item) => {
            let skilNames = await Skill.find({ _id: item.skill_id }).select(
              "name"
            );
            if (skilNames[0]?.name) {
              skilllist.push(skilNames[0].name);
            }
          })
        );
        let comparArray =
          dataType === "bookmark" ? ["-1", "2"] : ["-1", "2", "0"];
        newjobData = {
          jobData,
          skilllist,
          review: averageRating,
          jobinvitessdata: [
            jobinvitessdata.find((professional) => {
              if (
                jobData._id.toString() === professional.job_id &&
                comparArray.includes(professional.invite_status)
              ) {
                return professional;
              }
            }),
          ],
        };
        bookmarkQuery.push(newjobData);
      }
      data.bookmark = bookmarkQuery;
    }

    data.searchjob1 = searchjob1;
    data.short1 = short1;

    if (pid) {
      let inviteQuery = JobInvitees.aggregate([
        {
          $match: {
            professional_id: pro_id,
            invite_status: dataType === "bookmark" ? "1" : "0",
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "job_id",
            foreignField: "id",
            as: "job",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "client_id",
            foreignField: "id",
            as: "user",
          },
        },
        { $unwind: "$job" },
        { $unwind: "$user" },
        {
          $project: {
            "jobs.status": 1,
            "jobs.job_title": 1,
            "users.*": 1,
            "job.*": 1,
            "job_invitees.*": 1,
            "jobs.status": "$jstatus",
          },
        },
      ]);

      if (searchjob) {
        inviteQuery = inviteQuery.find({
          "jobs.job_title": { $regex: searchjob, $options: "i" },
        });
        data.active_tab = "home";
      }

      if (short === 1) {
        inviteQuery = inviteQuery.sort({ "job.job_title": 1 });
        data.active_tab = "home";
      } else if (short === 2) {
        inviteQuery = inviteQuery.sort({ "job.job_title": -1 });
        data.active_tab = "home";
      } else if (short === "bookmark") {
        inviteQuery = inviteQuery.find({ "job_invitees.bookmark": "1" });
        data.active_tab = "home";
      } else {
        inviteQuery = inviteQuery.sort({ "job.id": -1 });
        data.active_tab = "home";
      }

      data.invite = await inviteQuery.match({ "jobs.status": { $ne: "4" } });
    }

    data.searchjob = searchjob;
    data.short = short;

    return data;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function sortBookmarks(short) {
  switch (short) {
    case "1":
      return { "job_id.job_title": 1 };
    case "2":
      return { "job_id.job_title": -1 };
    default:
      return { "job_id.id": -1 };
  }
}

async function postjobDashboard(
  _id,
  budg,
  fcat,
  exp,
  short,
  searchjob,
  res,
  req
) {
  // session.put('draft_app', 'draft');
  try {
    if (_id) {
      let jobQuery = Jobs.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "job_invitees",
            localField: "id",
            foreignField: "job_id",
            as: "job_invitees",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            status: 1,
          },
        },
        {
          $group: {
            _id: "$id",
            country: { $first: "$user.country" },
            jobs: { $first: "$$ROOT" },
          },
        },
      ]);
      if (fcat) {
        jobQuery = jobQuery.match({ "jobs.job_type": fcat });
      }

      if (budg) {
        jobQuery = jobQuery.match({ "jobs.budget_type": budg });
      }

      if (exp) {
        jobQuery = jobQuery.match({ "jobs.experience_level": exp });
      }

      if (short === "1") {
        jobQuery = jobQuery.sort({ "jobs.job_title": 1 });
      } else if (short === "2") {
        jobQuery = jobQuery.sort({ "jobs.job_title": -1 });
      } else if (short === "bookmark") {
        jobQuery = jobQuery.match({ "job_invitees.bookmark": "1" });
      } else {
        jobQuery = jobQuery.sort({ "jobs.id": -1 });
      }

      if (searchjob) {
        jobQuery = jobQuery.match({
          "jobs.job_title": { $regex: new RegExp(searchjob, "i") },
        });
      }

      jobQuery = await jobQuery
        .match({ "jobs.status": { $ne: "4" }, "jobs.application_id": null })
        .facet({
          paginatedResults: [{ $skip: 0 }, { $limit: 10 }],
          totalCount: [{ $count: "count" }],
        });

      let data;

      if (jobQuery && jobQuery.length > 0) {
        const totalCountArray = jobQuery[0].totalCount;

        if (totalCountArray && totalCountArray.length > 0) {
          const totalCountObject = totalCountArray[0];

          if (totalCountObject && totalCountObject.count !== undefined) {
            const totalCount = totalCountObject.count;

            data = {
              jobs: jobQuery[0].paginatedResults,
              short,
              totalCount,
            };
          } else {
            console.error(
              "Missing 'count' property in jobQuery[0].totalCount[0]"
            );
          }
        } else {
          // Set a default value for totalCount when totalCountArray is empty
          const totalCountDefault = 0;
          data = {
            jobs: jobQuery[0].paginatedResults,
            short,
            totalCount: totalCountDefault,
          };

          console.warn("Using default totalCount:", totalCountDefault);
        }
      } else {
        console.error("jobQuery is empty");
      }
      if (fcat) {
        const cnm = await category.findOne({ _id: fcat });
        data.cid = fcat;
        data.cfilter = cnm.name;
        if (budg) data.bfilter = budg;
        if (exp) data.efilter = exp;
        data.searchjob = searchjob;
      } else {
        if (budg) data.bfilter = budg;
        if (exp) data.efilter = exp;
        data.searchjob = searchjob;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// const dashboard = async (req, res) => {
//   try {
//     const loginUserId = req.user._id;
//     console.log("first")
//     // Fetch client details
//     const clientDetails = await Client.findOne({ user_id: loginUserId });

//     // Fetch all active jobs and populate user and country details, sorted by creation date
//     const jobs = await JobModel.find({ type: "active" })
//       .sort({ created_at: 1 }) // Sort by created_at in descending order
//       .select(
//         "job_title experience_level budget_type budget_to budget_from servicestag location created_at job_description user_id job_type"
//       )
//       .populate({
//         path: "user_id",
//         select: "_id email first_name last_name",
//         populate: {
//           path: "country",
//           model: "Country",
//           select: "_id name",
//         },
//       })
//       .exec();
//       console.log("second"  , jobs)

//     // Filter out jobs without user_id
//     const filteredJobs = jobs.filter((job) => job.user_id);

//     // Fetch all contract jobs with "shortlisted" status
//     const shortlistedContracts = await MyContracts.find({
//       status: "shortlisted",
//     })
//       .select("job_id")
//       .exec();
//     const shortlistedJobIds = new Set(
//       shortlistedContracts.map((contract) => contract.job_id.toString())
//     );

//     // Fetch all contract jobs (regardless of status)
//     const allContractJobs = await MyContracts.find({}).select("job_id").exec();
//     const allContractJobIds = new Set(
//       allContractJobs.map((contract) => contract.job_id.toString())
//     );

//     // Filter jobs that are not in contract jobs
//     const jobsNotInContracts = filteredJobs.filter(
//       (job) => !allContractJobIds.has(job._id.toString())
//     );

//     // Filter jobs that are shortlisted
//     const shortlistedJobs = filteredJobs.filter((job) =>
//       shortlistedJobIds.has(job._id.toString())
//     );

//     // Combine jobsNotInContracts and shortlistedJobs, ensuring no duplicates
//     const combinedJobs = [...jobsNotInContracts, ...shortlistedJobs];

//     // Fetch reviews and calculate average ratings for each job
//     var updatedJobs = await Promise.all(
//       combinedJobs.map(async (job) => {
//         const reviews = await JobFeedback.find({ rate_to: job.user_id._id });
//         const totalRating = reviews.reduce((acc, curr) => acc + curr.rate, 0);
//         const averageRating =
//           reviews.length > 0 ? totalRating / reviews.length : 0;

//         let selefeCreate = 0;
//         if (clientDetails != null) {
//           if (job.user_id._id.equals(loginUserId)) {
//             selefeCreate = 1;
//           }
//         }

//         return {
//           ...job.toObject(),
//           review: averageRating,
//           selefeCreate: selefeCreate,
//         };
//       })
//     );

//     // Fetch contracts for the logged-in user
//     const userContracts = await MyContracts.find({
//       user_id: loginUserId,
//       job_id: { $in: filteredJobs.map((job) => job._id) },
//     }).exec();

//     // Extract job IDs from the user's contracts
//     const hireJobIds = userContracts.map((contract) => contract.job_id);

//     // Fetch job data for the jobs in user's contracts, sorted by creation date
//     const hireJobData = await JobModel.find({ _id: { $in: hireJobIds } })
//       .sort({ created_at: 1 }) // Sort by created_at in descending order
//       .exec();

//     // Extract unique user IDs from the hire job data
//     const userIds = [...new Set(hireJobData.map((job) => job.user_id))];

//     // Fetch user details
//     const userDetails = await User.find({ _id: { $in: userIds } });

//     // Create a map of user details by user ID
//     const userMap = userDetails.reduce((acc, user) => {
//       acc[user._id] = user;
//       return acc;
//     }, {});

//     // Extract unique country IDs from user details
//     const countryIds = [...new Set(userDetails.map((user) => user.country))];

//     // Fetch country details
//     const countryDetails = await Country.find({
//       _id: { $in: countryIds },
//     });

//     // Create a map of country details by country ID
//     const countryMap = countryDetails.reduce((acc, country) => {
//       acc[country._id] = country;
//       return acc;
//     }, {});

//     // Enrich hire job data with user and country details
//     var enrichedHireJobData = hireJobData.map((job) => {
//       const user = userMap[job.user_id];
//       const country = countryMap[user.country];

//       return {
//         ...job._doc,
//         user_id: {
//           ...user._doc,
//           country,
//         },
//       };
//     });

//     updatedJobs = updatedJobs.concat(enrichedHireJobData);

//     // Remove duplicate jobs by prioritizing those with the logged-in user's user_id
//     const jobMap = {};
//     updatedJobs.forEach((job) => {
//       if (!jobMap[job._id] || job.user_id._id.equals(loginUserId)) {
//         jobMap[job._id] = job;
//       }
//     });

//     // Convert jobMap back to an array
//     updatedJobs = Object.values(jobMap);

//     // Sort the final updatedJobs array by created_at in descending order
//     updatedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

//     res.status(200).send({ success: true, data: updatedJobs });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const dashboard = async (req, res) => {
  try {
    const loginUserId = req.user._id;

    // Fetch client details and active jobs in parallel
    const [clientDetails, jobs] = await Promise.all([
      Client.findOne({ user_id: loginUserId }),
      JobModel.find({ type: "active" })
        .sort({ created_at: 1 })
        .select(
          "job_title experience_level budget_type budget_to budget_from servicestag location created_at job_description user_id job_type"
        )
        .populate({
          path: "user_id",
          select: "_id email first_name last_name",
          populate: {
            path: "country",
            model: "Country",
            select: "_id name",
          },
        }),
    ]);

    // Filter jobs without user_id
    const filteredJobs = jobs.filter((job) => job.user_id);

    // Fetch contract data and shortlisted jobs
    const [shortlistedContracts, allContracts] = await Promise.all([
      MyContracts.find({ status: "shortlisted" }).select("job_id"),
      MyContracts.find({}).select("job_id"),
    ]);
    
    const shortlistedJobIds = new Set(
      shortlistedContracts.map((contract) => contract.job_id.toString())
    );


    const allContractJobIds = new Set(
      allContracts.map((contract) => contract.job_id.toString())
    );

    // Separate jobs not in contracts and shortlisted jobs
    const jobsNotInContracts = filteredJobs.filter(
      (job) => !allContractJobIds.has(job._id.toString())
    );

    
    const shortlistedJobs = filteredJobs.filter((job) =>
      shortlistedJobIds.has(job._id.toString())
    );

    // Combine and remove duplicate jobs
    const combinedJobs = [
      ...new Set([...jobsNotInContracts, ...shortlistedJobs]),
    ];

    // Fetch job feedback in bulk for combined jobs
    const userIds = combinedJobs.map((job) => job.user_id._id);
    const jobFeedbacks = await JobFeedback.find({
      rate_to: { $in: userIds },
    });

    // Calculate average ratings for each job
    const feedbackMap = jobFeedbacks.reduce((acc, feedback) => {
      acc[feedback.rate_to] = acc[feedback.rate_to] || [];
      acc[feedback.rate_to].push(feedback.rate);
      return acc;
    }, {});

    const updatedJobs = combinedJobs.map((job) => {
      const reviews = feedbackMap[job.user_id._id] || [];
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, rating) => sum + rating, 0) / reviews.length
          : 0;

      const selefeCreate =
        clientDetails && job.user_id._id.equals(loginUserId) ? 1 : 0;

      return {
        ...job.toObject(),
        review: averageRating,
        selefeCreate,
      };
    });

    // Fetch user's contracts and enrich them with user/country details
    const userContracts = await MyContracts.find({
      user_id: loginUserId,
      job_id: { $in: filteredJobs.map((job) => job._id) },
    }).select("job_id");

    const hireJobIds = userContracts.map((contract) => contract.job_id);
    const hireJobData = await JobModel.find({ _id: { $in: hireJobIds } })
      .sort({ created_at: 1 })
      .populate({
        path: "user_id",
        select: "_id email first_name last_name country",
        populate: {
          path: "country",
          model: "Country",
          select: "_id name",
        },
      });

    // Combine hireJobData with updatedJobs and remove duplicates
    const enrichedJobs = [...updatedJobs, ...hireJobData].reduce(
      (acc, job) => {
        if (!acc[job._id] || job.user_id._id.equals(loginUserId)) {
          acc[job._id] = job;
        }
        return acc;
      },
      {}
    );

    // Convert job map back to an array and sort
    const finalJobs = Object.values(enrichedJobs).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.status(200).send({ success: true, data: finalJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const myapplication = async (req, res) => {
  const userId = req.user._id;
  try {
    const Contract = await MyContracts.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    res.status(200).send({ success: true, data: Contract });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const myapplicationlist = async (req, res) => {
  try {
    const userId = req.user._id;
    if (userId) {
      const data = await myApplicationList(userId);
      res.status(200).send(data);
    } else {
      res.status(400).json({ error: "User ID is required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
async function myApplicationList(id) {
  const piddata = await Professional.findOne({ user_id: id });

  let data = {
    draft: [],
    archived: [],
    active: [],
    active_tab: "",
  };

  if (piddata) {
    // Query draft jobs
    let draftQuery = JobInvitees.aggregate([
      {
        $lookup: {
          from: "jobs",
          let: { jobIdStr: "$job_id" }, // Define a variable to hold the string job_id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$jobIdStr" }] }, // Convert jobIdStr to ObjectId and match with _id
              },
            },
          ],
          as: "job_details",
        },
      },
      {
        $match: {
          professional_id: piddata._id.toString(),
          invite_status: "1",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    data.draft = await draftQuery.exec();

    // Query archived jobs
    let archivedQuery = JobInvitees.aggregate([
      {
        $lookup: {
          from: "jobs",
          let: { jobIdStr: "$job_id" }, // Define a variable to hold the string job_id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$jobIdStr" }] }, // Convert jobIdStr to ObjectId and match with _id
              },
            },
          ],
          as: "job_details",
        },
      },
      {
        $match: {
          professional_id: piddata._id.toString(),
          invite_status: "5",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    data.archived = await archivedQuery.exec();
    // Query active jobs
    let activeQuery = JobInvitees.aggregate([
      {
        $lookup: {
          from: "jobs",
          let: { jobIdStr: "$job_id" }, // Define a variable to hold the string job_id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$jobIdStr" }] }, // Convert jobIdStr to ObjectId and match with _id
              },
            },
          ],
          as: "job_details",
        },
      },
      {
        $match: {
          professional_id: piddata._id.toString(),
          invite_status: { $gte: "2", $ne: "5" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    data.active = await activeQuery.exec();

    // Set active tab based on the query
    data.active_tab = data.active.length
      ? "home"
      : data.draft.length
      ? "profile"
      : "contactus";
  }

  return data;
}
const job_detail = async (req, res) => {
  const userId = req.user._id;
  if (userId) {
    try {
      const data = await jobDetailId(userId, req.params.id, req, res);

      const jobSkills = await SkillJob.find({ job_id: req.params.id });

      const skillDetails = await Promise.all(
        jobSkills.map(async (skill) => {
          const skillInfo = await SkillModel.findById(skill.skill_id);
          if (skillInfo) {
            if (skillInfo.name !== null) {
              return skillInfo.name;
            }
          }
        })
      );

      const title = data.detail.job_title;
      const description = data.detail.job_description;
      const postJobDescription = `${title} ${description}`;
      res.status(200).send({ success: true, data: { data, skillDetails } });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
};

async function jobDetailId(uid, jid, sessionInvite, res, req) {
  try {
    const detail = await Jobs.findOne({
      _id: jid,
    });

    const userDetails = await Jobs.findOne({ _id: jid })
      .populate({
        path: "user_id",
        populate: {
          path: "country",
          model: "Country",
        },
      })
      .exec();
    const data = {
      detail: detail, // Add the detail property to the data object
    };

    if (detail && detail.user_id) {
      data.client = await Jobs.find({ user_id: detail.user_id });
      data.review = await JobFeedback.find({ rate_to: detail.user_id });
    }

    data.user_id = uid;

    const fileNameDetails = await Professional_Application_Attachment.find({
      job_id: data.detail._id.toString(),
    });
    const fileData = [];

    if (fileNameDetails.length > 0) {
      fileNameDetails.forEach((fileItem) => {
        const file = {
          filepath: `/public/uploads/job_attachment/${fileItem.file_name}`,
          fileName: fileItem.file_name,
          id: fileItem._id.toString(),
        };
        fileData.push(file);
      });
    } else {
      fileData.push({ filepath: false });
    }

    data.fileData = fileData;
    data.userDetails = userDetails;
    // Return  he data object
    return data;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

const SendFile = async (req, res) => {
  const Filepath = req.body.filepath;
  try {
    const parentDirectory = path.dirname(__dirname);
    const pdfPath = path.join(
      parentDirectory,
      "public",
      "uploads",
      "job_attachment",
      Filepath
    );
    res.sendFile(pdfPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function my_application_detail(jobid, res, req) {
  try {
    const userId = "6593ea10687b67eaa75fbed8";
    const jobId = jobid.params.id;
    var skill;
    const invjob = await MyContracts.findOne({
      user_id: userId,
      job_id: jobId,
    });
    const skill_job = await SkillJob.findOne({
      job_id: jobId,
    });
    if (skill_job) {
      skill = await SkillModel.findOne({
        _id: skill_job.skill_id,
      });
      if (skill) {
        console.log("skill Editing:", skill.name);
      } else {
        console.log("Skill not found for the given skill_id");
      }
    } else {
      console.log("SkillJob not found");
    }
    const milestone = await MilestoneJob.find({
      job_id: jobId,
    });
    const uid = userId;

    const data = {
      invjob,
      skill: skill.name,
      milestone,
      uid,
    };

    res.json(data);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Internal Server Error");
  }
}

const transaction_history = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.user._id;
    const userRole = req.user.login_as;
    // Fetch transaction data from the database for the specified user
    let option = {};
    if (userRole == 2) {
      option = {
        operation_user_id: userId,
        type: "Withdrawn",
      };
    } else {
      option = {
        operation_user_id: userId,
        type: "Released",
      };
    }
    const transactions = await Transaction.find(option)
      .sort({ created_at: -1 })
      .populate("user_id professional_user_id");
    // Send the response with the fetched transaction data and user names
    res.json({ transactions, userRole });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const earning_overview = async (req, res) => {
  try {
    const uid = req.user._id;
    const data = await earning_overview_services(uid);
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const earning_overview_services = async (uid) => {
  try {
    const data = await earning_overview_repository(uid);
    let total = 0;
    data.remainingPrice.forEach((item) => {
      total += item.milestone_price;
    });
    let tavl = 0;
    let tavlp = 0;
    let tavlw = 0;

    data.availableCount.forEach((avl) => {
      if (avl.type === "Released") {
        tavlp += avl.amount;
      } else if (avl.type === "Withdrawn") {
        tavlw += avl.amount;
      }
    });

    tavl = tavlp - tavlw;

    let trev = 0;
    data.review1.forEach((rev) => {
      trev += rev.milestone_price;
    });
    let tpro = 0;
    data.progress1.forEach((pro) => {
      tpro += pro.milestone_price;
    });

    let totalAssigned = 0;
    data.assignedMile.forEach((pro) => {
      totalAssigned += pro.milestone_price;
    });

    let totalRejected = 0;
    data.rejectedMile.forEach((pro) => {
      totalRejected += pro.milestone_price;
    });

    let totalPendingMile = 0;
    data.pendingMile.forEach((pro) => {
      totalPendingMile += pro.milestone_price;
    });

    const result = {
      available: data.available,
      availableFullWithdraw: data.availableFullWithdraw,
      total: total,
      tavl: tavl,
      trev: trev,
      tpro: tpro + totalAssigned + totalRejected,
      pid: data.professional.id,
      TAssigned: totalAssigned + totalRejected + totalPendingMile,
    };

    return result;
  } catch (err) {
    return { success: false, message: err.message };
  }
};
const earning_overview_repository = async (uid) => {
  const professional = await Professional.findOne({ user_id: uid });
  const pay_methods = await BankDetail.find({ status: "1", user_id: uid });

  const available = await Transaction.aggregate([
    {
      $lookup: {
        from: "job_milestones",
        localField: "milestone_id",
        foreignField: "id",
        as: "milestone",
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "milestone.job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_user_id: uid,
        "milestone.status": "2",
        "milestone.price_withdrowed": "0",
      },
    },
    {
      $group: {
        _id: "$job.id",
        job: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$job" },
    },
  ]);
  const availableFullWithdraw = await Transaction.aggregate([
    {
      $lookup: {
        from: "job_milestones",
        localField: "milestone_id",
        foreignField: "id",
        as: "milestone",
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "milestone.job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_user_id: uid,
        "milestone.status": "2",
        "milestone.price_withdrowed": "0",
      },
    },
    {
      $replaceRoot: { newRoot: "$job" },
    },
  ]);
  let remainingPrice = await Transaction.aggregate([
    {
      $lookup: {
        from: "job_milestones",
        localField: "milestone_id",
        foreignField: "id",
        as: "milestone",
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "milestone.job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_user_id: uid,
        "milestone.status": "2",
        "milestone.price_withdrowed": "0",
      },
    },
    {
      $replaceRoot: { newRoot: "$job" },
    },
  ]);
  const availableCount = await Transaction.aggregate([
    {
      $lookup: {
        from: "job_milestones",
        localField: "milestone_id",
        foreignField: "id",
        as: "milestone",
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "milestone.job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_user_id: uid,
        "milestone.status": "2",
      },
    },
  ]);
  const review = await MilestoneJob.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_id: professional._id.toString(),
        submit_task_status: "1",
        status: { $in: [1, 3] },
      },
    },
    {
      $group: {
        _id: "$job.id",
        job: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$job" },
    },
  ]);

  const review1 = await MilestoneJob.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_id: professional._id.toString(),
        submit_task_status: "1",
        status: { $in: [1, 3] },
      },
    },
  ]);
  const progress = await MilestoneJob.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_id: professional._id.toString(),
        submit_task_status: "0",
        status: { $in: [1, 0, 3] },
      },
    },
    {
      $group: {
        _id: "$job.id",
        job: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$job" },
    },
  ]);
  const assignedMile = await MilestoneJob.find({
    professional_id: professional._id.toString(),
    submit_task_status: "0",
    status: "0",
  });
  const pendingMile = await MilestoneJob.find({
    professional_id: professional._id.toString(),
    submit_task_status: "0",
    status: "1",
  });
  const rejectedMile = await MilestoneJob.find({
    professional_id: professional._id.toString(),
    submit_task_status: "0",
    status: "3",
  });
  const progress1 = await MilestoneJob.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "job_id",
        foreignField: "id",
        as: "job",
      },
    },
    {
      $match: {
        professional_id: professional._id.toString(),
        submit_task_status: "0",
        status: "1",
      },
    },
    {
      $group: {
        _id: "$job.id",
        job: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$job" },
    },
  ]);

  return {
    professional,
    pay_methods,
    available,
    availableFullWithdraw,
    remainingPrice,
    availableCount,
    review,
    review1,
    progress,
    assignedMile,
    pendingMile,
    rejectedMile,
    progress1,
  };
};

const jobinviteesdetails = async (req, res) => {
  try {
    const id = req.user._id;
    const pid = await Professional.findOne({ user_id: id }).select("_id");
    if (!pid) {
      return res
        .status(404)
        .json({ success: false, error: "Professional not found" });
    }
    const pro_id = pid._id.toString();
    const data = await JobInvitees.find({
      professional_id: pro_id,
      bookmark: "1",
    }).select("job_id bookmark");

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const removejobinvitesen = async (req, res) => {
  // const id = req.user._id;
  // const pid = await Professional.findOne({ user_id: id }).select("_id");
  // const pro_id = pid._id.toString();
  // const data = await JobInvitees.deleteOne({
  //   professional_id: pro_id,
  //   bookmark: "1",
  //   job_id: req.body.jobId,
  // });
  // res.status(200).json(data);
  try {
    const id = req.user._id;
    const pid = await Professional.findOne({ user_id: id }).select("_id");
    const pro_id = pid._id.toString();

    // Find the JobInvitees with bookmark = 1 and invite_status = -1
    let jobInvitee = await JobInvitees.findOne({
      professional_id: pro_id,
      bookmark: "1",
      invite_status: "-1",
      job_id: req.body.jobId,
    });
    if (jobInvitee) {
      // If found, delete the JobInvitees document
      await JobInvitees.deleteOne({
        professional_id: pro_id,
        bookmark: "1",
        invite_status: "-1",
        job_id: req.body.jobId,
      });
      res
        .status(200)
        .json({ success: true, message: "JobInvitee deleted successfully" });
    } else {
      // If not found, update the bookmark value to 0 for the matching document
      jobInvitee = await JobInvitees.findOneAndUpdate(
        {
          professional_id: pro_id,
          bookmark: "1",
          job_id: req.body.jobId,
        },
        { bookmark: "0" }, // Update the bookmark value to 0
        { new: true } // Return the updated document
      );
      res.status(200).json({
        success: true,
        message: "JobInvitee updated successfully",
        data: jobInvitee,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const diclinJobInvite = async (req, res) => {
  try {
    const id = req.user._id;
    const pid = await Professional.findOne({ user_id: id }).select("_id");
    const pro_id = pid._id.toString();

    // Find the JobInvitees document with bookmark value 1
    const jobInvitee = await JobInvitees.findOne({
      professional_id: pro_id,
      bookmark: "1",
      job_id: req.body.jobId,
    });
    if (jobInvitee) {
      // If found, update invite_status to -1
      await JobInvitees.updateOne(
        {
          professional_id: pro_id,
          bookmark: "1",
          job_id: req.body.jobId,
        },
        { invite_status: "-1", updatedAt: new Date() }
      );
    } else {
      // If not found, delete JobInvitees document
      await JobInvitees.deleteOne({
        professional_id: pro_id,
        invite_status: "0",
        job_id: req.body.jobId,
      });
    }

    res.status(200).json({
      success: true,
      message: "JobInvitee updated/deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeInvite = async (req, res) => {
  try {
    const id = req.user._id;
    const pid = await Professional.findOne({ user_id: id }).select("_id");
    const pro_id = pid._id.toString();

    await JobInvitees.deleteOne({
      professional_id: pro_id,
      job_id: req.body.jobId,
    });

    const availableJobinvite = await JobInvitees.find({
      job_id: req.body.jobId,
    });

    if (availableJobinvite.length === 0) {
      await Jobs.findOneAndDelete({ _id: req.body.jobId });
      await skilljobs.deleteMany({ job_id: req.body.jobId });
    }

    res.status(200).json({
      success: true,
      message: "JobInvitee removed successfully",
    });
  } catch (error) {
    console.error("Error in declining job invite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const draftProfessionalApplications = async (req, res) => {
  try {
    const data = req.body;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const myContract = async (req, res) => {
  const id = req.user._id;
  const contractID = req.body.contractID;
  try {
    const contracts = await MyContracts.find({
      user_id: id,
      contact_type: { $in: ["active", "ended", "pending"] },
    });
    let specificContract = [];
    if (contractID) {
      const singleContract = await MyContracts.findOne({
        _id: contractID,
      }).populate("job_id");
      if (singleContract) {
        const job = singleContract.job_id;
        const user = await User.findOne({ _id: job.user_id });
        // Populate the user_id field with the user data
        job.user_id = user;
        specificContract = [singleContract];
      }
    }

    if (!contracts || contracts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No contracts found" });
    }

    const activeContracts = contracts.filter(
      (contract) => contract.contact_type === "active"
    );
    const endedContracts = contracts.filter(
      (contract) => contract.contact_type === "ended"
    );
    const pendingContract = contracts.filter(
      (contract) => contract.contact_type === "pending"
    );

    return res.status(200).json({
      success: true,
      message: "Contracts found",
      activeContracts,
      endedContracts,
      specificContract,
      pendingContract,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const myapplicationdetilaslist = async (req, res) => {
  try {
    const jobid = req.body.job_id;
    let id;
    if (req.body.user_id) {
      id = req.body.user_id;
    } else {
      id = req.user._id;
    }

    const data = await myApplicationDetailId(jobid, id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function myApplicationDetailId(jobid, id) {
  const data = {};

  const dummyfeesdata = [{ fees: 10 }];

  try {
    // Fetch necessary data from MongoDB collections
    data.job = await Jobs.findOne({ _id: jobid }).populate("user_id");

    const review = await JobFeedback.find({ rate_to: data.job.user_id._id });
    // Calculate the average rating for the user
    let averageRating = 0;
    if (review.length > 0) {
      const totalRating = review.reduce((acc, curr) => acc + curr.rate, 0);
      averageRating = totalRating / review.length;
    }

    data.review = averageRating;
    data.mycontaractbargainingoption = await MyContracts.find({
      job_id: jobid,
      user_id: id,
    }).select("bargaining_option contract_desc");
    // data.pfees = await PraikiFees.find({ id: parseInt(data.job.p_fees_id) });
    data.pfees = dummyfeesdata; // this is dummy data above one is dynamic
    const pid = await Professional.findOne({ user_id: id });
    data.invjob = await JobInvitees.findOne({
      job_id: jobid,
      professional_id: pid?._id?.toString(),
    });

    const jobSkills = await SkillJob.find({ job_id: jobid });
    const skillDetails = await Promise.all(
      jobSkills.map(async (skill) => {
        const skillInfo = await SkillModel.findById(skill.skill_id);
        if (skillInfo) {
          if (skillInfo.name !== null) {
            return skillInfo.name;
          }
        }
      })
    );
    data.skill_job = skillDetails;

    data.star = await Jobs.aggregate([
      {
        $match: {
          _id: jobid,
        },
      },
      {
        $lookup: {
          from: "job_feedbacks",
          let: { rate_from: "$user_id", rate_to: "$professional_user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$job_id", "$_id"] },
                    { $eq: ["$rate_from", "$$rate_from"] },
                    { $eq: ["$rate_to", "$$rate_to"] },
                  ],
                },
              },
            },
          ],
          as: "job_feedbacks",
        },
      },
    ]);

    const contracts = await MyContracts.find({ job_id: jobid, user_id: id });
    const fileData = [];
    if (contracts.length > 0) {
      for (let item of contracts) {
        const fileNameDetails = await Professional_Application_Attachment.find({
          job_id: item.job_id,
          user_id: id,
        }).select("file_name");
        // Check if the file exists
        for (let fileItem of fileNameDetails) {
          const file = {};
          file.filepath = `/public/uploads/job_attachment/${fileItem.file_name}`;
          file.fileName = fileItem.file_name;
          file.id = fileItem._id.toString();
          fileData.push(file);
        }
      }
    } else {
      const file = {};
      file.filepath = false;
      fileData.push(file);
    }
    data.attachment = fileData;

    data.budget = await MyContracts.find({ user_id: id, job_id: jobid });
    data.milestone = await MilestoneJob.find({
      job_id: jobid,
      professional_id: id,
    }).sort({ created_at: 1 });

    data.uid = id;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }

  return data;
}

const updateapplicationdetials = async (req, res) => {
  const id = req.user._id;
  console.log("...", req.body);
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let { milestones, pitch, jobid, typebtn, selpay } = req.body;
      let f = 0;

      const jinv = await MyContracts.findOne({
        job_id: req.body.jobid,
        user_id: id,
        status: "hired",
      });

      console.log("jinv", jinv);

      if (jinv) {
        f = 1;
      }

      console.log("f", f);

      if (f === 1) {
        return res.json({
          success: true,
          msg: "Your contract activated, so can't edit",
          flag: 1,
        });
      }

      milestones = JSON.parse(milestones);
      const jobData = await JobModel.findOne({ _id: jobid });
      const updateObject = { contract_desc: pitch };

      if (typebtn && typebtn !== "") {
        updateObject.type = "active";
        updateObject.status = "shortlisted";
      }
      const jdata = await MyContracts.updateOne(
        { job_id: jobid, user_id: id },
        { $set: updateObject }
      );

      const pid = await Professional.findOne({ user_id: id }).select("_id");
      let prof_id = pid._id.toString();

      const jobInviteData = {
        job_id: jobid,
        client_id: jobData.user_id,
        professional_id: pid !== null ? pid._id : "",
      };

      if (req.body.typebtn && req.body.typebtn !== "") {
        if (req.body.typebtn == "1") {
          jobInviteData.invite_status = "2";
        } else if (req.body.typebtn == "2") {
          jobInviteData.invite_status = "1";
        }
      } else {
        jobInviteData.invite_status = "0";
      }

      await JobInvitees.updateOne(
        { job_id: jobid, professional_id: pid.id },
        jobInviteData
      );

      const file = req.file; // multer will add the 'file' property to req
      if (file) {
        const fileName = `${file.originalname.split(".")[0]}_${Date.now()}.${
          file.originalname.split(".")[1]
        }`;
        const attachmentData = {
          job_id: jobid,
          file_name: fileName,
          user_id: id,
        };
        const pData = await Professional_Application_Attachment.create(
          attachmentData
        );
      }

      for (const milestone of milestones) {
        if (typeof milestone._id == "string") {
          const existingMilestone = await MilestoneJob.findOneAndUpdate(
            { _id: milestone._id },
            {
              $set: {
                milestone_hours: milestone.milestone_hours,
                milestone_task: milestone.milestone_task,
                milestone_price: milestone.milestone_price,
                milestone_start_date: milestone.milestone_start_date,
                milestone_end_date: milestone.milestone_end_date,
              },
            }
          );
        } else {
          const milestoneData = {
            job_id: jobid,
            professional_id: id,
            milestone_task: "",
            milestone_hours: "",
            submit_task_status: "",
            milestone_price: "",
            milestone_start_date: "",
            milestone_end_date: "",
            milestone_original_start_date: "",
            milestone_original_end_date: "",
            status: "",
            current_status: "",
          };
          if (milestone.milestone_task) {
            milestoneData.milestone_task = milestone.milestone_task;
            milestoneData.milestone_hours = milestone.milestone_hours;
          } else {
            milestoneData.milestone_task =
              selpay == 2 ? "Whole Project" : "Whole Project";
          }

          milestoneData.submit_task_status = "0";
          milestoneData.milestone_price = parseInt(milestone.milestone_price);
          milestoneData.milestone_hours = parseInt(milestone.milestone_hours);
          milestoneData.milestone_start_date = new Date(
            milestone.milestone_start_date
          );
          milestoneData.milestone_end_date = new Date(
            milestone.milestone_end_date
          );
          milestoneData.milestone_original_start_date = new Date();
          milestoneData.milestone_original_end_date = new Date();
          milestoneData.status = "0";
          milestoneData.current_status = "0";
          milestoneData.created_at = new Date();
          await MilestoneJob.create(milestoneData);
        }
      }
      return res
        .status(200)
        .json({ success: true, message: "Edit application successful" });
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteMilstoneDetails = async (req, res) => {
  try {
    const { milstone_id } = req.body;
    const data = await MilestoneJob.deleteOne({ _id: milstone_id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const deleteFileUpload = async (req, res) => {
  try {
    const { file_id } = req.body;
    const data = await Professional_Application_Attachment.deleteOne({
      _id: file_id,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const data = await Jobs.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const myContractFeedback = async (req, res) => {
  try {
    const feedback = await JobFeedback.create(req.body);

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const milstoneData = async (req, res) => {
  const jobId = req.body.id;
  const userDetails = await User.findOne({ _id: req.user._id });
  try {
    let option = {};
    if (userDetails.login_as == 2) {
      option = {
        job_id: jobId,
        professional_id: req.user._id,
      };
    } else {
      option = {
        job_id: jobId,
      };
    }
    const result = await MilestoneJob.find(option).sort({
      milestone_start_date: 1,
    });
    const fileData = await Professional_Application_Attachment.find({
      job_id: jobId,
    });
    const contractdata = await MyContracts.findOne({
      job_id: jobId,
      professional_id: result[0].professional_id,
    });
    const fileDetails = [];

    if (result.length > 0) {
      if (fileData && fileData.length > 0) {
        for (let fileItem of fileData) {
          const file = {};
          file.filepath = `/public/uploads/job_attachment/${fileItem.file_name}`;
          file.fileName = fileItem.file_name;
          file.id = fileItem._id.toString();
          file.job_id = fileItem.job_id;
          file.user_id = fileItem.user_id;
          fileDetails.push(file);
        }
      } else {
        const file = {};
        file.filepath = false;
        fileDetails.push(file);
      }

      res.status(200).json({
        success: true,
        message: "Get milstone data successful",
        milstone: result,
        file: fileDetails,
        contractdata: contractdata._id.toString(),
      });
    } else {
      res
        .status(200)
        .json({ success: false, message: "No milstone data found" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const update_user = async (req, res) => {
  const id = req.user._id;
  const { status } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found...." });
    }

    // Update the user's status
    user.login_as = status;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const job_milestone = async (req, res) => {
  const id = req.user._id;
  try {
    const milestones = await MilestoneJob.find({
      professional_id: id,
      price_withdrowed: "0",
    }).populate("job_id"); // Fetch milestones for the user
    const BankDetail = await bankdetails.find({ user_id: id });

    // Initialize objects to store milestone data for each status
    const availabelMilestones = [];
    const inReviewMilestones = [];
    const workInProgressMilestones = [];
    const inReviewMileston = [];
    const workInProgressMileston = [];
    // Organize milestones based on status
    milestones.forEach((milestone) => {
      if (milestone.status === "3") {
        availabelMilestones.push(milestone);
        workInProgressMilestones.push(milestone);
        inReviewMilestones.push(milestone);
        // console.log("availabelMilestones",availabelMilestones)
      } else if (milestone.status === "2") {
        inReviewMilestones.push(milestone);
        inReviewMileston.push(milestone);
      } else if (milestone.status === "1") {
        workInProgressMilestones.push(milestone);
        workInProgressMileston.push(milestone);
      }
    });
    // console.log("workInProgressMilestones12", workInProgressMilestones.length);

    // Prepare response object
    const milestoneData = {
      available: availabelMilestones,
      inReview: inReviewMilestones,
      workInProgress: workInProgressMilestones,
      AllMilestone: milestones,
      inReviewes: inReviewMileston,
      workProgress: workInProgressMileston,
    };
    res
      .status(200)
      .json({ milestones: milestoneData, bankDetails: BankDetail });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const make_end_contract = async (req, res) => {
  const { id } = req.body;

  try {
    const endDate = new Date();
    // Find the document by id and update its type field to 'ended'
    const updatedContract = await MyContracts.findOneAndUpdate(
      { _id: id },
      { $set: { type: "ended", end_date: endDate } },
      { new: true } // To return the updated document
    ).populate("client_id");

    const JobDetails = await Jobs.findOne({ _id: updatedContract.job_id });

    if (updatedContract) {
      const endDate = new Date();
      await Promise.all([
        Jobs.findOneAndUpdate(
          { _id: updatedContract.job_id },
          { $set: { job_end_date: endDate } }
        ),
        JobModel.findOneAndUpdate(
          { _id: updatedContract.job_id },
          { $set: { type: "ended" } }
        ),
      ]);
      const pid = await Professional.findOne({ user_id: req.user._id });
      await JobInvitees.updateOne(
        {
          job_id: updatedContract.job_id,
          professional_id: pid?._id?.toString(),
        },
        { invite_status: "-2" }
      );
    }

    if (!updatedContract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }
    res.status(200).json({
      success: true,
      message: "Contract is ended successfully",
      updatedContract,
      JobDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const withdraw_amount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentme, mileid, commi, totalpayment } = req.body;
    let backDetails = paymentme;
    const professional = await Professional.findOne({ user_id: userId });
    const pid = professional?._id.toString();

    if (!totalpayment) {
      return res
        .status(400)
        .json({ response: "error", msg: "Total payment is required" });
    }

    const returndata = await flutterWithdraw(totalpayment, backDetails);
    console.log("Returndata from flutterWithdraw:", returndata);

    if (!returndata || returndata.response !== "1") {
      console.log("Withdrawal failed or returned incomplete data:", returndata);
      return res.status(400).json({
        response: "error",
        msg: "Earnings withdrawal failed",
        error: returndata,
      });
    }
    const transactionData = mileid.map(async (mrec) => {
      const trclient_id = await Transaction.findOne({ milestone_id: mrec });

      console.log("trclient_id", trclient_id);

      // if (!trclient_id) {
      //   return null;
      // }

      return {
        milestone_id: mrec,
        user_id: trclient_id.user_id || "", // Ensure this is populated
        amount: trclient_id.amount || "0", // Ensure a default value
        commission_rate: commi,
        professional_user_id: pid, // Ensure professional ID is provided
        reference: returndata?.reference || "", // Ensure returndata has reference, default to empty
        response: returndata?.response || "", // Ensure returndata has a response, default to empty
        status: returndata?.status || "0", // Provide a default value if undefined
        payment_gateway: trclient_id.payment_gateway || "", // Ensure this is set, default to empty
        type: "Withdrawn",
        description: trclient_id.description || "",
        operation_user_id: userId, // Ensure user ID is assigned
        response_text: returndata?.response_text || "", // Ensure response_text is provided
      };
    });

    const transactions = await Promise.all(transactionData);
    const failedTransaction = transactions.find((data) => !data);
    if (failedTransaction) {
      return res.status(404).json({
        response: "error",
        msg: "Unable to retrieve transaction information",
      });
    }

    await Transaction.insertMany(transactions);

    await MilestoneJob.updateMany(
      { _id: { $in: mileid } },
      { price_withdrowed: "1" }
    );

    return res.status(200).json({
      response: "success",
      msg: "Your amount withdrawal is successful",
    });
  } catch (err) {
    console.error("Error in withdraw_amount:", err);
    console.log("Error in withdraw_amount:", err);
    return res
      .status(500)
      .json({ response: err, msg: "Internal server error" });
  }
};
const flutterWithdraw = async (amount, bankDetail) => {
  try {
    const userBankDetailsResponse = bankDetail;
    const userBankDetails = userBankDetailsResponse;

    console.log("userBankDetails", userBankDetails);

    const reference = Date.now() + Math.floor(Math.random() * 1000000);

    const feesResponse = await PraikiFees.findOne({
      attributes: ["fees"],
      where: { status: 1 },
    });

    console.log("feesResponse", feesResponse);

    let feesPercentage = 0;
    if (feesResponse) {
      feesPercentage = feesResponse.fees;
    }

    const feesAmount = (amount * feesPercentage) / 100;
    amount -= feesAmount;

    let endpoint, requestData, responseData;
    if (!userBankDetails.routing_number) {
      console.log("false");
      endpoint = "https://api.flutterwave.com/v3/transfers";
      requestData = {
        account_bank: userBankDetails.ifsc_code,
        account_number: userBankDetails.acc_number,
        amount: amount,
        narration: `Withdraw ${userBankDetails.acc_number} for N${amount}`,
        currency: "NGN",
        reference: reference.toString(),
        callback_url: "https://www.flutterwave.com/ng/",
        debit_currency: "NGN",
        beneficiary_name: userBankDetails.acc_name,
      };
    } else {
      console.log("true");
      let netAmount = 0;
      const rateResponse = await getTransferRates(amount);
      netAmount = Math.abs(rateResponse.data.source.amount);
      requestData = {
        amount: netAmount,
        reference: reference.toString(),
        beneficiary_name: userBankDetails.acc_name,
        currency: "USD",
        debit_currency: "NGN",
        callback_url: "https://www.flutterwave.com/ng/",
        narration: `Withdraw ${userBankDetails.acc_number} for N${amount}`,
        meta: [
          {
            AccountNumber: userBankDetails.acc_number,
            RoutingNumber: userBankDetails.routing_number,
            SwiftCode: userBankDetails.swift_code,
            BankName: userBankDetails.bank_name,
            BeneficiaryName: userBankDetails.acc_name,
            BeneficiaryAddress: userBankDetails.address,
            BeneficiaryCountry: userBankDetails.country,
          },
        ],
      };
    }

    responseData = await getResponse(requestData);

    console.log("responseData", responseData);

    if (!responseData || responseData.response !== "success") {
      return {
        response: "error",
        status: "0",
        reference: null,
        amount,
        response_text: "Failed to withdraw",
      };
    }

    const final = {
      response: responseData.status || "error",
      status: responseData.status === "success" ? "1" : "0",
      reference: responseData.reference || null,
      amount: responseData.amount || amount, // Ensure amount is always returned
      response_text: JSON.stringify(responseData) || "", // Ensure response_text is always available
    };

    return final;
  } catch (error) {
    console.error("Error in flutterWithdraw:", error);
    return {
      response: "error",
      status: "0",
      reference: null,
      amount,
      response_text: "Error during withdrawal",
    };
  }
};

async function getResponse(requestData) {
  try {
    console.log("getResponse", requestData);
    const flw = new Flutterwave(
      process.env.FLUTTERWAVE_Public_Key,
      process.env.FLUTTERWAVE_Secret_Key
    );
    console.log("flw", flw);
    const details = requestData;
    console.log("Details", details);
    const responseData = await flw.Transfer.initiate(details);

    console.log("responseData", responseData);

    let final = {};
    if (responseData.status === "success") {
      const fetchTransferResponse = await fetchTransfer(responseData.data.id);
      const fetchTransferData = fetchTransferResponse.data[0];
      if (fetchTransferData.id) {
        final.response = "success";
        final.status = "1";
        final.reference = fetchTransferData.id;
        final.amount = fetchTransferData.amount;
        final.response_text = JSON.stringify(fetchTransferResponse);
      } else if (responseData.data.status === "FAILED") {
        const msg = responseData.data.complete_message;
        final.response = "error";
        final.message = msg;
      } else {
        const msg = responseData.message;
        final.response = "error";
        final.message = msg;
        final.status = "0";
        final.reference = null;
        final.amount = requestData.amount;
        final.response_text = JSON.stringify(fetchTransferResponse);
      }
      return final;
    } else {
      final.response = "error";
      final.status = "0";
      final.reference = null;
      final.amount = requestData.amount;
      final.response_text = JSON.stringify(responseData);

      return final;
    }
  } catch (error) {
    console.error("Error in getResponse:", error);
    return null;
  }
}

async function getTransferRates(amount) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      url: `https://api.flutterwave.com/v3/transfers/rates?amount=${amount}&destination_currency=NGN&source_currency=USD`,
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_Secret_Key}`,
      },
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        try {
          const rateResponse = JSON.parse(body);
          resolve(rateResponse);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

async function fetchTransfer(transferId) {
  try {
    let id = transferId.toString();
    const flw = new Flutterwave(
      process.env.FLUTTERWAVE_Public_Key,
      process.env.FLUTTERWAVE_Secret_Key
    );
    // Use the fetch method to get transfer details
    const response = await flw.Transfer.fetch({ id: id });
    return response;
  } catch (error) {
    console.error("Error fetching transfer:", error);
    throw error;
  }
}
async function getUserDetails(userId) {
  try {
    const user = await User.findById(userId).select(
      "first_name last_name email"
    );
    return user;
  } catch (error) {
    console.error("Error occurred while fetching user details:", error);
    return null;
  }
}
async function getClientPaymentCompleteMail(templateKey) {
  try {
    const emailTemplate = await EmailTemplate.findOne({
      template_key: templateKey,
    });
    return emailTemplate;
  } catch (error) {
    // console.error("Error occurred while fetching email template:", error);
    return null;
  }
}
function htmlTemplate(htmlBody, amount) {
  const validate = { Amount: amount };
  let html = htmlBody;
  for (const key in validate) {
    const regex = new RegExp(`\\[${key}\\]`, "g");
    html = html.replace(regex, validate[key]);
  }
  // Other cleaning and formatting as needed
  return html;
}

const withdraw_application = async (req, res) => {
  const id = req.user._id;

  try {
    const pid = await Professional.findOne({ user_id: id });
    let f = 0;

    const jinv = await MyContracts.findOne({
      job_id: req.body.job_id,
      user_id: id,
      status: "hired",
    });

    if (jinv) {
      f = 1;
    }

    if (f === 1) {
      res.json({
        msg: "Your contract activated, so can't withdraw",
        flag: 1,
      });
    } else {
      await MyContracts.updateOne(
        {
          job_id: req.body.job_id,
          user_id: id,
        },
        { status: "withdraw" }
      );
      console.log("req.body.job_id", req.body.job_id);
      console.log("id", id);
      await JobInvitees.updateOne(
        { job_id: req.body.job_id, professional_id: pid._id.toString() },
        { invite_status: "5" }
      );

      res.json({
        msg: "Application withdrawn successfully",
        flag: 0,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
const updateMilstoneSubmitReview = async (req, res) => {
  try {
    const { milestones, jobid } = req.body;
    let id = req.user._id;
    for (const milestone of milestones) {
      const existingMilestone = await MilestoneJob.findOneAndUpdate(
        { _id: milestone._id },
        {
          $set: {
            milestone_hours: milestone.milestone_hours,
            milestone_task: milestone.milestone_task,
            milestone_price: milestone.milestone_price,
            milestone_start_date: milestone.milestone_start_date,
            milestone_end_date: milestone.milestone_end_date,
          },
        }
      );
      // }
      // } else {
      //   const milestoneData = {
      //     job_id: jobid,
      //     professional_id: id,
      //     milestone_task: "",
      //     milestone_hours: "",
      //     submit_task_status: "",
      //     milestone_price: "",
      //     milestone_start_date: "",
      //     milestone_end_date: "",
      //     milestone_original_start_date: "",
      //     milestone_original_end_date: "",
      //     status: "",
      //     current_status: "",
      //   };
      //   if (milestone.milestone_task) {
      //     milestoneData.milestone_task = milestone.milestone_task;
      //   } else {
      //     milestoneData.milestone_task = "Whole Project";
      //   }

      //   milestoneData.submit_task_status = "0";
      //   milestoneData.milestone_price = parseInt(milestone.milestone_price);
      //   milestoneData.milestone_hours = parseInt(milestone.milestone_hours);
      //   milestoneData.milestone_start_date = new Date(
      //     milestone.milestone_start_date
      //   );
      //   milestoneData.milestone_end_date = new Date(
      //     milestone.milestone_end_date
      //   );
      //   (milestoneData.milestone_original_start_date = new Date()), // Add this line
      //     (milestoneData.milestone_original_end_date = new Date()), // Add this line
      //     (milestoneData.status = "0");
      //   milestoneData.current_status = "0";
      //   milestoneData.created_at = new Date();
      //   await MilestoneJob.create(milestoneData);
      // }
    }
    res.status(200).json("data updated sucessfully.");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getUserContractApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userStatus } = req.body;

    const status = parseInt(userStatus);

    let professionalIds = [];

    if (status === 1) {
      professionalIds = await MyContracts.distinct("professional_id", {
        client_id: userId,
      });
    } else if (status === 2) {
      professionalIds = await MyContracts.distinct("client_id", {
        professional_id: userId,
      });
    } else {
      res.status(400).json({ error: "Invalid user status" });
      return;
    }
    const users = await User.find({ _id: { $in: professionalIds } });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMilstoneData = async (req, res) => {
  try {
    const { mid } = req.body;
    const data = await MilestoneJob.findOne({ _id: mid });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
const getUserNameAvtar = async (req, res) => {
  try {
    const id = req.user._id;
    const data = await User.findOne({ _id: id }).select(
      "last_name first_name avatar login_as"
    );
    res.status(200).json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const globalSearch = async (req, res) => {
  try {
    const { search, userId, login_as } = req.body;
    const searchResults = {};

    if (!search.trim()) {
      // If search string is empty, return empty arrays
      setEmptySearchResults(searchResults);
    } else {
      if (userId) {
        let overviewData = [];
        searchResults.users = await getuserDetials(search, userId, login_as);
        searchResults.userJobs = await JobTableSarch(search, userId, login_as);
        searchResults.myContracts = await Mycontractserch(
          search,
          userId,
          login_as,
          "contract"
        );
        searchResults.contractMilston = await MyContractMilston(
          search,
          userId,
          login_as,
          "contract"
        );
        searchResults.applicationMilston = await MyContractMilston(
          search,
          userId,
          login_as,
          "application"
        );
        let inviteBookMark = [];
        let pid;
        if (login_as == 2) {
          pid = await Professional.findOne({ user_id: userId });
          if (searchResults?.userJobs.length > 0) {
            await Promise.all(
              searchResults?.userJobs?.map(async (item) => {
                //this is for to get job invite and bookmark data.
                const response1 = await JobInvitees.findOne({
                  job_id: item._id,
                  professional_id: pid?._id.toString(),
                  invite_status: 0,
                });
                if (response1) {
                  inviteBookMark.push(item);
                } else {
                  const response2 = await JobInvitees.findOne({
                    job_id: item._id,
                    professional_id: pid?._id.toString(),
                    bookmark: 1,
                  });
                  if (response2) {
                    inviteBookMark.push(item);
                  }
                }
              })
            );
          }
          searchResults.invitetabledata = inviteBookMark;
          await Promise.all(
            searchResults.myContracts.map(async (item) => {
              //thisis for get overview data include that job or not.
              if (item?.contract_title != null) {
                const milston = await MilestoneJob.find({
                  professional_id: userId,
                  job_id: item.job_id,
                });
                if (milston) {
                  for (const milstonitem of milston) {
                    const trasactionwithdrawn = await Transaction.findOne({
                      milestone_id: milstonitem._id.toString(),
                      type: "Released",
                    });
                    const trasactionrelease = await Transaction.findOne({
                      milestone_id: milstonitem._id.toString(),
                      type: "Withdrawn",
                    });
                    if (!trasactionwithdrawn && trasactionrelease) {
                      overviewData.push(item);
                      break; // exit the loop once the condition is met
                    }
                  }
                }
              }
            })
          );
          searchResults.overview = overviewData;
          searchResults.bankdetails = await bankDetialsSearch(search, userId);
          searchResults.application = await Mycontractserch(
            search,
            userId,
            login_as,
            ""
          );
          searchResults.overviewMilston = await MyContractMilston(
            search,
            userId,
            login_as,
            "overview"
          );
        }
        if (login_as == 1) {
          let { removeNull, hiredData, bookmarkProfessionalData } =
            await ProfessionalDetails(search);
          searchResults.professinals = removeNull;
          searchResults.hiredProfessinals = hiredData;
          searchResults.BookmarkProfessinals = bookmarkProfessionalData;
        }
      }
    }

    res.status(200).json({ results: searchResults });
  } catch (err) {
    console.error("Error searching:", err);
    res.status(500).json({ error: err });
  }
};
async function setEmptySearchResults(searchResults) {
  searchResults.users = [];
  searchResults.userJobs = [];
  searchResults.myContracts = [];
  searchResults.application = [];
  searchResults.invitableData = [];
  searchResults.overview = [];
  searchResults.professionals = [];
  searchResults.hiredProfessionals = [];
  searchResults.bookmarkedProfessionals = [];
  searchResults.contractMilston = [];
  searchResults.applicationMilston = [];
  searchResults.overviewMilston = [];
}
const MyContractMilston = async (search, userId, login_as, type) => {
  let whereCondition = {};
  if (type == "contract" || type == "overview") {
    if (login_as == 1) {
      whereCondition.client_id = userId;
    } else {
      whereCondition.professional_id = userId;
    }
    whereCondition.status = "hired";
  } else {
    whereCondition.professional_id = userId;
    whereCondition.type = "active";
  }
  const contract = await MyContracts.find(whereCondition, {
    contract_title: 1,
    job_id: 1,
    professional_id: 1,
    _id: 1,
  });
  const DataArray = [];
  if (contract) {
    await Promise.all(
      contract.map(async (item) => {
        if (item?.job_id) {
          const milestoneDetails = await MilestoneJob.find(
            { job_id: item.job_id, professional_id: item.professional_id },
            { milestone_task: 1, milestone_price: 1, _id: 1 }
          );
          // Use for...of loop to properly handle asynchronous operations
          for (const milston of milestoneDetails) {
            const objectOfMilston = {
              contract_title: item.contract_title,
              milestone_task: milston.milestone_task,
              milestone_price: milston.milestone_price,
              _id: type == "contract" ? item._id : item.job_id,
            };
            if (type == "overview") {
              const transactionReleased = await Transaction.findOne({
                milestone_id: milston._id.toString(),
                type: "Released",
                status: "success",
              });
              const transactionWithdorwn = await Transaction.findOne({
                milestone_id: milston._id.toString(),
                type: "Withdrawn",
                response: "success",
              });
              if (transactionReleased && !transactionWithdorwn) {
                DataArray.push(objectOfMilston);
              }
            } else {
              DataArray.push(objectOfMilston);
            }
          }
        }
      })
    );
  }

  const foundUserJobs = DataArray.map((job) => {
    const foundJob = {};

    if (
      job.milestone_task.toString().toLowerCase().includes(search.toLowerCase())
    ) {
      foundJob.milestone_task = job.milestone_task;
    }

    if (
      job.milestone_price
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      foundJob.milestone_price = job.milestone_price;
    }

    if (Object.keys(foundJob).length !== 0) {
      foundJob.contract_title = job.contract_title;
      foundJob._id = job._id.toString();
      return foundJob;
    }
  });

  const removeNull = foundUserJobs.filter((item) => {
    if (item != null) {
      return item;
    }
  });
  return removeNull;
};
const getuserDetials = async (search, userId, login_as) => {
  let allData = {};
  const userJobs = await User.findOne({
    _id: userId,
  });

  if (userJobs) {
    allData._id = userJobs._id.toString();
    allData.first_name = userJobs.first_name;
    allData.last_name = userJobs.last_name;
    allData.email = userJobs.email;
    allData.user_timezone = userJobs.user_timezone;
    if (userJobs?.country) {
      const countryName = await Country.findOne({
        _id: userJobs?.country,
      }).select("name");
      allData.country = countryName.name;
    }
    if (login_as == 2) {
      const pid = await Professional.findOne({ user_id: userId });
      if (pid) {
        allData.phone = pid.phone;
        allData.location = pid.location;
        allData.bio_brief = pid.bio_brief;
        allData.experience_level = pid.experience_level;
        allData.designation = pid.designation;
      }
    } else {
      const cid = await Client.findOne({ user_id: userId });
      if (cid) {
        allData.phone = cid.phone;
        allData.company_name = cid.company_name;
        allData.company_desc = cid.company_desc;
        allData.location = cid.location;
        allData.designation = cid.designation;
        allData.web_address = cid.web_address;
      }
    }
  }
  const array = [allData];
  const foundUserJobs = array.map((job) => {
    const foundJob = {};

    if (
      job.first_name.toString().toLowerCase().includes(search.toLowerCase()) ==
        true ||
      job.last_name.toString().toLowerCase().includes(search.toLowerCase()) ==
        true
    ) {
      foundJob.userName = `${job.first_name} ${job.last_name}`;
    }

    if (job.email.toString().toLowerCase().includes(search.toLowerCase())) {
      foundJob.email = job.email;
    }

    if (
      job.user_timezone.toString().toLowerCase().includes(search.toLowerCase())
    ) {
      foundJob.user_timezone = job.user_timezone;
    }

    if (job.country.toString().toLowerCase().includes(search.toLowerCase())) {
      foundJob.country = job.country;
    }

    if (job.phone.toString().toLowerCase().includes(search.toLowerCase())) {
      foundJob.phone = job.phone;
    }
    if (login_as == 2) {
      if (
        job.location.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.location = job.location;
      }
      if (
        job.bio_brief.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.bio_brief = job.bio_brief;
      }
      if (
        job.experience_level
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        foundJob.experience_level = job.experience_level;
      }
      if (
        job.designation.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.designation = job.designation;
      }
    } else {
      if (
        job.company_name.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.company_name = job.company_name;
      }
      if (
        job.location.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.location = job.location;
      }
      if (
        job.company_desc.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.company_desc = job.company_desc;
      }
      if (
        job.web_address.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.web_address = job.web_address;
      }
      if (
        job.designation.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        foundJob.designation = job.designation;
      }
    }

    if (Object.keys(foundJob).length !== 0) {
      foundJob._id = job._id.toString();
      return foundJob;
    }
  });
  const removeNull = foundUserJobs.filter((item) => {
    if (item != null) {
      return item;
    }
  });
  return removeNull;
};
const ProfessionalDetails = async (search) => {
  const userData = await User.find({
    login_as: 2,
  });
  const foundUserMycontract = userData.map((job) => {
    const foundJob = {};

    if (
      job.first_name.toString().toLowerCase().includes(search.toLowerCase()) ==
        true ||
      job.last_name.toString().toLowerCase().includes(search.toLowerCase()) ==
        true
    ) {
      foundJob.userName = `${job.first_name} ${job.last_name}`;
      foundJob._id = job._id;
      return foundJob;
    }
  });
  const removeNull = foundUserMycontract.filter((item) => {
    if (item != null) {
      return item;
    }
  });
  const hiredData = [];
  const bookmarkProfessionalData = [];
  if (removeNull?.length > 0) {
    await Promise.all(
      removeNull.map(async (item) => {
        const mycontract = await MyContracts.find({
          user_id: item._id.toString(),
          type: "active",
        });
        if (mycontract.length > 0) {
          hiredData.push(item);
        }
        const pid = await Professional.findOne({
          user_id: item._id.toString(),
        });
        if (pid) {
          const bookmark = await JobInvitees.find({
            professional_id: pid._id.toString(),
            bookmark: 1,
            invite_status: "-1",
          });
          if (bookmark.length > 0) {
            bookmarkProfessionalData.push(item);
          }
        }
      })
    );
  }
  return { removeNull, hiredData, bookmarkProfessionalData };
};
const bankDetialsSearch = async (search, userId) => {
  const userJobs = await BankDetail.find({
    user_id: userId,
    $or: [
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$bank_name" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$account_holder_name" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$bank_account" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$ifsc_code" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$routing_number" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$swift_code" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$address" },
            regex: search,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$country" },
            regex: search,
            options: "i",
          },
        },
      },
    ],
  });
  const foundUserJobs = userJobs.map((job) => {
    const foundJob = {};

    if (job.bank_name.toString().includes(search)) {
      foundJob.bank_name = job.bank_name;
    }

    if (job.account_holder_name.toString().includes(search)) {
      foundJob.account_holder_name = job.account_holder_name;
    }

    if (job.bank_account.toString().includes(search)) {
      foundJob.bank_account = job.bank_account;
    }

    if (job.bank_type.toString().includes(search)) {
      foundJob.bank_type = job.budget_to;
    }

    if (job.ifsc_code.toString().includes(search)) {
      foundJob.ifsc_code = job.ifsc_code;
    }

    if (job.routing_number.toString().includes(search)) {
      foundJob.routing_number = job.routing_number;
    }

    if (job.swift_code.toString().includes(search)) {
      foundJob.swift_code = job.swift_code;
    }

    if (job.address.toString().includes(search)) {
      foundJob.address = job.address;
    }

    if (job.country.toString().includes(search)) {
      foundJob.country = job.country;
    }
    if (Object.keys(foundJob).length !== 0) {
      foundJob._id = job._id.toString();
      return foundJob;
    }
  });
  const removeNull = foundUserJobs.filter((item) => {
    if (item != null) {
      return item;
    }
  });
  return removeNull;
};
const Mycontractserch = async (search, userId, login_as, type) => {
  let whereCondition = {};
  if (login_as == 1) {
    whereCondition.client_id = userId;
  } else {
    whereCondition.professional_id = userId;
  }
  if (type == "contract") {
    whereCondition.status = "hired";
  } else {
    whereCondition.type = "active";
  }
  const myContracts = await MyContracts.find({
    $and: [
      whereCondition,
      {
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$contract_title" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$contract_desc" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$budget" },
                regex: search,
                options: "i",
              },
            },
          },
        ],
      },
    ],
  });
  const foundUserMycontract = myContracts.map((job) => {
    const foundJob = {};

    if (job.contract_title.toString().includes(search)) {
      foundJob.contract_title = job.contract_title;
    }

    if (job.contract_desc.toString().includes(search)) {
      foundJob.contract_desc = job.contract_desc;
    }

    if (job.budget.toString().includes(search)) {
      foundJob.budget = job.budget;
    }
    if (Object.keys(foundJob).length !== 0) {
      foundJob._id = type == "contract" ? job._id.toString() : job.job_id;
      foundJob.job_id = job.job_id;
      return foundJob;
    }
  });
  const removeNull = foundUserMycontract.filter((item) => {
    if (item != null) {
      return item;
    }
  });
  return removeNull;
};

const JobTableSarch = async (search, userId, login_as) => {
  let whereCondition = {};
  if (login_as == 1) {
    whereCondition.user_id = userId;
  } else {
    whereCondition.type = "active";
  }
  const userJobs = await Jobs.find({
    $and: [
      whereCondition,
      {
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$job_title" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$job_description" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$budget_from" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$budget_to" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$experience_level" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$budget_type" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$location" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$job_place" },
                regex: search,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$cover_page_detail" },
                regex: search,
                options: "i",
              },
            },
          },
        ],
      },
    ],
  });
  const foundUserJobs = userJobs.map((job) => {
    const foundJob = {};

    if (job.job_title.toString().includes(search)) {
      foundJob.job_title = job.job_title;
    }

    if (job.job_description.toString().includes(search)) {
      foundJob.job_description = job.job_description;
    }

    if (job.budget_from.toString().includes(search)) {
      foundJob.budget_from = job.budget_from;
    }

    if (job.budget_to.toString().includes(search)) {
      foundJob.budget_to = job.budget_to;
    }

    if (job.experience_level.toString().includes(search)) {
      foundJob.experience_level = job.experience_level;
    }

    if (job.budget_type.toString().includes(search)) {
      foundJob.budget_type = job.budget_type;
    }

    if (job.location.toString().includes(search)) {
      foundJob.location = job.location;
    }

    if (job.job_place.toString().includes(search)) {
      foundJob.job_place = job.job_place;
    }

    if (job.cover_page_detail.toString().includes(search)) {
      foundJob.cover_page_detail = job.cover_page_detail;
    }
    if (Object.keys(foundJob).length !== 0) {
      foundJob._id = job._id.toString();
      return foundJob;
    }
  });
  const removeNull = foundUserJobs.filter((item) => {
    if (item != null) {
      return item;
    }
  });
  return removeNull;
};
const storeImageInBackend = async (req, res) => {
  try {
    profileUpload.single("companyImage")(req, res, async function (err) {
      const uid = req.user._id;
      const client = await Client.updateOne(
        { user_id: uid },
        { $set: { profile_img: req.fileName } }
      );
      res.status(200).json({ message: "Image is store." });
    });
  } catch (error) {
    res.status(500).json({ message: "Not able to store iamge." });
  }
};

const storepPortfolioData = async (req, res) => {
  try {
    profileUpload.array("files")(req, res, async function (err) {
      const { portfolio, UploadedIds, deleteDataId } = req.body;
      const userId = req.user._id;
      const data = JSON.parse(portfolio);
      const uploadedFileIds = JSON.parse(UploadedIds);
      const file = req.files;
      const deletIdsData = JSON.parse(deleteDataId);
      if (deletIdsData.length > 0) {
        deletIdsData.map(async (item) => {
          await Portfolio.deleteOne({ _id: item });
        });
      }
      if (data) {
        // await Portfolio.deleteMany({ user_id: userId });
        let count = 0;
        for (const entry of data) {
          if (typeof entry.id == "string") {
            let option = {};
            option.title = entry.portfoliotitle;
            option.portfolio_link = entry.portfoliolink;
            option.user_id = userId;

            if (uploadedFileIds) {
              uploadedFileIds.filter((item) => {
                if (item == entry.id) {
                  option.portfolio_image = file[count]?.filename;
                  count += 1;
                }
              });
            } else {
              option.portfolio_image = entry.portfolioimg || "";
            }
            await Portfolio.findOneAndUpdate(
              { _id: entry.id },
              {
                $set: option,
              }
            );
          } else {
            await Portfolio.create({
              title: entry.portfoliotitle,
              portfolio_link: entry.portfoliolink,
              portfolio_image:
                file[count]?.filename != "" ? file[count]?.filename : "",
              user_id: userId,
            });
            count += 1;
          }
        }
      }
      res.status(200).json({ message: "" });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

// const withoutLoginFindJob = async (req, res) => {
//   try {
//     const jobs = await JobModel.find({ type: "active" })
//       .sort({ created_at: 1 }) // Sort by created_at in ascending order (for descending use -1)
//       .select(
//         "job_title experience_level budget_type budget_to budget_from servicestag location created_at job_description user_id job_type"
//       )
//       .populate({
//         path: "user_id",
//         select: "country",  // Select country field from the user
//         populate: {
//           path: "country",  // Populate the country field in user
//           model: "Country", // Reference the Country model
//           select: "name",   // Get only the name field from the Country
//         },
//       })
//       .exec();

//     var updatedJobs = await Promise.all(
//       jobs.map(async (job) => {
//         if (job.user_id ) {

//         const reviews = await JobFeedback.find({ rate_to: job.user_id._id });

//         const totalRating = reviews.reduce((acc, curr) => acc + curr.rate, 0);

//         const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
//         return {
//           ...job.toObject(),
//           review: averageRating,
//         };
//         }
//       })
//     );
//     // Sort the final updatedJobs array by created_at in descending order
//     updatedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

//     res.status(200).send({ success: true, data: updatedJobs.filter((item)=>item!=undefined) });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({ success: false, error: error });
//   }
// }

// const withoutLoginFindJob = async (req, res) => {
//   try {
//     const jobs = await JobModel.find({ type: "active" })
//       .sort({ created_at: 1 }) // Sort by created_at in ascending order
//       .select(
//         "job_title experience_level budget_type budget_to budget_from servicestag location created_at job_description user_id job_type"
//       )
//       .populate({
//         path: "user_id",
//         select: "country", // Select country field from the user
//         populate: {
//           path: "country", // Populate the country field in user
//           model: "Country", // Reference the Country model
//           select: "name", // Get only the name field from the Country
//         },
//       })
//       .populate({
//         path: "job_type",
//         model: "Category", // Reference the Category model
//         select: "name", // Get the name field from Category
//       })
//       .lean()
//       .exec();

//     const updatedJobs = await Promise.all(
//       jobs.map(async (job) => {
//         if (job.user_id) {
//           // Find all skills associated with this job
//           const skillJobs = await SkillJob.find({ job_id: job._id });
//           const skillIds = skillJobs.map((skillJob) => skillJob.skill_id);

//           // Find all skill names based on the skill IDs
//           const skills = await SkillModel.find({
//             _id: { $in: skillIds },
//           }).select("name");
//           const skillNames = skills.map((skill) => skill.name);

//           const reviews = await JobFeedback.find({ rate_to: job.user_id._id });
//           const totalRating = reviews.reduce((acc, curr) => acc + curr.rate, 0);
//           const averageRating =
//             reviews.length > 0 ? totalRating / reviews.length : 0;
// console.log(job)
//           return {
//             ...job.toObject(),
//             review: averageRating,
//             category_name: job.job_type?.name || "Unknown Category", // Include category name
//             skills: skillNames, // Add the list of skills
//           };
//         }
//       })
//     );

//     // Sort the final updatedJobs array by created_at in descending order
//     updatedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

//     res.status(200).send({
//       success: true,
//       data: updatedJobs.filter((item) => item !== undefined),
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

const withoutLoginFindJob = async (req, res) => {
  try {
    const jobs = await JobModel.find({ type: "active" })
      .sort({ created_at: 1 }) // Sort by created_at in ascending order
      .select(
        "job_title experience_level budget_type budget_to budget_from servicestag location created_at job_description user_id job_type"
      )
      .populate({
        path: "user_id",
        select: "country", // Select country field from the user
        populate: {
          path: "country",
          model: "Country",
          select: "name",
        },
      })
      .populate({
        path: "job_type",
        model: "Category",
        select: "name",
      })
      .lean() // Use lean to convert to plain JS object
      .exec();

    const jobIds = jobs.map(job => job._id);
    const userIds = jobs.map(job => job.user_id._id);

    // Batch fetch all skills for jobs in one query
    const skillJobs = await SkillJob.find({ job_id: { $in: jobIds } });
    const skillIdsMap = skillJobs.reduce((acc, skillJob) => {
      if (!acc[skillJob.job_id]) acc[skillJob.job_id] = [];
      acc[skillJob.job_id].push(skillJob.skill_id);
      return acc;
    }, {});

    // Batch fetch all skill names in one go
    const allSkillIds = [...new Set(skillJobs.map(skillJob => skillJob.skill_id))];
    const skills = await SkillModel.find({ _id: { $in: allSkillIds } }).select("name").lean();

    const skillMap = skills.reduce((acc, skill) => {
      acc[skill._id] = skill.name;
      return acc;
    }, {});

    // Batch fetch all reviews for the users in one go
    const reviews = await JobFeedback.find({ rate_to: { $in: userIds } }).lean();
    const reviewMap = reviews.reduce((acc, review) => {
      if (!acc[review.rate_to]) acc[review.rate_to] = { total: 0, count: 0 };
      acc[review.rate_to].total += review.rate;
      acc[review.rate_to].count += 1;
      return acc;
    }, {});

    // Build the final updated jobs array
    const updatedJobs = jobs.map(job => {
      if (!job.user_id) return undefined;

      // Calculate average rating
      const userReviews = reviewMap[job.user_id._id] || { total: 0, count: 0 };
      const averageRating = userReviews.count > 0 ? userReviews.total / userReviews.count : 0;

      // Get skill names for the job
      const jobSkillIds = skillIdsMap[job._id] || [];
      const skillNames = jobSkillIds.map(skillId => skillMap[skillId] || "Unknown Skill");

      return {
        ...job,
        review: averageRating,
        category_name: job.job_type?.name || "Unknown Category",
        skills: skillNames,
      };
    });

    // Sort updated jobs by created_at in descending order
    updatedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Send response, filtering out undefined jobs
    res.status(200).send({
      success: true,
      data: updatedJobs.filter(job => job !== undefined),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  my_application_detail,
  deleteFileUpload,
  deleteMilstoneDetails,
  myapplicationdetilaslist,
  myapplicationlist,
  jobinviteesdetails,
  removejobinvitesen,
  diclinJobInvite,
  removeInvite,
  myapplication,
  getAllProducts,
  getAllProductsUsers,
  change_password_process_users,
  edit_profile_process,
  jobApply,
  edit_job_apply,
  bookmark,
  invitation_bookmark,
  dashboard,
  job_detail,
  transaction_history,
  earning_overview,
  bookmarkProfessional,
  removeProfessionalBookmark,
  getBookmarkedProfessionals,
  draftProfessionalApplications,
  myContract,
  updateapplicationdetials,
  getAllJobs,
  myContractFeedback,
  milstoneData,
  update_user,
  job_milestone,
  update_profile,
  make_end_contract,
  withdraw_amount,
  withdraw_application,
  updateMilstoneSubmitReview,
  getUserContractApplications,
  getMilstoneData,
  getUserNameAvtar,
  globalSearch,
  storeImageInBackend,
  storepPortfolioData,
  withoutLoginFindJob,
};
