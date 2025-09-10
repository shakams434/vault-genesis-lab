import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/hooks/useUserStore";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Activity,
  Coins,
  Vault,
  ArrowUpRight
} from "lucide-react";

export default function Portfolio() {
  const { assets, vaultPositions, totalBalance } = useUserStore();

  const totalAssetValue = assets.reduce((total, asset) => total + (asset.balance * asset.price), 0);
  const totalVaultValue = vaultPositions.reduce((total, position) => total + position.value, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Portfolio
          </h1>
          <p className="text-muted-foreground">
            Overview of your assets and vault positions
          </p>
        </div>

        {/* Total Balance */}
        <Card className="banking-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-foreground">${totalBalance.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary">${totalAssetValue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Liquid Assets</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-success">${totalVaultValue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">In Vaults</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets */}
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5" />
                  <span>Your Assets</span>
                </div>
                <Link to="/swap">
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Swap
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assets.filter(asset => asset.balance > 0).length > 0 ? (
                assets
                  .filter(asset => asset.balance > 0)
                  .map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{asset.icon}</div>
                        <div>
                          <h4 className="font-medium text-foreground">{asset.symbol}</h4>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {asset.balance.toFixed(6)} {asset.symbol}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${(asset.balance * asset.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assets yet</h3>
                  <p className="text-muted-foreground mb-4">Add funds to get started</p>
                  <Link to="/onramp">
                    <Button variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Add Funds
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vault Positions */}
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Vault className="h-5 w-5" />
                  <span>Vault Positions</span>
                </div>
                <Link to="/vaults">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Browse Vaults
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vaultPositions.length > 0 ? (
                vaultPositions.map((position) => (
                  <div key={position.vaultId} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{position.vaultName}</h4>
                        <Badge 
                          variant={position.risk === "Core" ? "outline" : position.risk === "Prime" ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {position.risk}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {position.amount.toFixed(6)} {position.asset}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-foreground">${position.value.toFixed(2)}</div>
                      <div className="text-sm text-success">{position.apy}% APY</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Vault className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No vault positions</h3>
                  <p className="text-muted-foreground mb-4">Start earning yield on your assets</p>
                  <Link to="/vaults">
                    <Button variant="outline">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Explore Vaults
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}