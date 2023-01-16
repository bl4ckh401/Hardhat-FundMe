const { network } = require("hardhat")
const { networkConfig, mockConfig } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    if (mockConfig.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitBlockConfirmations:network.config.blockConfirmations||1
    })
    if (!mockConfig.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }

    log("--------------------------------------------------------------------------------")
}
module.exports.tags = ["all", "fundMe"]