import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, ArrowLeft, ArrowRight, FileText, Building, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSubmitAssessment, AssessmentFormData } from "@/hooks/useContract";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useEthersSigner } from "@/hooks/useEthersSigner";

const SecureAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { submitAssessment, isLoading } = useSubmitAssessment();
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEncrypting, setIsEncrypting] = useState(false);
  
  const [formData, setFormData] = useState<AssessmentFormData>({
    // Basic Information
    companyName: "",
    industry: "",
    revenue: "",
    employees: "",
    
    // Risk Factors
    businessType: "",
    riskHistory: "",
    securityMeasures: "",
    complianceLevel: "",
    
    // Coverage Details
    coverageType: "",
    coverageAmount: "",
    deductible: "",
    additionalNotes: ""
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit the assessment",
        variant: "destructive",
      });
      return;
    }

    if (!instance) {
      toast({
        title: "FHE Service Not Ready",
        description: fheError || "FHE encryption service is initializing. Please wait...",
        variant: "destructive",
      });
      return;
    }

    setIsEncrypting(true);
    
    try {
      // Submit assessment with FHE encryption
      const depositAmount = "0.01"; // 0.01 ETH deposit
      await submitAssessment(formData, depositAmount);
      
      toast({
        title: "Assessment Encrypted & Submitted",
        description: "Your data has been FHE-encrypted and submitted to the blockchain",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Basic Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select onValueChange={(value) => handleInputChange("industry", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="revenue">Annual Revenue *</Label>
            <Select onValueChange={(value) => handleInputChange("revenue", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select revenue range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1m">Under $1M</SelectItem>
                <SelectItem value="1m-10m">$1M - $10M</SelectItem>
                <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                <SelectItem value="over-100m">Over $100M</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employees">Number of Employees *</Label>
            <Select onValueChange={(value) => handleInputChange("employees", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="500+">500+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Risk Assessment</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type *</Label>
            <Select onValueChange={(value) => handleInputChange("businessType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low-risk">Low Risk Operations</SelectItem>
                <SelectItem value="medium-risk">Medium Risk Operations</SelectItem>
                <SelectItem value="high-risk">High Risk Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="riskHistory">Claims History *</Label>
            <Select onValueChange={(value) => handleInputChange("riskHistory", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select claims history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Previous Claims</SelectItem>
                <SelectItem value="minor">Minor Claims (Under $10K)</SelectItem>
                <SelectItem value="moderate">Moderate Claims ($10K-$100K)</SelectItem>
                <SelectItem value="major">Major Claims (Over $100K)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="securityMeasures">Security Measures *</Label>
            <Textarea
              id="securityMeasures"
              value={formData.securityMeasures}
              onChange={(e) => handleInputChange("securityMeasures", e.target.value)}
              placeholder="Describe your current security measures and protocols..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="complianceLevel">Compliance Level *</Label>
            <Select onValueChange={(value) => handleInputChange("complianceLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select compliance level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Compliance</SelectItem>
                <SelectItem value="standard">Industry Standard</SelectItem>
                <SelectItem value="enhanced">Enhanced Compliance</SelectItem>
                <SelectItem value="premium">Premium Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Coverage Requirements</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverageType">Coverage Type *</Label>
            <Select onValueChange={(value) => handleInputChange("coverageType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select coverage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general-liability">General Liability</SelectItem>
                <SelectItem value="cyber-security">Cyber Security</SelectItem>
                <SelectItem value="professional-liability">Professional Liability</SelectItem>
                <SelectItem value="directors-officers">Directors & Officers</SelectItem>
                <SelectItem value="comprehensive">Comprehensive Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverageAmount">Coverage Amount *</Label>
            <Select onValueChange={(value) => handleInputChange("coverageAmount", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select coverage amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">$1 Million</SelectItem>
                <SelectItem value="5m">$5 Million</SelectItem>
                <SelectItem value="10m">$10 Million</SelectItem>
                <SelectItem value="25m">$25 Million</SelectItem>
                <SelectItem value="50m">$50 Million</SelectItem>
                <SelectItem value="custom">Custom Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deductible">Preferred Deductible *</Label>
            <Select onValueChange={(value) => handleInputChange("deductible", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select deductible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1k">$1,000</SelectItem>
                <SelectItem value="5k">$5,000</SelectItem>
                <SelectItem value="10k">$10,000</SelectItem>
                <SelectItem value="25k">$25,000</SelectItem>
                <SelectItem value="50k">$50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              placeholder="Any additional information or special requirements..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              <Shield className="w-4 h-4 mr-2" />
              FHE Protected
            </Badge>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">Secure Risk Assessment</h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Card */}
          <Card className="gradient-card border-border/50 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentStep === 1 && <Building className="w-6 h-6 text-primary" />}
                  {currentStep === 2 && <FileText className="w-6 h-6 text-accent" />}
                  {currentStep === 3 && <DollarSign className="w-6 h-6 text-warning" />}
                  <div>
                    <CardTitle>
                      {currentStep === 1 && "Company Information"}
                      {currentStep === 2 && "Risk Assessment"}
                      {currentStep === 3 && "Coverage Requirements"}
                    </CardTitle>
                    <CardDescription>
                      All data is encrypted using Fully Homomorphic Encryption during processing
                    </CardDescription>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-warning" />
              </div>
            </CardHeader>
            
            <CardContent>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              
              {/* Navigation */}
              <div className="flex justify-between pt-6 mt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    variant="fintech"
                    onClick={handleNext}
                    className="shadow-glow"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="security"
                    onClick={handleSubmit}
                    disabled={isEncrypting || isLoading || !isConnected || !instance || fheLoading}
                    className="shadow-security"
                  >
                    {isEncrypting || isLoading ? (
                      <>
                        <Lock className="w-4 h-4 mr-2 animate-pulse" />
                        {isEncrypting ? "Encrypting..." : "Submitting..."}
                      </>
                    ) : !isConnected ? (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Connect Wallet First
                      </>
                    ) : !instance || fheLoading ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Initializing FHE...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Submit Assessment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecureAssessment;