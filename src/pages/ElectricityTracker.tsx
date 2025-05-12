
import { useState, useEffect, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportWatermark } from "@/components/ui/export-watermark";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { isPremiumUser } from "@/utils/premium";

interface ElectricityEntry {
  id: string;
  date: string;
  units: number;
  cost: number;
  notes: string;
}

interface UsageStats {
  dailyAvg: number;
  weeklyAvg: number;
  monthlyAvg: number;
  costPerUnit: number;
}

// Default electricity rates
const DEFAULT_RATES = {
  basic: 2.5176,
  block1: 2.8455,
  block2: 3.5569,
  block3: 4.2683,
};

const ElectricityTracker = () => {
  const [entries, setEntries] = useState<ElectricityEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    units: 0,
    cost: 0,
    notes: ""
  });
  const [householdSize, setHouseholdSize] = useState<string>("2");
  const [stats, setStats] = useState<UsageStats>({
    dailyAvg: 0,
    weeklyAvg: 0,
    monthlyAvg: 0,
    costPerUnit: 0
  });
  
  const isPremium = isPremiumUser();
  const resultRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("electricity_entries");
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Error loading electricity data:", error);
      }
    }
    
    const savedHouseholdSize = localStorage.getItem("electricity_household_size");
    if (savedHouseholdSize) {
      setHouseholdSize(savedHouseholdSize);
    }
  }, []);
  
  // Save data to localStorage when entries or household size changes
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("electricity_entries", JSON.stringify(entries));
    }
  }, [entries]);
  
  useEffect(() => {
    localStorage.setItem("electricity_household_size", householdSize);
  }, [householdSize]);
  
  // Calculate statistics whenever entries change
  useEffect(() => {
    if (entries.length === 0) return;
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const recentEntries = entries.filter(entry => new Date(entry.date) >= oneMonthAgo);
    const totalUnits = recentEntries.reduce((sum, entry) => sum + entry.units, 0);
    const totalCost = recentEntries.reduce((sum, entry) => sum + entry.cost, 0);
    
    const daysInPeriod = Math.max(1, (now.getTime() - oneMonthAgo.getTime()) / (1000 * 60 * 60 * 24));
    
    const dailyAvg = totalUnits / daysInPeriod;
    const weeklyAvg = dailyAvg * 7;
    const monthlyAvg = dailyAvg * 30.5;
    const costPerUnit = totalUnits > 0 ? totalCost / totalUnits : 0;
    
    setStats({
      dailyAvg,
      weeklyAvg,
      monthlyAvg,
      costPerUnit
    });
  }, [entries]);

  const handleAddEntry = () => {
    if (newEntry.units <= 0) {
      toast.error("Please enter a valid number of units");
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newId = Date.now().toString();
    
    const entryToAdd: ElectricityEntry = {
      id: newId,
      date: today,
      units: newEntry.units,
      cost: newEntry.cost > 0 ? newEntry.cost : calculateCost(newEntry.units),
      notes: newEntry.notes
    };
    
    setEntries([...entries, entryToAdd]);
    setNewEntry({ units: 0, cost: 0, notes: "" });
    toast.success("Electricity purchase recorded");
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success("Entry deleted");
  };
  
  const calculateCost = (units: number): number => {
    // Simple calculation based on typical prepaid rates
    return units * DEFAULT_RATES.block1;
  };
  
  const getAverageUsageByHousehold = (): number => {
    const size = parseInt(householdSize) || 1;
    // Typical monthly usage in kWh by household size
    switch (size) {
      case 1: return 350;
      case 2: return 550;
      case 3: return 750;
      case 4: return 950;
      case 5: return 1100;
      default: return 1200;
    }
  };
  
  // Prepare chart data
  const getChartData = () => {
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return sortedEntries.map(entry => ({
      date: entry.date,
      units: entry.units,
      cost: entry.cost
    }));
  };
  
  // Get usage comparison data
  const getUsageComparisonData = () => {
    const avgUsage = getAverageUsageByHousehold();
    const yourUsage = stats.monthlyAvg;
    
    return [
      {
        name: "Your Usage",
        units: yourUsage
      },
      {
        name: "Average Household",
        units: avgUsage
      }
    ];
  };
  
  // Calculate savings recommendations
  const calculateSavingsTips = () => {
    const avgUsage = getAverageUsageByHousehold();
    const yourUsage = stats.monthlyAvg;
    const difference = yourUsage - avgUsage;
    
    if (difference <= 0) {
      return "Great job! Your electricity usage is below or at the average for your household size.";
    } else {
      const potentialSavings = difference * stats.costPerUnit;
      return `Your monthly usage is ${Math.round(difference)} kWh above average for your household size. By reducing to the average, you could save approximately R${Math.round(potentialSavings)} per month.`;
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Electricity Usage Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your electricity consumption to identify savings opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input form */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Add Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="units">Units Purchased (kWh)</Label>
                  <Input
                    id="units"
                    type="number"
                    value={newEntry.units || ''}
                    onChange={(e) => setNewEntry({...newEntry, units: Number(e.target.value)})}
                    min="0"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cost">Amount Paid (R)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newEntry.cost || ''}
                    onChange={(e) => setNewEntry({...newEntry, cost: Number(e.target.value)})}
                    min="0"
                    className="mt-2"
                    placeholder={`Approx. R${calculateCost(newEntry.units).toFixed(2)}`}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Leave at 0 to use the default rate calculation
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    placeholder="e.g. Winter month, visitors staying"
                    className="mt-2"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddEntry}
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  Record Purchase
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Household Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="householdSize">Number of People</Label>
                  <Select 
                    value={householdSize} 
                    onValueChange={setHouseholdSize}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Household size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3">3 People</SelectItem>
                      <SelectItem value="4">4 People</SelectItem>
                      <SelectItem value="5">5 People</SelectItem>
                      <SelectItem value="6">6+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results and charts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Electricity Usage Analysis</CardTitle>
                <ExportWatermark elementRef={resultRef} filename="electricity-usage" />
              </CardHeader>
              <CardContent>
                <div ref={resultRef} className="bg-white p-6 rounded-md">
                  {entries.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No electricity purchases recorded yet. Add your first purchase to start tracking.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Usage statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Daily Average</div>
                          <div className="text-xl font-bold mt-1">{stats.dailyAvg.toFixed(1)} kWh</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Weekly Average</div>
                          <div className="text-xl font-bold mt-1">{stats.weeklyAvg.toFixed(1)} kWh</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Monthly Average</div>
                          <div className="text-xl font-bold mt-1">{stats.monthlyAvg.toFixed(1)} kWh</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Cost Per Unit</div>
                          <div className="text-xl font-bold mt-1">R{stats.costPerUnit.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {/* Usage comparison chart */}
                      <div>
                        <h3 className="font-medium text-lg mb-4">Usage Comparison</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getUsageComparisonData()}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis
                                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip formatter={(value) => `${Number(value).toFixed(1)} kWh`} />
                              <Legend />
                              <Bar dataKey="units" fill="#2DD4BF" name="Monthly kWh" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* Usage trend */}
                      {entries.length >= 2 && (
                        <div>
                          <h3 className="font-medium text-lg mb-4">Usage Trend</h3>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={getChartData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  angle={-45} 
                                  textAnchor="end"
                                  height={60}
                                />
                                <YAxis yAxisId="left" 
                                  label={{ value: 'Units (kWh)', angle: -90, position: 'insideLeft' }} 
                                />
                                <YAxis 
                                  yAxisId="right" 
                                  orientation="right" 
                                  label={{ value: 'Cost (R)', angle: 90, position: 'insideRight' }} 
                                />
                                <Tooltip 
                                  formatter={(value, name) => [
                                    name === "units" ? `${value} kWh` : `R${Number(value).toFixed(2)}`,
                                    name === "units" ? "Units" : "Cost"
                                  ]} 
                                />
                                <Legend />
                                <Line 
                                  yAxisId="left" 
                                  type="monotone" 
                                  dataKey="units" 
                                  stroke="#2DD4BF" 
                                  activeDot={{ r: 8 }} 
                                  name="Units" 
                                />
                                <Line 
                                  yAxisId="right" 
                                  type="monotone" 
                                  dataKey="cost" 
                                  stroke="#0F766E" 
                                  name="Cost" 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                      
                      {/* Savings tips */}
                      <Card className="bg-teal-50 border-teal-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Savings Opportunity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            {calculateSavingsTips()}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent purchases table */}
            {entries.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Purchases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-right py-2">Units (kWh)</th>
                          <th className="text-right py-2">Cost (R)</th>
                          <th className="text-left py-2 hidden md:table-cell">Notes</th>
                          <th className="text-right py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.slice().reverse().map((entry) => (
                          <tr key={entry.id} className="border-b hover:bg-muted/30">
                            <td className="py-2">{entry.date}</td>
                            <td className="text-right py-2">{entry.units}</td>
                            <td className="text-right py-2">R{entry.cost.toFixed(2)}</td>
                            <td className="py-2 hidden md:table-cell">{entry.notes || "-"}</td>
                            <td className="text-right py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEntry(entry.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ElectricityTracker;
