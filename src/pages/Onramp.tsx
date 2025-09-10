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
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Banknote,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Onramp() {
  const [mode, setMode] = useState<"onramp" | "offramp">("onramp");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const exchangeRate = 0.9995; // Simulated rate USD -> USDC
  const fees = {
    platform: "0.5%",
    network: "$2.50",
    total: parseFloat(amount) ? (parseFloat(amount) * 0.005 + 2.5).toFixed(2) : "0.00"
  };

  const estimatedOutput = parseFloat(amount) 
    ? ((parseFloat(amount) - parseFloat(fees.total)) * exchangeRate).toFixed(2)
    : "0.00";

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Transaction completed!",
        description: mode === "onramp" 
          ? `Successfully converted $${amount} to ${estimatedOutput} USDC`
          : `Successfully converted ${amount} USDC to $${estimatedOutput}`,
      });
      setAmount("");
    }, 3000);
  };

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="h-4 w-4" />, fee: "0.5%" },
    { id: "bank", name: "Bank Transfer", icon: <Banknote className="h-4 w-4" />, fee: "0.1%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === "onramp" ? "Add Funds" : "Withdraw Funds"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "onramp" 
              ? "Convert fiat currency to USDC for investing"
              : "Convert USDC back to fiat currency"
            }
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex space-x-2 mb-8">
          <Button
            variant={mode === "onramp" ? "default" : "outline"}
            onClick={() => setMode("onramp")}
            className="flex-1"
          >
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Onramp (Buy USDC)
          </Button>
          <Button
            variant={mode === "offramp" ? "default" : "outline"}
            onClick={() => setMode("offramp")}
            className="flex-1"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Offramp (Sell USDC)
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <Card className="banking-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Transaction Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {mode === "onramp" ? "Amount to deposit" : "Amount to withdraw"}
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg h-12 pr-20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-20 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Methods (Onramp only) */}
              {mode === "onramp" && (
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <Card key={method.id} className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            {method.icon}
                            <div className="flex-1">
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-muted-foreground">Fee: {method.fee}</div>
                            </div>
                            <Badge variant="outline">{method.fee}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction Summary */}
              {amount && parseFloat(amount) > 0 && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium">Transaction Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span>${amount} {currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform fee ({fees.platform})</span>
                      <span>${(parseFloat(amount) * 0.005).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network fee</span>
                      <span>{fees.network}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>You receive</span>
                      <span>{estimatedOutput} USDC</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleTransaction}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                variant="premium"
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {mode === "onramp" ? "Buy USDC" : "Sell USDC"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Security Features */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-lg">Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Bank-grade Security</div>
                    <div className="text-xs text-muted-foreground">256-bit SSL encryption</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Instant Settlement</div>
                    <div className="text-xs text-muted-foreground">Funds available immediately</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Compliance</div>
                    <div className="text-xs text-muted-foreground">Fully regulated service</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limits */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-lg">Transaction Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily limit</span>
                  <span>$10,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly limit</span>
                  <span>$50,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Minimum amount</span>
                  <span>$10</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}