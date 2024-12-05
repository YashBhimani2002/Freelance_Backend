const flutterwave = require("flutterwave-node");
const Stripe = require("stripe");
const Transaction = require("../model/TransactionModel");
const MyContracts = require("../model/MyContractsModel");
const Users = require("../model/userModel");
const Jobes = require("../model/JobsModel");
const JobMilestone = require("../model/MilestoneJobModel");

const axios = require("axios");

exports.flutterwaveCallback = async (req, res) => {
  res.json("done");
};

// Encryption function
function encrypt(text, key) {
  return [...text]
    .map((x, i) =>
      (x.codePointAt() ^ key.charCodeAt(i % key.length) % 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
}

exports.checkoutsession = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.PUBLIC_STRIPE_SECRET_KEY);
    // const host = "https://praiki.com";
    const host = process.env.BASE_URL;
    const date = new Date().toISOString();
    // Encrypting milestone ID before passing to payment intent data
    let encryptedMilestoneId = encrypt(
      req.body.mileid.toString(),
      "enc89dd837jfndk52987774bndbssndf"
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "NGN", // Change currency to NGN
            product_data: {
              name: "INV-" + date,
            },
            unit_amount: req.body.amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          milestone_id: encryptedMilestoneId, // Passing encrypted milestone ID
        },
      },
      mode: "payment",
      cancel_url: `${host}/clientContract/${req.body.contractId}`,
      success_url: `${host}/success/${encryptedMilestoneId}`,
    });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(200).json({
      error: "Amount is too small",
    });
  }
};

const getUser = async (jobId) => {
  const jobData = await MyContracts.findOne({ job_id: jobId });
  return jobData;
};

exports.paystack = async (req, res) => {
  const jobdata = await getUser(req.body.milestone.jobId);

  const newTransaction = new Transaction({
    milestone_id: req.body.milestone.mileid,
    user_id: jobdata.client_id,
    reference: req.body.response.reference,
    amount: req.body.milestone.amount / 100,
    commission_rate: "10", //NEED TO MAKE DYNAMIC
    response: req.body.response,
    status: req.body.response.status,
    payment_gateway: req.body.milestone.payment_gateway, //NEED TO MAKE DYNAMIC
    type: "Released",
    description: jobdata.contract_title,
    professional_user_id: jobdata.professional_id, // Should be a valid ObjectId
    operation_user_id: jobdata.client_id,
    response_text: req.body.response.status,
  });

  // Save the new transaction entry
  newTransaction
    .save()
    .then((savedTransaction) => {
      console.log("Transaction saved successfully:", savedTransaction);
    })
    .catch((error) => {
      // console.error("Error saving transaction:", error);
    });
  res.status(200).json({ data: req.body });
};
exports.demoPayStack = async(req,res)=>{
  const jobdata = await getUser(req.body.milestone.jobId);
    // Default demo data
    const demoTransactionData = {
      milestone_id: req.body.milestone.mileid,
      user_id: jobdata.client_id,
      reference: "default_reference",
      amount: req.body.milestone.amount / 100,
      commission_rate: "10", // Fixed commission rate for demo
      response: { status: "success" }, // Demo response
      status: "success", // Demo status
      payment_gateway: "demopayment", // Default payment gateway
      type: "Released",
      description: jobdata.contract_title,
      professional_user_id: jobdata.professional_id, // Should be a valid ObjectId
      operation_user_id: jobdata.client_id,
      response_text: "success",
    };
  
    // Create a new transaction document
    const newTransaction = new Transaction(demoTransactionData);
  
    try {
      const savedTransaction = await newTransaction.save();
      console.log("Demo Transaction saved successfully:", savedTransaction);
      res.status(201).json({ message: "Demo transaction created successfully", data: savedTransaction });
    } catch (error) {
      console.error("Error saving demo transaction:", error);
      res.status(500).json({ message: "Error creating demo transaction", error });
    }
  
}
exports.paystackCallback = async (req, res) => {
  const PAYSTACK_API_URL = "https://api.paystack.co/payment/data";

  try {
    // Make a GET request to fetch payment data
    const response = await axios.get(PAYSTACK_API_URL, {
      headers: {
        // Add any required headers like authorization token
        Authorization: `Bearer ${process.env.PUBLIC_PAYSTACK_SECRET_KEY}`,
      },
    });

    // Extract the status from the response data
    const status = response.data.data.status;

    // Return the status
    return status;
  } catch (error) {
    // Handle errors, e.g., network issues, API errors, etc.
    console.error("Error fetching payment data:", error);
    // throw error; // Rethrow the error to handle it in the calling function
  }
};

exports.getMailUser = async (req, res) => {
  try {
    console.log(req.body.milestone.jobId, "emailUsers");
    const jobId = req.body.milestone.jobId;
    const miletstoneId = req.body.milestone.mileid;
    console.log("miletstoneId", miletstoneId);
    const jobData = await MyContracts.findOne({ job_id: jobId });
    const ProfessionalData = jobData.professional_id;
    const ClientData = jobData.client_id;
    const UserP = await Users.findById(ProfessionalData);
    const UserC = await Users.findById(ClientData);
    const Jobss = await Jobes.findOne({ _id: jobId });
    const milestoneJob = await JobMilestone.findOne({ _id: miletstoneId });
    console.log("milestonejob", milestoneJob);
    res.status(200).json({
      professional: UserP,
      client: UserC,
      job: Jobss,
      milestoneJob: milestoneJob,
    });
  } catch (err) {
    res.status(401).send("Faild").json({ msg: err });
  }
};
