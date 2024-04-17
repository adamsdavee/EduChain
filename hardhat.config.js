require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const KLAYTN_BAOBAB_URL = process.env.KLAYTN_BAOBAB_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
// console.log(KLAYTN_BAOBAB_URL);

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    baobab: {
      url: process.env.KLAYTN_BAOBAB_URL || "",
      gasPrice: 250000000000,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  solidity: {
    compilers: [{ version: "0.8.19" }, { version: "0.8.20" }],
  },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY,
  // },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    player: {
      default: 1,
    },
  },
};
