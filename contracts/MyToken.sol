// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VToken is ERC20, Ownable {
    mapping(address => bool) public claimed; // Lưu danh sách ví đã nhận

    constructor(uint256 initialSupply) ERC20("Voting Token", "VTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** decimals())); // Mint cho owner ban đầu
    }

    // Sinh viên tự claim token, mỗi ví chỉ 1 lần
    function claimToken(uint256 amount) public {
        require(!claimed[msg.sender], "You have already claimed your tokens");
        claimed[msg.sender] = true;
        _mint(msg.sender, amount * (10 ** decimals()));
    }

    // Owner có thể mint thêm khi cần
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * (10 ** decimals()));
    }
}
