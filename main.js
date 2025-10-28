let WALLET_CONNECTED = "";
let contractAddress = "0xAb8D5692309139CF53C8c81511c8A1322378B8a7";
const tokenAddress = "0x2f33044A4A800ba82fC0d497FB8e1b5e8cEeE1B9";
const proposalId = 1;
const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function claimToken(uint256 amount)",
  "function mint(address to, uint256 amount)",
  "function claimed(address user) view returns (bool)",
];

let contractabi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "voterCount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "maxVoters",
          "type": "uint256"
        }
      ],
      "name": "ProposalCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "closeProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxVoters",
          "type": "uint256"
        }
      ],
      "name": "createProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "getAllVotesOfCandidates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProposalCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposalCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "name": "resetTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokenAmount",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voteToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const connectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  var element = document.getElementById("metamasknotification");
  element.innerHTML = "Metamask is connected " + WALLET_CONNECTED;
};

const getAllCandidates = async () => {
  var p3 = document.getElementById("p3");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractabi,
    signer
  );
  p3.innerHTML =
    "Please wait, getting all the candidates from voting smart contract";
  var candidates = await contractInstance.getAllVotesOfCandidates(proposalId);
  console.log(candidates);
  var table = document.getElementById("myTable");
  table.innerHTML = "";

  for (let i = 0; i < candidates.length; i++) {
    var row = table.insertRow();
    var idCell = row.insertCell();
    var nameCell = row.insertCell();
    var vc = row.insertCell();

    idCell.innerHTML = i;
    nameCell.innerHTML = candidates[i].name;
    vc.innerHTML = candidates[i].voteCount;
  }

  p3.innerHTML = "The candidate list is updated !!!";
};

const voteStatus = async () => {
  if (WALLET_CONNECTED != 0) {
    var status = document.getElementById("status");
    var remainingTime = document.getElementById("time");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractabi,
      signer
    );
    const currentStatus = await contractInstance.getVotingStatus(proposalId);
    const time = await contractInstance.getRemainingTime(proposalId);
    status.innerHTML =
      currentStatus == 1 ? "Voting is currenly open" : "Voting is finished";
    remainingTime.innerHTML = `Remain time is ${parseInt(time, 16)} seconds`;
  } else {
    var status = document.getElementById("status");
    status.innerHTML = "Please connect Metamask first";
  }
};

const getBalance = async () => {
  if (WALLET_CONNECTED != 0) {
    const balance = document.getElementById("balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const balanceTx = await tokenInstance.balanceOf(WALLET_CONNECTED);
    console.log(balanceTx.toString());
    balance.innerHTML = balanceTx.toString();
  } else {
    var balance = document.getElementById("balance");
    balance.innerHTML = "Please connect Metamask first";
  }
};

const transferToken = async () => {
  if (WALLET_CONNECTED != 0) {
    const transferStatus = document.getElementById("transferStatus");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, signer);
    transferStatus.innerHTML = "Please wait for transfer process";
    const numToken = document.getElementById("tokenTransfer").value;
    const walletAddress = document.getElementById("walletAddress").value;
    console.log(walletAddress, numToken);
    const transfer = await tokenInstance.transfer(walletAddress, numToken);
    if (transfer) {
      transferStatus.innerHTML = "Transfer Successfull";
    } else {
      transferStatus.innerHTML = "Get Error When Transfer";
    }
  } else {
    const transferStatus = document.getElementById("transferStatus");
    transferStatus.innerHTML = "Please connect Metamask first";
  }
};

const verifyStudent = async (formData) => {
  const res = await fetch("/verify-student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await res.json();

  if (result.success) {
    alert(result.message);

    // Gọi hàm mint token bằng ethers.js
    await claimToken(result.data.tokenAmount);
  } else {
    alert(result.error);
  }
};

const claimToken = async (amount) => {
  try {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const tx = await tokenContract.claimToken(amount);
    await tx.wait();

    alert("Nhận token thành công!\nTxHash: " + tx.hash);
  } catch (err) {
    console.error(err);
    alert("Claim token thất bại: " + err.message);
  }
};

const resetVotingTime = async () => {
  try {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài đặt MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // ✅ Gọi đúng contract Voting (không phải Token)
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractabi,
      signer
    );

    const duration = document.getElementById("durationMinutes").value;
    if (!duration || duration <= 0) {
      alert("Vui lòng nhập thời gian hợp lệ (tính bằng phút)");
      return;
    }

    const tx = await contractInstance.resetTime(proposalId, duration);
    document.getElementById("resetStatus").innerText =
      "⏳ Đang reset thời gian voting...";
    await tx.wait();

    document.getElementById(
      "resetStatus"
    ).innerText = `✅ Reset thời gian voting thành công!
Tx Hash: ${tx.hash}`;
  } catch (err) {
    console.error(err);
    document.getElementById("resetStatus").innerText =
      "❌ Reset thất bại: " + err.message;
  }
};

const loadCandidates = async () => {
  try {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài đặt MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractabi,
      signer
    );

    let candidates = await contractInstance.getAllVotesOfCandidates(proposalId);

    const tbody = document.getElementById("candidatesBody");
    tbody.innerHTML = "";
    
    for (let i = 0; i < candidates.length; i++) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${i}</td>
        <td>${candidates[i].name}</td>
        <td>${candidates[i].voteCount}</td>
        <td><button onclick="voteForCandidate(${i})">🗳️ Vote</button></td>
      `;

      tbody.appendChild(row);
    }
  } catch (err) {
    console.error("Lỗi loadCandidates:", err);
  }
};

const voteForCandidate = async (index) => {
  try {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài đặt MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractabi,
      signer
    );
    
    const amount = ethers.utils.parseUnits("1", 1);
    const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const approveTx = await tokenInstance.approve(contractAddress, amount);
    await approveTx.wait();

    const tx = await contractInstance.vote(proposalId, index, amount);
    await tx.wait();
    document.getElementById("cand").innerText = "⏳ Đang gửi vote...";
    await tx.wait();

    document.getElementById(
      "cand"
    ).innerText = `✅ Vote thành công cho candidate #${index}`;
    await loadCandidates(); // Cập nhật lại bảng sau khi vote
  } catch (err) {
    console.error(err);
    document.getElementById("cand").innerText =
      "❌ Vote thất bại ";
  }
};
