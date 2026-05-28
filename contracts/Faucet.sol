// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Faucet {
    error CooldownActive(uint256 nextAccessTime);
    error InsufficientBalance(uint256 available, uint256 required);
    error TransferFailed();

    mapping(address => uint256) public lastAccessTime;
    uint256 public constant withdrawalAmount = 0.01 ether;
    uint256 public constant cooldown = 1 minutes;

    receive() external payable {}

    function requestFunds() external {
        uint256 nextAccessTime = lastAccessTime[msg.sender] + cooldown;
        if (block.timestamp < nextAccessTime) {
            revert CooldownActive(nextAccessTime);
        }

        uint256 balance = address(this).balance;
        if (balance < withdrawalAmount) {
            revert InsufficientBalance(balance, withdrawalAmount);
        }

        lastAccessTime[msg.sender] = block.timestamp;

        (bool sent, ) = payable(msg.sender).call{value: withdrawalAmount}("");
        if (!sent) {
            revert TransferFailed();
        }
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
