import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  DollarSign,
  Activity,
  Users,
  BarChart3,
  AlertTriangle
} from "lucide-react";

const vaultsData = [
  {
    id: "usdc-core",
    name: "USDC Core Vault",
    asset: "USDC",
    apy: "7.5%",
    tvl: "$10,247,830",
    liquidity: "$2,847,293",
    risk: "Core",
    riskLevel: 1,
    description: "Conservative vault focused on stable returns with USDC",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual",
    performance: "+1.2%",
    allocation: [
      { protocol: "Compound", percentage: 45 },
      { protocol: "Aave", percentage: 35 },
      { protocol: "Yearn", percentage: 20 }
    ]
  },
  {
    id: "eth-prime",
    name: "ETH Prime Vault",
    asset: "ETH",
    apy: "9.8%",
    tvl: "$8,721,456",
    liquidity: "$1,934,821",
    risk: "Prime", 
    riskLevel: 2,
    description: "Balanced ETH strategy with optimized yields",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual",
    performance: "+2.1%",
    allocation: [
      { protocol: "Lido", percentage: 50 },
      { protocol: "Rocket Pool", percentage: 30 },
      { protocol: "Frax", percentage: 20 }
    ]
  },
  {
    id: "btc-frontier",
    name: "BTC Frontier Vault",
    asset: "WBTC",
    apy: "12.3%",
    tvl: "$5,138,492",
    liquidity: "$1,247,583",
    risk: "Frontier",
    riskLevel: 3,
    description: "High-yield BTC strategies with elevated risk",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual",
    performance: "+3.4%",
    allocation: [
      { protocol: "Convex", percentage: 40 },
      { protocol: "Curve", percentage: 35 },
      { protocol: "Balancer", percentage: 25 }
    ]
  },
  {
    id: "multi-core",
    name: "Multi-Asset Core",
    asset: "Multi",
    apy: "8.1%",
    tvl: "$12,954,721",
    liquidity: "$3,429,184",
    risk: "Core",
    riskLevel: 1,
    description: "Diversified portfolio across multiple stable assets",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual",
    performance: "+1.8%",
    allocation: [
      { protocol: "USDC Pool", percentage: 40 },
      { protocol: "DAI Pool", percentage: 30 },
      { protocol: "USDT Pool", percentage: 30 }
    ]
  },
  {
    id: "defi-prime",
    name: "DeFi Prime Vault",
    asset: "Mixed",
    apy: "11.7%",
    tvl: "$6,742,891",
    liquidity: "$1,587,392",
    risk: "Prime",
    riskLevel: 2,
    description: "Optimized DeFi protocol strategies",
    curator: "Gauntlet Risk", 
    guardian: "Nexus Mutual",
    performance: "+2.7%",
    allocation: [
      { protocol: "Uniswap V3", percentage: 35 },
      { protocol: "SushiSwap", percentage: 30 },
      { protocol: "1inch", percentage: 35 }
    ]
  },
  {
    id: "yield-frontier",
    name: "Yield Frontier",
    asset: "Various",
    apy: "15.2%",
    tvl: "$3,287,456",
    liquidity: "$847,291",
    risk: "Frontier",
    riskLevel: 3,
    description: "Experimental high-yield farming strategies",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual", 
    performance: "+4.1%",
    allocation: [
      { protocol: "GMX", percentage: 40 },
      { protocol: "Radiant", percentage: 30 },
      { protocol: "Gains", percentage: 30 }
    ]
  }
];

export default function Vaults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState("apy");

  const filteredVaults = vaultsData
    .filter(vault => {
      const matchesSearch = vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vault.asset.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "all" || vault.risk.toLowerCase() === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "apy":
          return parseFloat(b.apy) - parseFloat(a.apy);
        case "tvl":
          return parseFloat(b.tvl.replace(/[$,]/g, "")) - parseFloat(a.tvl.replace(/[$,]/g, ""));
        case "risk":
          return a.riskLevel - b.riskLevel;
        default:
          return 0;
      }
    });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Core": return "bg-success/20 text-success border-success/30";
      case "Prime": return "bg-warning/20 text-warning border-warning/30";  
      case "Frontier": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Core": return <Shield className="h-3 w-3" />;
      case "Prime": return <BarChart3 className="h-3 w-3" />;
      case "Frontier": return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Investment Vaults
          </h1>
          <p className="text-muted-foreground">
            Explore curated investment strategies across different risk profiles
          </p>
        </div>

        {/* Filters */}
        <Card className="banking-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vaults..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="core">Core (Low Risk)</SelectItem>
                  <SelectItem value="prime">Prime (Medium Risk)</SelectItem>
                  <SelectItem value="frontier">Frontier (High Risk)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apy">Sort by APY</SelectItem>
                  <SelectItem value="tvl">Sort by TVL</SelectItem>
                  <SelectItem value="risk">Sort by Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vaults Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault) => (
            <Card key={vault.id} className="banking-card hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{vault.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{vault.description}</p>
                  </div>
                  <Badge className={`${getRiskColor(vault.risk)} border`}>
                    {getRiskIcon(vault.risk)}
                    <span className="ml-1">{vault.risk}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-xl font-bold text-primary">{vault.apy}</div>
                    <div className="text-xs text-muted-foreground">APY</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-lg font-semibold text-foreground">{vault.performance}</div>
                    <div className="text-xs text-muted-foreground">7d Performance</div>
                  </div>
                </div>

                {/* Vault Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      TVL
                    </span>
                    <span className="font-medium">{vault.tvl}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      Liquidity
                    </span>
                    <span className="font-medium">{vault.liquidity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Curator
                    </span>
                    <span className="font-medium">{vault.curator}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/vault/${vault.id}`}>
                  <Button variant="outline" className="w-full group">
                    View Details
                    <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredVaults.length === 0 && (
          <Card className="banking-card">
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No vaults found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setRiskFilter("all");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}