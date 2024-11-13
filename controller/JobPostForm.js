const categoryjob = require("../model/CategoryJobModel"); //
const jobnotificationprovider = require("../model/JobNotificationProviderModel"); //
const jobs = require("../model/JobsModel"); //
const praikifees = require("../model/praikifeesModel");
const professionalapplicationattchment = require("../model/ProfessionalApplicationAttachment"); //
const providertbl = require("../model/ProviderTblModel");
const session = require("../model/SessionsModel");
const skilljob = require("../model/SkillJobModel"); //
const skill = require("../model/SkillsModel"); //
const client = require("../model/ClientModel");
const { ObjectId } = require("mongodb");
const multer = require("multer");

const fs = require("fs");
const { relativeTimeRounding } = require("moment");
const ProfessionalApplicationAttachment = require("../model/ProfessionalApplicationAttachment");

const storagePath = "public/uploads/job_attachment";

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

exports.jobpostformadd = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      let pfees = await praikifees.find({ status: "1" });
      const id = req.user._id; // Assuming you have set up session handling
      // Validator logic
      if (!req.body.catjob) {
        return res
          .status(422)
          .json({ errors: ["Category is required."], success: false });
      }
      // Job status logic
      let jstatus, cjobpostion;
      if (req.body.post === "Post Now") {
        jstatus = "1";
        cjobpostion = "cactivej";
      } else {
        jstatus = "0";
        cjobpostion = "cactived";
      }
      var status = jstatus;
      var titlejob = req.body.titlejob;
      var titlejob3 = req.body.titlejob1;
      var titlejob2 = req.body.titlejob2;
      var streuse = req.body.statusjob;
      var titlejob1 = "";
      if (req.body.titlejob1 && req.body.titlejob1.length != "") {
        titlejob1 = titlejob3;
      } else if (req.body.titlejob2 && req.body.titlejob2 != "") {
        titlejob1 = titlejob2;
      }
      var descjob = req.body.descjob;
      var coverpage = req.body.coverpage || "";
      var catjob = req.body.catjob;
      var skillstag = req.body.skillstag; //multiple
      var exp = req.body.exp;
      var jobplace = req.body.jobplace;
      var projectype = req.body.type;
      var location = req.body.location || "";
      var type_budget = req.body.budget;
      var tbudget, tbudget1, tbudget2;
      if (req.body.sel_budg == 1) {
        tbudget = req.body.tbudget;
      } else {
        tbudget1 = req.body.tbudget1;
        tbudget2 = req.body.tbudget2;
      }
      var files = req.files; //mulitple
      var jdata = {};
      jdata["job_description"] = descjob;
      jdata["user_id"] = id;
      jdata["job_type"] = catjob;
      if (req.body.sel_budg == 1) {
        jdata["budget_from"] = parseInt(tbudget);
        jdata["budget_to"] = parseInt(tbudget);
      } else {
        jdata["budget_from"] = parseInt(tbudget1);
        jdata["budget_to"] = parseInt(tbudget2);
      }
      jdata["status"] = parseInt(status);
      jdata["type"] = projectype;
      jdata["job_title"] = titlejob;
      jdata["experience_level"] = exp;
      jdata["budget_type"] = type_budget;
      jdata["cover_page_detail"] = coverpage;
      jdata["job_place"] = jobplace;
      jdata["location"] = location;
      jdata["p_fees_id"] = pfees[0]?.id.toString();
      //If user selecte Reuse an existing post

      if (streuse == 1 || streuse == 3) {
        if (titlejob === "") {
          var jid_reuse = titlejob1;
          const objectId = new ObjectId(titlejob1);
          var titlejobModel = await jobs.findOne({ _id: objectId });
        }
        var jtitle = titlejob === "" ? titlejobModel.job_title : titlejob;
        jdata["job_title"] = jtitle;
        var jadd = await jobs.create(jdata);
        var job_id = jadd._id.toString();
              if (skillstag.length > 0) {
        // skillstag is not empty, execute the loop
        var str = skillstag.split(",");

        let totaljobidData;
        for (const sknm of str) {
          var skill_id;
          // Insert
          try {
            const skillData = await skill.findOne({ _id: sknm });
            skill_id = sknm;
          } catch (err) {
            var sknmdata = {};
            sknmdata["name"] = sknm;
            sknmdata["status"] = "1";
            var sdata = await skill.create(sknmdata);
            skill_id = sdata._id.toString();
          }
          console.log("sdata",sdata)
          var sdata1 = {};
          sdata1["job_id"] = job_id;
          sdata1["skill_id"] = skill_id;
          totaljobidData = await skilljob
            .find({ job_id: job_id })
            .select("skill_id");

            console.log("Total Skill:", totaljobidData)

          let deletarray = totaljobidData.filter((FindId) => {
            if (FindId.skill_id !== sknm) {
              return FindId;
            }
          });

          if (
            totaljobidData.some((data) => data.skill_id.toString() === skill_id)
          ) {
            continue;
          } else {
            console.log("second", sdata1)
            var sjdata = await skilljob.create(sdata1);
            console.log("Sjdata", sjdata);

          }
        }
      } else {
        return { success: false, message: "skillstag is empty" };
      }
      } else {
        //If user selecte Edit a draft
        var jadd = await jobs.findOneAndUpdate({ _id: titlejob1 }, jdata, {
          new: true,
        });
        var job_id = titlejob1;
        if (skillstag.length > 0) {
          // skillstag is not empty, execute the loop
          var str = skillstag.split(",");
  
          let totaljobidData;
          for (const sknm of str) {
            var skill_id;
            // Insert
            try {
              const skillData = await skill.findOne({ _id: sknm });
              skill_id = sknm;
            } catch (err) {
              var sknmdata = {};
              sknmdata["name"] = sknm;
              sknmdata["status"] = "1";
              var sdata = await skill.create(sknmdata);
              skill_id = sdata._id.toString();
            }
            console.log("sdata",sdata)
            var sdata1 = {};
            sdata1["job_id"] = job_id;
            sdata1["skill_id"] = skill_id;
            totaljobidData = await skilljob
              .find({ job_id: job_id })
              .select("skill_id");
  
              console.log("Total Skill:", totaljobidData)
  
            let deletarray = totaljobidData.filter((FindId) => {
              if (FindId.skill_id !== sknm) {
                return FindId;
              }
            });
  
            if (
              totaljobidData.some((data) => data.skill_id.toString() === skill_id)
            ) {
              continue;
            } else {
              console.log("second", sdata1)
              var sjdata = await skilljob.create(sdata1);
              console.log("Sjdata", sjdata);
  
            }
          }
          if (str.length > 0) {
            const deleArray = totaljobidData.filter(
              (id) => !str.includes(id.skill_id)
            );
            if (deleArray.length > 0) {
  
              console.log("deleted first")
              for (let deletId of deleArray) {
                await skilljob.deleteOne({
                  skill_id: deletId.skill_id,
                  job_id: job_id,
                });
              }
            }
          } else {
            if (totaljobidData.length > 0) {
              console.log("deleted second")
  
              for (let deletId of totaljobidData) {
                await skilljob.deleteOne({
                  skill_id: deletId.skill_id,
                  job_id: job_id,
                });
              }
            }
          }
        } else {
          return { success: false, message: "skillstag is empty" };
        }
      }
      var user_type = await client.countDocuments({ user_id: id });
      if (user_type === 0) {
        var professional = await providertbl.findOne({ user_id: id });
        //If professional data found of user id.
        if (professional) {
          var data = {
            job_id: job_id,
            user_id: id,
            professional_id: professional._id.toString(),
            created_at: new Date(),
            updated_at: new Date(),
            status: "0",
          };
          await jobnotificationprovider.create(data);
        }
      }
      var cdata = {};
      cdata["job_id"] = job_id;
      cdata["category_id"] = catjob;
      //This will worke for both create job post and reuse an existing post
      if (titlejob !== "" || streuse == 3) {
        var cadd = await categoryjob.create(cdata);
      } else {
        var cadd = await categoryjob.findOneAndUpdate(
          { job_id: job_id },
          cdata,
          { new: true }
        );
      }
      //Thhis is only for reuse an existing post
      if (streuse == 3) {
        var sdt = await skilljob.find({ job_id: jid_reuse });
        if (sdt.length > 0) {
          for (const sdt1 of sdt) {
            var sdata1 = {};
            sdata1["job_id"] = job_id;
            sdata1["skill_id"] = sdt1.skill_id;
            console.log("first", sdata1)
            var sdata11 = await skilljob.create(sdata1);
          }
        }
        var attdt = await professionalapplicationattchment.find({
          job_id: jid_reuse,
          user_id: id,
        });
        if (attdt.length > 0) {
          for (const attdt1 of attdt) {
            var padata = {};
            padata["job_id"] = job_id;
            padata["user_id"] = id;
            padata["file_name"] = attdt1[0].file_name;
            var attdata = await professionalapplicationattchment.create(padata);
          }
        }
      }
      function isNumeric(value) {
        return /^-?\d+$/.test(value);
      }
      // if (skillstag.length > 0) {
      //   // skillstag is not empty, execute the loop
      //   var str = skillstag.split(",");

      //   let totaljobidData;
      //   for (const sknm of str) {
      //     var skill_id;
      //     // Insert
      //     try {
      //       const skillData = await skill.findOne({ _id: sknm });
      //       skill_id = sknm;
      //     } catch (err) {
      //       var sknmdata = {};
      //       sknmdata["name"] = sknm;
      //       sknmdata["status"] = "1";
      //       var sdata = await skill.create(sknmdata);
      //       skill_id = sdata._id.toString();
      //     }
      //     console.log("sdata",sdata)
      //     var sdata1 = {};
      //     sdata1["job_id"] = job_id;
      //     sdata1["skill_id"] = skill_id;
      //     totaljobidData = await skilljob
      //       .find({ job_id: job_id })
      //       .select("skill_id");

      //       console.log("Total Skill:", totaljobidData)

      //     let deletarray = totaljobidData.filter((FindId) => {
      //       if (FindId.skill_id !== sknm) {
      //         return FindId;
      //       }
      //     });

      //     if (
      //       totaljobidData.some((data) => data.skill_id.toString() === skill_id)
      //     ) {
      //       continue;
      //     } else {
      //       console.log("second", sdata1)
      //       var sjdata = await skilljob.create(sdata1);
      //       console.log("Sjdata", sjdata);

      //     }
      //   }
      //   // if (str.length > 0) {
      //   //   const deleArray = totaljobidData.filter(
      //   //     (id) => !str.includes(id.skill_id)
      //   //   );
      //   //   if (deleArray.length > 0) {

      //   //     console.log("deleted first")
      //   //     for (let deletId of deleArray) {
      //   //       await skilljob.deleteOne({
      //   //         skill_id: deletId.skill_id,
      //   //         job_id: job_id,
      //   //       });
      //   //     }
      //   //   }
      //   // } else {
      //   //   if (totaljobidData.length > 0) {
      //   //     console.log("deleted second")

      //   //     for (let deletId of totaljobidData) {
      //   //       await skilljob.deleteOne({
      //   //         skill_id: deletId.skill_id,
      //   //         job_id: job_id,
      //   //       });
      //   //     }
      //   //   }
      //   // }
      // } else {
      //   return { success: false, message: "skillstag is empty" };
      // }
      const file = req.file; // multer will add the 'file' property to req
      if (file) {
        const path = "public/uploads/job_attachment"; // Specify your upload path
        const filename = file.filename;
        var padata = {};
        padata["job_id"] = job_id;
        padata["user_id"] = id;
        padata["file_name"] = filename;
        let filData = await professionalapplicationattchment.findOneAndUpdate(
          { job_id: job_id, user_id: id },
          padata,
          { new: true }
        );
        if (filData === null) {
          var attdata = await professionalapplicationattchment.create(padata);
        }
      }
      var msg;
      if (streuse == 4) {
        msg = "edited";
      } else if (streuse == 3) {
        msg = "reused";
      } else {
        msg = "posted";
      }
      if (req.body.draft) {
        msg = "Drafted";
      }
      if (req.body.post) {
        msg = "Posted";
      }
      return res
        .status(200)
        .json({ success: true, message: `Job ${msg} successfully.` });
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.ProjectTitle = async (req, res) => {
  try {
    const id = req.user._id;

    const data = await jobs.find({ user_id: id });
    let skillIdArray = [];
    let fileNameArray = [];
    await Promise.all(
      data.map(async (item) => {
        const skillId = await skilljob.find({ job_id: item._id.toString() });
        skillId.forEach((skill) => {
          skillIdArray.push(skill);
        });
        let jid = item._id.toString();
        const fileName = await ProfessionalApplicationAttachment.findOne({
          job_id: item._id.toString(),
        });
        if (fileName != null) {
          fileNameArray.push({
            file_name: fileName.file_name,
            job_id: fileName.job_id,
            _id: fileName._id,
          });
        }
      })
    );

    res.status(200).json({
      data: data,
      skillIdArray: skillIdArray,
      fileNameList: fileNameArray,
    });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
