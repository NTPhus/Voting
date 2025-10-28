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

var port = 3000;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const {abi} = require("./artifacts/contracts/Voting.sol/Voting.json");
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

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

    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt.transactionHash);

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

    // ✅ 1. Kiểm tra đầu vào
    if(studentId.length != 10){
      return res.status(400).json({ success: false, error: "Mã sinh viên không hợp lệ" });
    }
    
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({ success: false, error: "Địa chỉ ví không hợp lệ" });
    }

    if (!email.endsWith(STUDENT_EMAIL_DOMAIN)) {
      return res.status(400).json({ success: false, error: "Email không phải của sinh viên QNU" });
    }

    // ✅ 2. (Tùy chọn) kiểm tra trong DB
    // const studentExists = await db.findStudent(studentId);
    // if (!studentExists) return res.status(400).json({ success: false, error: "Không tìm thấy sinh viên" });

    // ✅ 3. Gửi phản hồi cho frontend để xử lý mint
    return res.json({
      success: true,
      message: "Xác minh thành công. Bạn đủ điều kiện nhận token!",
      data: {
        walletAddress,
        fullName,
        studentId,
        email,
        tokenAmount: "1", // thông tin để frontend mint
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Lỗi hệ thống: " + err.message });
  }
});


app.listen(port, () => {
    console.log("App is listening on port " + port);
})