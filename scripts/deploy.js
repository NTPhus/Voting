const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy token
  const Token = await hre.ethers.getContractFactory("VToken");
  const token = await Token.deploy(1000000); // 1,000,000 token
  await token.deployed();
  console.log("Token deployed to:", token.address);

  // Deploy voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(
    token.address,
    ["Trang web bán quần áo tích hợp AI", "Trang web dự đoán nghề nghiệp dựa trên tính cách bằng AI", "Tìm kiếm văn bản theo ngữ nghĩa kết hợp RAG"], // candidate list
    10000 // thời gian (phút)
  );
  await voting.deployed();
  console.log("Voting contract deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
