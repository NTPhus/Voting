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
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 voterCount; // 🆕 đếm số người đã vote
        uint256 maxVoters;  // 🆕 giới hạn người vote
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
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal");
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
            p.candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
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
    function vote(uint256 _proposalId, uint256 _candidateIndex, uint256 tokenAmount)
        public
        validProposal(_proposalId)
    {
        Proposal storage p = proposals[_proposalId];
        require(p.active, "Voting closed");
        require(block.timestamp >= p.startTime && block.timestamp < p.endTime, "Voting not active");
        require(!p.voters[msg.sender], "You have already voted!");
        require(p.voterCount < p.maxVoters, "Voting limit reached!");
        require(_candidateIndex < p.candidates.length, "Invalid candidate index");
        require(tokenAmount > 0, "Must vote with tokens");
        require(voteToken.balanceOf(msg.sender) >= tokenAmount, "Not enough tokens");

        voteToken.transferFrom(msg.sender, address(this), tokenAmount);
        p.candidates[_candidateIndex].voteCount += tokenAmount;
        p.voters[msg.sender] = true;
        p.voterCount++;
    }

    function getAllVotesOfCandidates(uint256 _proposalId)
        public
        view
        validProposal(_proposalId)
        returns (Candidate[] memory)
    {
        Proposal storage p = proposals[_proposalId];
        return p.candidates;
    }

    function getVotingStatus(uint256 _proposalId)
        public
        view
        validProposal(_proposalId)
        returns (bool)
    {
        Proposal storage p = proposals[_proposalId];
        return (block.timestamp >= p.startTime && block.timestamp < p.endTime && p.active);
    }

    function getRemainingTime(uint256 _proposalId)
        public
        view
        validProposal(_proposalId)
        returns (uint256)
    {
        Proposal storage p = proposals[_proposalId];
        if (block.timestamp >= p.endTime) {
            return 0;
        }
        return p.endTime - block.timestamp;
    }

    function resetTime(uint256 _proposalId, uint256 _durationInMinutes)
        public
        onlyOwner
        validProposal(_proposalId)
    {
        Proposal storage p = proposals[_proposalId];
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        p.active = true;
    }

    function closeProposal(uint256 _proposalId)
        public
        onlyOwner
        validProposal(_proposalId)
    {
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
