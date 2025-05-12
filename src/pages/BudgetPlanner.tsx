
import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExportWatermark } from "@/components/ui/export-watermark";
import { PremiumOverlay } from "@/components/ui/premium-overlay";
import { isPremiumUser } from "@/utils/premium";
import { PlusCircle, MinusCircle, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { toast } from "sonner";

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  color: string;
}

interface BudgetData {
  income: number;
  categories: BudgetCategory[];
}

// Predefined colors for budget categories
const COLORS = [
  "#2DD4BF", "#0F766E", "#047857", "#0EA5E9", 
  "#8B5CF6", "#D946EF", "#F97316", "#EF4444",
  "#10B981", "#6366F1", "#8B5CF6", "#EC4899"
];

const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Housing", amount: 6000, color: "#2DD4BF" },
  { id: "2", name: "Transportation", amount: 2500, color: "#0F766E" },
  { id: "3", name: "Groceries", amount: 3000, color: "#047857" },
  { id: "4", name: "Utilities", amount: 1500, color: "#0EA5E9" },
  { id: "5", name: "Savings", amount: 2000, color: "#8B5CF6" },
  { id: "6", name: "Entertainment", amount: 1000, color: "#D946EF" }
];

const BudgetPlanner = () => {
  const [income, setIncome] = useState<number>(20000);
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [isPremium] = useState<boolean>(isPremiumUser());
  
  const resultRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Helper functions
  const addCategory = () => {
    const newId = Date.now().toString();
    const newCategory = {
      id: newId,
      name: "",
      amount: 0,
      color: getRandomColor()
    };
    
    setCategories([...categories, newCategory]);
  };
  
  const updateCategory = (id: string, field: keyof BudgetCategory, value: string | number) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, [field]: field === 'name' ? value : Number(value) } : category
    ));
  };
  
  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };
  
  // Calculate total expenses and remaining budget
  const calculateTotalExpenses = (): number => {
    return categories.reduce((sum, category) => sum + category.amount, 0);
  };
  
  const calculateRemaining = (): number => {
    return income - calculateTotalExpenses();
  };
  
  // Prepare chart data
  const getPieChartData = () => {
    return categories.filter(cat => cat.amount > 0).map(category => ({
      name: category.name,
      value: category.amount,
      color: category.color
    }));
  };
  
  // Save budget data to localStorage
  const saveBudget = () => {
    if (!isPremium) {
      toast.error("Saving budgets is a premium feature. Please upgrade to save your work.");
      return;
    }
    
    const budgetData: BudgetData = {
      income: income,
      categories: categories
    };
    
    try {
      localStorage.setItem("budget_data", JSON.stringify(budgetData));
      toast.success("Budget saved successfully!");
    } catch (error) {
      console.error("Error saving budget data:", error);
      toast.error("Failed to save budget data.");
    }
  };
  
  // Load budget data from localStorage
  const loadBudget = () => {
    if (!isPremium) {
      toast.error("Loading saved budgets is a premium feature. Please upgrade to access this feature.");
      return;
    }
    
    try {
      const savedData = localStorage.getItem("budget_data");
      if (savedData) {
        const parsedData: BudgetData = JSON.parse(savedData);
        setIncome(parsedData.income);
        setCategories(parsedData.categories);
        toast.success("Budget loaded successfully!");
      } else {
        toast.info("No saved budget found.");
      }
    } catch (error) {
      console.error("Error loading budget data:", error);
      toast.error("Failed to load budget data.");
    }
  };
  
  // Helper function for percentage calculation
  const calculatePercentage = (amount: number): number => {
    if (income === 0) return 0;
    return (amount / income) * 100;
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
          <p className="text-muted-foreground mt-2">
            Create a comprehensive budget to manage your income and expenses effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income and Categories Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="income">Monthly Income (R)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    min="0"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Budget Categories</CardTitle>
                <CardDescription>
                  Add your monthly expense categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-end space-x-2">
                      <div className="flex-grow">
                        <Input
                          placeholder="Category name"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, "name", e.target.value)}
                          className="mb-2"
                        />
                        <Input
                          type="number"
                          value={category.amount}
                          onChange={(e) => updateCategory(category.id, "amount", e.target.value)}
                          min="0"
                          placeholder="Amount"
                        />
                      </div>
                      <div 
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCategory(category.id)}
                      >
                        <MinusCircle className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={addCategory}
                  className="w-full mt-4 flex items-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </CardContent>
            </Card>
            
            <div className="relative">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Save & Load</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="default" 
                    onClick={saveBudget} 
                    className="w-full"
                    disabled={!isPremium}
                  >
                    Save Budget
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadBudget} 
                    className="w-full"
                    disabled={!isPremium}
                  >
                    Load Saved Budget
                  </Button>
                </CardContent>
              </Card>
              
              {!isPremium && (
                <PremiumOverlay
                  title="Premium Feature"
                  message="Upgrade to save and load your budgets."
                />
              )}
            </div>
          </div>
          
          {/* Results and Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Budget Breakdown</CardTitle>
                <ExportWatermark elementRef={resultRef} filename="budget-plan" />
              </CardHeader>
              <CardContent>
                <div ref={resultRef} className="bg-white p-6 rounded-md">
                  {/* Summary Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="text-sm text-muted-foreground">Total Income</div>
                      <div className="text-2xl font-semibold">R{income.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="text-sm text-muted-foreground">Total Expenses</div>
                      <div className="text-2xl font-semibold">R{calculateTotalExpenses().toLocaleString()}</div>
                    </div>
                    <div className={`p-4 rounded-md ${calculateRemaining() >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="text-sm text-muted-foreground">Remaining</div>
                      <div className={`text-2xl font-semibold ${calculateRemaining() >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        R{calculateRemaining().toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart */}
                    <div ref={chartRef}>
                      <h3 className="font-medium text-lg mb-4">Expense Breakdown</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getPieChartData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {getPieChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `R${Number(value).toLocaleString()}`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Category Breakdown Table */}
                    <div>
                      <h3 className="font-medium text-lg mb-4">Category Details</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Category</th>
                            <th className="text-right py-2">Amount</th>
                            <th className="text-right py-2">% of Income</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.filter(cat => cat.amount > 0 && cat.name).map((category) => (
                            <tr key={category.id} className="border-b hover:bg-muted/30">
                              <td className="py-2 flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                              </td>
                              <td className="text-right py-2">R{category.amount.toLocaleString()}</td>
                              <td className="text-right py-2">
                                {calculatePercentage(category.amount).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                          {calculateRemaining() !== 0 && (
                            <tr className={`${calculateRemaining() >= 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                              <td className="py-2">Remaining / Deficit</td>
                              <td className="text-right py-2">R{calculateRemaining().toLocaleString()}</td>
                              <td className="text-right py-2">
                                {calculatePercentage(calculateRemaining()).toFixed(1)}%
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Budget Tips */}
                  <div className="mt-6">
                    <Card className="bg-teal-50 border-teal-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Budget Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Aim to save at least 10-20% of your income.</li>
                          <li>Keep housing costs under 30% of your income.</li>
                          <li>Use the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings.</li>
                          <li>Review and adjust your budget regularly.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BudgetPlanner;
