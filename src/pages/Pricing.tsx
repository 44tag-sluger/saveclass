
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { features, subscriptionTiers } from "@/data/subscriptionTiers";
import { setUserTier, getUserTier } from "@/utils/premium";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currentTier, setCurrentTier] = useState(getUserTier());
  
  const handleUpgrade = (tierId: string) => {
    // In a real app, this would trigger payment flow
    // For demo, we'll just update the tier in localStorage
    if (tierId === "silver" || tierId === "gold" || tierId === "platinum") {
      setUserTier(tierId);
      setCurrentTier(tierId);
      toast.success(`Successfully upgraded to ${tierId.charAt(0).toUpperCase() + tierId.slice(1)} tier!`);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Select the perfect plan for your financial journey. Upgrade anytime as your needs grow.
          </p>
        </div>

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier) => (
            <Card 
              key={tier.id}
              className={cn(
                "flex flex-col",
                tier.highlighted && "border-2 border-teal-400 shadow-lg shadow-teal-50"
              )}
            >
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R{tier.price}</span>
                  {tier.monthly && <span className="text-muted-foreground ml-1">/month</span>}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={cn(
                    "w-full",
                    tier.highlighted && "bg-teal-500 hover:bg-teal-600"
                  )}
                  variant={tier.id === currentTier ? "outline" : "default"}
                  disabled={tier.id === currentTier}
                  onClick={() => handleUpgrade(tier.id)}
                >
                  {tier.id === currentTier ? "Current Plan" : tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left">Feature</th>
                  <th className="px-6 py-3 text-center">Silver</th>
                  <th className="px-6 py-3 text-center">Gold</th>
                  <th className="px-6 py-3 text-center">Platinum</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.silverIncluded ? (
                        <Check className="h-5 w-5 text-teal-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xl">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.goldIncluded ? (
                        <Check className="h-5 w-5 text-teal-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xl">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.platinumIncluded ? (
                        <Check className="h-5 w-5 text-teal-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xl">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
