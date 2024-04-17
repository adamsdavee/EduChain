// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// contract address: 0x851d61a87cdA4b31C1c5eA6389a82cE9F1a45e81

import "@klaytn/contracts/token/ERC20/ERC20.sol";
import "@klaytn/contracts/access/AccessControl.sol";

contract BUNN is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("BlockchainUNN", "BUNN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function minterRole() public view returns (bytes32) {
        return MINTER_ROLE;
    }
}
