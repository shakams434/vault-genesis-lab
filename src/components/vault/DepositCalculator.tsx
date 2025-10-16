import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingUp, Info } from "lucide-react";

interface DepositCalculatorProps {
  depositAmount: string;
  maxBalance: number;
  onAmountChange: (amount: string) => void;
  sharePrice: number;
  apy: string;
  asset: string;
}

export default function DepositCalculator({
  depositAmount,
  maxBalance,
  onAmountChange,
  sharePrice,
  apy,
  asset
}: DepositCalculatorProps) {
  const amount = parseFloat(depositAmount) || 0;
  const shares = amount / sharePrice;
  const dailyReturn = (amount * parseFloat(apy) / 100 / 365);
  const monthlyReturn = (amount * parseFloat(apy) / 100 / 12);
  const yearlyReturn = (amount * parseFloat(apy) / 100);

  const handlePercentageClick = (percentage: number) => {
    const newAmount = (maxBalance * percentage / 100).toFixed(2);
    onAmountChange(newAmount);
  };

  const handleSliderChange = (value: number[]) => {
    const newAmount = (maxBalance * value[0] / 100).toFixed(2);
    onAmountChange(newAmount);
  };

  const sliderPercentage = maxBalance > 0 ? (amount / maxBalance) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Quick Percentage Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePercentageClick(25)}
          className="text-xs"
        >
          25%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePercentageClick(50)}
          className="text-xs"
        >
          50%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePercentageClick(75)}
          className="text-xs"
        >
          75%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePercentageClick(100)}
          className="text-xs"
        >
          Max
        </Button>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>{sliderPercentage.toFixed(0)}%</span>
          <span>100%</span>
        </div>
        <Slider
          value={[sliderPercentage]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Real-time Calculations */}
      {amount > 0 && (
        <div className="space-y-4 animate-fade-in">
          {/* Shares Received */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">You'll Receive</span>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-primary">
              {shares.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} shares
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              @ {sharePrice.toFixed(4)} {asset}/share
            </p>
          </div>

          {/* Expected Returns */}
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Expected Returns</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Daily</p>
                <p className="text-sm font-bold text-success">
                  ${dailyReturn.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                <p className="text-sm font-bold text-success">
                  ${monthlyReturn.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Yearly</p>
                <p className="text-sm font-bold text-success">
                  ${yearlyReturn.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-success/20">
              <p className="text-xs text-center text-muted-foreground">
                Based on current APY of <span className="font-medium text-success">{apy}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
