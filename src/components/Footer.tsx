import { PieChart } from "lucide-react";

export const Footer = () => {
  const segments = [
    { name: "Approved", value: 45, color: "text-accent" },
    { name: "Pending", value: 30, color: "text-primary" },
    { name: "Review", value: 15, color: "text-warning" },
    { name: "Declined", value: 10, color: "text-destructive" },
  ];

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Rotating Chart Animation */}
          <div className="relative mb-6 md:mb-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <PieChart className="w-8 h-8 text-primary animate-rotate" />
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Risk Analytics</h3>
                <p className="text-sm text-muted-foreground">Real-time underwriting metrics</p>
              </div>
            </div>
          </div>

          {/* Segments Display */}
          <div className="flex flex-wrap gap-4 md:gap-6">
            {segments.map((segment, index) => (
              <div 
                key={segment.name}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-3 h-3 rounded-full bg-current ${segment.color}`}></div>
                <span className="text-sm font-medium">{segment.name}</span>
                <span className="text-xs text-muted-foreground">{segment.value}%</span>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right mt-6 md:mt-0">
            <p className="text-sm text-muted-foreground">
              © 2024 FHE Insurance Platform
            </p>
            <p className="text-xs text-muted-foreground">
              Secured by Fully Homomorphic Encryption
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};