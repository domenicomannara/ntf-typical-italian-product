const { assert } = require('chai')

const TypicalProduct = artifacts.require('./TypicalProduct.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TypicalProduct', (accounts) => {
  let contract

  before(async () => {
    contract = await TypicalProduct.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'TypicalProduct')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'TYP')
    })

  })

  describe('minting', async () => {

    it('Creates a new token', async () => {
      const result = await contract.mint('Puglia', 'bevande', 'Vino rosso')
      const totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })
  })

})
