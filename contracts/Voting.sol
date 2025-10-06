    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

    contract Voting {
        struct Candidate{
            string name;
            uint256 voteCount;
        }

        Candidate[] public candidates;
        address owner;
        IERC20 public voteToken; //ERC -20

        mapping(address => bool) public voters;

        uint256 public votingStart;
        uint256 public votingEnd;

        constructor(address _tokenAddress,string[] memory _candidateNames, uint256 _durationInMinutes){
            for(uint256 i = 0; i < _candidateNames.length; i++){
                candidates.push(
                    Candidate({
                        name: _candidateNames[i],
                        voteCount : 0
                    })
                );
            }
            voteToken = IERC20(_tokenAddress);
            owner = msg.sender;
            votingStart = block.timestamp;
            votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        }

        modifier onlyOwner {
            require(msg.sender == owner);
            _;
        }

        function addCandidate(string memory _name) public onlyOwner{
            candidates.push(Candidate({
                name:_name,
                voteCount: 0
            }));
        }

        modifier votingActive() {
            require(block.timestamp >= votingStart && block.timestamp < votingEnd, "Voting not active");
            _;
        }


        function vote(uint256 _candidateIndex, uint256 tokenAmount) public votingActive {
            require(!voters[msg.sender], "You have already voted !!!");
            require(_candidateIndex < candidates.length, "Invalid candidate index");
            require(tokenAmount > 0, "Must vote with tokens");
            require(voteToken.balanceOf(msg.sender) >= tokenAmount, "Not enough tokens");

            // Người dùng phải approve token trước
            voteToken.transferFrom(msg.sender, address(this), tokenAmount);

            candidates[_candidateIndex].voteCount++;
            voters[msg.sender] = true;
        }

        function getAllVotesOfCandidates() public view returns (Candidate[] memory){
            return candidates;
        }

        function getVotingStatus() public view returns (bool){
            return(block.timestamp>=votingStart && block.timestamp<votingEnd);
        }

        function getRemainingTime() public view returns (uint256){
            require(block.timestamp >= votingStart, "Voting has not started yet !!!");
            if(block.timestamp >= votingEnd){
                return 0;
            }
            return votingEnd - block.timestamp;
        }

        function getBalance() public view returns (uint256){
            return voteToken.balanceOf(msg.sender);
        }
    }