const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    log: true,
    args: [],
  });
  log(`Contract deployed at ${nftMarketplace.address}`);

  if (chainId != 31337) {
    await verify(nftMarketplace.address, []);
    log("verified........");
  }
  log("------------------------------------");
};

module.exports.tags = ["all", "nftMarketplace"];
