import { Shield, Wallet } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="FHE Shield Secure Logo" 
                className="w-10 h-10 animate-pulse-glow"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FHE Shield Secure
              </h1>
              <p className="text-sm text-muted-foreground">
                Privacy-Preserving Financial Assessment
              </p>
            </div>
          </div>

          {/* Security Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">FHE Encrypted</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};