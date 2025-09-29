require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.API_URL,   // RPC bạn đưa
      accounts: [process.env.PRIVATE_KEY],      // private key ví của bạn
      chainId: 11155111
    }
  }
};
