// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Proposal {
        string title;
        Candidate[] candidates;
        mapping(address => bool) voters;
        mapping(address => uint256) votedCandidate;
        mapping(address => uint256) votedAmount;
        address[] voterList;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 voterCount;
        uint256 maxVoters;
    }

    IERC20 public voteToken;
    address public owner;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) private proposals;

    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        uint256 startTime,
        uint256 endTime,
        uint256 voterCount,
        uint256 maxVoters
    );

    constructor(address _tokenAddress) {
        voteToken = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier validProposal(uint256 _proposalId) {
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Invalid proposal"
        );
        _;
    }

    // 🟢 Tạo cuộc họp (proposal) mới
    function createProposal(
        string memory _title,
        string[] memory _candidateNames,
        uint256 _durationInMinutes,
        uint256 _maxVoters
    ) public onlyOwner {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.title = _title;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        p.active = true;
        p.maxVoters = _maxVoters;
        p.voterCount = 0;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            p.candidates.push(
                Candidate({name: _candidateNames[i], voteCount: 0})
            );
        }

        emit ProposalCreated(
            proposalCount,
            _title,
            p.startTime,
            p.endTime,
            p.voterCount,
            p.maxVoters
        );
    }

    // 🗳️ Bỏ phiếu bằng token ERC20
    function vote(
        uint256 _proposalId,
        uint256 _candidateIndex,
        uint256 tokenAmount
    ) public validProposal(_proposalId) {
        Proposal storage p = proposals[_proposalId];

        require(p.active, "Voting closed");
        require(
            block.timestamp >= p.startTime && block.timestamp < p.endTime,
            "Voting not active"
        );
        require(!p.voters[msg.sender], "You have already voted");
        require(p.voterCount < p.maxVoters, "Voting limit reached");
        require(_candidateIndex < p.candidates.length, "Invalid candidate");
        require(tokenAmount > 0, "Must vote with tokens");
        require(
            voteToken.balanceOf(msg.sender) >= tokenAmount,
            "Not enough tokens"
        );

        voteToken.transferFrom(msg.sender, address(this), tokenAmount);

        p.voters[msg.sender] = true;
        p.votedCandidate[msg.sender] = _candidateIndex;
        p.votedAmount[msg.sender] = tokenAmount;
        p.voterList.push(msg.sender);

        p.candidates[_candidateIndex].voteCount += tokenAmount;
        p.voterCount++;
    }

    function addCandidate(
        uint256 _proposalId,
        string memory _candidateName
    ) public onlyOwner validProposal(_proposalId) {
        Proposal storage p = proposals[_proposalId];

        require(p.active, "Proposal is closed");
        require(bytes(_candidateName).length > 0, "Candidate name required");

        p.candidates.push(Candidate({name: _candidateName, voteCount: 0}));
    }

    function getWinners(
        uint256 _proposalId
    )
        public
        view
        validProposal(_proposalId)
        returns (
            string[] memory names,
            uint256 maxVotes,
            uint256[] memory indexes
        )
    {
        Proposal storage p = proposals[_proposalId];
        require(p.candidates.length > 0, "No candidates");

        // 1. Tìm maxVotes
        maxVotes = 0;
        for (uint256 i = 0; i < p.candidates.length; i++) {
            if (p.candidates[i].voteCount > maxVotes) {
                maxVotes = p.candidates[i].voteCount;
            }
        }

        // 2. Đếm số winner
        uint256 count = 0;
        for (uint256 i = 0; i < p.candidates.length; i++) {
            if (p.candidates[i].voteCount == maxVotes) {
                count++;
            }
        }

        // 3. Gán kết quả
        names = new string[](count);
        indexes = new uint256[](count);

        uint256 j = 0;
        for (uint256 i = 0; i < p.candidates.length; i++) {
            if (p.candidates[i].voteCount == maxVotes) {
                names[j] = p.candidates[i].name;
                indexes[j] = i;
                j++;
            }
        }

        // 👇 return rõ ràng
        return (names, maxVotes, indexes);
    }

    function getVoters(
        uint256 _proposalId
    )
        public
        view
        validProposal(_proposalId)
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        Proposal storage p = proposals[_proposalId];
        uint256 len = p.voterList.length;

        address[] memory voters = new address[](len);
        uint256[] memory candidates = new uint256[](len);
        uint256[] memory amounts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            address voter = p.voterList[i];
            voters[i] = voter;
            candidates[i] = p.votedCandidate[voter];
            amounts[i] = p.votedAmount[voter];
        }

        return (voters, candidates, amounts);
    }

    function getAllVotesOfCandidates(
        uint256 _proposalId
    ) public view validProposal(_proposalId) returns (Candidate[] memory) {
        Proposal storage p = proposals[_proposalId];

        uint256 len = p.candidates.length;
        Candidate[] memory result = new Candidate[](len);

        for (uint256 i = 0; i < len; i++) {
            result[i] = p.candidates[i];
        }

        return result;
    }

    function getVotingStatus(
        uint256 _proposalId
    ) public view validProposal(_proposalId) returns (bool) {
        Proposal storage p = proposals[_proposalId];
        return (block.timestamp >= p.startTime &&
            block.timestamp < p.endTime &&
            p.active);
    }

    function getRemainingTime(
        uint256 _proposalId
    ) public view validProposal(_proposalId) returns (uint256) {
        Proposal storage p = proposals[_proposalId];
        if (block.timestamp >= p.endTime) {
            return 0;
        }
        return p.endTime - block.timestamp;
    }

    function resetTime(
        uint256 _proposalId,
        uint256 _durationInMinutes
    ) public onlyOwner validProposal(_proposalId) {
        Proposal storage p = proposals[_proposalId];
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        p.active = true;
    }

    function closeProposal(
        uint256 _proposalId
    ) public onlyOwner validProposal(_proposalId) {
        Proposal storage p = proposals[_proposalId];
        require(p.active, "Already closed");
        p.active = false;
    }

    function withdrawToken(uint256 amount) public onlyOwner {
        uint256 contractBalance = voteToken.balanceOf(address(this));
        require(contractBalance >= amount, "Not enough tokens in contract");
        bool success = voteToken.transfer(owner, amount);
        require(success, "Withdraw failed");
    }

    function transferToken(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 contractBalance = voteToken.balanceOf(address(this));
        require(contractBalance >= amount, "Not enough tokens in contract");

        bool success = voteToken.transfer(to, amount);
        require(success, "Token transfer failed");
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }
}
