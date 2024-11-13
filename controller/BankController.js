const bankdetails = require("../model/BankDetailModel");

const bankStore = async (req, res) => {
  try {
    const user_id = req.user._id; // Assuming you have session handling middleware
    const data = await bankStoreServices(req, user_id);
    if (data.status == true) {
      return res.status(200).json({
        success: "Bank data added successfully.",
        id: data.id, // Include the id in the response
        new: data,
      });
    } else {
      return res
        .status(500)
        .json({ error: "Error in bank data add operation, Please try again." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
const bankupdate = async (req, res) => {
  try {
    const data = await bankUpdateServices(req);
    if (data.status == true) {
      return res
        .status(200)
        .json({ success: "Bank data updated successfully." });
    } else {
      return res.status(500).json({
        error: "Error in bank data update operation, Please try again.",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
const bankremove = async (req, res) => {
  try {
    const data = await bankRemoveServices(req);
    if (data.status == true) {
      return res
        .status(200)
        .json({ success: true, message: "Record removed successfully." });
    } else {
      return res.status(404).json({
        success: false,
        message: "Record not found or error in delete operation.",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
const getbankdetail = async (req, res) => {
  try {
    const uid = req.user._id;
    const data = await getBankDetilServices(uid);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

const bankStoreServices = async (req, userId) => {
  try {
    const data = {
      bank_name: req.body.bank_name,
      account_holder_name: req.body.acc_name,
      bank_account: req.body.acc_number,
      bank_type: req.body.b_type,
      ifsc_code: req.body.ifsc_no || "",
      user_id: userId,
      routing_number: req.body.routing_number || "",
      swift_code: req.body.swift_code || "",
      address: req.body.address || "",
      country: req.body.country || "",
      status: "1",
    };

    const response = await bankStoreRepositroy(data);
    return response;
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};
const bankUpdateServices = async (req) => {
  try {
    const bid = req.body.bid;

    const data = {
      bank_name: req.body.bank_name,
      account_holder_name: req.body.acc_name,
      bank_account: req.body.acc_number,
      bank_type: req.body.b_type,
      ifsc_code: req.body.ifsc_no,
      routing_number: req.body.routing_number || "",
      swift_code: req.body.swift_code || "",
      address: req.body.address || "",
      country: req.body.country || "",
      status: "1",
    };

    const response = await bankUpdateRepository(data, bid);
    return response;
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};
const bankRemoveServices = async (req) => {
  try {
    const bill_id = req.body.bill_id;

    const response = await bankRemoveRepository(bill_id);
    return response;
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};
const getBankDetilServices = async (uid) => {
  try {
    const response = await getBankDetialsRepositry(uid);
    return response;
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

const bankStoreRepositroy = async (data) => {
  try {
    const bankDetail = await bankdetails.create(data);
    return {
      status: true,
      id: bankDetail.id, // Return the newly created entry ID (or _id if using MongoDB)
    };
  } catch (err) {
    return { status: false };
  }
};
const bankUpdateRepository = async (data, bid) => {
  try {
    const updatedBankDetail = await bankdetails.findOneAndUpdate(
      { _id: bid },
      data,
      { new: true }
    );
    return { status: true };
  } catch (err) {
    return { status: false };
  }
};
const bankRemoveRepository = async (bill_id) => {
  try {
    const result = await bankdetails.deleteOne({ _id: bill_id });
    return { status: true };
  } catch (err) {
    return { status: false };
  }
};
const getBankDetialsRepositry = async (uid) => {
  try {
    // console.log("uid", uid);
    const bank_list = await bankdetails.find({ user_id: uid });
    return bank_list;
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

module.exports = {
  bankStore,
  bankupdate,
  bankremove,
  getbankdetail,
};
