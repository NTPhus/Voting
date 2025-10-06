// scripts/transferToken.js
const hre = require("hardhat");
async function main() {
  const [sender] = await hre.ethers.getSigners(); // ví gửi
  const tokenAddress = "0xB67b505C692765006E6D04BdD26D17483ab3C0A1"; // token deployed
  const to = "0x59cc25768C648E08eE9583d6Ccc5F33a437A872C";
  const Token = await hre.ethers.getContractAt("VToken", tokenAddress, sender);
  const amount = hre.ethers.utils.parseUnits("1", 1); // 100 token
  const tx = await Token.transfer(to, amount);
  await tx.wait();
  console.log("Transfer done:", tx.hash);
}
main().catch(console.error);
