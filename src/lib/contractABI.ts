export const FHEShieldSecureABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "assessmentId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "AssessmentApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "assessmentId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "AssessmentSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "assessmentId",
        "type": "bytes32"
      }
    ],
    "name": "RiskScoreCalculated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_assessmentId",
        "type": "bytes32"
      }
    ],
    "name": "getAssessment",
    "outputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isProcessed",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "depositAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_assessmentId",
        "type": "bytes32"
      }
    ],
    "name": "getEncryptedAssessmentData",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "revenue",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "employees",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "industry",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "businessType",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "riskHistory",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "complianceLevel",
        "type": "uint8"
      },
      {
        "internalType": "uint32",
        "name": "coverageAmount",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "deductible",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "riskScore",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getEncryptedUserAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_assessmentId",
        "type": "bytes32"
      }
    ],
    "name": "getRiskScore",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "assessments",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deposits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "withdrawals",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "contractBalance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserAssessments",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserProfile",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalAssessments",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalDeposits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalWithdrawals",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_assessmentId",
        "type": "bytes32"
      }
    ],
    "name": "processAssessment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_revenueEncrypted",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_employeesEncrypted",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "_industryEncrypted",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_businessTypeEncrypted",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_riskHistoryEncrypted",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_complianceLevelEncrypted",
        "type": "uint8"
      },
      {
        "internalType": "uint32",
        "name": "_coverageAmountEncrypted",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_deductibleEncrypted",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "_inputProof",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_depositAmount",
        "type": "uint256"
      }
    ],
    "name": "submitAssessment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_assessmentId",
        "type": "bytes32"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "receive",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;
