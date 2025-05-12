
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserTier } from "@/utils/premium";
import { useState, useEffect } from "react";

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTier, setUserTier] = useState(getUserTier());
  
  // Update tier from localStorage on mount and when it changes
  useEffect(() => {
    const tier = getUserTier();
    setUserTier(tier);
    
    // Check if user is "logged in" (for demo purposes)
    setIsLoggedIn(localStorage.getItem('is_logged_in') === 'true');
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setUserTier(getUserTier());
      setIsLoggedIn(localStorage.getItem('is_logged_in') === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle login/logout for demo
  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.setItem('is_logged_in', 'false');
      setIsLoggedIn(false);
    } else {
      localStorage.setItem('is_logged_in', 'true');
      setIsLoggedIn(true);
    }
  };

  return (
    <div className={cn(
      "h-14 px-6 border-b border-border flex items-center justify-between bg-background",
      "md:ml-64", // Add margin for sidebar
      className
    )}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center md:hidden">
          <Wallet className="h-6 w-6 text-teal-400" strokeWidth={2} />
          <span className="ml-2 text-lg font-semibold">SaveClass</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <BellRing size={18} />
        </Button>
        
        {/* Auth Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAuth}
        >
          {isLoggedIn ? "Sign Out" : "Sign In"}
        </Button>
        
        {/* Upgrade Button - only show for silver tier */}
        {userTier === 'silver' && (
          <Link to="/pricing">
            <Button variant="default" size="sm" className="bg-teal-500 hover:bg-teal-600">
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default TopNav;
