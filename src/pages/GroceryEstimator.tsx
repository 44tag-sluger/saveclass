
import { useState, useEffect, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportWatermark } from "@/components/ui/export-watermark";
import { Trash2, Plus, Save, XCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import groceryData from "@/data/prices.json";
import { Switch } from "@/components/ui/switch";

interface GroceryEstimate {
  weekly: number;
  monthly: number;
  description: string;
}

interface CustomGroceryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const GroceryEstimator = () => {
  const [householdSize, setHouseholdSize] = useState<"singlePerson" | "couple" | "smallFamily" | "largeFamily">("singlePerson");
  const [estimate, setEstimate] = useState<GroceryEstimate>(groceryData.groceryPrices.singlePerson);
  const [customItems, setCustomItems] = useState<{name: string, quantity: number}[]>([]);
  const [customPricesList, setCustomPricesList] = useState<CustomGroceryItem[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<{name: string, price: string}>({name: "", price: ""});
  const [useCustomPricesOnly, setUseCustomPricesOnly] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only update estimate from default data if not using custom prices only
    if (!useCustomPricesOnly) {
      setEstimate(groceryData.groceryPrices[householdSize]);
    }
  }, [householdSize, useCustomPricesOnly]);

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
      // First check custom price list
      const customGroceryItem = customPricesList.find(g => g.name === item.name);
      
      if (customGroceryItem) {
        return total + (customGroceryItem.price * item.quantity);
      }
      
      // If not found in custom list, check default items
      const groceryItem = groceryData.commonItems.find(g => g.name === item.name);
      if (groceryItem && !useCustomPricesOnly) {
        return total + (groceryItem.price * item.quantity);
      }
      
      return total;
    }, 0);
  };

  const handleAddCustomPrice = () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please provide both name and price");
      return;
    }
    
    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    const newCustomItem: CustomGroceryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: price,
      quantity: 1
    };
    
    setCustomPricesList([...customPricesList, newCustomItem]);
    setNewItem({name: "", price: ""});
    toast.success("Item added to your custom price list");
  };

  const handleUpdateCustomPrice = (id: string) => {
    const itemToUpdate = customPricesList.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    const updatedList = customPricesList.map(item => {
      if (item.id === id) {
        return {...item, name: newItem.name || item.name, price: parseFloat(newItem.price) || item.price};
      }
      return item;
    });
    
    setCustomPricesList(updatedList);
    setIsEditing(null);
    setNewItem({name: "", price: ""});
    toast.success("Price updated successfully");
  };

  const handleDeleteCustomPrice = (id: string) => {
    setCustomPricesList(customPricesList.filter(item => item.id !== id));
    toast.success("Item removed from your custom price list");
  };

  const startEditing = (item: CustomGroceryItem) => {
    setIsEditing(item.id);
    setNewItem({name: item.name, price: item.price.toString()});
  };

  const calculateCustomEstimate = () => {
    // This is a simplified estimation based on custom items
    // In a real app, this would be more sophisticated
    const customTotal = calculateCustomItemTotal();
    return {
      weekly: Math.round(customTotal * 0.25), // Assuming weekly is 1/4 of monthly
      monthly: Math.round(customTotal),
      description: "Based on your custom grocery list"
    };
  };

  const toggleUseCustomPricesOnly = () => {
    setUseCustomPricesOnly(prev => {
      const newValue = !prev;
      if (newValue) {
        // When switching to custom only, update the estimate
        setEstimate(calculateCustomEstimate());
      } else {
        // When switching back to defaults, use the original estimate
        setEstimate(groceryData.groceryPrices[householdSize]);
      }
      return newValue;
    });
  };

  // Update estimate when custom prices change if using custom prices only
  useEffect(() => {
    if (useCustomPricesOnly && customPricesList.length > 0) {
      setEstimate(calculateCustomEstimate());
    }
  }, [customPricesList, useCustomPricesOnly, customItems]);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Grocery Cost Estimator</h1>
          <p className="text-muted-foreground mt-2">
            Estimate your grocery expenses based on household size or create your own custom list.
          </p>
        </div>

        <Tabs defaultValue="estimate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="estimate">Quick Estimate</TabsTrigger>
            <TabsTrigger value="custom">Custom Calculator</TabsTrigger>
            <TabsTrigger value="prices">Manage Prices</TabsTrigger>
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
                      disabled={useCustomPricesOnly}
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
                  
                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                    <Switch
                      id="custom-prices-only"
                      checked={useCustomPricesOnly}
                      onCheckedChange={toggleUseCustomPricesOnly}
                    />
                    <Label htmlFor="custom-prices-only">Use only my custom prices</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Estimated Costs</CardTitle>
                  <ExportWatermark elementRef={resultRef} filename="grocery-estimate" />
                </CardHeader>
                <CardContent>
                  <div ref={resultRef} className="p-6 bg-white dark:bg-gray-800 rounded-md space-y-4">
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
                      <p>{estimate.description}</p>
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
                                {/* Show custom prices first */}
                                {customPricesList.map((customItem) => (
                                  <SelectItem key={customItem.id} value={customItem.name}>
                                    {customItem.name} - R{customItem.price.toFixed(2)} (custom)
                                  </SelectItem>
                                ))}
                                
                                {/* Show default prices only if not using custom prices only */}
                                {!useCustomPricesOnly && groceryData.commonItems.map((groceryItem) => (
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
                              <XCircle className="h-4 w-4" />
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
                    <Plus className="h-4 w-4 mr-2" /> Add Item
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
                  <CardTitle className="text-xl">Price Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-y-auto pr-2">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Price (R)</th>
                          <th className="text-center py-2">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Show custom prices first */}
                        {customPricesList.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-muted/30">
                            <td className="py-2">{item.name}</td>
                            <td className="text-right py-2">{item.price.toFixed(2)}</td>
                            <td className="text-center py-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-finance-green/20 text-finance-green">
                                Custom
                              </span>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Show default prices only if not hiding them */}
                        {!useCustomPricesOnly && groceryData.commonItems.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30">
                            <td className="py-2">{item.name}</td>
                            <td className="text-right py-2">{item.price.toFixed(2)}</td>
                            <td className="text-center py-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                Default
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    {useCustomPricesOnly 
                      ? "Showing only your custom prices. Default prices are hidden."
                      : "Prices are based on your custom entries and average costs across major South African retailers."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="prices">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Add Custom Prices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input 
                        id="item-name" 
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        placeholder="e.g., Brown Bread (700g)"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="item-price">Price (R)</Label>
                      <Input 
                        id="item-price" 
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                        placeholder="29.99"
                        className="mt-1"
                      />
                    </div>
                    
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleUpdateCustomPrice(isEditing)}
                        >
                          <Save className="h-4 w-4 mr-2" /> Update Item
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setIsEditing(null);
                            setNewItem({name: "", price: ""});
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={handleAddCustomPrice}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Custom Price
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your Custom Prices</CardTitle>
                </CardHeader>
                <CardContent>
                  {customPricesList.length > 0 ? (
                    <div className="h-[300px] overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Item</th>
                            <th className="text-right py-2">Price (R)</th>
                            <th className="text-right py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customPricesList.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-2">{item.name}</td>
                              <td className="text-right py-2">{item.price.toFixed(2)}</td>
                              <td className="text-right py-2">
                                <div className="flex justify-end space-x-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => startEditing(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => handleDeleteCustomPrice(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No custom prices added yet.</p>
                      <p className="mt-2 text-sm">Add your own prices to create personalized grocery estimates.</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-custom-only"
                        checked={useCustomPricesOnly}
                        onCheckedChange={toggleUseCustomPricesOnly}
                      />
                      <Label htmlFor="use-custom-only">Use only my custom prices for estimates</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      When enabled, default prices will be hidden and estimates will use only your custom prices.
                    </p>
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
