import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnderwritingDashboard } from "@/components/UnderwritingDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Database, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Shield className="w-4 h-4 text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Fully Homomorphic Encryption Protected</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Underwriting Protected by FHE
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Revolutionary insurance underwriting platform that keeps risk assessment data encrypted 
            until finalized, preventing data leaks and ensuring maximum security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="fintech" 
              className="shadow-glow hover:shadow-security"
              onClick={() => navigate("/assessment")}
            >
              <Lock className="w-5 h-5 mr-2" />
              Start Secure Assessment
            </Button>
            <Button variant="outline" size="lg" className="border-border hover:bg-muted/50">
              Learn About FHE
            </Button>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="gradient-card border-border/50 shadow-card text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Encrypted Processing</CardTitle>
              <CardDescription>
                All risk data remains encrypted during computation
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="gradient-card border-border/50 shadow-card text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Zero Data Leaks</CardTitle>
              <CardDescription>
                Sensitive information never exposed during analysis
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="gradient-card border-border/50 shadow-card text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-security rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Regulatory Compliant</CardTitle>
              <CardDescription>
                Meets all privacy and security requirements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Dashboard */}
        <UnderwritingDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;