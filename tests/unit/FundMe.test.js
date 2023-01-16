const { assert, expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
describe("FundMe", async()=>{
    let fundMe
    let mockV3Aggregator
    let deployer
    let gasCost
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", async()=>{
        it("Fails if you don't send enough ethers", async()=>{
            await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough wei")
        })
        it("Should update fundme Data Structure", async()=>{
            await fundMe.fund({value: sendValue})
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds Funder to funders array", async()=>{
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder,deployer)
        })
    })
    describe("withdraw", async()=>{
        beforeEach(async()=>{
            await fundMe.fund({value:sendValue})
        })
        // it("Only allows owner to withdraw", async () => {
        //     const accounts = await ethers.getSigners()
        //     const attackerConnectedAccount = await fundMe.connect(accounts[1])
        //     await expect(attackerConnectedAccount.withdraw()).to.be.reverted
        // })
        it("Withdraws fund from the contract", async () => {
            const startFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startFundMeDeployer = await fundMe.provider.getBalance(deployer)
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            gasCost = gasUsed.mul(effectiveGasPrice)
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingFundMeDeployer = await fundMe.provider.getBalance(deployer)
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startFundMeBalance.add(startFundMeDeployer).toString(), endingFundMeDeployer.add(gasCost).toString())
        })
        it("Withdraws fund from the contract with multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for(let i; i<=accounts.length; i++){
                const fundMeConnected = await fundMe.connect(accounts[i])
                await fundMeConnected.fund({value:sendValue})
                const startFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startFundMeDeployer = await fundMe.provider.getBalance(deployer)
                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                gasCost = gasUsed.mul(effectiveGasPrice)
                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingFundMeDeployer = await fundMe.provider.getBalance(deployer)
                assert.equal(endingFundMeBalance, 0)
                assert.equal(startFundMeBalance.add(startFundMeDeployer).toString(), endingFundMeDeployer.add(gasCost).toString())
                await expect(fundMe.funders(0)).to.be.reverted
                for(i; i<=accounts.length; i++){
                    assert.equal(await fundMe.addressToAmountFunded(accounts[i].address),0)
                }
            }
        })
    })
})