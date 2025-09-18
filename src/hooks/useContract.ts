import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { FHEShieldSecureABI } from '../lib/contractABI';

const CONTRACT_ADDRESS = '0x...'; // Replace with deployed contract address

export const useFHEShieldSecure = () => {
  const { address } = useAccount();

  return {
    address,
    contractAddress: CONTRACT_ADDRESS,
  };
};

export const useSubmitAssessment = () => {
  const { writeContract, isPending, error } = useWriteContract();

  const submitAssessment = async (args: any) => {
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: FHEShieldSecureABI,
      functionName: 'submitAssessment',
      args: args.args,
      value: args.value,
    });
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
    abi: FHEShieldSecureABI,
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
    abi: FHEShieldSecureABI,
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
    abi: FHEShieldSecureABI,
    functionName: 'getContractStats',
  });

  return {
    stats: data,
    isLoading,
    error,
  };
};
