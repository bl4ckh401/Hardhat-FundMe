const { network } = require("hardhat")
const { mockConfig,DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (mockConfig.includes(network.name)){
        log("Local network detected. Deploying mocks ...");
            await deploy("MockV3Aggregator", {
                contract: "MockV3Aggregator",
                from: deployer,
                args: [DECIMAL,INITIAL_ANSWER],
                log: true,
            })
            log("Mocks Deployed");
            log("--------------------------------------------------------------------");
    }

}
module.exports.tags=["all", "mocks"]