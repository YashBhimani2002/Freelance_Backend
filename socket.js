const { Server } = require("socket.io");
const tblMessage = require("./model/MessageModel");
const MilestoneJob = require("./model/MilestoneJobModel");
const MyContracts = require("./model/MyContractsModel");
const User = require("./model/userModel");

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const Notification = require("./model/NotificationModel");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [process.env.BASE_URL],
    },
  });

  io.on("connection", (socket) => {
    socket.on("chat message", async (msg) => {
      try {
        const targetUser = msg.targetUser;
        const sender_id = msg.from;
        const inputValue = msg.inputValue;
        const file = msg.file;
        const attachmentName = msg.attachmentName;

        let filePath = null;

        if (!inputValue) {
          const timestamp = Date.now();
          const uniqueFilename = `${timestamp}-${uuidv4()}-${attachmentName}`;

          const uploadDir = "./uploads";
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }

          filePath = `${uploadDir}/${uniqueFilename}`;
          const fileStream = fs.createWriteStream(filePath);
          // fileStream.write(file.buffer);
          fileStream.write(Buffer.from(file, "base64"));
          fileStream.end();
        }

        const messageData = {
          user_id: sender_id,
          sender_id: sender_id,
          receiver_id: targetUser,
          message: inputValue ? inputValue : attachmentName,
          file: filePath,
          message_type: inputValue ? 1 : 2,
          reading_status: 0,
          job_id: null,
        };

        const add = await tblMessage.create(messageData);
        if (add) {
          io.emit("chat message", add);
        } else {
          console.log("error: true");
        }
      } catch (error) {
        // console.error(error);
      }
    });

    socket.on("job-applied", async (msg) => {
      console.log("message: " + msg);
    });

    socket.on("milstonChagestatus", async (msg) => {
      try {
        const { id, status } = msg;
        if (!id || !status) {
          console.log("error: true");
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
        const userDetails = await User.findById(
          updatedMilestone.professional_id
        );
        if (!userDetails) {
          // If user not found, handle the error
          console.log("error: true");
        }

        // Attach user data to the milestone object
        updatedMilestone.professional_data = userDetails;
        const responseData = {
          user: userDetails,
          milestone: updatedMilestone,
        };
        io.emit("milstonChagestatus", {
          success: true,
          data: responseData,
        });
      } catch (error) {
        console.log("error: true");
      }
    });
    socket.on("jobapply", (msg) => {
      io.emit("jobapply", {
        success: true,
        msg: msg,
      });
    });
    socket.on("verifiedstatus", (msg) => {
      io.emit("verifiedstatus", {
        success: true,
        msg: msg,
      });
    });
    socket.on("inviteStatus", (msg) => {
      io.emit("inviteStatus", {
        success: true,
        msg: msg,
      });
    });
    socket.on("deleteJobStatus", (msg) => {
      io.emit("deleteJobStatus", {
        success: true,
        msg: msg,
      });
    });
    socket.on("join_room", async (data) => {
      socket.join(data);
      console.log(
        `User Connected to : ${socket.id}  and joined room : ${data}`
      );
    });
    // Handle chatMessage event
    socket.on("send_message", (message) => {
      socket.broadcast.emit("recv_message", message);
    });

    socket.on("new_notification", (data) => {
      // Emit the notification to all connected clients
      // socketIO.emit('res_notification_noRoom', data);
      io.to(data.professional_id).emit("res_notification", data);
    });

    socket.on("post_notification", (notificationData) => {
      io.emit("new_notification", notificationData);
    });

    socket.on("Decline Notification", async (data) => {
      const {
        rout,
        send_by,
        subject,
        professional_id,
        client_id,
        message,
        job_id,
        status,
      } = data;

      const newNotification = new Notification({
        rout,
        send_by,
        subject,
        professional_id,
        client_id,
        message,
        job_id,
        status,
      });

      const dataForClient = await newNotification.save();

      io.emit("Decline Notification", dataForClient);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = setupSocket;
