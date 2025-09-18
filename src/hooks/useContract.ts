import { useContract, useContractRead, useContractWrite, useAccount } from 'wagmi';
import { FHEShieldSecureABI } from '../lib/contractABI';

const CONTRACT_ADDRESS = '0x...'; // Replace with deployed contract address

export const useFHEShieldSecure = () => {
  const { address } = useAccount();
  
  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: FHEShieldSecureABI,
  });

  return {
    contract,
    address,
  };
};

export const useSubmitAssessment = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: FHEShieldSecureABI,
    functionName: 'submitAssessment',
  });

  return {
    submitAssessment: write,
    isLoading,
    error,
  };
};

export const useUserProfile = (userAddress?: string) => {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: FHEShieldSecureABI,
    functionName: 'getUserProfile',
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  });

  return {
    profile: data,
    isLoading,
    error,
  };
};

export const useUserAssessments = (userAddress?: string) => {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: FHEShieldSecureABI,
    functionName: 'getUserAssessments',
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  });

  return {
    assessments: data,
    isLoading,
    error,
  };
};

export const useContractStats = () => {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: FHEShieldSecureABI,
    functionName: 'getContractStats',
  });

  return {
    stats: data,
    isLoading,
    error,
  };
};
