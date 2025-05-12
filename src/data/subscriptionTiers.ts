
export interface SubscriptionFeature {
  name: string;
  silverIncluded: boolean;
  goldIncluded: boolean;
  platinumIncluded: boolean;
  description: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  monthly: boolean;
  description: string;
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'premium';
  features: string[];
  highlighted: boolean;
}

export const features: SubscriptionFeature[] = [
  {
    name: "Basic Financial Tools",
    silverIncluded: true,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Access to all 6 core financial tools"
  },
  {
    name: "Export Watermarked Images",
    silverIncluded: true,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Export your data as watermarked images"
  },
  {
    name: "Save Data Locally",
    silverIncluded: true,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Save your financial data on your device"
  },
  {
    name: "Remove Export Limit",
    silverIncluded: false,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Export unlimited reports and data"
  },
  {
    name: "Remove Watermarks",
    silverIncluded: false,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Export clean, watermark-free documents"
  },
  {
    name: "PDF & CSV Export",
    silverIncluded: false,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Export in additional file formats"
  },
  {
    name: "Custom Inflation Settings",
    silverIncluded: false,
    goldIncluded: true,
    platinumIncluded: true,
    description: "Set your own inflation parameters"
  },
  {
    name: "Advanced Financial Reports",
    silverIncluded: false,
    goldIncluded: false,
    platinumIncluded: true,
    description: "Detailed financial analysis reports"
  },
  {
    name: "Priority Support",
    silverIncluded: false,
    goldIncluded: false,
    platinumIncluded: true,
    description: "Get help faster when you need it"
  }
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "silver",
    name: "Silver",
    price: 0,
    monthly: false,
    description: "Free access to basic tools",
    buttonText: "Get Started",
    buttonVariant: "outline",
    features: [
      "All 6 financial tools",
      "Up to 5 image exports",
      "Watermarked exports",
      "Basic savings calculations",
      "Data saved locally"
    ],
    highlighted: false
  },
  {
    id: "gold",
    name: "Gold",
    price: 69,
    monthly: true,
    description: "Perfect for active budget planners",
    buttonText: "Upgrade to Gold",
    buttonVariant: "default",
    features: [
      "All Silver features",
      "Unlimited exports",
      "PDF & CSV exports",
      "No watermarks",
      "Custom inflation rates",
      "Advanced budget options"
    ],
    highlighted: true
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 129,
    monthly: true,
    description: "Comprehensive financial planning",
    buttonText: "Upgrade to Platinum",
    buttonVariant: "premium",
    features: [
      "All Gold features",
      "Advanced financial reports",
      "Detailed cost breakdowns",
      "Historical data tracking",
      "Priority customer support",
      "Early access to new tools"
    ],
    highlighted: false
  }
];
