
import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ExportWatermark } from "@/components/ui/export-watermark";
import { PremiumOverlay } from "@/components/ui/premium-overlay";
import { isPremiumUser } from "@/utils/premium";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#2dd4bf", "#0d9488", "#059669", "#047857"];

const SavingsPlanner = () => {
  const [goal, setGoal] = useState<number>(100000);
  const [months, setMonths] = useState<number>(36);
  const [inflationRate, setInflationRate] = useState<number>(5.5);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);
  const [isPremium, setIsPremium] = useState<boolean>(isPremiumUser());
  const resultRef = useRef<HTMLDivElement>(null);
  
  const calculateInflationAdjustedGoal = (): number => {
    const years = months / 12;
    return goal * Math.pow(1 + inflationRate / 100, years);
  };
  
  const calculateTotalSavings = (): number => {
    return monthlyContribution * months;
  };
  
  const calculateShortfall = (): number => {
    return Math.max(0, calculateInflationAdjustedGoal() - calculateTotalSavings());
  };
  
  const calculateRequiredContribution = (): number => {
    return calculateInflationAdjustedGoal() / months;
  };
  
  const generateSavingsData = () => {
    const data = [];
    const inflationAdjustedGoal = calculateInflationAdjustedGoal();
    const monthlyRate = inflationRate / 100 / 12;
    
    let currentSavings = 0;
    let adjustedGoal = goal;
    
    for (let i = 0; i <= months; i++) {
      if (i > 0) {
        currentSavings += monthlyContribution;
        adjustedGoal = goal * Math.pow(1 + monthlyRate, i);
      }
      
      data.push({
        month: i,
        savings: Math.round(currentSavings),
        goal: Math.round(adjustedGoal)
      });
    }
    
    return data;
  };
  
  const pieData = [
    { name: "Current Savings", value: calculateTotalSavings() },
    { name: "Shortfall", value: calculateShortfall() }
  ];
  
  const savingsData = generateSavingsData();

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Savings Goal Planner</h1>
          <p className="text-muted-foreground mt-2">
            Plan your savings with inflation adjustment to ensure your goals keep pace with rising costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Savings Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="goal">Savings Goal (R)</Label>
                  <Input
                    id="goal"
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    min="1000"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="months">Timeline (Months)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="months"
                      value={[months]}
                      onValueChange={(value) => setMonths(value[0])}
                      min={1}
                      max={120}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-16 text-center">{months}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.floor(months / 12)} years, {months % 12} months
                  </div>
                </div>
                
                <div className="relative">
                  <Label htmlFor="inflation">Inflation Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="inflation"
                      value={[inflationRate]}
                      onValueChange={(value) => setInflationRate(value[0])}
                      min={0}
                      max={15}
                      step={0.1}
                      disabled={!isPremium}
                      className="flex-1"
                    />
                    <span className="w-16 text-center">{inflationRate}%</span>
                  </div>
                  {!isPremium && (
                    <PremiumOverlay 
                      title="Custom Inflation Rate" 
                      message="Upgrade to set your own inflation rate. Free users use the default rate of 5.5%."
                    />
                  )}
                </div>
                
                <div>
                  <Label htmlFor="contribution">Monthly Contribution (R)</Label>
                  <Input
                    id="contribution"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    min="0"
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  variant="default" 
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  Calculate Plan
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Savings Analysis</CardTitle>
                <ExportWatermark elementRef={resultRef} filename="savings-plan" />
              </CardHeader>
              <CardContent>
                <div ref={resultRef} className="bg-white p-6 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Savings Summary</h3>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Original Goal</div>
                        <div className="text-2xl font-semibold">R{goal.toLocaleString()}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Inflation-Adjusted Goal</div>
                        <div className="text-2xl font-semibold">R{Math.round(calculateInflationAdjustedGoal()).toLocaleString()}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Total Savings with Current Plan</div>
                        <div className="text-2xl font-semibold">R{calculateTotalSavings().toLocaleString()}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Shortfall</div>
                        <div className={`text-2xl font-semibold ${calculateShortfall() > 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {calculateShortfall() > 0 ? `R${Math.round(calculateShortfall()).toLocaleString()}` : 'No shortfall!'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Required Monthly Contribution</div>
                        <div className="text-2xl font-semibold">R{Math.round(calculateRequiredContribution()).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Goal Breakdown</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Savings Progress Over Time</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={savingsData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month" 
                            label={{ value: 'Months', position: 'insideBottom', offset: -5 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `R${value.toLocaleString()}`}
                            width={80} 
                          />
                          <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="savings" 
                            stackId="1" 
                            stroke="#2DD4BF" 
                            fill="#2DD4BF" 
                            name="Your Savings" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="goal" 
                            stackId="2" 
                            stroke="#0F766E" 
                            fill="none" 
                            name="Inflation-Adjusted Goal" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
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

export default SavingsPlanner;
