const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const EduNft = await deploy("EduNFT", {
    from: deployer,
    log: true,
    args: [],
  });
  log(`Contract deployed at ${EduNft.address}`);

  if (chainId != 31337) {
    await verify(EduNft.address, []);
    log("verified........");
  }
  log("------------------------------------");
};

module.exports.tags = ["all", "EduNft"];
