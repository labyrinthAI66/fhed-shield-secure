import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText, TrendingUp, AlertCircle } from "lucide-react";

export const UnderwritingDashboard = () => {
  const riskProfiles = [
    {
      id: "UW-2024-001",
      applicant: "Corporate Entity Alpha",
      riskLevel: "Low",
      premium: "$2,450",
      status: "encrypted",
      confidence: 94,
    },
    {
      id: "UW-2024-002", 
      applicant: "Tech Startup Beta",
      riskLevel: "Medium",
      premium: "$3,200",
      status: "encrypted",
      confidence: 87,
    },
    {
      id: "UW-2024-003",
      applicant: "Manufacturing Corp",
      riskLevel: "High",
      premium: "$5,100",
      status: "finalized",
      confidence: 91,
    },
  ];

  const metrics = [
    {
      title: "Total Applications",
      value: "127",
      change: "+12%",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Risk Score Avg",
      value: "7.2",
      change: "+0.3",
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Encrypted Cases",
      value: "84",
      change: "secure",
      icon: Lock,
      color: "text-warning",
    },
    {
      title: "Active Reviews",
      value: "23",
      change: "-5%",
      icon: AlertCircle,
      color: "text-destructive",
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
                <span>Risk Assessment Queue</span>
              </CardTitle>
              <CardDescription>
                Underwriting data protected by Fully Homomorphic Encryption
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              FHE Protected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskProfiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 transition-smooth hover:bg-muted/50"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{profile.id}</span>
                  <span className="text-sm text-muted-foreground">{profile.applicant}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">{profile.premium}</div>
                  <div className="text-xs text-muted-foreground">Premium</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">{profile.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
                
                <Badge 
                  variant={profile.riskLevel === "Low" ? "secondary" : profile.riskLevel === "Medium" ? "outline" : "destructive"}
                  className="min-w-[60px]"
                >
                  {profile.riskLevel}
                </Badge>
                
                <div className="flex items-center space-x-2">
                  {profile.status === "encrypted" ? (
                    <Lock className="w-4 h-4 text-warning" />
                  ) : (
                    <Eye className="w-4 h-4 text-accent" />
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-primary hover:text-primary-glow"
                  >
                    {profile.status === "encrypted" ? "Decrypt" : "Review"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};