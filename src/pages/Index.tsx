
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolCard } from "@/components/ui/tool-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ShoppingBag, Wallet, BarChart3, Droplets, Zap } from "lucide-react";
import { getUserTier, isPremiumUser } from "@/utils/premium";
import { useState, useEffect } from "react";

const Index = () => {
  const [userTier, setUserTier] = useState(getUserTier());
  const isPremium = isPremiumUser();

  useEffect(() => {
    // Update tier if it changes in localStorage
    const handleStorageChange = () => {
      setUserTier(getUserTier());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get tier badge color
  const getTierBadgeColor = () => {
    switch (userTier) {
      case 'platinum': return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };
  
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personal Finance Toolkit</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to SaveClass. Take control of your finances with our powerful tools.
            </p>
          </div>

          {/* User Tier Card */}
          <Card className="bg-gradient-to-r from-teal-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Current Subscription: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierBadgeColor()}`}>
                  {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {userTier === 'silver' 
                  ? "You're using our free tier with limited features. Upgrade for full access to all tools."
                  : "Thank you for supporting SaveClass! You have full access to all premium features."}
              </p>
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Financial Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ToolCard
                title="Debt Calculator"
                description="Plan your debt repayment with snowball or avalanche methods"
                icon={<Calculator className="h-5 w-5 text-teal-500" />}
                path="/debt"
              />
              
              <ToolCard
                title="Grocery Estimator" 
                description="Estimate grocery costs based on household size"
                icon={<ShoppingBag className="h-5 w-5 text-teal-500" />}
                path="/grocery"
              />
              
              <ToolCard
                title="Savings Planner"
                description="Plan savings with inflation adjustment"
                icon={<Wallet className="h-5 w-5 text-teal-500" />}
                path="/savings"
                isPremium={true}
              />
              
              <ToolCard
                title="Electricity Tracker"
                description="Monitor and estimate electricity costs"
                icon={<Zap className="h-5 w-5 text-teal-500" />}
                path="/electricity"
              />
              
              <ToolCard
                title="Water Usage"
                description="Track and optimize your water consumption"
                icon={<Droplets className="h-5 w-5 text-teal-500" />}
                path="/water"
              />
              
              <ToolCard
                title="Budget Planner"
                description="Create and visualize your complete budget"
                icon={<BarChart3 className="h-5 w-5 text-teal-500" />}
                path="/budget"
                isPremium={true}
              />
            </div>
          </div>
          
          {/* Financial Tips Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Financial Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">The 50/30/20 Rule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Emergency Fund</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Aim to save 3-6 months of essential expenses in an easily accessible account.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
