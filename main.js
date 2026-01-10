let WALLET_CONNECTED = "";
let contractAddress = "0xd49000131E0FE5d21a1ae8BB0f7eA144Ebf44534";
const tokenAddress = "0xf6c24F5C1ac656800c33AD14005f25dF72A2Cc8E";
const owner = "0xD93c7fBF96f534bbE15C80c4677D57a6783b8F18";
const proposalId = 1;
//Hàm của ERC-20
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

//ABI
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
      "name": "getVoters",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
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
  if(WALLET_CONNECTED == owner){
    const adminLink = document.getElementById("admin");
    adminLink.classList.remove("hidden");
  }
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
  var remainingTime = document.getElementById("time");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractabi,
    signer
  );
  const time = await contractInstance.getRemainingTime(proposalId);
  // remainingTime.innerHTML = `Thời gian kết thúc bầu chọn: ${parseInt(time, 16)}`
  let remaining = time.toNumber();

  const interval = setInterval(() => {
    if (remaining <= 0) {
      remainingTime.innerHTML = "Bầu chọn đã kết thúc";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    remainingTime.innerHTML = `Thời gian kết thúc bầu chọn: ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;

    remaining--;
  }, 1000);
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

async function verifyStudent(formData) {
  const url = "/verify-student";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!data) throw new Error("Server không trả JSON hợp lệ");

  if (!res.ok || data.success !== true) {
    throw new Error(data.error || "Xác minh thất bại");
  }

  claimToken(1);

  document.getElementById("verify-btn").innerHTML = "Xác minh thành công!";
  document.getElementById("verify-btn").setAttribute("disabled", "");

  return data; // ✅ để submitForm dùng Swal hiển thị
}

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
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

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
      "Đang reset thời gian voting...";
    await tx.wait();

    document.getElementById(
      "resetStatus"
    ).innerText = `Reset thời gian voting thành công!
Tx Hash: ${tx.hash}`;
  } catch (err) {
    console.error(err);
    document.getElementById("resetStatus").innerText =
      "Reset thất bại: " + err.message;
  }
};

const loadCandidates = async () => {
  try {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const network = await provider.getNetwork();
    console.log("Network:", network);

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
      alert("Vui lòng cài đặt MetaMask!");
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

    const tokenAmount = 1;
    const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const approveTx = await tokenInstance.approve(contractAddress, tokenAmount);
    await approveTx.wait();
    const tx = await contractInstance.vote(proposalId, index, tokenAmount);
    await tx.wait();
    document.getElementById("cand").innerText = "⏳ Đang gửi vote...";

    document.getElementById(
      "cand"
    ).innerText = `Vote thành công cho candidate #${index}`;
    await loadCandidates(); // Cập nhật lại bảng sau khi vote
  } catch (err) {
    console.error(err);
    document.getElementById("cand").innerText = "Vote thất bại ";
  }
};

let students = [];

function renderStudents() {
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";
  students.forEach((s) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.fullName}</td>
      <td>${s.studentId}</td>
      <td>${s.email}</td>
      <td>${s.wallet}</td>
    `;
    tbody.appendChild(row);
  });
}

function showStudentsTable() {
  document.getElementById("studentsTable").classList.remove("hidden");
}

function importExcel() {
  const fileInput = document.getElementById("excelFile");
  const file = fileInput.files[0];

  if (!file) {
    document.getElementById("importStatus").innerText =
      "❌ Vui lòng chọn file Excel";
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Chuẩn hóa dữ liệu gửi server
    const importedStudents = jsonData.map((row, index) => ({
      fullName: row.fullName?.trim(),
      studentId: row.studentId?.toString().trim(),
      email: row.email?.trim(),
      walletAddress: row.walletAddress?.trim()
    })).filter(s =>
      s.fullName && s.studentId && s.email && s.walletAddress
    );

    if (importedStudents.length === 0) {
      document.getElementById("importStatus").innerText =
        "❌ File không có dữ liệu hợp lệ";
      return;
    }

    // 🔥 GỬI LÊN SERVER
    try {
      document.getElementById("importStatus").innerText =
        "⏳ Đang gửi dữ liệu lên server...";

      const res = await fetch("/import-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ importedStudents })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Import thất bại");
      }

      document.getElementById("importStatus").innerText =
        `✅ Import thành công ${result.count} students`;

      if (result.students) {
        students = result.students;
        renderStudents();
        showStudentsTable();
      }

    } catch (err) {
      document.getElementById("importStatus").innerText =
        "❌ Lỗi: " + err.message;
    }
  };

  reader.readAsArrayBuffer(file);
}

const loadVoters = async () => {
  try {
    const status = document.getElementById("voterStatus");
    const table = document.getElementById("votersTable");
    const tbody = table.querySelector("tbody");

    status.innerText = "⏳ Đang tải danh sách voter...";
    tbody.innerHTML = "";

    if (!window.ethereum) {
      alert("Vui lòng cài MetaMask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      contractabi,
      signer
    );

    // ⚠️ proposalId phải tồn tại
    const [voters, candidates, amounts] =
      await contract.getVoters(proposalId);

    if (voters.length === 0) {
      status.innerText = "Chưa có ai vote";
      return;
    }

    voters.forEach((addr, i) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${addr}</td>
        <td>Candidate #${candidates[i]}</td>
        <td>${ethers.utils.formatUnits(amounts[i], 18)}</td>
      `;

      tbody.appendChild(row);
    });

    table.classList.remove("hidden");
    status.innerText = `✅ Tổng số voter: ${voters.length}`;
  } catch (err) {
    console.error(err);
    document.getElementById("voterStatus").innerText =
      "❌ Lỗi khi tải danh sách voter";
  }
};

