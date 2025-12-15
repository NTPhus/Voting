const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // Deploy Token
  const Token = await hre.ethers.getContractFactory("VToken");
  const token = await Token.deploy(1000000); // Tổng cung 1,000,000 token
  await token.deployed();
  console.log("✅ Token deployed to:", token.address);

  // Deploy Voting (phiên bản hỗ trợ nhiều proposal)
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(token.address);
  await voting.deployed();
  console.log("✅ Voting contract deployed to:", voting.address);

  // Tạo proposal đầu tiên ngay sau khi deploy
  const tx = await voting.createProposal(
    "Lựa chọn đề tài dự án AI",
    [
      "Trang web bán quần áo tích hợp AI",
      "Trang web dự đoán nghề nghiệp dựa trên tính cách bằng AI",
      "Tìm kiếm văn bản theo ngữ nghĩa kết hợp RAG",
    ],
    10000, // Thời gian (phút)
    50
  );
  await tx.wait();
  console.log("🗳️ Proposal đầu tiên đã được tạo thành công!");

   const receipt = await tx.wait();

  // Lấy event từ logs
  const event = receipt.events.find(e => e.event === "ProposalCreated");
  const proposalId = event.args.proposalId.toString();

  console.log("Proposal created successfully!");
  console.log("Proposal ID:", proposalId);
  console.log("Start time:", event.args.startTime.toString());
  console.log("End time:", event.args.endTime.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
