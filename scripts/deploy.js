const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");

  // 👇 Truyền tham số constructor ở đây
  const voting = await Voting.deploy(["A", "B"], 100);

  // chờ contract deploy xong
    await voting.deployed();

  console.log("✅ Contract deployed to:", await voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
