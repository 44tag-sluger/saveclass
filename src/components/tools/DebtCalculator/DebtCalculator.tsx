import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/utils/financeUtils';
import { sortDebtsForAvalanche, sortDebtsForSnowball } from '@/utils/financeUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import html2canvas from 'html2canvas';

interface Debt {
  id: number;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

const DebtCalculator: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Credit Card', balance: 15000, interestRate: 19.5, minimumPayment: 500 },
    { id: 2, name: 'Car Loan', balance: 80000, interestRate: 12, minimumPayment: 2500 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(1000);
  const [useAvalanche, setUseAvalanche] = useState<boolean>(true);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const { toast } = useToast();
  const { canDownload, incrementDownloadCount, userTier } = useUser();

  // Calculate totals
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  // Add a new empty debt
  const addDebt = () => {
    const newId = debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1;
    setDebts([...debts, { id: newId, name: '', balance: 0, interestRate: 0, minimumPayment: 0 }]);
  };

  // Remove a debt by id
  const removeDebt = (id: number) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  // Update a debt property
  const updateDebt = (id: number, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => {
      if (debt.id === id) {
        return { ...debt, [field]: typeof value === 'string' && field !== 'name' ? parseFloat(value) || 0 : value };
      }
      return debt;
    }));
  };

  // Calculate payment plan
  const calculatePaymentPlan = () => {
    if (debts.length === 0) {
      toast({
        title: "No debts to calculate",
        description: "Please add at least one debt to calculate a payment plan.",
        variant: "destructive",
      });
      return;
    }
    
    setShowResults(true);
  };

  // Export results as image
  const exportResults = async () => {
    if (!canDownload) {
      toast({
        title: "Feature restricted",
        description: "Please upgrade your account to export results.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultsElement = document.getElementById('debt-results');
      if (!resultsElement) return;
      
      const canvas = await html2canvas(resultsElement);
      const image = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = image;
      link.download = 'debt-payment-plan.png';
      link.click();
      
      incrementDownloadCount();
      
      toast({
        title: "Export successful",
        description: "Your debt payment plan has been exported.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your results.",
        variant: "destructive",
      });
    }
  };

  // Sort debts based on selected strategy
  const sortedDebts = useAvalanche 
    ? sortDebtsForAvalanche([...debts]) 
    : sortDebtsForSnowball([...debts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Debt Snowball/Avalanche Calculator</h2>
        <p className="text-muted-foreground">
          Enter your debts below and see how quickly you can pay them off using either the 
          Snowball method (paying smallest balances first) or the Avalanche method (paying highest interest first).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Debts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {debts.map((debt) => (
            <div key={debt.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 sm:col-span-3">
                <Label htmlFor={`name-${debt.id}`}>Debt Name</Label>
                <Input
                  id={`name-${debt.id}`}
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  placeholder="Credit Card, Car Loan, etc."
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <Label htmlFor={`balance-${debt.id}`}>Balance (R)</Label>
                <Input
                  id={`balance-${debt.id}`}
                  type="number"
                  value={debt.balance || ''}
                  onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Label htmlFor={`interest-${debt.id}`}>Interest (%)</Label>
                <Input
                  id={`interest-${debt.id}`}
                  type="number"
                  value={debt.interestRate || ''}
                  onChange={(e) => updateDebt(debt.id, 'interestRate', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <Label htmlFor={`payment-${debt.id}`}>Min Payment (R)</Label>
                <Input
                  id={`payment-${debt.id}`}
                  type="number"
                  value={debt.minimumPayment || ''}
                  onChange={(e) => updateDebt(debt.id, 'minimumPayment', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="col-span-12 sm:col-span-1 flex justify-end items-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDebt(debt.id)}
                  disabled={debts.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addDebt} className="w-full mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Another Debt
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="extra-payment">Extra Monthly Payment (R)</Label>
              <Input
                id="extra-payment"
                type="number"
                value={extraPayment || ''}
                onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Label htmlFor="payment-method">
                {useAvalanche ? 'Avalanche Method (Highest Interest First)' : 'Snowball Method (Smallest Balance First)'}
              </Label>
              <Switch
                id="payment-method"
                checked={useAvalanche}
                onCheckedChange={setUseAvalanche}
              />
            </div>
          </div>
          
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Total Debt: <span className="font-medium">{formatCurrency(totalDebt)}</span> | 
              Min Monthly Payment: <span className="font-medium">{formatCurrency(totalMinPayment)}</span>
            </div>
            <Button onClick={calculatePaymentPlan}>Calculate Plan</Button>
          </div>
        </CardFooter>
      </Card>

      {showResults && (
        <Card id="debt-results">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Debt Payment Plan</CardTitle>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="font-medium mb-2">Payment Strategy: {useAvalanche ? 'Avalanche' : 'Snowball'}</h3>
                <p className="text-sm text-muted-foreground">
                  {useAvalanche 
                    ? 'You\'re targeting debts with the highest interest rates first to minimize interest payments.' 
                    : 'You\'re targeting debts with the smallest balances first to build momentum with quick wins.'}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Payment Order:</h3>
                <ol className="space-y-2">
                  {sortedDebts.map((debt, index) => (
                    <li key={debt.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <span className="font-medium">{index + 1}. {debt.name}</span>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(debt.balance)} at {debt.interestRate}% interest
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(debt.minimumPayment)}/month</div>
                        <div className="text-sm text-muted-foreground">
                          minimum payment
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebtCalculator;
