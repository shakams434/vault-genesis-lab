import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Wallet,
  Shield,
  Vault,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  BarChart3,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const userMetrics = [
    {
      title: "Total Portfolio Value",
      value: "$12,847.50",
      change: "+$247.38 (1.96%)",
      changeType: "positive" as const,
      icon: <Wallet className="h-4 w-4" />
    },
    {
      title: "Daily Earnings",
      value: "$23.45",
      change: "+12.3% vs yesterday",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "Active Vaults",
      value: "3",
      subtitle: "Core (2) • Prime (1)",
      icon: <Shield className="h-4 w-4" />
    },
    {
      title: "Average APY",
      value: "8.24%",
      change: "+0.15% this week",
      changeType: "positive" as const,
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

  const topVaults = [
    {
      name: "USDC Core Vault",
      apy: "7.5%",
      risk: "Core",
      tvl: "$10.2M",
      userBalance: "$5,247.30",
      change: "+1.2%"
    },
    {
      name: "ETH Prime Vault",
      apy: "9.8%", 
      risk: "Prime",
      tvl: "$8.7M",
      userBalance: "$4,200.15",
      change: "+2.1%"
    },
    {
      name: "BTC Frontier Vault",
      apy: "12.3%",
      risk: "Frontier", 
      tvl: "$5.1M",
      userBalance: "$3,400.05",
      change: "+3.4%"
    }
  ];

  const quickActions = [
    {
      title: "Add Funds",
      description: "Deposit fiat to USDC",
      icon: <ArrowDownRight className="h-5 w-5" />,
      link: "/onramp",
      variant: "success" as const
    },
    {
      title: "Swap Assets", 
      description: "Exchange cryptocurrencies",
      icon: <Activity className="h-5 w-5" />,
      link: "/swap",
      variant: "default" as const
    },
    {
      title: "Browse Vaults",
      description: "Explore investment options",
      icon: <Vault className="h-5 w-5" />,
      link: "/vaults",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Alex
          </h1>
          <p className="text-muted-foreground">
            Your portfolio is performing well with a 8.24% average APY
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="banking-card hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Vaults */}
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Vaults</span>
                <Link to="/vaults">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topVaults.map((vault, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{vault.name}</h4>
                      <Badge 
                        variant={vault.risk === "Core" ? "outline" : vault.risk === "Prime" ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {vault.risk}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">TVL: {vault.tvl}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-foreground">{vault.userBalance}</div>
                    <div className="text-sm text-success">{vault.change}</div>
                    <div className="text-xs text-muted-foreground">APY: {vault.apy}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Chart Placeholder */}
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Portfolio Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Performance chart</p>
                  <p className="text-xs text-muted-foreground">Historical data visualization</p>
                </div>
              </div>
              
              {/* Recent Performance Metrics */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-success/10">
                  <div className="text-lg font-semibold text-success">+18.7%</div>
                  <div className="text-xs text-muted-foreground">30 Days</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-lg font-semibold text-primary">+127.3%</div>
                  <div className="text-xs text-muted-foreground">1 Year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}