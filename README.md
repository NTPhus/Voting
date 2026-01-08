# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

lệnh dịch hợp đồng
npx hardhat compile

Lệnh khởi tạo project
npx hardhat run scripts/deploy.js --network sepolia

Lệnh khởi tạo phiên họp mới
npx hardhat run scripts/createProposal.js --network sepolia