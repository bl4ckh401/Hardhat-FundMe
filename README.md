# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
# Hardhat-FundMe

A decentralized fundraising platform built on the Ethereum blockchain using the Hardhat framework. 

## Features

- Securely raise funds for individuals and organizations
- Withdraw donations from contract to wallet in real-time
- Built on the Ethereum blockchain for added security and transparency

## Installation

To use this platform, you'll need to have [Node.js](https://nodejs.org) and [Hardhat](https://hardhat.org/) installed. Then, you can install the dependencies by running:

npm install


## Usage

The platform can be accessed using a web3 enabled browser. You can find the user interface in the `interface` directory. The smart contract can be found in the `contracts` directory and it can be interacted with using the Hardhat's `ethers.js` library.

## Running the tests

You can run the tests by executing:

npx hardhat test

## Deployment

You can deploy the contract to the Ethereum blockchain using Hardhat. Make sure you have a local development blockchain like ganache running or have access to a testnet or mainnet through a provider like Ethereum.

## Contributing

This platform is open-source and actively maintained, pull requests and issues are welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE
