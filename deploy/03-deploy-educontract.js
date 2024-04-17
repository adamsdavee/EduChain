const { deployments, getNamedAccounts, network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const chainId = network.config.chainId;
  console.log(chainId);

  const token = await deployments.get("EduNFT", deployer);

  const nft = await deployments.get("BUNN", deployer);

  const args = [token.address, nft.address];

  console.log("Deploying NFT........");
  const EduChain = await deploy("EduChain", {
    from: deployer,
    args: args,
    log: true,
  });
  console.log(`Deployed contract at ${EduChain.address}`);

  if (chainId != 31337) {
    await verify(EduChain.address, []);
    log("verified........");
  }
};

module.exports.tags = ["all", "Educhain"];
