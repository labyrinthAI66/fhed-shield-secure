// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@zama-fhe/oracle-solidity/contracts/FheOracle.sol";

/**
 * @title FHEShieldSecure
 * @dev A secure financial assessment contract using Fully Homomorphic Encryption
 * @author FHE Shield Secure Team
 */
contract FHEShieldSecure is FheOracle {
    
    // Events
    event AssessmentSubmitted(address indexed user, bytes32 indexed assessmentId, uint256 timestamp);
    event RiskScoreCalculated(address indexed user, bytes32 indexed assessmentId, uint256 encryptedScore);
    event AssessmentApproved(address indexed user, bytes32 indexed assessmentId, bool approved);
    event FundsDeposited(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 amount);
    
    // Structs
    struct Assessment {
        address user;
        bytes32 id;
        uint256 timestamp;
        bool isProcessed;
        bool isApproved;
        uint256 encryptedScore;
        uint256 depositAmount;
    }
    
    struct UserProfile {
        bool exists;
        uint256 totalAssessments;
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        bool isActive;
    }
    
    // State variables
    mapping(bytes32 => Assessment) public assessments;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256) public userBalances;
    
    bytes32[] public assessmentIds;
    address public owner;
    uint256 public totalAssessments;
    uint256 public totalDeposits;
    uint256 public totalWithdrawals;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validAssessment(bytes32 _assessmentId) {
        require(assessments[_assessmentId].user != address(0), "Assessment does not exist");
        _;
    }
    
    modifier onlyUser(bytes32 _assessmentId) {
        require(assessments[_assessmentId].user == msg.sender, "Only assessment owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Submit a new financial assessment with encrypted data
     * @param _encryptedData The encrypted financial data for assessment
     * @param _depositAmount The amount to deposit for the assessment
     */
    function submitAssessment(
        bytes calldata _encryptedData,
        uint256 _depositAmount
    ) external payable {
        require(_depositAmount > 0, "Deposit amount must be greater than 0");
        require(msg.value >= _depositAmount, "Insufficient payment");
        
        bytes32 assessmentId = keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            _encryptedData,
            _depositAmount
        ));
        
        // Create new assessment
        assessments[assessmentId] = Assessment({
            user: msg.sender,
            id: assessmentId,
            timestamp: block.timestamp,
            isProcessed: false,
            isApproved: false,
            encryptedScore: 0,
            depositAmount: _depositAmount
        });
        
        // Update user profile
        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender] = UserProfile({
                exists: true,
                totalAssessments: 0,
                totalDeposits: 0,
                totalWithdrawals: 0,
                isActive: true
            });
        }
        
        userProfiles[msg.sender].totalAssessments++;
        userProfiles[msg.sender].totalDeposits += _depositAmount;
        userBalances[msg.sender] += _depositAmount;
        
        assessmentIds.push(assessmentId);
        totalAssessments++;
        totalDeposits += _depositAmount;
        
        emit AssessmentSubmitted(msg.sender, assessmentId, block.timestamp);
        emit FundsDeposited(msg.sender, _depositAmount);
    }
    
    /**
     * @dev Process assessment using FHE oracle for encrypted computation
     * @param _assessmentId The ID of the assessment to process
     * @param _encryptedScore The encrypted risk score from FHE computation
     */
    function processAssessment(
        bytes32 _assessmentId,
        uint256 _encryptedScore
    ) external onlyOwner validAssessment(_assessmentId) {
        Assessment storage assessment = assessments[_assessmentId];
        require(!assessment.isProcessed, "Assessment already processed");
        
        assessment.encryptedScore = _encryptedScore;
        assessment.isProcessed = true;
        
        // Determine approval based on encrypted score (simplified logic)
        // In real implementation, this would use FHE comparison operations
        assessment.isApproved = _encryptedScore > 0; // Simplified for demo
        
        emit RiskScoreCalculated(assessment.user, _assessmentId, _encryptedScore);
        emit AssessmentApproved(assessment.user, _assessmentId, assessment.isApproved);
    }
    
    /**
     * @dev Withdraw funds after assessment completion
     * @param _assessmentId The ID of the assessment
     */
    function withdrawFunds(bytes32 _assessmentId) external validAssessment(_assessmentId) onlyUser(_assessmentId) {
        Assessment storage assessment = assessments[_assessmentId];
        require(assessment.isProcessed, "Assessment not yet processed");
        require(assessment.isApproved, "Assessment not approved");
        require(userBalances[msg.sender] >= assessment.depositAmount, "Insufficient balance");
        
        uint256 amount = assessment.depositAmount;
        userBalances[msg.sender] -= amount;
        userProfiles[msg.sender].totalWithdrawals += amount;
        totalWithdrawals += amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Get assessment details
     * @param _assessmentId The ID of the assessment
     * @return Assessment details
     */
    function getAssessment(bytes32 _assessmentId) external view validAssessment(_assessmentId) returns (
        address user,
        bytes32 id,
        uint256 timestamp,
        bool isProcessed,
        bool isApproved,
        uint256 encryptedScore,
        uint256 depositAmount
    ) {
        Assessment memory assessment = assessments[_assessmentId];
        return (
            assessment.user,
            assessment.id,
            assessment.timestamp,
            assessment.isProcessed,
            assessment.isApproved,
            assessment.encryptedScore,
            assessment.depositAmount
        );
    }
    
    /**
     * @dev Get user profile
     * @param _user The user address
     * @return User profile details
     */
    function getUserProfile(address _user) external view returns (
        bool exists,
        uint256 totalAssessments,
        uint256 totalDeposits,
        uint256 totalWithdrawals,
        bool isActive,
        uint256 balance
    ) {
        UserProfile memory profile = userProfiles[_user];
        return (
            profile.exists,
            profile.totalAssessments,
            profile.totalDeposits,
            profile.totalWithdrawals,
            profile.isActive,
            userBalances[_user]
        );
    }
    
    /**
     * @dev Get all assessment IDs for a user
     * @param _user The user address
     * @return Array of assessment IDs
     */
    function getUserAssessments(address _user) external view returns (bytes32[] memory) {
        bytes32[] memory userAssessments = new bytes32[](assessmentIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < assessmentIds.length; i++) {
            if (assessments[assessmentIds[i]].user == _user) {
                userAssessments[count] = assessmentIds[i];
                count++;
            }
        }
        
        // Resize array to actual count
        bytes32[] memory result = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userAssessments[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get contract statistics
     * @return Total assessments, deposits, and withdrawals
     */
    function getContractStats() external view returns (
        uint256 assessments,
        uint256 deposits,
        uint256 withdrawals,
        uint256 contractBalance
    ) {
        return (
            totalAssessments,
            totalDeposits,
            totalWithdrawals,
            address(this).balance
        );
    }
    
    /**
     * @dev Emergency withdrawal function for owner
     * @param _amount The amount to withdraw
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        
        (bool success, ) = owner.call{value: _amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Update user active status
     * @param _user The user address
     * @param _isActive The new active status
     */
    function updateUserStatus(address _user, bool _isActive) external onlyOwner {
        require(userProfiles[_user].exists, "User does not exist");
        userProfiles[_user].isActive = _isActive;
    }
    
    // Receive function to accept ETH
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
