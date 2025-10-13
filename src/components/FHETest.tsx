import React, { useState } from 'react';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useAccount } from 'wagmi';

const FHETest: React.FC = () => {
  const { instance, isLoading, error } = useZamaInstance();
  const { address, isConnected } = useAccount();
  const [testResult, setTestResult] = useState<string>('');

  const testFHE = async () => {
    if (!instance || !address) {
      setTestResult('FHE instance or wallet not ready');
      return;
    }

    try {
      setTestResult('Testing FHE encryption...');
      
      // 测试创建加密输入
      const input = instance.createEncryptedInput('0xD6C2588486aAaF439ABCDeA17C9896C8c5527b79', address);
      
      // 添加一些测试数据
      input.add32(BigInt(100000)); // revenue
      input.add32(BigInt(50));    // employees
      input.add8(BigInt(1));      // industry
      input.add8(BigInt(2));      // businessType
      input.add8(BigInt(3));      // riskHistory
      input.add8(BigInt(4));      // complianceLevel
      input.add32(BigInt(500000)); // coverageAmount
      input.add32(BigInt(10000));  // deductible
      
      // 加密数据
      const encrypted = await input.encrypt();
      
      setTestResult(`✅ FHE Test Successful! Encrypted ${encrypted.handles.length} handles`);
      console.log('FHE Test Result:', encrypted);
      
    } catch (err) {
      console.error('FHE Test Error:', err);
      setTestResult(`❌ FHE Test Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>🔐 FHE 功能测试</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>钱包状态:</strong> {isConnected ? '✅ 已连接' : '❌ 未连接'} {address && `(${address.slice(0, 6)}...${address.slice(-4)})`}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>FHE 状态:</strong> {
          isLoading ? '⏳ 初始化中...' : 
          error ? `❌ 错误: ${error}` : 
          instance ? '✅ 已就绪' : '❌ 未初始化'
        }
      </div>
      
      <button 
        onClick={testFHE}
        disabled={!instance || !isConnected || isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: (!instance || !isConnected || isLoading) ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: (!instance || !isConnected || isLoading) ? 'not-allowed' : 'pointer'
        }}
      >
        测试 FHE 加密
      </button>
      
      {testResult && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontFamily: 'monospace'
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default FHETest;

