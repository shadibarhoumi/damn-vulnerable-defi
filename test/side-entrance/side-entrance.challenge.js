const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('[Challenge] Side entrance', function () {
  let deployer, attacker

  const ETHER_IN_POOL = ethers.utils.parseEther('1000')

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    ;[deployer, attacker] = await ethers.getSigners()

    const SideEntranceLenderPoolFactory = await ethers.getContractFactory('SideEntranceLenderPool', deployer)
    this.pool = await SideEntranceLenderPoolFactory.deploy()

    await this.pool.deposit({ value: ETHER_IN_POOL })

    this.attackerInitialEthBalance = await ethers.provider.getBalance(attacker.address)

    expect(await ethers.provider.getBalance(this.pool.address)).to.equal(ETHER_IN_POOL)
  })

  it('Exploit', async function () {
    const ExploitFactory = await ethers.getContractFactory('SideEntranceExploit', deployer)
    const exploit = await ExploitFactory.deploy(this.pool.address)
    await exploit.connect(attacker).attack()
    // exploit has 0 ETH, pool has 1000 ETH, but pool thinks exploit deposited 1000 ETH
    // exploit.withdraw(attacker.address)
  })

  after(async function () {
    /** SUCCESS CONDITIONS */
    expect(await ethers.provider.getBalance(this.pool.address)).to.be.equal('0')

    // Not checking exactly how much is the final balance of the attacker,
    // because it'll depend on how much gas the attacker spends in the attack
    // If there were no gas costs, it would be balance before attack + ETHER_IN_POOL
    expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(this.attackerInitialEthBalance)
  })
})
