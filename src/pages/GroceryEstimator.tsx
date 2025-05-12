
import { useState, useEffect, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportWatermark } from "@/components/ui/export-watermark";
import groceryData from "@/data/prices.json";

interface GroceryEstimate {
  weekly: number;
  monthly: number;
  description: string;
}

const GroceryEstimator = () => {
  const [householdSize, setHouseholdSize] = useState<"singlePerson" | "couple" | "smallFamily" | "largeFamily">("singlePerson");
  const [estimate, setEstimate] = useState<GroceryEstimate>(groceryData.groceryPrices.singlePerson);
  const [customItems, setCustomItems] = useState<{name: string, quantity: number}[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEstimate(groceryData.groceryPrices[householdSize]);
  }, [householdSize]);

  const addCustomItem = () => {
    setCustomItems([...customItems, { name: "", quantity: 1 }]);
  };

  const removeCustomItem = (index: number) => {
    const updated = [...customItems];
    updated.splice(index, 1);
    setCustomItems(updated);
  };

  const updateCustomItem = (index: number, field: string, value: string | number) => {
    const updated = [...customItems];
    updated[index] = { ...updated[index], [field]: value };
    setCustomItems(updated);
  };

  const calculateCustomItemTotal = () => {
    return customItems.reduce((total, item) => {
      const groceryItem = groceryData.commonItems.find(g => g.name === item.name);
      if (groceryItem) {
        return total + (groceryItem.price * item.quantity);
      }
      return total;
    }, 0);
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Grocery Cost Estimator</h1>
          <p className="text-muted-foreground mt-2">
            Estimate your grocery expenses based on household size and common items.
          </p>
        </div>

        <Tabs defaultValue="estimate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="estimate">Quick Estimate</TabsTrigger>
            <TabsTrigger value="custom">Custom Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="estimate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Household Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="householdSize">Household Size</Label>
                    <Select 
                      value={householdSize} 
                      onValueChange={(value: any) => setHouseholdSize(value)}
                    >
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select household size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="singlePerson">Single Person</SelectItem>
                        <SelectItem value="couple">Couple (2 people)</SelectItem>
                        <SelectItem value="smallFamily">Small Family (3-4 people)</SelectItem>
                        <SelectItem value="largeFamily">Large Family (5+ people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Estimated Costs</CardTitle>
                  <ExportWatermark elementRef={resultRef} filename="grocery-estimate" />
                </CardHeader>
                <CardContent>
                  <div ref={resultRef} className="p-6 bg-white rounded-md space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-md">
                        <div className="text-sm text-muted-foreground">Weekly Estimate</div>
                        <div className="text-3xl font-bold mt-1">R{estimate.weekly.toLocaleString()}</div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-md">
                        <div className="text-sm text-muted-foreground">Monthly Estimate</div>
                        <div className="text-3xl font-bold mt-1">R{estimate.monthly.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>These estimates are based on average grocery prices in South Africa for a {estimate.description.toLowerCase()}.</p>
                      <p className="mt-2">Actual costs may vary based on dietary preferences, shopping habits, and regional price differences.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Custom Grocery List</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Create a custom grocery list to get a more accurate estimate based on your specific needs.
                  </div>
                  
                  {customItems.length > 0 && (
                    <div className="space-y-4">
                      {customItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2 items-end">
                          <div className="col-span-2">
                            <Label htmlFor={`item-${index}`}>Item</Label>
                            <Select
                              value={item.name}
                              onValueChange={(value) => updateCustomItem(index, "name", value)}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                {groceryData.commonItems.map((groceryItem) => (
                                  <SelectItem key={groceryItem.name} value={groceryItem.name}>
                                    {groceryItem.name} - R{groceryItem.price.toFixed(2)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end space-x-2">
                            <div className="flex-1">
                              <Label htmlFor={`qty-${index}`}>Qty</Label>
                              <Input
                                id={`qty-${index}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateCustomItem(index, "quantity", parseInt(e.target.value) || 1)}
                                className="mt-1"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCustomItem(index)}
                              className="flex-shrink-0"
                            >
                              &times;
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={addCustomItem}
                    className="w-full"
                  >
                    Add Item
                  </Button>
                  
                  {customItems.length > 0 && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-md">
                      <div className="flex justify-between">
                        <span>Custom Items Total:</span>
                        <span className="font-semibold">R{calculateCustomItemTotal().toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        This is an estimated one-time cost and doesn't account for how frequently you buy these items.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Common Grocery Prices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-y-auto pr-2">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Price (R)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groceryData.commonItems.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30">
                            <td className="py-2">{item.name}</td>
                            <td className="text-right py-2">{item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    Prices are based on average costs across major South African retailers and may vary by location and season.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default GroceryEstimator;
