require('dotenv').config();
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(
    fileUpload({
        extended:true
    })
)
app.use(express.static(__dirname));
app.use(express.json());
const path = require('path');
const ethers = require('ethers');
const mongoose = require("mongoose");

var port = 3000;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const databaseURL = process.env.DATABASE_URL;

const {abi} = require("./artifacts/contracts/Voting.sol/Voting.json");
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/@st\.qnu\.edu\.vn$/, "Email không phải của sinh viên QNU"],
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // số token được nhận (ở API đang set là "1")
    tokenAmount: {
      type: Number,
      default: 1,
    },

    // trạng thái xác minh
    isVerified: {
      type: Boolean,
      default: true, // hoặc false, tùy flow của bạn
    },

    // nếu sau này bạn lưu tx hash khi mint token on-chain
    txHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // tự động có createdAt, updatedAt
  }
);

const Student = mongoose.model("Student", studentSchema, "student");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.post("/addCandidate", async (req, res) => {
  try {
    const vote = req.body.vote;
    console.log("Candidate to add:", vote);

    const bool = await contractInstance.getVotingStatus();
    if (!bool) {
      return res.send("Voting is finished");
    }

    console.log("Adding candidate in contract...");
    const tx = await contractInstance.addCandidate(vote);
    console.log("Transaction sent:", tx.hash);

    // xử lý mined ở background
    tx.wait().then(receipt => {
      console.log("Transaction mined:", receipt.transactionHash);
    }).catch(err => console.error("Error mining tx:", err));

    res.send("Candidate successfully added to blockchain");
  } catch (error) {
    console.error("Error while adding candidate:", error);
    res.status(500).send(`Error: ${error.reason || error.message}`);
  } finally {
    console.log("Done");
  }
});

app.post("/verify-student", async (req, res) => {
  try {
    const { fullName, studentId, email, walletAddress } = req.body;
    const STUDENT_EMAIL_DOMAIN = "@st.qnu.edu.vn";

    if(studentId.length != 10){
      return res.status(400).json({ success: false, error: "Mã sinh viên không hợp lệ" });
    }
    
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({ success: false, error: "Địa chỉ ví không hợp lệ" });
    }

    if (!email.endsWith(STUDENT_EMAIL_DOMAIN)) {
      return res.status(400).json({ success: false, error: "Email không phải của sinh viên QNU" });
    }

    const studentExists = await Student.findOne({ studentId: studentId, fullName: fullName, email: email });
    if (!studentExists) return res.status(400).json({ success: false, error: "Không tìm thấy sinh viên" });

    return res.json({
      success: true,
      message: "Xác minh thành công. Bạn đủ điều kiện nhận token!",
      data: {
        walletAddress,
        fullName,
        studentId,
        email,
        tokenAmount: "1",
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Lỗi hệ thống: " + err.message });
  }
});

mongoose
  .connect(databaseURL)
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

app.listen(port, () => {
    console.log("App is listening on port " + port);
})