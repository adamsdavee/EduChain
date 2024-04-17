// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// contract address: 0x86022BfC78f8769fCA6165264a5a9049c363115C

error EduChain__PathExists();
error EduChain__NotOwner();
error EduChain__CheckpointExceeded();
error EduChain__GoBackToPreviousCheckpoint();

interface MintingInterface {
    function mint(address account, uint256 amount) external;

    function mintNft() external;
}

contract EduChain is ReentrancyGuard {
    uint256 public tokenRewardsPerCheckpoint;
    address internal immutable tokenAddress;
    address internal immutable nftAddress;

    struct Roadmap {
        string roadName;
        uint256 numberOfCheckpoints;
    }

    struct Track {
        uint256 progress;
        bool pass;
    }

    mapping(string => Roadmap) public s_globalCheckpoints;
    mapping(address => mapping(string => mapping(uint256 => Track)))
        public verify;

    constructor(address _tokenAddress, address _nftAddress) {
        tokenAddress = _tokenAddress;
        nftAddress = _nftAddress;
    }

    // Main Functions

    /**
     * @notice Method for creating a global checkpoint for a particular roadmap
     * @param pathName: Name of the course roadmap
     * @param noOfCheckpoints: Number of checkpoints on the course
     */

    function createGlobalCheckpoints(
        string memory pathName,
        uint256 noOfCheckpoints
    ) external {
        if (s_globalCheckpoints[pathName].numberOfCheckpoints > 0)
            revert EduChain__PathExists();
        s_globalCheckpoints[pathName] = Roadmap(pathName, noOfCheckpoints);
    }

    /**
     * @notice Method for passing each checkPoint and tracking on the blockchain
     * @param pathName: Name of the course roadmap
     * @param checkPoint: Checkpoint to pass on the roadmap
     */

    function passCheckpoints(
        uint256 checkPoint,
        string memory pathName
    ) external returns (bool) {
        if (
            checkPoint > s_globalCheckpoints[pathName].numberOfCheckpoints ||
            checkPoint <= 0
        ) revert EduChain__CheckpointExceeded();
        bool isCertified;
        if (checkPoint == 1) {
            isCertified = _mintRewards();
        }
        if (checkPoint > 1) {
            bool check = verify[msg.sender][pathName][checkPoint - 1].pass;
            if (!check) revert EduChain__GoBackToPreviousCheckpoint();
            isCertified = _mintRewards();
        }

        verify[msg.sender][pathName][checkPoint].progress = checkPoint;
        return isCertified;
    }

    ////// INTERNAL FUNCTIONS

    function _mintRewards() internal returns (bool) {
        MintingInterface mintToken = MintingInterface(tokenAddress);
        mintToken.mint(msg.sender, tokenRewardsPerCheckpoint);
        MintingInterface mintNft = MintingInterface(nftAddress);
        mintNft.mintNft();
        return true;
    }

    //////////////////////
    // Getter Functions //
    //////////////////////

    function changeTokenRewards(uint256 value) external {
        tokenRewardsPerCheckpoint = value;
    }

    function getUserCurrentCheckpoint(
        string memory pathName
    ) external view returns (uint256) {
        return verify[msg.sender][pathName][1].progress;
    }
}
