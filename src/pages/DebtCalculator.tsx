
import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Calculator, Download } from "lucide-react";
import { ExportWatermark } from "@/components/ui/export-watermark";

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

const DebtCalculator = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Credit Card", balance: 20000, interestRate: 18.5, minimumPayment: 800 },
    { id: "2", name: "Car Loan", balance: 120000, interestRate: 9.5, minimumPayment: 2500 },
  ]);
  
  const [extraPayment, setExtraPayment] = useState<number>(1000);
  const [method, setMethod] = useState<"snowball" | "avalanche">("snowball");
  const [calculatedPlan, setCalculatedPlan] = useState<any[]>([]);
  const [showPlan, setShowPlan] = useState<boolean>(false);
  
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Add a new debt
  const addDebt = () => {
    const newId = Date.now().toString();
    setDebts([
      ...debts, 
      { id: newId, name: "", balance: 0, interestRate: 0, minimumPayment: 0 }
    ]);
  };
  
  // Remove a debt
  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };
  
  // Handle debt property change
  const handleDebtChange = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: field === 'name' ? value : Number(value) } : debt
    ));
  };
  
  // Calculate the debt payoff plan
  const calculatePlan = () => {
    // Sort debts based on method
    let sortedDebts = [...debts];
    if (method === "snowball") {
      // Sort by balance, lowest to highest
      sortedDebts.sort((a, b) => a.balance - b.balance);
    } else {
      // Sort by interest rate, highest to lowest
      sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
    }
    
    // Create a payoff plan
    const plan = [];
    let monthlyPayment = sortedDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + extraPayment;
    let remainingDebts = [...sortedDebts];
    let months = 0;
    let totalInterest = 0;
    
    // Simple simulation (in a real app this would be more detailed)
    while (remainingDebts.length > 0 && months < 300) {
      months++;
      let monthPlan = { month: months, debts: [], totalPaid: 0, interestPaid: 0 };
      let availablePayment = monthlyPayment;
      
      // Pay minimum on all debts
      remainingDebts.forEach((debt, index) => {
        const interest = debt.balance * (debt.interestRate / 100 / 12);
        totalInterest += interest;
        monthPlan.interestPaid += interest;
        
        let payment = Math.min(debt.minimumPayment, debt.balance + interest);
        availablePayment -= payment;
        
        const newBalance = Math.max(0, debt.balance + interest - payment);
        remainingDebts[index] = { ...debt, balance: newBalance };
        
        monthPlan.debts.push({
          id: debt.id,
          name: debt.name,
          startBalance: debt.balance,
          payment: payment,
          interest: interest,
          endBalance: newBalance
        });
        
        monthPlan.totalPaid += payment;
      });
      
      // Apply extra payment to first debt
      if (availablePayment > 0 && remainingDebts.length > 0) {
        const targetDebt = remainingDebts[0];
        const extraPaymentApplied = Math.min(availablePayment, targetDebt.balance);
        
        targetDebt.balance = Math.max(0, targetDebt.balance - extraPaymentApplied);
        monthPlan.debts[0].payment += extraPaymentApplied;
        monthPlan.debts[0].endBalance = targetDebt.balance;
        monthPlan.totalPaid += extraPaymentApplied;
      }
      
      // Filter out paid off debts
      remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
      
      // Re-sort for next month if using avalanche (interest rates might have changed)
      if (method === "avalanche") {
        remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
      }
      
      plan.push(monthPlan);
    }
    
    setCalculatedPlan(plan);
    setShowPlan(true);
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Debt Payoff Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Plan your debt repayment journey using the snowball or avalanche method.
          </p>
        </div>

        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Enter Debts</TabsTrigger>
            <TabsTrigger value="results" disabled={!showPlan}>View Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Debts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4 mb-2 text-sm font-medium text-muted-foreground hidden md:grid">
                  <div>Debt Name</div>
                  <div>Balance (R)</div>
                  <div>Interest Rate (%)</div>
                  <div>Minimum Payment (R)</div>
                  <div></div>
                </div>
                
                <div className="space-y-4">
                  {debts.map((debt) => (
                    <div key={debt.id} className="grid md:grid-cols-5 gap-4 items-end border-b pb-4 md:border-0 md:pb-0">
                      <div>
                        <Label className="md:hidden">Debt Name</Label>
                        <Input 
                          value={debt.name} 
                          onChange={(e) => handleDebtChange(debt.id, "name", e.target.value)}
                          placeholder="e.g. Credit Card" 
                        />
                      </div>
                      <div>
                        <Label className="md:hidden">Balance (R)</Label>
                        <Input 
                          type="number" 
                          value={debt.balance} 
                          onChange={(e) => handleDebtChange(debt.id, "balance", e.target.value)}
                          min="0" 
                        />
                      </div>
                      <div>
                        <Label className="md:hidden">Interest Rate (%)</Label>
                        <Input 
                          type="number" 
                          value={debt.interestRate} 
                          onChange={(e) => handleDebtChange(debt.id, "interestRate", e.target.value)}
                          min="0" 
                          step="0.1" 
                        />
                      </div>
                      <div>
                        <Label className="md:hidden">Minimum Payment (R)</Label>
                        <Input 
                          type="number" 
                          value={debt.minimumPayment} 
                          onChange={(e) => handleDebtChange(debt.id, "minimumPayment", e.target.value)}
                          min="0" 
                        />
                      </div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeDebt(debt.id)}
                          disabled={debts.length <= 1}
                        >
                          <MinusCircle className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={addDebt} 
                    className="flex items-center"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Debt
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Method Selection & Extra Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Repayment Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Payoff Method</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="grid grid-cols-2 w-full md:w-1/2">
                      <Button
                        variant={method === "snowball" ? "default" : "outline"}
                        className={method === "snowball" ? "rounded-r-none" : "rounded-r-none border-r-0"}
                        onClick={() => setMethod("snowball")}
                      >
                        Snowball
                      </Button>
                      <Button
                        variant={method === "avalanche" ? "default" : "outline"}
                        className={method === "avalanche" ? "rounded-l-none" : "rounded-l-none"}
                        onClick={() => setMethod("avalanche")}
                      >
                        Avalanche
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {method === "snowball" 
                      ? "Snowball: Pay off smallest debts first for psychological wins." 
                      : "Avalanche: Pay off highest interest debts first to minimize interest."}
                  </p>
                </div>
                
                <div className="w-full md:w-1/2">
                  <Label htmlFor="extraPayment">Extra Monthly Payment (R)</Label>
                  <Input 
                    id="extraPayment" 
                    type="number" 
                    value={extraPayment} 
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    min="0"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Additional amount above minimum payments to accelerate debt payoff.
                  </p>
                </div>
                
                <Button 
                  onClick={calculatePlan} 
                  disabled={debts.length === 0}
                  className="flex items-center"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Your Debt Payoff Plan</CardTitle>
                <ExportWatermark elementRef={resultRef} filename="debt-payoff-plan" />
              </CardHeader>
              <CardContent>
                <div ref={resultRef} className="p-6 bg-white rounded-md">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Summary - {method.charAt(0).toUpperCase() + method.slice(1)} Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {calculatedPlan.length} months
                          </div>
                          <p className="text-sm text-muted-foreground">Total Payoff Time</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            R{calculatedPlan.reduce((sum, month) => sum + month.totalPaid, 0).toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            R{calculatedPlan.reduce((sum, month) => sum + month.interestPaid, 0).toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Total Interest Paid</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Display first few months of the plan */}
                  <h3 className="text-lg font-semibold mb-2">Monthly Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Month</th>
                          <th className="px-4 py-2 text-left">Focus Debt</th>
                          <th className="px-4 py-2 text-right">Payment</th>
                          <th className="px-4 py-2 text-right">Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatedPlan.slice(0, 12).map((month) => (
                          <tr key={month.month} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2">{month.month}</td>
                            <td className="px-4 py-2">{month.debts[0]?.name || "N/A"}</td>
                            <td className="px-4 py-2 text-right">
                              R{month.debts[0]?.payment.toLocaleString() || 0}
                            </td>
                            <td className="px-4 py-2 text-right">
                              R{month.debts[0]?.endBalance.toLocaleString() || 0}
                            </td>
                          </tr>
                        ))}
                        {calculatedPlan.length > 12 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground">
                              ... {calculatedPlan.length - 12} more months
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DebtCalculator;
