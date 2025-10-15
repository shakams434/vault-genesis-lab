import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/hooks/useUserStore";
import { useToast } from "@/hooks/use-toast";
import DepositPreviewModal from "@/components/vault/DepositPreviewModal";
import DepositSuccessModal from "@/components/vault/DepositSuccessModal";
import DepositCalculator from "@/components/vault/DepositCalculator";
import {
  ArrowLeft,
  DollarSign,
  Activity,
  TrendingUp,
  Shield,
  Users,
  Vault,
  ExternalLink,
  Copy,
  Coins,
  Wallet,
  Loader2,
  CheckCircle2
} from "lucide-react";

const vaultsData = [
  {
    id: "usdc-core",
    name: "USDC Core Vault",
    asset: "USDC",
    apy: "7.5%",
    tvl: "$10,247,830",
    availableLiquidity: "$2,847,293",
    risk: "Core",
    riskLevel: 1,
    description: "Conservative vault focused on stable returns with USDC",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual",
    performanceFee: "10.00%",
    feeRecipient: "Compound DAO",
    owner: "Compound DAO",
    vaultAddress: "0xF5C8...3cCF",
    guardianAddress: "0x8Ab7...F6e5",
    allocation: [
      { protocol: "wsETH / WETH", percentage: 93.15, apy: "3.56%", totalSupply: "$22.93M", icon: "⚡" },
      { protocol: "WBTC / WETH", percentage: 5.08, apy: "1.98%", totalSupply: "$1.25M", icon: "₿" },
      { protocol: "WETH (idle)", percentage: 1.78, apy: "0.00%", totalSupply: "$436.95K", icon: "⚡" }
    ]
  },
  {
    id: "eth-prime",
    name: "ETH Prime Vault",
    asset: "ETH",
    apy: "9.8%",
    tvl: "$8,721,456",
    availableLiquidity: "$1,934,821",
    risk: "Prime", 
    riskLevel: 2,
    description: "Balanced ETH strategy with optimized yields",
    curator: "Gauntlet Risk",
    guardian: "Nexus Mutual",
    performanceFee: "10.00%",
    feeRecipient: "Compound DAO",
    owner: "Compound DAO",
    vaultAddress: "0x8F2A...9dE1",
    guardianAddress: "0x8Ab7...F6e5",
    allocation: [
      { protocol: "Lido Staking", percentage: 50, apy: "4.2%", totalSupply: "$4.36M", icon: "🔷" },
      { protocol: "Rocket Pool", percentage: 30, apy: "4.8%", totalSupply: "$2.62M", icon: "🚀" },
      { protocol: "Frax ETH", percentage: 20, apy: "5.1%", totalSupply: "$1.74M", icon: "💎" }
    ]
  }
];

type DepositState = 'idle' | 'preview' | 'approving' | 'depositing' | 'success';

export default function VaultDetail() {
  const { id } = useParams();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [depositState, setDepositState] = useState<DepositState>('idle');
  const [isApproved, setIsApproved] = useState(false);
  const { assets, depositToVault, vaultPositions } = useUserStore();
  const { toast } = useToast();

  const vault = vaultsData.find(v => v.id === id);
  const userAsset = assets.find(asset => asset.symbol === vault?.asset);
  const userPosition = vaultPositions.find(p => p.vaultId === id);
  
  // Calculate share price (simulating dynamic share price)
  const sharePrice = 1.0149;
  const shares = parseFloat(depositAmount) / sharePrice || 0;

  if (!vault) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vault not found</h1>
          <Link to="/vaults">
            <Button variant="outline">Back to Vaults</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInitiateDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive"
      });
      return;
    }

    if (!userAsset || userAsset.balance < parseFloat(depositAmount)) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${vault.asset}`,
        variant: "destructive"
      });
      return;
    }

    // Open preview modal
    setDepositState('preview');
  };

  const handleApprove = async () => {
    setDepositState('approving');
    
    // Simulate approval transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsApproved(true);
    toast({
      title: "Approval successful!",
      description: `${vault.asset} spending approved`,
    });
    
    setDepositState('preview');
  };

  const handleConfirmDeposit = async () => {
    setDepositState('depositing');
    
    // Simulate deposit transaction
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Execute the deposit
    depositToVault(
      vault.id,
      vault.name,
      vault.asset,
      parseFloat(depositAmount),
      shares,
      sharePrice,
      parseFloat(vault.apy),
      vault.risk
    );

    setDepositState('success');
    setIsApproved(false);
  };

  const handleCloseSuccess = () => {
    setDepositState('idle');
    setDepositAmount("");
  };

  const handleClosePreview = () => {
    setDepositState('idle');
  };

  const handleWithdraw = () => {
    if (!walletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdraw successful!",
      description: `Successfully withdrawn ${withdrawAmount} ${vault.asset}`,
    });

    setWithdrawAmount("");
  };

  const connectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(true);
    toast({
      title: "Wallet connected",
      description: "MetaMask wallet connected successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address copied successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/vaults" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vaults
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {vault.name}
          </h1>
          <p className="text-muted-foreground">
            {vault.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Metrics */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{vault.tvl}</p>
                    <p className="text-sm text-muted-foreground">Total Deposits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{vault.availableLiquidity}</p>
                    <p className="text-sm text-muted-foreground">Available Liquidity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{vault.apy}</p>
                    <p className="text-sm text-muted-foreground">APY</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Allocation */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle>Market Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <span>Market</span>
                    <span>Allocation</span>
                    <span>Total Supply</span>
                    <span>Supply APY</span>
                  </div>
                  {vault.allocation.map((allocation, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{allocation.icon}</span>
                        <span className="font-medium">{allocation.protocol}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">{allocation.percentage}%</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${allocation.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm font-medium">{allocation.totalSupply}</div>
                      <div className="text-sm font-medium text-success">{allocation.apy}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vault Info */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle>Vault Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Performance Fee</p>
                    <p className="font-medium">{vault.performanceFee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fee Recipient</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{vault.feeRecipient}</p>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Owner</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{vault.owner}</p>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Vault Address</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium font-mono text-xs">{vault.vaultAddress}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(vault.vaultAddress)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Curator</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{vault.curator}</p>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Guardian</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium font-mono text-xs">{vault.guardianAddress}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(vault.guardianAddress)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deposit/Withdraw Panel */}
          <div className="space-y-6">
            {/* Wallet Connect Button */}
            {!walletConnected && (
              <Button
                onClick={connectWallet}
                className="w-full"
                size="lg"
                variant="premium"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            )}

            {walletConnected && (
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">0x8F2A...9dE1</span>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  Connected
                </Badge>
              </div>
            )}

            <Card className="banking-card border-primary/20">
              <CardContent className="p-0">
                <Tabs defaultValue="deposit" className="w-full">
                  <div className="p-6 pb-4">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                      <TabsTrigger 
                        value="deposit"
                        className="data-[state=active]:bg-success data-[state=active]:text-white"
                      >
                        Deposit
                      </TabsTrigger>
                      <TabsTrigger 
                        value="withdraw"
                        className="data-[state=inactive]:text-muted-foreground"
                      >
                        Withdraw
                      </TabsTrigger>
                    </TabsList>
                  </div>

                   <TabsContent value="deposit" className="px-6 pb-6 space-y-4 mt-0">
                     <p className="text-xs text-muted-foreground">
                       Deposited funds are subject to a 3 days redemption period
                     </p>

                     <div className="space-y-2">
                       <div className="flex items-center justify-between text-sm">
                         <span className="text-muted-foreground">Amount</span>
                         <span className="text-muted-foreground">
                           Max: <span className="font-medium">{userAsset ? userAsset.balance.toFixed(2) : "0.00"}</span>
                         </span>
                       </div>
                       
                       <div className="relative">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                           <Coins className="h-5 w-5 text-primary" />
                           <span className="font-medium">{vault.asset}</span>
                         </div>
                         <Input
                           type="number"
                           placeholder="0.00"
                           value={depositAmount}
                           onChange={(e) => setDepositAmount(e.target.value)}
                           disabled={!walletConnected}
                           className="text-lg h-14 pl-24 pr-4 bg-background/50"
                         />
                       </div>
                     </div>

                     {/* Real-time Calculator */}
                     <DepositCalculator
                       depositAmount={depositAmount}
                       maxBalance={userAsset?.balance || 0}
                       onAmountChange={setDepositAmount}
                       sharePrice={sharePrice}
                       apy={vault.apy}
                       asset={vault.asset}
                     />

                     <div className="flex items-center justify-between py-3 border-t border-border/50">
                       <span className="text-sm text-muted-foreground">Balance</span>
                       <div className="flex items-center space-x-2">
                         <span className="text-sm font-medium">
                           {userAsset ? userAsset.balance.toFixed(2) : "0.00"}
                         </span>
                         <Coins className="h-4 w-4 text-primary" />
                       </div>
                     </div>

                     {userPosition && (
                       <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                         <p className="text-xs text-muted-foreground mb-2">Your Current Position</p>
                         <div className="flex items-center justify-between">
                           <div>
                             <p className="text-sm font-medium">{userPosition.shares.toFixed(2)} shares</p>
                             <p className="text-xs text-muted-foreground">${userPosition.value.toFixed(2)}</p>
                           </div>
                           {parseFloat(depositAmount) > 0 && (
                             <div className="text-right">
                               <p className="text-xs text-muted-foreground">After deposit →</p>
                               <p className="text-sm font-bold text-success">
                                 {(userPosition.shares + shares).toFixed(2)} shares
                               </p>
                               <p className="text-xs text-muted-foreground">
                                 ${(userPosition.value + parseFloat(depositAmount)).toFixed(2)}
                               </p>
                             </div>
                           )}
                         </div>
                       </div>
                     )}

                     <Button
                       onClick={handleInitiateDeposit}
                       disabled={!walletConnected || !depositAmount || parseFloat(depositAmount) <= 0}
                       className="w-full bg-success hover:bg-success/90 text-white"
                       size="lg"
                     >
                       {!walletConnected ? "Connect Wallet" : "Review Deposit"}
                     </Button>
                   </TabsContent>

                  <TabsContent value="withdraw" className="px-6 pb-6 space-y-4 mt-0">
                    <p className="text-xs text-muted-foreground">
                      Withdrawals are processed within 3 business days
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="text-muted-foreground">
                          Max: <span className="font-medium">0.00</span>
                        </span>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                          <Coins className="h-5 w-5 text-primary" />
                          <span className="font-medium">{vault.asset}</span>
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          disabled={!walletConnected}
                          className="text-lg h-14 pl-24 pr-4 bg-background/50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">0.00</span>
                        <Coins className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    <Button
                      onClick={handleWithdraw}
                      disabled={!walletConnected || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                      className="w-full"
                      size="lg"
                      variant="outline"
                    >
                      {!walletConnected ? "Connect Wallet" : "Withdraw"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Position Summary */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle>Position Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-medium">
                    {userAsset ? userAsset.balance.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APY</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-success">{vault.apy}</span>
                    <TrendingUp className="h-3 w-3 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {depositState === 'preview' && (
        <DepositPreviewModal
          isOpen={true}
          onClose={handleClosePreview}
          onConfirm={isApproved ? handleConfirmDeposit : handleApprove}
          depositAmount={parseFloat(depositAmount)}
          asset={vault.asset}
          shares={shares}
          sharePrice={sharePrice}
          performanceFee={vault.performanceFee}
          apy={vault.apy}
          vaultName={vault.name}
        />
      )}

      {/* Approving/Depositing Overlay */}
      {(depositState === 'approving' || depositState === 'depositing') && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="banking-card p-8 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {depositState === 'approving' ? 'Approving Token...' : 'Processing Deposit...'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {depositState === 'approving' 
                    ? `Approving ${vault.asset} for vault deposit` 
                    : 'Confirming your transaction on the blockchain'}
                </p>
              </div>
              {depositState === 'depositing' && (
                <div className="pt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Token Approved</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Depositing to Vault</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {depositState === 'success' && userPosition && (
        <DepositSuccessModal
          isOpen={true}
          onClose={handleCloseSuccess}
          depositAmount={parseFloat(depositAmount)}
          asset={vault.asset}
          shares={shares}
          totalShares={userPosition.shares}
          totalValue={userPosition.value}
          apy={vault.apy}
        />
      )}
    </div>
  );
}