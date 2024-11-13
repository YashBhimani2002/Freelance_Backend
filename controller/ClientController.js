const User = require("../model/userModel");
const client = require("../model/ClientModel");
const education = require("../model/Education_tblModel");
const experience = require("../model/Experience_tblModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Professionals = require("../model/Professional");
const Jobs = require("../model/JobsModel");
const skilljobs = require("../model/SkillJobModel");
const skills = require("../model/SkillsModel");
const JobInvitees = require("../model/JobIinviteesModel");
const JobFeedbacks = require("../model/job_feedbacks");
const MilestoneJob = require("../model/MilestoneJobModel");
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const countryss = require("../model/CountryModel");
const BookmarkProfessionals = require("../model/BookmarkProfessionalModel");
const { bookmarkProfessional } = require("./ProfessionalController");
const tblMessage = require("../model/MessageModel");
const my_contracts = require("../model/MyContractsModel");
const notification = require("../model/NotificationModel");
const jobs = require("../model/JobsModel");
const AppliedJobs = require("../model/AppliedJobs");
const Countries = require("../model/CountryModel");
const skillprofessional = require("../model/Skill_professionalModel");
const Client = require("../model/ClientModel");
const categoryjob = require("../model/CategoryJobModel");
const categories = require("../model/CategoriesModel");
const applicationfile = require("../model/ProfessionalApplicationAttachment");
const Professional = require("../model/Professional");
const JobFeedback = require("../model/job_feedbacks");
const MyContracts = require("../model/MyContractsModel");
const jobinvitees = require("../model/JobIinviteesModel");
const Transaction = require("../model/TransactionModel");
const PaymentMethods = require("../model/PaymentMethods");
const identityTable = require("../model/identity_table");
const professional_portfolios = require("../model/professional_portfolios");
const Certification = require("../model/Tbl_certifications");
const postmark = require("postmark");

const fs = require("fs");
const multer = require("multer");
const storagePath = "public/uploads/identity-verification-attachment";
const submitWorkeStoragePath = "public/uploads/submitWorkeFile";
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}
if (!fs.existsSync(submitWorkeStoragePath)) {
  fs.mkdirSync(submitWorkeStoragePath, { recursive: true });
}
const { v4: uuidv4 } = require("uuid"); // Use UUID library to generate a unique identifier

const generateToken = (payload) => {
  let secretKey = process.env.JWT_SECRET;
  const options = {
    expiresIn: "5d",
  };

  return jwt.sign(payload, secretKey, options);
};

// async function view_profile(req, res) {
//   try {
//     if (req.user._id) {
//       const user = await User.findOne({ _id: req.user._id });
//       let clint = null;
//       if (user.login_as == 1) {
//         clint = await client.findOne({ user_id: req.user._id });
//       }
//       const eduction = await education.find({ user_id: req.user._id });
//       const certificate = await Certification.find({ user_id: req.user._id });
//       const portfolio = await professional_portfolios.find({
//         user_id: req.user._id,
//       });
//       const expedit = await experience.find({ user_id: req.user._id });
//       let professional_data = null;
//       if (user.login_as == 2) {
//         professional_data = await Professional.findOne({
//           user_id: req.user._id,
//         });
//       }
//       const jobCount = await jobs.countDocuments({ user_id: req.user._id });
//       const active = await my_contracts
//         .find({ user_id: req.user._id, type: "active", status: "hired" })
//         .select("job_id")
//         .populate({
//           path: "job_id",
//           select:
//             "budget_from budget_to budget_type job_title job_description user_id",
//         });
//       const completed = await my_contracts
//         .find({ user_id: req.user._id, type: "ended", status: "hired" })
//         .select("job_id")
//         .populate({
//           path: "job_id",
//           select:
//             "budget_from budget_to budget_type job_title job_description user_id",
//         });
//       // Calculate average rating for each user in activejobs
//       const activeJobs = await Promise.all(
//         active.map(async (jobContract) => {
//           const reviews = await JobFeedback.find({
//             rate_to: jobContract.job_id.user_id,
//           });
//           let averageRating = 0;
//           if (reviews.length > 0) {
//             const totalRating = reviews.reduce(
//               (acc, curr) => acc + curr.rate,
//               0
//             );
//             averageRating = totalRating / reviews.length;
//           }
//           const rating = averageRating.toFixed(1);
//           // Return the job object with the calculated average rating
//           return { ...jobContract.job_id.toObject(), rating };
//         })
//       );

//       // Calculate average rating for each user in completedJobs
//       const completedJobs = await Promise.all(
//         completed.map(async (jobContract) => {
//           const reviews = await JobFeedback.find({
//             rate_to: jobContract.job_id.user_id,
//           });
//           let averageRating = 0;
//           if (reviews.length > 0) {
//             const totalRating = reviews.reduce(
//               (acc, curr) => acc + curr.rate,
//               0
//             );
//             averageRating = totalRating / reviews.length;
//           }
//           const rating = averageRating.toFixed(1);
//           // Return the job object with the calculated average rating
//           return { ...jobContract.job_id.toObject(), rating };
//         })
//       );

//       let countryInfoArray = null;
//       if (user.country) {
//         const countryInfo = await Countries.findOne({
//           _id: user.country,
//         }).select("name timezones");
//         const timezonesArray = JSON.parse(countryInfo.timezones);
//         const firstZoneName = timezonesArray[0].zoneName;
//         countryInfoArray = [];
//         countryInfoArray.push({
//           name: countryInfo.name,
//           firstZoneName: firstZoneName,
//         });
//       }

//       let skillData = [];
//       if (professional_data) {
//         skillData = await skillprofessional
//           .find({ professional_id: professional_data._id })
//           .select("skill_id");
//       }

//       const review = await JobFeedback.find({ rate_to: user._id });
//       // Calculate the average rating for the user
//       let averageRating = 0;
//       if (review.length > 0) {
//         const totalRating = review.reduce((acc, curr) => acc + curr.rate, 0);
//         averageRating = totalRating / review.length;
//       }
//       let rating = averageRating.toFixed(1);

//       //transactions
//       let option = {};
//       if (user.login_as == 2) {
//         option = {
//           operation_user_id: req.user._id,
//           type: "Withdrawn",
//           response: "success",
//         };
//       } else {
//         option = {
//           operation_user_id: req.user._id,
//           status: "success",
//           type: "Released",
//         };
//       }
//       const transactions = await Transaction.find(option).populate(
//         "user_id professional_user_id"
//       );

//       res.status(200).json({
//         user,
//         clint,
//         eduction,
//         expedit,
//         certificate,
//         portfolio,
//         countryInfoArray,
//         professional_data,
//         skillData,
//         rating,
//         jobCount,
//         completedJobs,
//         activeJobs,
//         transactions,
//       });
//     } else {
//       res.redirect("/login");
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
async function view_profile(req, res) {
  try {
    if (req.user._id) {
      const userId = req.user._id;
      const user = await User.findOne({ _id: req.user._id });
      const [
        resultEducation,
        certificate,
        portfolio,
        experienceData,
        transactions,
        resultClient,
        professionalData,
      ] = await Promise.all([
        education.find({ user_id: userId }).lean(),
        Certification.find({ user_id: userId }).lean(),
        professional_portfolios.find({ user_id: userId }).lean(),
        experience.find({ user_id: userId }).lean(),
        Transaction.find({
          operation_user_id: userId,
          ...(user.login_as === 2
            ? { type: "Withdrawn", response: "success" }
            : { status: "success", type: "Released" }),
        }).populate("user_id professional_user_id").lean(),
        user.login_as === 1 ? client.findOne({ user_id: userId }).lean() : null,
        user.login_as === 2 ? Professional.findOne({ user_id: userId }).lean() : null,
      ]);

      // Conditional queries based on user login type
      const skillData =
        professionalData && user.login_as === 2
          ? await skillprofessional
              .find({ professional_id: professionalData._id })
              .select("skill_id")
              .lean()
          : [];

      // Fetch country info if it exists
      let countryInfoArray = null;
      if (user.country) {
        const countryInfo = await Countries.findOne({ _id: user.country })
          .select("name timezones")
          .lean();

          
        const firstZoneName = '';
        countryInfoArray = [{ name: countryInfo.name, firstZoneName }];
      }

      // Fetch jobs, contracts, and reviews
      const [activeContracts, completedContracts, jobCount, reviews] =
        await Promise.all([
          my_contracts
            .find({ user_id: userId, type: "active", status: "hired" })
            .select("job_id")
            .populate(
              "job_id",
              "budget_from budget_to budget_type job_title job_description user_id"
            )
            .lean(),
          my_contracts
            .find({ user_id: userId, type: "ended", status: "hired" })
            .select("job_id")
            .populate(
              "job_id",
              "budget_from budget_to budget_type job_title job_description user_id"
            )
            .lean(),
          jobs.countDocuments({ user_id: userId }),
          JobFeedback.find({ rate_to: userId }).lean(),
        ]);

      const calculateJobRatings = async (contracts) => {
        return await Promise.all(
          contracts.map(async (contract) => {
            const reviews = await JobFeedback.find({
              rate_to: contract.job_id.user_id,
            }).lean();
            const averageRating =
              reviews.length > 0
                ? (
                    reviews.reduce((acc, curr) => acc + curr.rate, 0) /
                    reviews.length
                  ).toFixed(1)
                : "0.0";
            return { ...contract.job_id, rating: averageRating };
          })
        );
      };

      // Calculate ratings for active and completed jobs
      const [activeJobs, completedJobs] = await Promise.all([
        calculateJobRatings(activeContracts),
        calculateJobRatings(completedContracts),
      ]);

      // Calculate user’s average rating
      const userRating =
        reviews.length > 0
          ? (
              reviews.reduce((acc, curr) => acc + curr.rate, 0) / reviews.length
            ).toFixed(1)
          : "0.0";

      res.status(200).json({
        user,
        clint: resultClient,
        eduction: resultEducation,
        expedit: experienceData,
        certificate,
        portfolio,
        countryInfoArray,
        professional_data: professionalData,
        skillData,
        rating: userRating,
        jobCount,
        completedJobs,
        activeJobs,
        transactions,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function get_conversation(req, res) {
  try {
    if (req.user._id) {
      const targetUser = req.params.id;
      const messages = await tblMessage
        .find({
          $or: [
            { user_id: req.user._id, receiver_id: targetUser },
            { user_id: targetUser, receiver_id: req.user._id },
          ],
        })
        .exec();
      const con = {
        loggedUser: req.user._id,
        targetUser: targetUser,
      };
      res
        .status(200)
        .json({ messages: messages, loggedUser: req.user._id, con }); // Adjust the response as needed
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function getUserAllConversation(req, res) {
  try {
    if (req.user._id) {
      const targetUser = req.user._id;

      const messages = await tblMessage
        .find({
          $or: [{ sender_id: targetUser }, { receiver_id: targetUser }],
        })
        .exec();

      res.json({ messages: messages, loggedUser: req.user._id });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function readMessage(req, res) {
  try {
    const { messageIds } = req.body;
    await tblMessage.updateMany(
      { _id: { $in: messageIds } },
      { $set: { reading_status: "1" } }
    );

    res
      .status(200)
      .json({ success: true, message: "Messages updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteMessage(req, res) {
  try {
    // Assuming the criteria are passed in the request body
    const { senderId, receiverId } = req.body;
    // Find and delete the messages based on the criteria
    const deletedMessages = await tblMessage.deleteMany({
      senderId: senderId,
    });

    if (deletedMessages.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No messages found matching the criteria" });
    }

    res.status(200).json({
      success: true,
      message: "Messages deleted successfully",
      deletedMessages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function add_message(req, res) {
  try {
    if (req.user._id) {
      const targetUser = req.params.id;
      const inputValue = req.body.inputValue;
      const file = req.file;

      let filePath = null;

      if (file) {
        // Generate a unique filename using timestamp and UUID
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${uuidv4()}-${file.originalname}`;

        // Save the file to local storage
        const uploadDir = "./uploads";
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        filePath = `${uploadDir}/${uniqueFilename}`;
        const fileStream = fs.createWriteStream(filePath);
        fileStream.write(file.buffer);
        fileStream.end();
      }

      const messageData = {
        user_id: req.user._id,
        sender_id: req.user._id,
        receiver_id: targetUser,
        message: file ? file.originalname : inputValue,
        file: filePath,
        message_type: file ? 2 : 1,
        reading_status: 0,
        user_type: req.user.login_as,
        job_id: null,
      };

      const add = tblMessage.create(messageData);

      if (add) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: true });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function job_post(req, res) {
  try {
    const jobid = req.body.jobid;
    const job = await Jobs.findOne({ _id: jobid });
    const getskill = await skilljobs.find({ job_id: jobid });
    const skillIds = getskill.map((skill) => skill.skill_id);
    const getskill2 = await skills.find({ _id: { $in: skillIds } });
    const category = await categoryjob.findOne({ job_id: jobid });
    const categoryid = category.category_id;
    const category2 = await categories.findOne({ _id: categoryid });

    const file = await applicationfile.findOne({ job_id: jobid });

    return res.status(200).json({
      success: true,
      message: "job found.",
      job,
      getskill2,
      category2,
      file,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function discover_professional_list(req, res) {
  try {
    // Query for documents where login_as is equal to 2
    const users = await User.find({ login_as: 2 }).exec();
    const uniqueCountryIds = [...new Set(users.map((user) => user.country))];
    const countryNamesList = await Promise.all(
      uniqueCountryIds.map(async (countryId) => {
        const countrySkills = await countryss.find({ id: countryId });
        const countryNames = countrySkills.map((skill) => skill.name);

        return countryNames;
      })
    );
    const uniqueCountryNames = [...new Set(countryNamesList.flat())];

    res.status(200).json({ countryNames: uniqueCountryNames, users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function professioal_hired_list(req, res) {
  try {
    const _id = "659258e1516a429cef4eb59a";

    // Use Mongoose queries to fetch data
    const jobInvitees = await JobInvitees.find({ client_id: _id }).populate({
      path: "professional_id",
      model: Professionals,
      populate: {
        path: "user_id",
        model: User,
      },
    });

    let globalCountryNamesList;

    const jobs = await Promise.all(
      jobInvitees.map(async (jobInvitee) => {
        const professional = jobInvitee.professional_id;
        const users = Array.isArray(professional.user_id)
          ? professional.user_id[0]
          : professional.user_id;
        const uniqueCountryIds = [
          ...new Set([users].map((user) => user.country)),
        ];

        const countryNamesList = await Promise.all(
          uniqueCountryIds.map(async (countryId) => {
            const countrySkills = await countryss.find({ id: countryId });

            // Extracting only the 'name' property from each object in the countrySkills array
            const countryNames = countrySkills.map((skill) => skill.name);

            return countryNames;
          })
        );

        // Combine all the data for this jobInvitee
        const jobs = {
          hire: jobInvitee,
          professional,
          users,
          countryNamesList,
        };

        globalCountryNamesList = countryNamesList; // Set the global variable

        return jobs;
      })
    );
    const uniqueCountryNames = [...new Set(globalCountryNamesList.flat())];
    res.status(200).json({ countryNames: uniqueCountryNames, jobs });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

const professional_bookmark = async (req, res) => {
  try {
    //   textid pass to frontend
    //   uid pass to middleware
    const textid = req.body.textid || "";
    const job_id = req.body.job_id;
    const uid = req.user._id; // Assuming you are using session middleware
    const pid = await Professionals.findOne({ user_id: uid });
    const pro_id = pid;

    const dt = await BookmarkProfessionals.findOne({
      job_id: job_id,
      professional_id: pro_id,
    });

    if (dt) {
      if (dt.bookmark === "1") {
        await BookmarkProfessionals.findByIdAndUpdate(dt.id, { bookmark: "0" });
        res.json({ message: "successfully", sign: "n", textid: textid });
      } else {
        await BookmarkProfessionals.findByIdAndUpdate(dt.id, { bookmark: "1" });
        res.json({ message: "successfully", sign: "f", textid: textid });
      }
    } else {
      const data = {
        job_id: job_id,
        professional_id: pro_id._id.toString(),
        bookmark: "1",
      };
      await BookmarkProfessionals.create(data);
      res.status(200).json({ message: "successfully'", textid: textid });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const jobbookmarkdetails = async (req, res) => {
  // const id = req.user._id;
  // const pid = await Professionals.findOne({ user_id: id });
  // const pro_id = pid._id.toString();
  // const data = await BookmarkProfessionals.find({ professional_id: pro_id, bookmark: '1' }).select('job_id bookmark')
  // res.status(200).json(data);
};

const removeprofessionalbookmark = async (req, res) => {
  const id = req.user._id;
  const pid = await Professionals.findOne({ user_id: id }).select("_id");
  const pro_id = pid._id.toString();
  const data = await BookmarkProfessionals.deleteOne({
    professional_id: pro_id,
    bookmark: "1",
    job_id: req.body.jobId,
  });
  res.status(200).json(data);
};

const bookmark_professional_list = async (req, res) => {
  try {
    const _id = req.user._id;
    if (_id) {
      // req.session.invite = 'ib';
      const data = await professionalBookmarkList(_id);
      // data.uid = id;
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function professionalBookmarkList(
  id,
  searchjob,
  searchjob1,
  short,
  short1
) {
  try {
    const pid = await BookmarkProfessionals.find({});
    const jobIds = pid.map((professional) => professional.job_id);
    const userData = await User.find({ _id: { $in: jobIds } });
    return userData;
  } catch (error) {
    // console.error(error);
  }
}

async function projects(req, res) {
  try {
    const id = req.user._id;
    const projectID = req.body.projectID;
    const allprojects = await Jobs.find({
      user_id: id,
      type: { $in: ["active", "draft"] },
    });
    const endprojects = await Jobs.find({ user_id: id, type: "ended" }).sort({
      created_at: -1,
    });

    let specificContract = [];
    if (projectID) {
      const singleContract = await Jobs.findOne({ _id: projectID });
      const file = await applicationfile.findOne({ job_id: projectID });
      const singleskillJobData = await skilljobs.find({ job_id: projectID });
      if (singleContract) {
        const combinedContract = {
          ...singleContract.toObject(),
          attachfile: file ? file.toObject() : null,
          skills: [],
        };
        for (const skillJob of singleskillJobData) {
          const skill = await skills.findOne({ _id: skillJob.skill_id });
          if (skill) {
            combinedContract.skills.push(skill.name);
          }
        }
        specificContract.push(combinedContract);
      }
    }

    if (!allprojects) {
      return res.status(404).json({ message: "No Project Found." });
    }
    const enhancedProjects = await Promise.all(
      allprojects.map(async (project) => {
        const skillJobData = await skilljobs.find({ job_id: project._id });
        console.log("skillJobData111111111111111", skillJobData);
        const enhancedSkillJobData = await Promise.all(
          skillJobData.map(async (skillJob) => {
            const skillData = await skills.findById(skillJob.skill_id);
            return { ...skillJob.toObject(), skillData };
          })
        );

        const messageData = await tblMessage.find({
          job_id: project._id,
          reading_status: 0,
        });
        let unreadMessageCount = 0;
        if (messageData && messageData.length > 0) {
          unreadMessageCount = messageData.length;
        }
        const hiredCount = await my_contracts.countDocuments({
          job_id: project._id,
          status: "hired",
        });
        const proposalCount = await my_contracts.countDocuments({
          job_id: project._id,
          type: "active",
          status: "shortlisted",
        });
        return {
          ...project.toObject(),
          skillJobData: enhancedSkillJobData,
          unreadMessageCount,
          hiredCount,
          proposalCount,
        };
      })
    );

    const endedProjects = await Promise.all(
      endprojects.map(async (project) => {
        const skillJobData = await skilljobs.find({ job_id: project._id });
        const enhancedSkillJobData = await Promise.all(
          skillJobData.map(async (skillJob) => {
            const skillData = await skills.findById(skillJob.skill_id);
            return { ...skillJob.toObject(), skillData };
          })
        );

        return {
          ...project.toObject(),
          skillJobData: enhancedSkillJobData,
        };
      })
    );

    if (projectID) {
      return res.status(200).json({
        success: true,
        message: "Project Found.",
        specificContract,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Project Found.",
        projects: enhancedProjects,
        endedProjects: endedProjects,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getNotification(req, res) {
  try {
    const { accountType } = req.params;

    const { _id } = req.user;
    let response = await User.find({ _id: _id }).select("notification_status");
    let notificationStatus =
      response.length == 0
        ? true
        : response[0].notification_status == 1
        ? true
        : false;
    if (accountType === "2") {
      let notifications = await notification.find({ professional_id: _id });

      notifications = notifications.reverse();
      return res
        .status(200)
        .json({ status: notificationStatus, success: true, notifications });
    } else if (accountType === "1") {
      let notifications = await notification.find({ client_id: _id });
      notifications = notifications.reverse();
      return res
        .status(200)
        .json({ status: notificationStatus, success: true, notifications });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error });
  }
}

async function postNotification(req, res) {
  try {
    const {
      rout,
      send_by,
      subject,
      professional_id,
      client_id,
      job_id,
      email,
      first_name,
      last_name,
      client_email,
      milestone_Task,
    } = req.body;

    let client = "";
    let professional = "";
    if (client_id) {
      client = client_id;
    }

    if (professional_id) {
      professional = professional_id;
    }

    let messageForShow = "";
    if (subject === "job-Apply") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has applied for "${job.job_title}"`;
      // Send email notification
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "Job Apply"
      );
    }

    if (subject === "withdraw_Payment") {
      const user = await User.findOne({ _id: req.user._id });
      // Send email notification
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "withdraw_Payment"
      );
    }

    if (subject === "hired") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} hired your application for "${job.job_title}"`;
      // Send email notification
      // sendEmailNotification(first_name, last_name, email, user, job, "hired");
      sendEmailProfessional(
        first_name,
        last_name,
        email,
        milestone_Task,
        job,
        user,
        "hired"
      );
    }

    if (subject === "withdraw") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `Application for ${job.job_title} has been withdrawn by ${user.first_name} ${user.last_name}`;
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "withdraw"
      );
    }

    // if (subject === "updateApplication") {
    //   const user = await User.findOne({ _id: req.user._id });
    //   var job = await jobs.findOne({ _id: job_id });
    //   messageForShow = `Application for ${job.job_title} has been edit by ${user.first_name} ${user.last_name}`;
    // }

    if (subject === "c_feedback") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has submitted feedback for ${job.job_title}`;
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "c_feedback"
      );
    }

    if (subject === "p_feedback") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has shared feedback for ${job.job_title}`;
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "p_feedback"
      );
    }

    if (subject === "Decline") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has Declined for Work of ${job.job_title}`;
      sendEmailNotification(first_name, last_name, email, user, job, "Decline");
    }

    if (subject === "Active") {
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `Your contract is activated for "${job.job_title}"`;
      const user = await User.findOne({ _id: req.user._id });
      sendEmailNotification(first_name, last_name, email, user, job, "Active");
    }

    if (subject === "invite") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `You are invited to apply for "${job.job_title}"`;
      // Send email notification
      sendEmailNotification(first_name, last_name, email, user, job, "invite");
    }

    if (subject === "payment") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `Payment for project "${job.job_title}" successfully processed`;
      sendEmailClient(
        first_name,
        last_name,
        client_email,
        milestone_Task,
        job,
        user,
        "payment"
      );
      // Send email notification
      sendEmailProfessional(
        first_name,
        last_name,
        email,
        milestone_Task,
        job,
        user,
        "payment"
      );
    }

    if (subject === "reviewed") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} reviewed your application : "${job.job_title}"`;
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "reviewed"
      );
    }

    if (subject === "submit_work") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has submitted work for "${job.job_title}"`;
      // Send email notification
      sendEmailProfessional(
        first_name,
        last_name,
        email,
        milestone_Task,
        user,
        job,
        "submit_work"
      );
    }

    if (subject === "p_endcontract") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has ended contract for project "${job.job_title}"`;
      // Send email notification
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "p_endcontract"
      );
    }

    if (subject === "c_endcontract") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has ended contract for project "${job.job_title}"`;
      // Send email notification
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "c_endcontract"
      );
    }

    if (subject === "approved") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has Approved your work on"${job.job_title}"`;
      // Send email notification
      sendEmailClient(
        first_name,
        last_name,
        email,
        milestone_Task,
        user,
        job,
        "approved"
      );
    }

    if (subject === "rejected") {
      const user = await User.findOne({ _id: req.user._id });
      var job = await jobs.findOne({ _id: job_id });
      messageForShow = `${user.first_name} ${user.last_name} has rejected your work on "${job.job_title}"`;
      // Send email notification
      sendEmailNotification(
        first_name,
        last_name,
        email,
        user,
        job,
        "rejected"
      );
    }

    const newNotification = new notification({
      rout,
      send_by,
      subject,
      professional_id: professional,
      client_id: client,
      message: messageForShow,
      job_id,
    });

    await newNotification.save();

    return res
      .status(200)
      .json({ success: true, message: "Notification created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function sendEmailCloseAccount(req, res) {
  try {
    const { first_name, last_name, email, eventType } = req.body;

    const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;
    if (!email) {
      return { success: false, message: "Email is required" };
    }

    const client = new postmark.ServerClient(POSTMARK_TOKEN);

    let subject = "";
    let htmlBody = "";

    subject = "Close Account";
    htmlBody = `<p>Hello ${first_name} ${last_name},</p>
      <p>Your Account is closed. Please contact Praiki support at praiki@gmail.com.</p>
      <p>Thank you.</p>
      <p>Praiki</p>`;

    const sendEmail = await client.sendEmail({
      From: `Praiki <noreply@praiki.com>`,
      To: email,
      Subject: subject,
      HtmlBody: htmlBody,
    });
    return res.status(200).json({ success: true, message: sendEmail });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function sendEmailNotification(
  first_name,
  last_name,
  email,
  user,
  job,
  eventType
) {
  // const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

  try {
    // if (!email) {
    //   return { success: false, message: "Email is required" };
    // }

//     const client = new postmark.ServerClient(POSTMARK_TOKEN);

//     let subject = "";
//     let htmlBody = "";

//     switch (eventType) {
//       case "Job Apply":
//         subject = "A Professional Applied for Your Project on Praiki";
//         htmlBody = `<p>Hello ${first_name} ${last_name},</p>
//           <p>${user.first_name} ${user.last_name} has applied for your project "${job.job_title}".<a href="https://praiki.com/projects">Click Here</a> to review the application.</p>
//           <p>Note that you may review as many applications as you wish. You may also invite a professional to apply from the "invite professional" tab.
//           However, a professional is not hired until the project is assigned and paid for.</p>
//           <p>Thank you.</p>
//           <p>Praiki</p>`;
//         break;
//       case "withdraw_Payment":
//         subject = "Withdraw Payment";
//         htmlBody = `<p>Hello ${first_name} ${last_name},</p>
// <p>We are excited to inform you that your withdrawal has been successfully processed! Please check your bank account to see the updated balance.</p>
// <p>Thank you for choosing us!</p>
// <p>Best regards,<br>Praiki</p>`;
//         break;
//       case "hired":
//         subject = "Hired Notification";
//         htmlBody = `<p>Hello ${first_name} ${last_name},</p>
//           <p>Congratulations! Your contract has been hired for the project "${job.job_title}".
//           </p>
//           <p>Thank you.</p>`;
//         break;
//       case "Active":
//         subject = "Contract Activation Notification";
//         htmlBody = `<p>Hello,</p>
//           <p>Congratulations! Your contract has been activated for the project "${job.job_title}" has been activated.<br/>You will be notified when payment is made to begin work on the project.</p>
//           <p>Thank you.</p>`;
//         break;
//       case "invite":
//         subject = "Project Invitation";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//         <p> ${user.first_name} ${user.last_name}  has invited you to work on their project "${job.job_title}". <a href="https://praiki.com/invitation&bookmark">Click Here</a>; to get started.
//         </p>
//         <p>Thank you.</p>
//         <p>Praiki</p>`;
//         break;
//       case "submit_work":
//         subject = "Submit Work";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//           <p> ${user.first_name} ${user.last_name} has submitted work for your project "${job.job_title}". 
//           Go to your contract page to Accept Or Reject the completed milestone.
//           </p>
//           <p><a href="https://praiki.com/login">Login</a>; to review uploaded work in the “Files” tab on your contract page.</p>
//           <p>Click “End Contract” to rate the service provided to you. Your feedback and ratings help us serve you better.</p>
//           <p>Thank you.</p>
//           <p>Praiki</p>`;
//         break;
//       case "c_endcontract":
//         subject = "Ended Contract";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//             <p> ${user.first_name} ${user.last_name} has ended contract for the project "${job.job_title}"</p>
//             <p>Ratings and feedback increase your chances of future earnings on Praiki.<a href="https://praiki.com/login">Login</a> to your account to share feedback and rate your client. </p>
//             <p>Thank you.</p>
//             <p>Praiki</p>`;
//         break;

//       case "p_endcontract":
//         subject = "Ended Contract";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//             <p> ${user.first_name} ${user.last_name} has ended contract for the project "${job.job_title}"</p>
//             <p><a href="https://praiki.com/login"> Login</a> to share a review of their service.</p>
//             <p>Your ratings and feedback help us serve you better.</p>
//             <p>Thank you.</p>
//             <p>Praiki</p>`;
//         break;

//       case "Decline":
//         subject = "Invitation Declined";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//               <p> ${user.first_name} ${user.last_name} has declined your invite to work on the project "${job.job_title}"</p>
//               <p>Thank you.</p>
//               <p>Praiki</p>`;
//         break;
//       case "reviewed":
//         subject = "Application Review Notification";
//         htmlBody = `<p>Hello,</p>
//           <p>Your application for the project "${job.job_title}" has been reviewed by ${user.first_name} ${user.last_name}.</p>
//           <p>Thank you.</p>`;
//         break;
//       case "rejected":
//         subject = "Reject";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//             <p> ${user.first_name} ${user.last_name} has rejected your work for the project "${job.job_title}". 
//             ${user.first_name} ${user.last_name}  has to approve your submitted work or milestone for you to adequately process your earnings on this project. This does not affect earnings on your approved work or milestone. On this, withdrawal is processed immediately.
//             </p>
//             <p>
//             Login to message ${user.first_name} ${user.last_name}  or contact us if you need any assistance.</p>
//              <p>Best</p>
//             <p>Praiki</p>`;
//         break;
//       case "payment":
//         subject = "Payment successful";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//               <p>Payment successful this milestone ${milestoneTask}  for the contract with ${job.job_title}. 
//               </p>
//               <p>
//                <p>Best wishes</p>
//               <p>Praiki</p>`;
//         break;

//       case "withdraw":
//         subject = "Withdrawn Application";
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//               <p>The application for ${job.job_title} has been withdrawn by ${user.first_name} ${user.last_name}
//               </p>
//               <p>
//                <p>Best wishes</p>
//               <p>Praiki</p>`;
//         break;

//       case "p_feedback":
//         subject = `Feedback for ${job.job_title}`;
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//                 <p>${user.first_name} ${user.last_name} has shared feedback on your project ${job.job_title}
//                 </p>
//                 <p>Your feedback and ratings help us serve you better.</p>
//                 <p>Click on the feedback notification message to share your feedback directly or simply navigate to “Ended Contracts” and click on “View Contract” to share your feedback.</p>
//                 <p>Thank you</p>
//                 <p>Praiki</p>`;
//         break;

//       case "c_feedback":
//         subject = `Submit Feedback`;
//         htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
//                   <p>${user.first_name} ${user.last_name} has shared feedback for your work on the project ${job.job_title}
//                   </p>
//                   <p>Ratings and feedback increase your chances of future earnings on Praiki. <a href="https://praiki.com/login">Login</a> to give feedback and rate your client.                  </p>
//                   <p>
//                    <p>Best wishes</p>
//                   <p>Praiki</p>`;
//         break;

//       default:
//         return { success: false, message: "Invalid event type" };
//     }

//     const sendEmail = await client.sendEmail({
//       From: `Praiki <noreply@praiki.com>`,
//       To: email,
//       Subject: subject,
//       HtmlBody: htmlBody,
//     });
//     console.log("work submitted");

    return { success: false, message: "Done" };
  } catch (error) {
    console.log("work not submitted");
    return { success: false, message: error.message };
  }
}

async function sendEmailClient(
  first_name,
  last_name,
  client_email,
  milestone_Task,
  job,
  user,
  eventType
) {
  const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

  try {
    if (!client_email) {
      return { success: false, message: "Email is required" };
    }
    const client = new postmark.ServerClient(POSTMARK_TOKEN);

    let subject = "";
    let htmlBody = "";

    switch (eventType) {
      case "payment":
        subject = "Payment successful";
        if (milestone_Task && milestone_Task !== "Whole Project") {
          htmlBody = `<p>Hello ${user.first_name} ${user.last_name},</p>
          <p>You have successfully processed payment for the milestone "${milestone_Task}" on your project "${job.job_title}". 
          </p>
          <p>
           <p>Best wishes,</p>
          <p>Praiki</p>`;
        } else {
          htmlBody = `<p>Hello ${user.first_name} ${user.last_name},</p>
              <p>You have successfully processed payment for your project "${job.job_title}".</p>
              <p>Best wishes</p>
              <p>Praiki</p>`;
        }
        break;
      case "approved":
        subject = "Work Approved";

        if (milestone_Task && milestone_Task !== "Whole Project") {
          htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
          <p>
          ${job.first_name} ${job.last_name} has approved your submitted milestone "${milestone_Task}" for the project "${user.job_title}".
          </p>
          <p>
          To process your earnings, enter your bank details in <a href="https://praiki.com/paymentpreferences">Payment Preference</a>.
          </p>
          <p>Ratings and feedback increase your chances of future earnings on Praiki. Click <a href="https://praiki.com/mycontract">End Contract</a> to give feedback and rate your client.
          </p>
          <p>Thank you.</p>
          <p>Praiki</p>`;
        } else {
          htmlBody = `<p>Hello ${first_name} ${last_name},</p>
          <p>
          ${job.first_name} ${job.last_name} has approved your submitted work for the project "${user.job_title}".
          </p>
          <p>
          To process your earnings, enter your bank details in <a href="https://praiki.com/paymentpreferences">Payment Preference</a>.
          </p>
          <p>Ratings and feedback increase your chances of future earnings on Praiki. Click <a href="https://praiki.com/mycontract">End Contract</a> to give feedback and rate your client.
          </p>
          <p>Thank you.</p>
          <p>Praiki</p>`;
        }
        break;
      default:
        return { success: false, message: "Invalid event type" };
    }

    const sendEmail = await client.sendEmail({
      From: `Praiki <noreply@praiki.com>`,
      To: client_email,
      Subject: subject,
      HtmlBody: htmlBody,
    });
    return { success: false, message: sendEmail };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function sendEmailProfessional(
  first_name,
  last_name,
  email,
  milestone_Task,
  job,
  user,
  eventType
) {
  const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;
  try {
    if (!email) {
      return { success: false, message: "Email is required" };
    }
    const client = new postmark.ServerClient(POSTMARK_TOKEN);

    let subject = "";
    let htmlBody = "";

    switch (eventType) {
      case "payment":
        subject = "Payment successful";

        if (milestone_Task && milestone_Task !== "Whole Project") {
          htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
          <p>Payment for your milestone "${milestone_Task}" on the project "${job.job_title}" is successfully processed. Go to your contracts to get started immediately.
          </p>
          <p>
           <p>Best wishes</p>
          <p>Praiki</p>`;
        } else {
          htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
              <p>${user.first_name} ${user.last_name} has successfully processed payment for the project  "${job.job_title}" is successfully processed.
              <a href="https://praiki.com/login">Login</a> to your account to get started.
              </p>
              <p>Best wishes</p>
              <p>Praiki</p>`;
        }
        break;

      case "hired":
        subject = "Hired Notification";
        if (milestone_Task && milestone_Task !== "Whole Project") {
          htmlBody = `<p>Hello ${first_name} ${last_name},</p>
          <p>Congratulations! Your milestone "${milestone_Task}" has been hired for the project "${job.job_title}".
          </p>
          <p>Thank you.</p>`;
        } else {
          htmlBody = `<p>Hello ${first_name} ${last_name},</p>
          <p>Congratulations! Your contract has been hired for the project "${job.job_title}".
          </p>
          <p>Thank you.</p>`;
        }
        break;

      case "submit_work":
        subject = "Submit Work";
        if (milestone_Task && milestone_Task !== "Whole Project") {
          htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
            <p> ${job.first_name} ${job.last_name} has submitted work for  the milestone "${milestone_Task}" for your project "${user.job_title}". 
            Go to your contract page to Accept Or Reject the completed milestone.
            </p>
            <p><a href="https://praiki.com/login">Login</a>; to review uploaded work in the “Files” tab on your contract page.</p>
            <p>Click “End Contract” to rate the service provided to you. Your feedback and ratings help us serve you better.</p>
            <p>Thank you.</p>
            <p>Praiki</p>`;
        } else {
          htmlBody = `<p>Hello  ${first_name} ${last_name},</p>
            <p> ${job.first_name} ${job.last_name} has submitted work for your project "${user.job_title}". 
            Go to your contract page to Accept Or Reject the completed milestone.
            </p>
            <p><a href="https://praiki.com/login">Login</a>; to review uploaded work in the “Files” tab on your contract page.</p>
            <p>Click “End Contract” to rate the service provided to you. Your feedback and ratings help us serve you better.</p>
            <p>Thank you.</p>
            <p>Praiki</p>`;
        }
        break;

      default:
        return { success: false, message: "Invalid event type" };
    }

    const sendEmail = await client.sendEmail({
      From: `Praiki <noreply@praiki.com>`,
      To: email,
      Subject: subject,
      HtmlBody: htmlBody,
    });
    return { success: false, message: sendEmail };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function getAppliedJobs(req, res) {
  const id = req.user._id;
  try {
    const appliedJobs = await MyContracts.aggregate([
      {
        $match: { client_id: id },
      },
      {
        $lookup: {
          from: "users",
          let: { professionalId: { $toObjectId: "$user_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$professionalId"] },
              },
            },
          ],
          as: "professional_data",
        },
      },
      {
        $lookup: {
          from: "professionals",
          let: { professionalId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user_id", "$$professionalId"] },
              },
            },
          ],
          as: "professional_bio_data",
        },
      },
    ]);

    return res.status(200).json({ success: true, appliedJobs });
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function allprofessional(req, res) {
  try {
    const professionalsData = await User.find({ login_as: 2 })
      .select("_id first_name last_name country avatar")
      .sort({ createdAt: -1 });

    if (!professionalsData || professionalsData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No professionals found." });
    }

    const allprofessionals = await Promise.all(
      professionalsData.map(async (professional) => {
        let skillData = [];
        let jobInviteeData = [];
        let jobInviteeIds = [];

        const { _id, first_name, last_name, country } = professional;
        const avatarDetail = await User.find({ _id: _id }).select(
          "avatar email"
        );
        const professionalDetails = await Professionals.findOne({
          user_id: _id,
        }).select("company bio_title bio_brief experience_level");
        // If professional details are not found, skip this professional
        if (!professionalDetails) {
          return null; // Skip to the next professional
        }
        const countryDetails = await Countries.findOne({ _id: country }).select(
          "name"
        );
        if (professionalDetails) {
          skillData = await skillprofessional
            .find({ professional_id: professionalDetails._id })
            .select("skill_id");
          jobInviteeData = await jobinvitees
            .find({ professional_id: professionalDetails._id })
            .select("job_id invite_status");
          // jobInviteeIds = jobInviteeData.map(invitee => invitee.job_id);
          jobInviteeIds = jobInviteeData.map((invitee) => ({
            job_id: invitee.job_id,
            invite_status: invitee.invite_status,
          }));
        }
        // Retrieve job IDs for the professional
        const jobIds = (
          await my_contracts.find({ user_id: _id }).select("job_id")
        ).map((contract) => contract.job_id);
        // Retrieve job data for the professional's jobs
        const jobData = await jobs
          .find({ _id: { $in: jobIds } })
          .select("budget_type");
        // Filter job data to find the budget type based on job type
        const budgetType = jobData.map((job) => job.budget_type);

        const completed = await my_contracts
          .find({ user_id: _id, type: "ended", status: "hired" })
          .select("job_id")
          .populate({
            path: "job_id",
            select:
              "budget_from budget_to budget_type job_title job_description user_id",
          });

        const active = await my_contracts
          .find({ user_id: _id, type: "active", status: "hired" })
          .select("job_id")
          .populate({
            path: "job_id",
            select:
              "budget_from budget_to budget_type job_title job_description user_id",
          });

        // Calculate average rating for each user in activejobs
        const activeJobs = await Promise.all(
          active.map(async (jobContract) => {
            const reviews = await JobFeedback.find({
              rate_to: jobContract.job_id.user_id,
            });
            let averageRating = 0;
            if (reviews.length > 0) {
              const totalRating = reviews.reduce(
                (acc, curr) => acc + curr.rate,
                0
              );
              averageRating = totalRating / reviews.length;
            }
            const rating = averageRating.toFixed(1);
            // Return the job object with the calculated average rating
            return { ...jobContract.job_id.toObject(), rating };
          })
        );

        // Calculate average rating for each user in completedJobs
        const completedJobs = await Promise.all(
          completed.map(async (jobContract) => {
            const reviews = await JobFeedback.find({
              rate_to: jobContract.job_id.user_id,
            });
            let averageRating = 0;
            if (reviews.length > 0) {
              const totalRating = reviews.reduce(
                (acc, curr) => acc + curr.rate,
                0
              );
              averageRating = totalRating / reviews.length;
            }
            const rating = averageRating.toFixed(1);
            // Return the job object with the calculated average rating
            return { ...jobContract.job_id.toObject(), rating };
          })
        );

        const review = await JobFeedback.find({ rate_to: _id });
        // Calculate the average rating for the user
        let averageRating = 0;
        if (review.length > 0) {
          const totalRating = review.reduce((acc, curr) => acc + curr.rate, 0);
          averageRating = totalRating / review.length;
        }

        //transactions
        let option = {};
        option = {
          operation_user_id: _id,
          type: "Withdrawn",
          response: "success",
        };

        const transactions = await Transaction.find(option).populate(
          "user_id professional_user_id"
        );

        return {
          _id,
          first_name,
          last_name,
          country: {
            code: country,
            name: countryDetails ? countryDetails.name : null,
          },
          professionalDetails,
          skillData,
          budgetType,
          jobInviteeIds,
          rating: averageRating.toFixed(1),
          completedJobs,
          activeJobs,
          avatarDetail,
          transactions,
        };
      })
    );
    // Filter out null entries (skipped professionals)
    const filteredProfessionals = allprofessionals.filter(
      (professional) => professional !== null
    );

    return res.status(200).json({
      success: true,
      message: "Professionals found.",
      allprofessionals: filteredProfessionals,
    });
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
async function hiredProfessionals(req, res) {
  try {
    const clientid = req.user._id;
    const hiredContracts = await my_contracts.find({
      client_id: clientid,
      status: "hired",
      type: "active",
    });
    const userIds = hiredContracts.map((contract) => contract.user_id);
    //fetch user data
    const userData = await User.find({ _id: { $in: userIds } }).select(
      "_id first_name last_name country avatar"
    );
    // Find professionals
    const hiredProfessionals = await Promise.all(
      userData.map(async (professional) => {
        let skillData = [];
        const { _id, first_name, last_name, country, avatar } = professional;
        const professionalDetails = await Professionals.findOne({
          user_id: _id,
        }).select("company bio_title bio_brief experience_level");
        const countryDetails = await Countries.findOne({ _id: country }).select(
          "name"
        );
        if (professionalDetails) {
          skillData = await skillprofessional
            .find({ professional_id: professionalDetails._id })
            .select("skill_id");
        }
        const review = await JobFeedback.find({ rate_to: _id });
        // Calculate the average rating for the user
        let averageRating = 0;
        if (review.length > 0) {
          const totalRating = review.reduce((acc, curr) => acc + curr.rate, 0);
          averageRating = totalRating / review.length;
        }
        const completed = await my_contracts
          .find({ user_id: _id, type: "ended", status: "hired" })
          .select("job_id")
          .populate({
            path: "job_id",
            select:
              "budget_from budget_to budget_type job_title job_description user_id",
          });

        const active = await my_contracts
          .find({ user_id: _id, type: "active", status: "hired" })
          .select("job_id")
          .populate({
            path: "job_id",
            select:
              "budget_from budget_to budget_type job_title job_description user_id",
          });

        // Calculate average rating for each user in activejobs
        const activeJobs = await Promise.all(
          active.map(async (jobContract) => {
            const reviews = await JobFeedback.find({
              rate_to: jobContract.job_id.user_id,
            });
            let averageRating = 0;
            if (reviews.length > 0) {
              const totalRating = reviews.reduce(
                (acc, curr) => acc + curr.rate,
                0
              );
              averageRating = totalRating / reviews.length;
            }
            const rating = averageRating.toFixed(1);
            // Return the job object with the calculated average rating
            return { ...jobContract.job_id.toObject(), rating };
          })
        );

        // Calculate average rating for each user in completedJobs
        const completedJobs = await Promise.all(
          completed.map(async (jobContract) => {
            const reviews = await JobFeedback.find({
              rate_to: jobContract.job_id.user_id,
            });
            let averageRating = 0;
            if (reviews.length > 0) {
              const totalRating = reviews.reduce(
                (acc, curr) => acc + curr.rate,
                0
              );
              averageRating = totalRating / reviews.length;
            }
            const rating = averageRating.toFixed(1);
            // Return the job object with the calculated average rating
            return { ...jobContract.job_id.toObject(), rating };
          })
        );
        //transactions
        let option = {};
        option = {
          operation_user_id: _id,
          type: "Withdrawn",
          response: "success",
        };

        const transactions = await Transaction.find(option).populate(
          "user_id professional_user_id"
        );
        return {
          _id,
          first_name,
          last_name,
          avatar,
          country: {
            code: country,
            name: countryDetails ? countryDetails.name : null,
          },
          professionalDetails,
          skillData,
          rating: averageRating.toFixed(1),
          completedJobs,
          activeJobs,
          transactions,
          // budgetType,
        };
      })
    );
    return res.status(200).json({ success: true, hiredProfessionals });
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function editJobType(req, res) {
  try {
    const id = req.body.id;
    const changetype = req.body.changetype;
    if (changetype === "private") {
      const updatedJob = await Jobs.findOneAndUpdate(
        { _id: id },
        { $set: { type: changetype } }
      );
      if (!updatedJob) {
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Job type updated successfully",
        updatedJob,
      });
    } else if (changetype === "delete") {
      const invitedJob = await JobInvitees.findOne({ job_id: id });
      const mycontractJob = await my_contracts.findOne({ job_id: id });
      if (mycontractJob) {
        return res.status(401).json({
          success: false,
          message: "Professional has applied; cannot delete",
        });
      }

      if (invitedJob) {
        const bookmarkJob = await JobInvitees.findOne({
          job_id: id,
          invite_status: "-1",
          bookmark: "1",
        });

        if (bookmarkJob) {
          await JobInvitees.deleteMany({
            job_id: id,
            invite_status: "-1",
            bookmark: "1",
          });
          const availableJobinvite = await JobInvitees.find({
            job_id: id,
          });
          if (availableJobinvite.length === 0) {
            await Jobs.findOneAndDelete({ _id: id });
            await skilljobs.deleteMany({ job_id: id });
          }
        }

        // Update all JobInvitees entries
        await JobInvitees.updateMany(
          { job_id: id },
          { $set: { job_status: "deleted", bookmark: "0" } }
        );
        await Jobs.findOneAndUpdate(
          {
            _id: id,
          },
          { type: "deleted" }, // Update the job_status value
          { new: true } // Return the updated document
        );

        return res.status(200).json({
          success: true,
          message: "Job deleted successfully",
        });
      }

      if (mycontractJob && invitedJob) {
        return res.status(401).json({
          success: false,
          message: "Professional has applied; cannot delete",
        });
      }

      if (!mycontractJob && !invitedJob) {
        const deletedJob = await Jobs.findOneAndDelete({ _id: id });
        const deletejob2 = await skilljobs.deleteMany({ job_id: id });
        return res.status(200).json({
          success: true,
          message: "Job deleted successfully",
          deletedJob,
        });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function shortlist(req, res) {
  try {
    const id = "65967eaa8103483c9980eb1d";
    const currentStatus = "reviewed";

    let newStatus, successMessage, responseData;

    if (currentStatus === "shortlisted") {
      newStatus = "reviewed";
      successMessage = "Shortlist successfully updated to Reviewed";
    } else if (currentStatus === "reviewed") {
      newStatus = "hired";
      successMessage = "Reviewed successfully updated to Hired";
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Invalid current status" });
    }

    // Fetch data before the update
    const existingData = await my_contracts.find({
      job_id: id,
      status: currentStatus,
    });

    // Perform the update
    const updatedContracts = await my_contracts.updateOne(
      { job_id: id, status: currentStatus },
      { $set: { status: newStatus } }
    );

    if (updatedContracts.modifiedCount > 0) {
      // If at least one document is modified
      responseData = await my_contracts.find({ job_id: id, status: newStatus });
      return res.status(200).json({
        success: true,
        message: successMessage,
        dataBeforeUpdate: existingData,
        dataAfterUpdate: responseData,
        status: newStatus,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, error: "No matching documents found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

const bookmarkProfessionalForJob = async (req, res) => {
  try {
    const data = {
      job_id: req.body.job_id,
      professional_id: req.body.professional_id,
      bookmark: "1",
      client_id: req.user._id,
    };
    await BookmarkProfessionals.create(data);
    res.status(200).json({ message: "successfully'" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const bookmarkProfessionalForJobdetails = async (req, res) => {
  try {
    const id = req.user._id;
    const data = await BookmarkProfessionals.find({
      client_id: id,
      bookmark: "1",
    });
    if (!data) {
      res.status(400).json({ msg: "No data found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const removeprofessionalbookmarkForJobDetails = async (req, res) => {
  const id = req.user._id;
  const data = await BookmarkProfessionals.deleteOne({
    professional_id: req.body.professional_id,
    bookmark: "1",
    job_id: req.body.jobId,
  });
  res.status(200).json(data);
};

const reviewHireAppliedJob = async (req, res) => {
  const { id, reviewOrHire } = req.body;

  try {
    const updatedContract = await MyContracts.findOneAndUpdate(
      { _id: id },
      { status: reviewOrHire },
      { new: true }
    );

    if (!updatedContract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    return res.status(200).json({ success: true, updatedContract });
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const clientContarctDetails = async (req, res) => {
  // const id = req.body.id;
  const id = req.user._id;

  try {
    const appliedJobs = await MyContracts.aggregate([
      {
        $match: { client_id: id, status: "hired" },
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: { $toObjectId: "$user_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$user_id"] },
              },
            },
          ],
          as: "professional_data",
        },
      },
      {
        $lookup: {
          from: "jobs",
          let: { jobId: { $toObjectId: "$job_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$jobId"] },
              },
            },
          ],
          as: "jobs_data",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const jobDetails = await jobs.findOne({ _id: appliedJobs.job_id });
    return res.status(200).json({
      success: true,
      clientContracts: appliedJobs,
      jobDetails: jobDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const professionalContarctDetails = async (req, res) => {
  const id = req.user._id;
  try {
    const appliedJobs = await MyContracts.aggregate([
      {
        $match: { user_id: id, status: "hired" },
      },
      {
        $lookup: {
          from: "users",
          let: { client_id: { $toObjectId: "$client_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$client_id"] },
              },
            },
          ],
          as: "client_data",
        },
      },
      {
        $lookup: {
          from: "jobs",
          let: { jobId: { $toObjectId: "$job_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$jobId"] },
              },
            },
          ],
          as: "jobs_data",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res
      .status(200)
      .json({ success: true, clientContracts: appliedJobs });
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const contarctRating = async (req, res) => {
  const { rate_by, rate_to, job_id, contract_id, feedback, rate } = req.body;

  try {
    if (!rate_by || !rate_to || !contract_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let existingFeedback = await JobFeedback.findOne({
      job_id,
      contract_id,
      rate_by,
      rate_to,
    });

    if (existingFeedback) {
      existingFeedback.rate_by = rate_by;
      existingFeedback.rate_to = rate_to;
      existingFeedback.rate = rate;
      existingFeedback.feedback = feedback;
      existingFeedback.updated_at = Date.now();

      await existingFeedback.save();

      return res
        .status(200)
        .json({ success: true, message: "Feedback updated successfully" });
    } else {
      const newFeedback = new JobFeedback({
        job_id,
        rate_by,
        rate_to,
        contract_id,
        rate,
        feedback,
      });

      await newFeedback.save();

      return res
        .status(201)
        .json({ success: true, message: "Feedback submitted successfully" });
    }
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getContractRating = async (req, res) => {
  const { rate_by, rate_to, job_id, contract_id } = req.body;
  try {
    const query = { job_id, contract_id };
    if (rate_by) query.rate_by = rate_by;
    if (rate_to) query.rate_to = rate_to;

    const contractRatings = await JobFeedback.find(query)
      .populate({
        path: "rate_by",
        select: "first_name last_name",
        model: User,
      })
      .populate({
        path: "rate_to",
        select: "first_name last_name",
        model: User,
      });

    return res.status(200).json({ success: true, data: contractRatings });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

async function sendinviteprofessional(req, res) {
  try {
    const clientid = req.user._id;
    const { job_id, userid, invite_status, proposal_status } = req.body;

    const professionalID = await Professional.findOne({
      user_id: userid,
    }).select("_id");

    const jobInviteData = await jobinvitees.findOne({
      job_id: job_id,
      professional_id: professionalID._id.toString(),
    });

    const job = await Jobs.findById(job_id).select("job_title");
    let invitation;

    if (job_id) {
      // Check if the professional is already hired for this job
      const contract = await MyContracts.findOne({
        job_id: job_id,
        status: "hired",
      });
      if (contract) {
        return res.status(200).json({
          success: true,
          message: "Professional is already hired for this job",
        });
      }
    }

    if (jobInviteData) {
      await JobInvitees.updateOne(
        {
          professional_id: professionalID._id.toString(),
          job_id: job_id,
        },
        {
          client_id: clientid,
          invite_status: invite_status,
          proposal_status: proposal_status,
          job_title: job.job_title,
        }
      );
      // Capture the updated data
      invitation = {
        job_id: job_id,
        client_id: clientid,
        professional_id: professionalID._id.toString(),
        invite_status: invite_status,
        proposal_status: proposal_status,
        job_title: job.job_title,
      };
    } else {
      invitation = {
        job_id: job_id,
        client_id: clientid,
        professional_id: professionalID._id.toString(),
        invite_status: invite_status,
        proposal_status: proposal_status,
        job_title: job.job_title,
      };
      await JobInvitees.create(invitation);
    }
    // res.status(200).json({ success: true, message: 'Professional invited succesfully' });
    res.status(200).json({
      success: true,
      message: "Professional invited succesfully",
      data: invitation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function clientUpdateJobMilestone(req, res) {
  try {
    const milestoneData = req.body;
    for (const milestone of milestoneData) {
      const updatedMilestone = await MilestoneJob.findOneAndUpdate(
        { _id: milestone._id },
        milestone,
        { new: true }
      );
    }
    res
      .status(200)
      .json({ success: true, message: "Milestones updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function get_specific_country(req, res) {
  try {
    const alldata = req.body.countrydata;
    const alluserid = req.body.userids;
    const professionalids = req.body.professionalid;
    const countryDetails = [];
    const userRatings = [];
    const userskills = [];
    for (const data of alldata) {
      const country = await Countries.findOne({ id: data });
      if (country) {
        countryDetails.push({ id: country.id, name: country.name });
      }
    }
    for (const data of alluserid) {
      const review = await JobFeedback.find({ rate_to: data.userId });
      let averageRating = 0;
      if (review.length > 0) {
        const totalRating = review.reduce((acc, curr) => acc + curr.rate, 0);
        averageRating = totalRating / review.length;
      }
      userRatings.push({
        userId: data.userId,
        averageRating: averageRating.toFixed(1),
      });
    }

    for (const data of alluserid) {
      const professional = await Professionals.findOne({
        user_id: data.userId,
      }).select("_id");
      if (professional) {
        const skills = await skillprofessional.find({
          professional_id: professional._id,
        });
        if (skills.length > 0) {
          const skillIds = skills.map((skill) => skill.skill_id);
          userskills.push({ userId: data.userId, skills: skillIds });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "countries found...",
      data: countryDetails,
      userRatings: userRatings,
      userskills: userskills,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function changeStatusOfMilestone(req, res) {
  try {
    uploadSubmitWorke.array("files")(req, res, async (err) => {
      const file = req.files; // multer will add the 'file' property to req
      let fileNames = [];
      if (file) {
        file.map((item) => {
          fileNames.push(`/public/uploads/submitWorkeFile/${item.filename}`);
        });
      }
      const { id, filldescription } = req.body;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "ID and status are required" });
      }
      const updatedMilestone = await MilestoneJob.findByIdAndUpdate(
        id,
        {
          submit_task_files: fileNames,
          submit_task_description: filldescription,
        },
        { new: true }
      );
      if (!updatedMilestone) {
        return res.status(404).json({
          success: false,
          error: "Payment successfull, Milestone not found",
        });
      }
      const jobDetails = await Jobs.findById(updatedMilestone.job_id);
      const clientDetails = await User.findById(
        updatedMilestone.professional_id
      );
      if (!jobDetails) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      // Fetch the user details using the user_id
      const userDetails = await User.findById(jobDetails.user_id);
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          error: "User not found..",
        });
      }

      // Combine job and user details into the response
      const responseData = {
        job: jobDetails,
        user: userDetails,
        milestone: updatedMilestone,
        client: clientDetails,
      };

      return res.status(200).json({ success: true, data: responseData });
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
}

async function MilestoneStatusChange(req, res) {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res
        .status(400)
        .json({ success: false, error: "ID and status are required" });
    }
    const updatedMilestone = await MilestoneJob.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    const contract = await MyContracts.findOne({
      job_id: updatedMilestone.job_id,
    });

    if (!updatedMilestone) {
      return res.status(404).json({
        success: false,
        error: "Payment successfull, Milestone not found",
      });
    }
    // Fetch user data using professional_id
    const userDetails = await User.findById(updatedMilestone.professional_id);
    const jobdetails = await Jobs.findById(updatedMilestone.job_id);
    const ClientDetails = await User.findById(jobdetails.user_id);
    if (!userDetails) {
      // If user not found, handle the error
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    if (!ClientDetails) {
      // If user not found, handle the error
      return res.status(404).json({
        success: false,
        error: "client not found",
      });
    }

    // Attach user data to the milestone object
    updatedMilestone.professional_data = userDetails;
    const responseData = {
      user: userDetails,
      milestone: updatedMilestone,
      client: ClientDetails,
    };
    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
}

async function clientTransactions(req, res) {
  try {
    const {
      milestone_id,
      user_id,
      reference,
      amount,
      commission_rate,
      response,
      status,
      payment_gateway,
      type,
      description,
      professional_user_id,
      operation_user_id,
      response_text,
    } = req.body;

    const newTransaction = new Transaction({
      milestone_id,
      user_id,
      reference,
      amount,
      commission_rate,
      response,
      status,
      payment_gateway,
      type,
      description,
      professional_user_id,
      operation_user_id,
      response_text,
    });

    await newTransaction.save();

    return res
      .status(201)
      .json({ success: true, message: "Transaction created successfully" });
  } catch (error) {
    // console.error("Error creating transaction:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function getTransactions(req, res) {
  try {
    const { reqBy } = req.body;
    if (reqBy === "client") {
      const transactions = await Transaction.find({
        user_id: req.user._id,
      }).populate("professional_user_id");

      transactions.map((transaction) => {
        transaction.professional_user_id;
      });

      return res.status(200).json({ success: true, data: transactions });
    }
  } catch (error) {
    // console.error("Error fetching transactions:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function getPaymentMethods(req, res) {
  try {
    const paymentMethods = await PaymentMethods.find();

    if (!paymentMethods) {
      return res
        .status(404)
        .json({ success: false, error: "No payment methods found" });
    }
    return res.status(200).json({ success: true, data: paymentMethods });
  } catch (error) {
    // console.error("Error fetching payment methods:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

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
const submitWorke = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, submitWorkeStoragePath);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname.split(".")[0]}_${Date.now()}.${
      file.originalname.split(".")[1]
    }`;
    cb(null, fileName);
  },
});
const uploadSubmitWorke = multer({ storage: submitWorke });
async function identityverification(req, res) {
  try {
    upload.single("file")(req, res, async (err) => {
      const userId = req.user._id;
      const Document = req.body.documentType;
      const file = req.file;

      let identityRecord = await identityTable.findOne({ user_id: userId });
      if (!identityRecord) {
        identityRecord = new identityTable({
          user_id: userId,
          document: [{ documentType: Document, fileName: file.filename }],
          status: 0,
        });
      } else {
        const existingDocument = identityRecord.document.find(
          (doc) => doc.documentType === Document
        );
        if (existingDocument) {
          existingDocument.fileName = file.filename;
        } else {
          identityRecord.document.push({
            documentType: Document,
            fileName: file.filename,
          });
        }
      }
      await identityRecord.save();
      res
        .status(201)
        .json({ success: true, message: "Data received successfully." });
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getPaymentMethods(req, res) {
  try {
    const paymentMethods = await PaymentMethods.find();

    if (!paymentMethods) {
      return res
        .status(404)
        .json({ success: false, error: "No payment methods found" });
    }
    return res.status(200).json({ success: true, data: paymentMethods });
  } catch (error) {
    // console.error("Error fetching payment methods:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function identitystatus(req, res) {
  try {
    const id = req.user._id;
    const identitystatus = await identityTable
      .findOne({ user_id: id })
      .select("status");
    if (!identitystatus) {
      return res
        .status()
        .send({ success: false, identitystatus: identitystatus });
    }
    return res
      .status(200)
      .send({ success: true, identitystatus: identitystatus });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateNotificationStatus(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Notification message and new status are required",
      });
    }
    // Find the notification by message
    const notificationToUpdate = await notification.findOne({ _id: message });

    if (!notificationToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    // Update the status
    notificationToUpdate.status = 1;
    // Save the updated notification
    await notificationToUpdate.save();
    return res
      .status(200)
      .json({ success: true, message: "Notification updated successfully" });
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  view_profile,
  job_post,
  discover_professional_list,
  professioal_hired_list,
  professional_bookmark,
  removeprofessionalbookmark,
  jobbookmarkdetails,
  bookmark_professional_list,
  projects,
  get_conversation,
  getUserAllConversation,
  readMessage,
  add_message,
  allprofessional,
  editJobType,
  shortlist,
  bookmarkProfessionalForJob,
  bookmarkProfessionalForJobdetails,
  removeprofessionalbookmarkForJobDetails,
  getNotification,
  postNotification,
  sendEmailCloseAccount,
  getAppliedJobs,
  reviewHireAppliedJob,
  clientContarctDetails,
  sendinviteprofessional,
  professionalContarctDetails,
  clientUpdateJobMilestone,
  contarctRating,
  getContractRating,
  hiredProfessionals,
  get_specific_country,
  changeStatusOfMilestone,
  clientTransactions,
  getTransactions,
  getPaymentMethods,
  identityverification,
  identitystatus,
  MilestoneStatusChange,
  deleteMessage,
  updateNotificationStatus,
};
