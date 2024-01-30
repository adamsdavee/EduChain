const { ethers, getNamedAccounts, deployments } = require("hardhat");

const PRICE = ethers.parseEther("0.1");

async function mintAndList() {
  const { deployer } = await getNamedAccounts();
  const nft = await deployments.get("NftMarketplace", deployer);
  const nftMarketplace = await ethers.getContractAt(
    "NftMarketplace",
    nft.address
  );
  const basic = await deployments.get("BasicNFT", deployer);
  const basicNft = await ethers.getContractAt("BasicNFT", basic.address);

  console.log("Minting....");
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.logs[0].args.tokenId;
  console.log("Approving Nft...");

  const approvalTx = await basicNft.approve(nftMarketplace.target, tokenId);
  await approvalTx.wait(1);
  console.log("Listing Nft...");
  const tx = await nftMarketplace.listItem(basicNft.target, tokenId, PRICE);
  await tx.wait(1);
  console.log("Listed!");
}

mintAndList().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
