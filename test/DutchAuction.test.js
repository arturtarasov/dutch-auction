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

    async function getTimestamp(bn) {
        return (
          await ethers.provider.getBlock(bn)
        ).timestamp
    }

    describe("createAuction", function () {
        it("creates auction correctly", async function() {
            const duration = 60
            const startingPrice = ethers.utils.parseEther("0.0001")
            const discountRate = 3;
            const item = "fake item"
            const tx = await auction.createAuction(
                startingPrice,
                discountRate,
                item,
                duration
            )
        
            const cAuction = await auction.auctions(0) // Promise
            expect(cAuction.item).to.eq(item)
            expect(cAuction.discountRate).to.eq(discountRate)
            expect(cAuction.stopped).to.eq(false)
            expect(cAuction.startingPrice).to.eq(startingPrice)
            const ts = await getTimestamp(tx.blockNumber)
            expect(cAuction.endsAt).to.eq(ts + duration)
        })
    })

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    
    describe("buy", function () {
        it("allows to buy", async function() {
            await auction.connect(seller).createAuction(
                ethers.utils.parseEther("0.0001"),
                3,
                "fake item",
                60
            )
    
          this.timeout(5000) // 5s
          await delay(1000)
    
          const buyTx = await auction.connect(buyer).
            buy(0, {value: ethers.utils.parseEther("0.0001")})
    
          const cAuction = await auction.auctions(0)
          const finalPrice = cAuction.finalPrice
          await expect(() => buyTx).
            to.changeEtherBalance(
              seller, finalPrice - Math.floor((finalPrice * 10) / 100)
            )
    
          await expect(buyTx)
            .to.emit(auction, 'AuctionEnded')
            .withArgs(0, finalPrice, buyer.address)
    
          await expect(
            auction.connect(buyer).
              buy(0, {value: ethers.utils.parseEther("0.0001")})
          ).to.be.revertedWith('stopped!')
        })
    })
})