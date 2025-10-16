import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DepositSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: number;
  asset: string;
  shares: number;
  totalShares: number;
  totalValue: number;
  apy: string;
}

export default function DepositSuccessModal({
  isOpen,
  onClose,
  depositAmount,
  asset,
  shares,
  totalShares,
  totalValue,
  apy
}: DepositSuccessModalProps) {
  const { toast } = useToast();
  
  // Mock transaction hash
  const txHash = "0x742d35ac8f2b9e1a4d8c7f3e6a9b2c5d8e1f4a7b3c6d9e2f5a8b1c4d7e0f3a6b9";
  const shortTxHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
  
  const dailyEarnings = (totalValue * parseFloat(apy) / 100 / 365).toFixed(2);
  const monthlyEarnings = (totalValue * parseFloat(apy) / 100 / 12).toFixed(2);
  const yearlyEarnings = (totalValue * parseFloat(apy) / 100).toFixed(2);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] banking-card">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-success/20 p-3 animate-scale-in">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Deposit Successful!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Transaction Hash */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm">{shortTxHash}</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(txHash)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposited</span>
                <span className="font-medium">{depositAmount.toFixed(2)} {asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Received</span>
                <span className="font-medium text-success">{shares.toFixed(2)} shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Balance</span>
                <span className="font-medium">{totalShares.toFixed(2)} shares</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Your Position */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Your Position</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vault Value</span>
                <span className="text-sm font-medium">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Daily Earnings</span>
                <span className="text-sm font-medium text-success">~${dailyEarnings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly</span>
                <span className="text-sm font-medium text-success">~${monthlyEarnings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yearly</span>
                <span className="text-sm font-medium text-success">~${yearlyEarnings}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-primary hover:bg-primary-hover"
          >
            View Portfolio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
