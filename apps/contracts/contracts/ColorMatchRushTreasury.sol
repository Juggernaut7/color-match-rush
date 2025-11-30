// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ColorMatchRushTreasury
 * @notice Treasury contract for Color Match Rush game
 * Receives entry fees and distributes prizes to winners
 */
contract ColorMatchRushTreasury {
    address public owner;
    address public cUSD;
    
    // Round tracking
    struct Round {
        uint256 roundId;
        uint256 totalPool;
        bool isActive;
        bool prizesDistributed;
    }
    
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    
    event EntryFeeReceived(uint256 indexed roundId, address indexed player, uint256 amount);
    event PrizesDistributed(
        uint256 indexed roundId,
        address firstPlace,
        address secondPlace,
        address thirdPlace,
        uint256 firstPrize,
        uint256 secondPrize,
        uint256 thirdPrize
    );
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor(address _cUSD) {
        owner = msg.sender;
        cUSD = _cUSD;
    }
    
    /**
     * @notice Receive entry fees (called by players via ERC20 transfer)
     * Entry fees should be sent directly to this contract address
     */
    function receiveEntryFee(uint256 roundId) external {
        // This function is mainly for tracking
        // Actual transfer happens via ERC20 transfer to this contract
        emit EntryFeeReceived(roundId, msg.sender, 0);
    }
    
    /**
     * @notice Distribute prizes to top 3 winners
     * @param roundId The round ID
     * @param firstPlace First place winner address
     * @param secondPlace Second place winner address
     * @param thirdPlace Third place winner address
     */
    function distributePrizes(
        uint256 roundId,
        address firstPlace,
        address secondPlace,
        address thirdPlace
    ) external onlyOwner {
        Round storage round = rounds[roundId];
        require(round.isActive, "Round not active");
        require(!round.prizesDistributed, "Prizes already distributed");
        require(round.totalPool > 0, "No pool to distribute");
        
        // Calculate prize amounts (50%, 30%, 20%)
        uint256 firstPrize = (round.totalPool * 50) / 100;
        uint256 secondPrize = (round.totalPool * 30) / 100;
        uint256 thirdPrize = (round.totalPool * 20) / 100;
        
        // Transfer prizes
        if (firstPlace != address(0) && firstPrize > 0) {
            require(transferERC20(firstPlace, firstPrize), "First prize transfer failed");
        }
        if (secondPlace != address(0) && secondPrize > 0) {
            require(transferERC20(secondPlace, secondPrize), "Second prize transfer failed");
        }
        if (thirdPlace != address(0) && thirdPrize > 0) {
            require(transferERC20(thirdPlace, thirdPrize), "Third prize transfer failed");
        }
        
        round.prizesDistributed = true;
        
        emit PrizesDistributed(
            roundId,
            firstPlace,
            secondPlace,
            thirdPlace,
            firstPrize,
            secondPrize,
            thirdPrize
        );
    }
    
    /**
     * @notice Update round pool (called by backend)
     */
    function updateRoundPool(uint256 roundId, uint256 amount) external onlyOwner {
        rounds[roundId].totalPool += amount;
        if (!rounds[roundId].isActive) {
            rounds[roundId].isActive = true;
            rounds[roundId].roundId = roundId;
        }
    }
    
    /**
     * @notice End a round
     */
    function endRound(uint256 roundId) external onlyOwner {
        rounds[roundId].isActive = false;
    }
    
    /**
     * @notice Transfer ERC20 tokens
     */
    function transferERC20(address to, uint256 amount) internal returns (bool) {
        // Using low-level call for ERC20 transfer
        (bool success, ) = cUSD.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        return success;
    }
    
    /**
     * @notice Get round info
     */
    function getRound(uint256 roundId) external view returns (Round memory) {
        return rounds[roundId];
    }
    
    /**
     * @notice Change owner
     */
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }
    
    /**
     * @notice Emergency withdraw (only owner)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(transferERC20(owner, amount), "Withdraw failed");
    }
}


