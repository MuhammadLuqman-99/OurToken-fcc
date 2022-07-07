const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { INITIAL_SUPPLY } = require("../../helper-hardhat-config")

describe("Our token unit test", function () {
    // Multipler is used to make reading the math easier because of the 18 decimal points
    const multiplier = 10 ** 18
    let ourToken, deployer, user1
    beforeEach(async function () {
        const accounts = await getNamedAccounts()
        deployer = accounts.deployer
        user1 = accounts.user1

        await deployments.fixture("all")
        ourToken = await ethers.getContract("OurToken", deployer)
    })

    it("was deployed", async () => {
        assert(ourToken.address)
    })

    describe("constructor", function () {
        it("Should have correct INITIAL_SUPPLY token", async function () {
            const totalSupply = await ourToken.totalSupply()
            assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
        })

        it("Initializes the token with the correct name and symbol", async function () {
            const name = (await ourToken.name()).toString()
            assert.equal(name.toString(), "OurToken")

            const symbol = (await ourToken.symbol()).toString()
            assert.equal(symbol.toString(), "OT")
        })
    })

    describe("transfer", function () {
        it("Should be able to transfer tokens successfully to an address", async function () {
            const tokenToSend = ethers.utils.parseEther("10")
            await ourToken.transfer(user1, tokenToSend)
            expect(await ourToken.balanceOf(user1)).to.equal(tokenToSend)
        })

        it("emits an transfer event, when an transfer occurs", async function () {
            await expect(
                ourToken.transfer(user1, (10 * multiplier).toString())
            ).to.emit(ourToken, "Transfer")
        })
    })

    describe("Allowance", function () {
        const amount = (20 * multiplier).toString()
        beforeEach(async () => {
            playerToken = await ethers.getContract("OurToken", user1)
        })

        it("Should approve other address to spend Token", async function () {
            const tokensToSpend = ethers.utils.parseEther("5")
            await ourToken.approve(user1, tokensToSpend)
            const ourToken1 = await ethers.getContract("OurToken", user1)
            await ourToken1.transferFrom(deployer, user1, tokensToSpend)
            expect(await ourToken1.balanceOf(user1)).to.equal(tokensToSpend)
        })

        it("doent't allow an unnaproved member to do transfers", async () => {
            //Deployer is approving that user1 can spend 20 of their precious OT's

            await expect(
                playerToken.transferFrom(deployer, user1, amount)
            ).to.be.revertedWith("ERC20: insufficient allowance")
        })

        it("emits and approval event, when and approval occurs", async () => {
            await expect(ourToken.approve(user1, amount)).to.emit(
                ourToken,
                "Approval"
            )
        })

        it("the allowance being set is accurate", async () => {
            await ourToken.approve(user1, amount)
            const allowance = await ourToken.allowance(deployer, user1)
            assert.equal(allowance.toString(), amount)
        })

        it("won't allow a user to go over the allowance", async () => {
            await ourToken.approve(user1, amount)
            await expect(
                playerToken.transferFrom(
                    deployer,
                    user1,
                    (40 * multiplier).toString()
                )
            ).to.be.revertedWith("ERC20: insufficient allowance")
        })
    })
})
