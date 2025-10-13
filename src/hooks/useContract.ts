import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';
import contractABI from '../lib/contractABI.json';
import { Contract } from 'ethers';

const CONTRACT_ADDRESS = '0xD6C2588486aAaF439ABCDeA17C9896C8c5527b79'; // Updated contract address

// Convert FHE handles to hex string format
const convertHex = (handle: any): string => {
  console.log('Converting handle:', handle, 'type:', typeof handle, 'isUint8Array:', handle instanceof Uint8Array);
  
  let formattedHandle: string;
  if (typeof handle === 'string') {
    formattedHandle = handle.startsWith('0x') ? handle : `0x${handle}`;
  } else if (handle instanceof Uint8Array) {
    formattedHandle = `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else if (Array.isArray(handle)) {
    // Handle array format
    formattedHandle = `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else {
    formattedHandle = `0x${handle.toString()}`;
  }
  
  console.log('Converted handle:', formattedHandle);
  return formattedHandle;
};

export interface AssessmentFormData {
  // Basic Information
  companyName: string;
  industry: string;
  revenue: string;
  employees: string;
  
  // Risk Factors
  businessType: string;
  riskHistory: string;
  securityMeasures: string;
  complianceLevel: string;
  
  // Coverage Details
  coverageType: string;
  coverageAmount: string;
  deductible: string;
  additionalNotes: string;
}

export const useFHEShieldSecure = () => {
  const { address } = useAccount();

  return {
    address,
    contractAddress: CONTRACT_ADDRESS,
  };
};

export const useSubmitAssessment = () => {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const { address } = useAccount();

  const submitAssessment = async (formData: AssessmentFormData, depositAmount: string) => {
    console.log('Starting submitAssessment...');
    console.log('Instance:', !!instance);
    console.log('Address:', address);
    console.log('SignerPromise:', !!signerPromise);
    
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    try {
      // Convert form data to numeric values for FHE encryption
      const revenueValue = getRevenueValue(formData.revenue);
      const employeesValue = getEmployeesValue(formData.employees);
      const industryValue = getIndustryValue(formData.industry);
      const businessTypeValue = getBusinessTypeValue(formData.businessType);
      const riskHistoryValue = getRiskHistoryValue(formData.riskHistory);
      const complianceLevelValue = getComplianceLevelValue(formData.complianceLevel);
      const coverageAmountValue = getCoverageAmountValue(formData.coverageAmount);
      const deductibleValue = getDeductibleValue(formData.deductible);

      // Create encrypted input with all assessment data
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(BigInt(revenueValue));
      input.add32(BigInt(employeesValue));
      input.add8(BigInt(industryValue));
      input.add8(BigInt(businessTypeValue));
      input.add8(BigInt(riskHistoryValue));
      input.add8(BigInt(complianceLevelValue));
      input.add32(BigInt(coverageAmountValue));
      input.add32(BigInt(deductibleValue));

      const encryptedInput = await input.encrypt();
      console.log('Encryption successful, handles:', encryptedInput.handles.length);

      console.log('Calling writeContract...');
      const depositAmountWei = BigInt(Math.floor(parseFloat(depositAmount) * 1e18));
      console.log('Deposit amount (Wei):', depositAmountWei.toString());
      console.log('inputProof type:', typeof encryptedInput.inputProof, 'isArray:', Array.isArray(encryptedInput.inputProof));
      console.log('inputProof value:', encryptedInput.inputProof);

      // Submit to contract with encrypted data
      console.log('Calling writeContract with args:', {
        address: CONTRACT_ADDRESS,
        functionName: 'submitAssessment',
        args: [
          encryptedInput.handles[0], // revenue
          encryptedInput.handles[1], // employees
          encryptedInput.handles[2], // industry
          encryptedInput.handles[3], // businessType
          encryptedInput.handles[4], // riskHistory
          encryptedInput.handles[5], // complianceLevel
          encryptedInput.handles[6], // coverageAmount
          encryptedInput.handles[7], // deductible
          encryptedInput.inputProof,
          BigInt(Math.floor(parseFloat(depositAmount) * 1e18))
        ],
        value: depositAmountWei,
      });
      
      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI.abi,
        functionName: 'submitAssessment',
        args: [
          convertHex(encryptedInput.handles[0]), // revenue
          convertHex(encryptedInput.handles[1]), // employees
          convertHex(encryptedInput.handles[2]), // industry
          convertHex(encryptedInput.handles[3]), // businessType
          convertHex(encryptedInput.handles[4]), // riskHistory
          convertHex(encryptedInput.handles[5]), // complianceLevel
          convertHex(encryptedInput.handles[6]), // coverageAmount
          convertHex(encryptedInput.handles[7]), // deductible
          convertHex(encryptedInput.inputProof), // inputProof
          BigInt(Math.floor(parseFloat(depositAmount) * 1e18))
        ],
        value: depositAmountWei,
      });
      
      console.log('writeContract result:', result);
      console.log('writeContract result type:', typeof result);
      
      // writeContract 返回的是 hash，需要等待交易确认
      if (result && typeof result === 'string') {
        console.log('Transaction hash:', result);
        return result;
      } else {
        console.log('writeContract returned unexpected result:', result);
        return result;
      }
    } catch (err) {
      console.error('FHE encryption failed:', err);
      throw err;
    }
  };

  return {
    submitAssessment,
    isLoading: isPending,
    error,
  };
};

export const useUserProfile = (userAddress?: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI.abi,
    functionName: 'getUserProfile',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    profile: data,
    isLoading,
    error,
  };
};

export const useUserAssessments = (userAddress?: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI.abi,
    functionName: 'getUserAssessments',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    assessments: data,
    isLoading,
    error,
  };
};

export const useContractStats = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI.abi,
    functionName: 'getContractStats',
  });

  return {
    stats: data,
    isLoading,
    error,
  };
};

export const useProcessAssessment = () => {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { address } = useAccount();

  const processAssessment = async (assessmentId: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI.abi,
        functionName: 'processAssessment',
        args: [assessmentId],
      });

      return result;
    } catch (err) {
      console.error('Process assessment failed:', err);
      throw err;
    }
  };

  return { processAssessment, isLoading: isPending, error };
};

export const useDecryptAssessment = () => {
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const { address } = useAccount();

  const decryptAssessment = async (assessmentId: string) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    try {
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      
      // Get the assessment details
      const assessment = await contract.getAssessment(assessmentId);
      console.log('Assessment details:', assessment);
      
      // Get encrypted assessment data
      const encryptedData = await contract.getEncryptedAssessmentData(assessmentId);
      
      // Create keypair for decryption
      const keypair = instance.generateKeypair();
      
      // Prepare handles for decryption
      const handleContractPairs = [
        { handle: encryptedData.riskScore, contractAddress: CONTRACT_ADDRESS }
      ];
      
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "7";
      const contractAddresses = [CONTRACT_ADDRESS];
      
      // Create EIP712 signature for decryption
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      
      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );
      
      console.log('Decryption parameters:', {
        handleContractPairs,
        keypair: { publicKey: keypair.publicKey, privateKey: keypair.privateKey },
        signature: signature.replace("0x", ""),
        contractAddresses,
        userAddress: address,
        startTimeStamp,
        durationDays
      });
      
      // Decrypt the risk score
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      );
      
      return {
        riskScore: result[encryptedData.riskScore],
        encryptedData
      };
    } catch (err) {
      console.error('FHE decryption failed:', err);
      throw err;
    }
  };

  return {
    decryptAssessment,
  };
};

// Helper functions to convert form data to numeric values
function getRevenueValue(revenue: string): number {
  const mapping: Record<string, number> = {
    'under-1m': 1,
    '1m-10m': 2,
    '10m-50m': 3,
    '50m-100m': 4,
    'over-100m': 5,
  };
  return mapping[revenue] || 1;
}

function getEmployeesValue(employees: string): number {
  const mapping: Record<string, number> = {
    '1-10': 1,
    '11-50': 2,
    '51-200': 3,
    '201-500': 4,
    '500+': 5,
  };
  return mapping[employees] || 1;
}

function getIndustryValue(industry: string): number {
  const mapping: Record<string, number> = {
    'technology': 1,
    'manufacturing': 2,
    'healthcare': 3,
    'finance': 4,
    'retail': 5,
    'construction': 6,
    'other': 7,
  };
  return mapping[industry] || 1;
}

function getBusinessTypeValue(businessType: string): number {
  const mapping: Record<string, number> = {
    'low-risk': 1,
    'medium-risk': 2,
    'high-risk': 3,
  };
  return mapping[businessType] || 1;
}

function getRiskHistoryValue(riskHistory: string): number {
  const mapping: Record<string, number> = {
    'none': 1,
    'minor': 2,
    'moderate': 3,
    'major': 4,
  };
  return mapping[riskHistory] || 1;
}

function getComplianceLevelValue(complianceLevel: string): number {
  const mapping: Record<string, number> = {
    'basic': 1,
    'standard': 2,
    'enhanced': 3,
    'premium': 4,
  };
  return mapping[complianceLevel] || 1;
}

function getCoverageAmountValue(coverageAmount: string): number {
  const mapping: Record<string, number> = {
    '1m': 1,
    '5m': 2,
    '10m': 3,
    '25m': 4,
    '50m': 5,
    'custom': 6,
  };
  return mapping[coverageAmount] || 1;
}

function getDeductibleValue(deductible: string): number {
  const mapping: Record<string, number> = {
    '1k': 1,
    '5k': 2,
    '10k': 3,
    '25k': 4,
    '50k': 5,
  };
  return mapping[deductible] || 1;
}
