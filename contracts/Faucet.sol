// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OptimizedFaucet {
    mapping(address => uint256) public lastAccessTime;
    uint256 public withdrawalAmount = 0.01 ether;
    uint256 public cooldown = 1 minutes;

    receive() external payable {}

    function requestFunds() public {
        require(
            block.timestamp >= lastAccessTime[msg.sender] + cooldown,
            "Wait before requesting again"
        );

        require(
            address(this).balance >= withdrawalAmount,
            "Not enough balance"
        );

        lastAccessTime[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(withdrawalAmount);
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
}