const { deployments, getNamedAccounts, network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const chainId = network.config.chainId;
  console.log(chainId);

  console.log("Deploying NFT........");
  const BUNN = await deploy("BUNN", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`Deployed contract at ${BUNN.address}`);

  if (chainId != 31337) {
    await verify(BUNN.address, []);
    log("verified........");
  }
};

module.exports.tags = ["all", "bunn"];
