const express = require("express");
const bodyParser = require("body-parser");
const Router = require("./router/router");
const PaymentRouter = require("./router/PaymentRouter");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDatabase = require("./mongodb");
const { middleware } = require("./middleware");
const { middlewareAdmin } = require("./middlewareAdmin");
const path = require("path");
const http = require("http");
const socketSetup = require("./socket");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://praiki.com",
      "https://admin.praiki.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://staging.praiki.com",
      "https://stageadmin.praiki.com",
      "http://localhost:4001",
      "https://www.praiki.com"
    ],
    credentials: true,
  })
);


const port = process.env.PORT;

const server = http.createServer(app);

socketSetup(server);

connectDatabase();

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.get(
  "/storage/app/public/uploads/identity-verification-attachment/:filename",
  (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(
      __dirname,
      "/public/uploads/identity-verification-attachment",
      filename
    );
    res.sendFile(filePath);
  }
);
app.get("/storage/app/public/uploads/job_attachment/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(
    __dirname,
    "/public/uploads/job_attachment",
    filename
  );
  res.sendFile(filePath);
});
//for user profile image get api
app.get("/admin/profile/img/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(
    __dirname,
    "/public/uploads/profile_attachments",
    filename
  );
  res.sendFile(filePath);
});

app.get("/test", (req, res) => res.send("OK"));
app.use("/", Router);
app.use("/verify-token", middleware);
app.use("/verify-token-admin", middlewareAdmin);
app.use("/payment", PaymentRouter);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.listen(port, () => console.log(`Start on http://localhost:${port}`));
