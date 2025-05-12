
import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExportWatermark } from "@/components/ui/export-watermark";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type UsageCategory = "low" | "average" | "high" | "very-high";

interface UsageTip {
  tip: string;
  saveAmount: number;
}

const WaterUsage = () => {
  const [waterBill, setWaterBill] = useState<number>(800);
  const [householdSize, setHouseholdSize] = useState<number>(3);
  const [usageLiters, setUsageLiters] = useState<number>(15000);
  
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Calculate water consumption category
  const calculateUsageCategory = (): UsageCategory => {
    const perPersonUsage = usageLiters / householdSize;
    
    if (perPersonUsage < 3000) return "low";
    if (perPersonUsage < 6000) return "average";
    if (perPersonUsage < 9000) return "high";
    return "very-high";
  };
  
  // Get description for usage category
  const getUsageCategoryDescription = (): string => {
    const category = calculateUsageCategory();
    switch (category) {
      case "low": return "Your water usage is low and efficient. Great job!";
      case "average": return "Your water usage is around the average for South African households.";
      case "high": return "Your water usage is higher than average. Consider implementing some water-saving tips.";
      case "very-high": return "Your water usage is very high. There are likely significant opportunities to reduce consumption.";
    }
  };
  
  // Get water saving tips based on usage category
  const getWaterSavingTips = (): UsageTip[] => {
    const category = calculateUsageCategory();
    
    const allTips = [
      { tip: "Fix leaking taps - a dripping tap can waste up to 15 liters per day.", saveAmount: 450 },
      { tip: "Install water-efficient showerheads to reduce water usage by up to 40%.", saveAmount: 2400 },
      { tip: "Take shorter showers - reducing shower time by 2 minutes saves about 20 liters per shower.", saveAmount: 1800 },
      { tip: "Install a dual-flush toilet or place a water displacement device in your toilet tank.", saveAmount: 3000 },
      { tip: "Only run full loads of laundry and dishes.", saveAmount: 1000 },
      { tip: "Turn off tap when brushing teeth or shaving.", saveAmount: 600 },
      { tip: "Collect rainwater for garden use.", saveAmount: 2000 },
      { tip: "Use drought-resistant plants in your garden.", saveAmount: 3000 },
      { tip: "Water garden in early morning or evening to reduce evaporation.", saveAmount: 1000 }
    ];
    
    // Return more tips for higher usage categories
    switch (category) {
      case "low": return allTips.slice(0, 3);
      case "average": return allTips.slice(0, 5);
      case "high": return allTips.slice(0, 7);
      case "very-high": return allTips;
    }
  };
  
  // Calculate estimates
  const calculateEstimatedUsage = (): number => {
    if (waterBill <= 0) return 0;
    // Rough estimate based on typical municipal rates
    return waterBill * 18.75; // 18.75 liters per rand
  };
  
  // Update the other value when one changes
  const updateFromBill = (bill: number) => {
    setWaterBill(bill);
    setUsageLiters(bill * 18.75);
  };
  
  const updateFromUsage = (usage: number) => {
    setUsageLiters(usage);
    setWaterBill(usage / 18.75);
  };
  
  // Calculate comparison data
  const getComparisonData = () => {
    const perPersonUsage = usageLiters / householdSize;
    
    return [
      { name: "Your Usage", liters: Math.round(perPersonUsage) },
      { name: "Low Usage", liters: 3000 },
      { name: "Average", liters: 6000 },
      { name: "High Usage", liters: 9000 }
    ];
  };
  
  // Get breakdown of typical household water usage
  const getUsageBreakdown = () => {
    return [
      { name: "Toilet", percentage: 30, liters: Math.round(usageLiters * 0.3) },
      { name: "Shower/Bath", percentage: 25, liters: Math.round(usageLiters * 0.25) },
      { name: "Laundry", percentage: 20, liters: Math.round(usageLiters * 0.2) },
      { name: "Kitchen", percentage: 10, liters: Math.round(usageLiters * 0.1) },
      { name: "Garden", percentage: 10, liters: Math.round(usageLiters * 0.1) },
      { name: "Other", percentage: 5, liters: Math.round(usageLiters * 0.05) }
    ];
  };
  
  // Get usage category color
  const getCategoryColor = (): string => {
    const category = calculateUsageCategory();
    switch (category) {
      case "low": return "bg-green-500";
      case "average": return "bg-blue-500";
      case "high": return "bg-yellow-500";
      case "very-high": return "bg-red-500";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Water Usage Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your water consumption and identify ways to conserve this precious resource.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Water Usage</CardTitle>
                <CardDescription>
                  Enter your monthly water bill or estimated usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="waterBill">Monthly Water Bill (R)</Label>
                  <Input
                    id="waterBill"
                    type="number"
                    value={waterBill}
                    onChange={(e) => updateFromBill(Number(e.target.value))}
                    min="0"
                    className="mt-2"
                  />
                </div>
                
                <div className="text-center font-semibold text-lg">OR</div>
                
                <div>
                  <Label htmlFor="usageLiters">Monthly Usage (Liters)</Label>
                  <Input
                    id="usageLiters"
                    type="number"
                    value={usageLiters}
                    onChange={(e) => updateFromUsage(Number(e.target.value))}
                    min="0"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="householdSize">
                    Household Size: {householdSize} {householdSize === 1 ? 'person' : 'people'}
                  </Label>
                  <Slider
                    id="householdSize"
                    value={[householdSize]}
                    onValueChange={(value) => setHouseholdSize(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Usage Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white ${getCategoryColor()}`}>
                    {calculateUsageCategory().replace('-', ' ').toUpperCase()}
                  </div>
                  
                  <p className="text-center">
                    {getUsageCategoryDescription()}
                  </p>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Per Person Monthly Usage:
                    </p>
                    <p className="font-semibold text-lg">
                      {Math.round(usageLiters / householdSize).toLocaleString()} liters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Water Usage Analysis</CardTitle>
                <ExportWatermark elementRef={resultRef} filename="water-usage-analysis" />
              </CardHeader>
              <CardContent>
                <div ref={resultRef} className="bg-white p-6 rounded-md">
                  <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                      <TabsTrigger value="tips">Saving Tips</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-6">
                      <TabsContent value="overview">
                        <div className="space-y-6">
                          {/* Usage Summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-muted/30 p-4 rounded-md">
                              <div className="text-sm text-muted-foreground">Monthly Usage</div>
                              <div className="text-xl font-semibold">{usageLiters.toLocaleString()} liters</div>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-md">
                              <div className="text-sm text-muted-foreground">Daily Average</div>
                              <div className="text-xl font-semibold">{Math.round(usageLiters / 30).toLocaleString()} liters</div>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-md">
                              <div className="text-sm text-muted-foreground">Cost</div>
                              <div className="text-xl font-semibold">R{waterBill.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          {/* Usage Breakdown */}
                          <div>
                            <h3 className="font-medium text-lg mb-4">Typical Water Usage Breakdown</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Category</th>
                                    <th className="text-right py-2">Percentage</th>
                                    <th className="text-right py-2">Estimated Liters</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getUsageBreakdown().map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/30">
                                      <td className="py-2">{item.name}</td>
                                      <td className="text-right py-2">{item.percentage}%</td>
                                      <td className="text-right py-2">{item.liters.toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="comparison">
                        <div>
                          <h3 className="font-medium text-lg mb-4">Usage Comparison (Per Person)</h3>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={getComparisonData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                  label={{ value: 'Liters per Person', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip formatter={(value) => `${Number(value).toLocaleString()} liters`} />
                                <Legend />
                                <Bar dataKey="liters" fill="#2DD4BF" name="Monthly Water Usage" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-6 bg-muted/30 p-4 rounded-md">
                            <h4 className="font-medium">Understanding the Comparison</h4>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                              <li><span className="font-medium">Low Usage:</span> Less than 3,000 liters per person monthly</li>
                              <li><span className="font-medium">Average Usage:</span> 3,000-6,000 liters per person monthly</li>
                              <li><span className="font-medium">High Usage:</span> 6,000-9,000 liters per person monthly</li>
                              <li><span className="font-medium">Very High Usage:</span> More than 9,000 liters per person monthly</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tips">
                        <div>
                          <h3 className="font-medium text-lg mb-4">Water Saving Recommendations</h3>
                          
                          <div className="space-y-4">
                            {getWaterSavingTips().map((tip, index) => (
                              <Card key={index} className="bg-teal-50 border-teal-100">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="text-sm">{tip.tip}</p>
                                    </div>
                                    <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold ml-4">
                                      Save ~{tip.saveAmount.toLocaleString()} L/month
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          
                          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-md">
                            <h4 className="font-medium text-blue-800">Did You Know?</h4>
                            <p className="text-sm mt-2 text-blue-700">
                              South Africa is considered a water-scarce country. Implementing just a few of these tips can help conserve this precious resource and reduce your water bill.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WaterUsage;
