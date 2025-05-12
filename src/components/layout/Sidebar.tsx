
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calculator, PieChart, ShoppingBag, Wallet, 
  BarChart3, Droplets, Zap, Menu, X, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getUserTier } from "@/utils/premium";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: PieChart,
    description: "Overview of your financial tools"
  },
  {
    title: "Debt Calculator",
    href: "/debt",
    icon: Calculator,
    description: "Snowball & avalanche debt payoff methods"
  },
  {
    title: "Grocery Estimator",
    href: "/grocery",
    icon: ShoppingBag,
    description: "Estimate your grocery expenses"
  },
  {
    title: "Savings Planner",
    href: "/savings",
    icon: Wallet,
    description: "Plan savings with inflation adjustment"
  },
  {
    title: "Electricity Tracker",
    href: "/electricity",
    icon: Zap,
    description: "Track & estimate electricity usage"
  },
  {
    title: "Water Usage",
    href: "/water",
    icon: Droplets,
    description: "Track & analyze water consumption"
  },
  {
    title: "Budget Planner",
    href: "/budget",
    icon: BarChart3,
    description: "Plan & visualize your budget"
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const location = useLocation();
  const [userTier, setUserTier] = useState(getUserTier());
  
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isOpen) setIsOpen(true);
      if (mobile && isOpen) setIsOpen(false);
    }
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);
  
  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Get tier badge color
  const getTierBadgeColor = () => {
    switch (userTier) {
      case 'platinum': return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and brand */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center">
              <Wallet className="h-6 w-6 text-teal-400" strokeWidth={2} />
              <span className="ml-2 text-lg font-semibold text-sidebar-foreground">SaveClass</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors group",
                    location.pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}>
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User tier badge */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  getTierBadgeColor()
                )}>
                  {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier
                </div>
              </div>
              
              {userTier === 'silver' && (
                <Link to="/pricing">
                  <Button variant="ghost" size="sm" className="text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground">
                    <span>Upgrade</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
