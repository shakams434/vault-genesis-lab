import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, AlertCircle } from "lucide-react";

interface DepositPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  depositAmount: number;
  asset: string;
  shares: number;
  sharePrice: number;
  performanceFee: string;
  apy: string;
  vaultName: string;
}

export default function DepositPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  depositAmount,
  asset,
  shares,
  sharePrice,
  performanceFee,
  apy,
  vaultName
}: DepositPreviewModalProps) {
  const yearlyEarnings = (depositAmount * parseFloat(apy) / 100).toFixed(2);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] banking-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Deposit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* You Deposit */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">You Deposit</p>
            <p className="text-3xl font-bold">
              {depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {asset}
            </p>
          </div>

          <Separator />

          {/* You Receive */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">You Receive</p>
            <p className="text-2xl font-bold text-success">
              {shares.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Vault Shares
            </p>
          </div>

          <Separator />

          {/* Exchange Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Exchange Rate</p>
              <p className="font-medium">1 share = {sharePrice.toFixed(4)} {asset}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Performance Fee</p>
              <p className="font-medium">{performanceFee}</p>
            </div>
          </div>

          <Separator />

          {/* Estimated Returns */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Estimated APY</p>
                <p className="text-2xl font-bold text-success">{apy}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ ${yearlyEarnings}/year
                </p>
              </div>
            </div>
          </div>

          {/* Redemption Period Warning */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">Redemption Period: 3 days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deposited funds will be subject to a 3-day redemption period before withdrawal
                </p>
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
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-success hover:bg-success/90 text-white"
          >
            Confirm Deposit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
