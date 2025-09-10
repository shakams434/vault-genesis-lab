import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowDownUp,
  Coins,
  TrendingUp,
  Info,
  Zap,
  Shield,
  Clock,
  Vault,
  AlertCircle
} from "lucide-react";

const supportedAssets = [
  { 
    symbol: "USDC", 
    name: "USD Coin", 
    balance: "5,247.30",
    price: "$1.00",
    icon: "💵"
  },
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    balance: "2.547",
    price: "$2,432.18",
    icon: "⚡"
  },
  { 
    symbol: "WBTC", 
    name: "Wrapped Bitcoin", 
    balance: "0.123",
    price: "$43,521.90",
    icon: "₿"
  },
  { 
    symbol: "DAI", 
    name: "DAI Stablecoin", 
    balance: "1,247.89",
    price: "$0.9998",
    icon: "🏛️"
  }
];

export default function Swap() {
  const [fromAsset, setFromAsset] = useState("USDC");
  const [toAsset, setToAsset] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const { toast } = useToast();

  const fromAssetData = supportedAssets.find(asset => asset.symbol === fromAsset);
  const toAssetData = supportedAssets.find(asset => asset.symbol === toAsset);

  // Simulated exchange calculations
  const exchangeRate = fromAsset === "USDC" && toAsset === "ETH" ? 0.000411 :
                      fromAsset === "ETH" && toAsset === "USDC" ? 2432.18 :
                      fromAsset === "USDC" && toAsset === "WBTC" ? 0.0000230 :
                      fromAsset === "WBTC" && toAsset === "USDC" ? 43521.90 : 1;

  const slippage = 0.005; // 0.5%
  const fee = 0.003; // 0.3%
  
  const estimatedOutput = parseFloat(fromAmount) 
    ? ((parseFloat(fromAmount) * exchangeRate * (1 - slippage)) * (1 - fee)).toFixed(6)
    : "0.00";

  const minimumReceived = parseFloat(estimatedOutput) 
    ? (parseFloat(estimatedOutput) * 0.98).toFixed(6)
    : "0.00";

  const swapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount("");
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive"
      });
      return;
    }

    setIsSwapping(true);
    
    // Simulate swap processing
    setTimeout(() => {
      setIsSwapping(false);
      toast({
        title: "Swap completed!",
        description: `Successfully swapped ${fromAmount} ${fromAsset} for ${estimatedOutput} ${toAsset}`,
      });
      setFromAmount("");
    }, 3000);
  };

  const handleDepositToVault = () => {
    toast({
      title: "Redirecting to vaults",
      description: `Ready to deposit ${estimatedOutput} ${toAsset} into a vault`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Asset Swap
          </h1>
          <p className="text-muted-foreground">
            Exchange cryptocurrencies with competitive rates and low fees
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <Card className="banking-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Swap Assets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Asset */}
              <div className="space-y-2">
                <Label>From</Label>
                <div className="flex space-x-2">
                  <Select value={fromAsset} onValueChange={setFromAsset}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedAssets.map((asset) => (
                        <SelectItem key={asset.symbol} value={asset.symbol}>
                          <div className="flex items-center space-x-2">
                            <span>{asset.icon}</span>
                            <span>{asset.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="flex-1 text-lg h-12"
                  />
                </div>
                {fromAssetData && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Balance: {fromAssetData.balance} {fromAsset}</span>
                    <span>{fromAssetData.price}</span>
                  </div>
                )}
              </div>

              {/* Swap Direction */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapAssets}
                  className="rounded-full"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To Asset */}
              <div className="space-y-2">
                <Label>To</Label>
                <div className="flex space-x-2">
                  <Select value={toAsset} onValueChange={setToAsset}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedAssets.map((asset) => (
                        <SelectItem key={asset.symbol} value={asset.symbol}>
                          <div className="flex items-center space-x-2">
                            <span>{asset.icon}</span>
                            <span>{asset.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 h-12 bg-muted/30 rounded-md flex items-center px-3 text-lg font-medium">
                    {estimatedOutput} {toAsset}
                  </div>
                </div>
                {toAssetData && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Balance: {toAssetData.balance} {toAsset}</span>
                    <span>{toAssetData.price}</span>
                  </div>
                )}
              </div>

              {/* Swap Details */}
              {fromAmount && parseFloat(fromAmount) > 0 && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>Swap Details</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exchange Rate</span>
                      <span>1 {fromAsset} = {exchangeRate} {toAsset}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Slippage Tolerance</span>
                      <Badge variant="outline">0.5%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trading Fee</span>
                      <span>0.3%</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Minimum Received</span>
                      <span>{minimumReceived} {toAsset}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleSwap}
                  disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
                  variant="premium"
                  size="lg"
                  className="w-full"
                >
                  {isSwapping ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Swapping...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Swap {fromAsset} for {toAsset}
                    </>
                  )}
                </Button>

                {estimatedOutput !== "0.00" && (
                  <Button
                    onClick={handleDepositToVault}
                    variant="success"
                    size="lg"
                    className="w-full"
                    disabled={isSwapping}
                  >
                    <Vault className="h-4 w-4 mr-2" />
                    Deposit {estimatedOutput} {toAsset} to Vault
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Market Info */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Market Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">24h Volume</span>
                    <span className="font-medium">$47.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liquidity</span>
                    <span className="font-medium">$12.8M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Price</span>
                    <Badge variant="outline" className="text-success border-success">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Price Impact</div>
                    <div className="text-muted-foreground">Large trades may experience higher slippage</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-4 w-4 text-success mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">MEV Protection</div>
                    <div className="text-muted-foreground">Protected against front-running</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Swaps */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1,000 USDC → ETH</span>
                    <span className="text-success">+0.41 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">0.5 ETH → USDC</span>
                    <span className="text-success">+1,216 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2,500 USDC → WBTC</span>
                    <span className="text-success">+0.057 WBTC</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}