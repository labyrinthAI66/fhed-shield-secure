import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText, TrendingUp, AlertCircle, RefreshCw, Unlock } from "lucide-react";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import contractABI from "@/lib/contractABI.json";
import { useDecryptAssessment } from "@/hooks/useContract";
import { useToast } from "@/hooks/use-toast";

const CONTRACT_ADDRESS = '0xD6C2588486aAaF439ABCDeA17C9896C8c5527b79';

export const UnderwritingDashboard = () => {
  const { address } = useAccount();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const { decryptAssessment } = useDecryptAssessment();

  // 获取合约统计信息
  const { data: contractStats } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI.abi,
    functionName: 'getContractStats',
  });

  // 获取总评估数量
  const { data: totalAssessments } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI.abi,
    functionName: 'totalAssessments',
  });

  useEffect(() => {
    // 直接测试合约调用
    const testContract = async () => {
      if (!address) return;
      
      try {
        console.log('Testing contract calls...');
        console.log('Contract address:', CONTRACT_ADDRESS);
        console.log('User address:', address);
        
        // 测试 getUserAssessments
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
        
        console.log('Calling getUserAssessments...');
        const userAssessments = await contract.getUserAssessments(address);
        console.log('getUserAssessments result:', userAssessments);
        console.log('getUserAssessments length:', userAssessments.length);
        console.log('getUserAssessments type:', typeof userAssessments);
        console.log('getUserAssessments array:', Array.from(userAssessments));
        
        // 测试 totalAssessments
        const totalAssessments = await contract.totalAssessments();
        console.log('totalAssessments:', totalAssessments.toString());
        
        // 测试 getContractStats
        const stats = await contract.getContractStats();
        console.log('getContractStats:', stats);
        
        if (userAssessments && userAssessments.length > 0) {
          console.log('Found assessments:', userAssessments.length);
          setAssessments(userAssessments.map((id: string, index: number) => ({
            id: id,
            user: address,
            timestamp: Date.now() / 1000,
            isProcessed: true,
            isApproved: false,
            depositAmount: '10000000000000000',
          })));
        } else {
          console.log('No assessments found');
          setAssessments([]);
        }
      } catch (error) {
        console.error('Contract test failed:', error);
        setAssessments([]);
      }
    };
    
    testContract();
  }, [address]);

  const handleRefresh = async () => {
    setLoading(true);
    // 简单刷新
    window.location.reload();
    setLoading(false);
  };


  const handleDecrypt = async (assessmentId: string) => {
    if (!assessmentId) return;
    
    setDecrypting(assessmentId);
    try {
      const result = await decryptAssessment(assessmentId);
      setDecryptedData(prev => ({
        ...prev,
        [assessmentId]: result
      }));
      
      toast({
        title: "Decryption Successful",
        description: "Assessment data has been decrypted",
      });
    } catch (error) {
      console.error('Decryption failed:', error);
      toast({
        title: "Decryption Failed",
        description: error instanceof Error ? error.message : "An error occurred during decryption",
        variant: "destructive",
      });
    } finally {
      setDecrypting(null);
    }
  };

  const metrics = [
    {
      title: "My Assessments",
      value: assessments.length.toString(),
      change: "submitted",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Decrypted",
      value: Object.keys(decryptedData).length.toString(),
      change: "viewable",
      icon: Unlock,
      color: "text-green-500",
    },
    {
      title: "Encrypted",
      value: (assessments.length - Object.keys(decryptedData).length).toString(),
      change: "locked",
      icon: Lock,
      color: "text-warning",
    },
    {
      title: "Total Assessments",
      value: totalAssessments ? totalAssessments.toString() : "0",
      change: "all time",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="gradient-card border-border/50 shadow-card transition-smooth hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className={`text-xs ${metric.color}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Assessment Table */}
      <Card className="gradient-card border-border/50 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent" />
                <span>My Assessments</span>
              </CardTitle>
              <CardDescription>
                Assessment data protected by FHE encryption, click to decrypt and view details
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">No Assessment Data</p>
              <p className="text-sm">Submit your first assessment to see it here</p>
            </div>
          ) : (
            assessments.map((assessment, index) => (
              <div
                key={assessment.id || index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 transition-smooth hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {assessment.id ? `Assessment ${assessment.id.slice(0, 8)}...` : `Assessment #${index + 1}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {assessment.user ? `${assessment.user.slice(0, 6)}...${assessment.user.slice(-4)}` : 'Unknown User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(Number(assessment.timestamp) * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">
                      {assessment.depositAmount ? `${(Number(assessment.depositAmount) / 1e18).toFixed(4)} ETH` : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">Deposit</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">
                      {assessment.isProcessed ? 'Processed' : 'Pending'}
                    </div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </div>
                  
                  <Badge 
                    variant={assessment.isProcessed ? "secondary" : "outline"}
                    className="min-w-[80px]"
                  >
                    {assessment.isProcessed ? "Completed" : "Encrypted"}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    {decryptedData[assessment.id] ? (
                      <div className="flex items-center space-x-2">
                        <Unlock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">Decrypted</span>
                        <div className="text-xs text-muted-foreground">
                          Risk Score: {decryptedData[assessment.id]?.riskScore || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-warning" />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDecrypt(assessment.id)}
                          disabled={decrypting === assessment.id}
                          className="text-primary hover:text-primary-glow"
                        >
                          {decrypting === assessment.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Decrypting...
                            </>
                          ) : (
                            "Decrypt & View"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};