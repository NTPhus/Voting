let WALLET_CONNECTED = "";
let contractAddress = "0x0ad797E8C95E39b438A4Fd613dbC8213EEe1b3C5";
const tokenAddress = "0xB67b505C692765006E6D04BdD26D17483ab3C0A1";
const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
];

let contractabi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "string[]",
        name: "_candidateNames",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_durationInMinutes",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllVotesOfCandidates",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVotingStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "voteToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
  var candidates = await contractInstance.getAllVotesOfCandidates();
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
    const currentStatus = await contractInstance.getVotingStatus();
    const time = await contractInstance.getRemainingTime();
    status.innerHTML =
      currentStatus == 1 ? "Voting is currenly open" : "Voting is finished";
    remainingTime.innerHTML = `Remain time is ${parseInt(time, 16)} seconds`;
  } else {
    var status = document.getElementById("status");
    status.innerHTML = "Please connect Metamask first";
  }
};

const addVote = async () => {
  if (WALLET_CONNECTED != 0) {
    var name = document.getElementById("vote");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractabi,
      signer
    );
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please wait, adding a vote in the smart contract";
    const amount = ethers.utils.parseUnits("1", 1);

    const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const approveTx = await tokenInstance.approve(contractAddress, amount);
    await approveTx.wait();

    const tx = await contractInstance.vote(name.value, amount);
    await tx.wait();

    cand.innerHTML = "Vote added";
    await getAllCandidates();
  } else {
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please connect Metamask first";
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
  }else {
    const transferStatus = document.getElementById("transferStatus");
    transferStatus.innerHTML = "Please connect Metamask first";
  }
};
