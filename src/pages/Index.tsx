import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnderwritingDashboard } from "@/components/UnderwritingDashboard";
import { Button } from "@/components/ui/button";
import { Shield, Lock } from "lucide-react";

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
            <span className="text-sm font-medium text-accent">FHE Protected</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              FHE Shield Secure
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Privacy-preserving financial assessment platform using Fully Homomorphic Encryption
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="fintech" 
              className="shadow-glow hover:shadow-security"
              onClick={() => navigate("/assessment")}
            >
              <Lock className="w-5 h-5 mr-2" />
              Start Assessment
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-border hover:bg-muted/50"
              onClick={() => window.open('https://www.zama.ai/', '_blank')}
            >
              Learn About FHE
            </Button>
          </div>
        </div>

        {/* Dashboard */}
        <UnderwritingDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;