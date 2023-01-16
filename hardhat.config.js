require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
//require('./tasks/block-number')
require("hardhat-gas-reporter")
require('solidity-coverage')
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //solidity: "0.8.17",
  solidity:{
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }]
  },
  defaultNetwork:"hardhat",
  networks:{
    goerli:{
      url : process.env.RPC_URL,
      accounts:[
        process.env.PRIVATE_KEY,
      ],
      chainId:5,
      blockConfirmations:6,
    }
  },
  etherscan:{
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter:{
    enabled:true,
    outputFile:"gasReport.txt",
    noColors:true,
    // currency:"KES",
  },
  namedAccounts:{
    deployer:{
      default:0
    },
    user:{
      default:1
    }
  }
};
