const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.attach("0x6e4A87449C243e6c19F0CC09BA9F93a4Ab245A65"); 

  console.log("Creating new proposal...");

  const tx = await voting.createProposal(
    "Đề tài AI mới",
    ["Ứng dụng tích hợp AI dự đoán nghề nghiệp", "Ứng dụng tích hợp AI bán quần áo thông minh", "Ứng dụng tích hợp AI tạo nội dung RAG"],
    60, // thời gian (phút)
    50 //Lượng người vote
  );

  const receipt = await tx.wait();

  const event = receipt.events.find(e => e.event === "ProposalCreated");
  const proposalId = event.args.proposalId.toString();

  console.log("✅ Proposal created successfully!");
  console.log("🆔 Proposal ID:", proposalId);
  console.log("📅 Start time:", event.args.startTime.toString());
  console.log("⏳ End time:", event.args.endTime.toString());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
