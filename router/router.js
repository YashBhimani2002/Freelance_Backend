const express = require("express");
const { middleware } = require("../middleware");
const router = express.Router();
const userController = require("../controller/userController");
const signupController = require("../controller/SignupController");
const APIController = require("../controller/APIController");
const ProfessionalController = require("../controller/ProfessionalController");
const ClientController = require("../controller/ClientController");
const jobpostform = require("../controller/JobPostForm");
const bankcontorller = require("../controller/BankController");
const aiControllers = require("../controller/GeminiController");
const multer = require("multer");
// Set up multer to handle form data
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

router.get("/users", userController.getAllUsers);

router.post("/registration", userController.registration);

router.post("/google/registration", userController.googleRegistration);

router.post("/facebook/registration", userController.facebookRegistration);

router.post("/linkedin/registration", userController.linkedInRegister);

router.post("/facebook/login", userController.facebookLogin);

router.post("/linkedin/login", userController.linkedInLogin);

router.post("/user/verify", userController.userVerify);

router.post("/verify-email", userController.verifyEmail);

router.post(
  "/admin/education_data_registration",
  signupController.get_all_education_data_registration
);

router.post(
  "/change-password",
  ProfessionalController.change_password_process_users
);

router.post(
  "/admin/expirence_data_registration",
  signupController.get_all_experience_data_registration
);

router.post("/admin/signup_form_submit", signupController.signupFormSubmit);

router.post(
  "/edit_profile_process",
  ProfessionalController.edit_profile_process
);

router.route("/login").post(APIController.getAllProductslogin);

// router.post('/logout', middleware, APIController.logOut)

router.post("/client_form_submit", signupController.getAllProductsClient);

router.get("/view_profile", middleware, ClientController.view_profile);

router.get(
  "/get_conversation/:id",
  middleware,
  ClientController.get_conversation
);

router.get(
  "/get_user_all_conversation",
  middleware,
  ClientController.getUserAllConversation
);

router.post("/read-message", middleware, ClientController.readMessage);

router.post("/delete-message", middleware, ClientController.deleteMessage);

router.post(
  "/add_message/:id",
  middleware,
  upload.single("file"),
  ClientController.add_message
);

router.get("/logout", middleware, userController.logOut);

// router.post('/email-forgot-password', userController.forgotPasswordProcess);
//create new api for forgot password
router.post("/forgot/password", userController.forgotPassword);
// create new api for reset password
router.post("/reset/password/:token", userController.resetPassword);

// router.post('/forgot-password', userController.changePassword);

router.post("/get-countries", userController.getCountries);

router.get("/get-signupcountries", userController.getCountriesForSignup);

router.post("/get-states/:id", userController.getStates);

router.post("/get-city/:id", userController.getCity);

router.post("/get-skills", userController.getAllSkills);

router.post("/get-categories", userController.getCategories);

router.post("/job-apply", middleware, ProfessionalController.jobApply);

router.post("/edit-job-apply", ProfessionalController.edit_job_apply);

router.post("/bookmark", middleware, ProfessionalController.bookmark);

router.post(
  "/bookmark-professional",
  middleware,
  ProfessionalController.bookmarkProfessional
);

router.post(
  "/remove-professional-bookmark",
  middleware,
  ProfessionalController.removeProfessionalBookmark
);

router.post(
  "/get-bookmarked-professionals",
  middleware,
  ProfessionalController.getBookmarkedProfessionals
);

router.post(
  "/invitation-bookmark",
  middleware,
  ProfessionalController.invitation_bookmark
);

router.get("/findjob", middleware, ProfessionalController.dashboard);
router.get("/without_login_findjob", ProfessionalController.withoutLoginFindJob);

router.post(
  "/my_application",
  middleware,
  ProfessionalController.myapplication
);

router.post("/job_post_form_add", middleware, jobpostform.jobpostformadd);

router.post("/ProjectTitle", middleware, jobpostform.ProjectTitle);

router.post("/p-job-detail/:id", middleware, ProfessionalController.job_detail);

router.get(
  "/my_application_detail/:id",
  middleware,
  ProfessionalController.my_application_detail
);

router.post("/handleGoogleCallback", userController.handleGoogleCallback);

router.post("/google/login", userController.googleLogin);

router.post("/job_post", middleware, ClientController.job_post);

router.get(
  "/discover_professional_list",
  ClientController.discover_professional_list
);

router.get(
  "/professioal_hired_list",
  middleware,
  ClientController.professioal_hired_list
);

router.post("/bank/store", middleware, bankcontorller.bankStore);

router.post("/bank/update", bankcontorller.bankupdate);

router.post("/bank/remove", bankcontorller.bankremove);

router.post("/bank/addbanking", middleware, bankcontorller.getbankdetail);

router.get(
  "/transaction_history",
  middleware,
  ProfessionalController.transaction_history
);

router.post(
  "/earning_overview",
  middleware,
  ProfessionalController.earning_overview
);

router.post(
  "/jobinviteesdetails",
  middleware,
  ProfessionalController.jobinviteesdetails
);

router.post(
  "/removejobinvitesen",
  middleware,
  ProfessionalController.removejobinvitesen
);

router.post(
  "/diclinJobInvite",
  middleware,
  ProfessionalController.diclinJobInvite
);

router.post("/removeInvite", middleware, ProfessionalController.removeInvite);

router.post("/my_contracts", middleware, ProfessionalController.myContract);

router.post(
  "/draft-professional-applications",
  middleware,
  ProfessionalController.draftProfessionalApplications
);

router.post(
  "/professional_bookmark",
  middleware,
  ClientController.professional_bookmark
);

router.post(
  "/removeprofessionalbookmark",
  middleware,
  ClientController.removeprofessionalbookmark
);

router.post(
  "/jobbookmarkdetails",
  middleware,
  ClientController.jobbookmarkdetails
);

router.post(
  "/bookmark_professional_list",
  middleware,
  ClientController.bookmark_professional_list
);

router.get("/projects", middleware, ClientController.projects);

router.post("/projects", middleware, ClientController.projects);

router.post(
  "/myapplicationlist",
  middleware,
  ProfessionalController.myapplicationlist
);

router.post("/shortlist", ClientController.shortlist);

router.get(
  "/get-notification/:accountType",
  middleware,
  ClientController.getNotification
);

router.post(
  "/post-notification",
  middleware,
  ClientController.postNotification
);

router.post("/post-email", middleware, ClientController.sendEmailCloseAccount);

router.get("/get-applied-jobs", middleware, ClientController.getAppliedJobs);

router.get("/allProfessional", middleware, ClientController.allprofessional);

router.post("/edit-jobType", middleware, ClientController.editJobType);

router.post(
  "/my_application_detail_list",
  middleware,
  ProfessionalController.myapplicationdetilaslist
);

router.post(
  "/update_application_detials",
  middleware,
  ProfessionalController.updateapplicationdetials
);

router.post(
  "/bookmarkProfessionalForJob",
  middleware,
  ClientController.bookmarkProfessionalForJob
);
router.post(
  "/removeprofessionalbookmarkForJobDetails",
  middleware,
  ClientController.removeprofessionalbookmarkForJobDetails
);

router.get(
  "/bookmarkProfessionalForJobdetails",
  middleware,
  ClientController.bookmarkProfessionalForJobdetails
);

router.post(
  "/delete_milstone_details",
  ProfessionalController.deleteMilstoneDetails
);

router.post("/delete_upload_file", ProfessionalController.deleteFileUpload);

router.get("/get-all-jobs", ProfessionalController.getAllJobs);

router.post("/my-contract-feedback", ProfessionalController.myContractFeedback);

router.post("/Job-milstone", middleware, ProfessionalController.milstoneData);

router.put("/review-hire-applied-job", ClientController.reviewHireAppliedJob);

router.get(
  "/client-contarct-details",
  middleware,
  ClientController.clientContarctDetails
);

router.get(
  "/professional-contarct-details",
  middleware,
  ClientController.professionalContarctDetails
);

router.post("/contarct-rating", ClientController.contarctRating);

router.post("/get-contract-rating", ClientController.getContractRating);

router.post(
  "/invite_professional",
  middleware,
  ClientController.sendinviteprofessional
);

router.get(
  "/hiredProfessionals",
  middleware,
  ClientController.hiredProfessionals
);

router.post(
  "/client-update-job-milestone",
  middleware,
  ClientController.clientUpdateJobMilestone
);

router.post("/update_user", middleware, ProfessionalController.update_user);

router.post(
  "/get-specific-countries",
  middleware,
  ClientController.get_specific_country
);

router.put(
  "/change-status-of-milestone",
  middleware,
  ClientController.changeStatusOfMilestone
);
router.put(
  "/MilestoneStatusChange",
  middleware,
  ClientController.MilestoneStatusChange
);

router.post(
  "/client-transactions",
  middleware,
  ClientController.clientTransactions
);

router.post("/get-transactions", middleware, ClientController.getTransactions);

router.get(
  "/get-payment-methods",
  middleware,
  ClientController.getPaymentMethods
);

router.post(
  "/identity-verification",
  middleware,
  ClientController.identityverification
);
router.get(
  "/getidentity-verificationStatus",
  middleware,
  ClientController.identitystatus
);

router.post("/close-account", middleware, userController.closeAccount);
router.get("/milestones", middleware, ProfessionalController.job_milestone);
router.post("/get-job-categories", middleware, userController.getJobCategories);

router.post(
  "/make-end-contract",
  middleware,
  ProfessionalController.make_end_contract
);
router.post(
  "/update_profile",
  middleware,
  ProfessionalController.update_profile
);
router.post(
  "/withdrawAmount",
  middleware,
  ProfessionalController.withdraw_amount
);

router.post(
  "/withdraw_application",
  middleware,
  ProfessionalController.withdraw_application
);

router.post(
  "/updateMilstoneSubmitReview",
  middleware,
  ProfessionalController.updateMilstoneSubmitReview
);

router.post(
  "/get-user-contract-applications",
  middleware,
  ProfessionalController.getUserContractApplications
);

router.post("/getMilstoneData", ProfessionalController.getMilstoneData);

router.post(
  "/update-notification",
  middleware,
  ClientController.updateNotificationStatus
);

router.post(
  "/getUserNameAvtar",
  middleware,
  ProfessionalController.getUserNameAvtar
);

router.post("/global-search", middleware, ProfessionalController.globalSearch);

router.post("/switchaccount", middleware, userController.switchaccount);
router.post("/change_status",middleware,userController.changeStatus);

router.post(
  "/storeImageInBackend",
  middleware,
  ProfessionalController.storeImageInBackend
);

router.post(
  "/storepPortfolioData",
  middleware,
  ProfessionalController.storepPortfolioData
);
router.post('/generate-text', aiControllers.generateText);

router.post(
  "/contact-us",userController.contactus
);

module.exports = router;

