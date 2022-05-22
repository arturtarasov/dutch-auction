const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("DutchAuction", function () {
    let owner
    let seller
    let buyer
    let auction

    beforeEach(async function () {
        [owner, seller, buyer] = await ethers.getSigners()

        const DutchAuction = await ethers.getContractFactory("DutchAuction", owner)
        auction = await DutchAuction.deploy()
        await auction.deployed()
    })

    it("sets owner", async function() {
        const currentOwner = await auction.owner()
        expect(currentOwner).to.eq(owner.address)
    })
})