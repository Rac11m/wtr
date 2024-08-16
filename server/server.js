const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

app.post("/contact-us", (req, res) => {
  const { firstName, lastName, phone, repair, model, problem, about } =
    req.body;
  const file = req.file;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  var subject = "New Repair Transfer Request";

  let mailOptions = {
    from: process.env.AUTH_USER,
    to: process.env.AUTH_USER,
    subject: {
      prepared: true,
      value: "=?UTF-8?B?" + new Buffer.from(subject).toString("base64") + "?=",
    },
    html: `
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Device:</strong> ${repair}</p>
      <p><strong>Model:</strong> ${model}</p>
      <p><strong>Issue:</strong> ${problem}</p>
      <p><strong>About Problem:</strong> ${about}</p>
    `,
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Failed to delete file: ", err);
        }
      });
    }
    if (error) {
      console.log("Error occurred: ", error.message);
      res.status(500).send("Error occurred while sending email.");
    } else {
      console.log("Email sent: ", info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

app.post("/buyback", (req, res) => {
  const { firstName, lastName, phone, device, condition, price, about } =
    req.body;
  const file = req.file;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  var subject = "New Buyback Offer";

  let mailOptions = {
    from: process.env.AUTH_USER,
    to: process.env.AUTH_USER,
    subject: {
      prepared: true,
      value: "=?UTF-8?B?" + new Buffer.from(subject).toString("base64") + "?=",
    },
    html: `
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Device:</strong> ${device}</p>
      <p><strong>Condition:</strong> ${condition}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>About Device:</strong> ${about}</p>
    `,
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Failed to delete file: ", err);
        }
      });
    }
    if (error) {
      console.log("Error occurred: ", error.message);
      res.status(500).send("Error occurred while sending email.");
    } else {
      console.log("Email sent: ", info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
