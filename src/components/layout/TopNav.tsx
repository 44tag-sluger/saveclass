
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { isPremiumUser } from "@/utils/premium";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidenavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TopNav() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const isPremium = isPremiumUser();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidenavOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-finance-blue to-finance-green bg-clip-text text-transparent">SaveClass</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link to="/pricing">
              {isPremium ? "Manage Subscription" : "Upgrade"}
            </Link>
          </Button>
        </div>
      </div>
      
      {isMobile && sidenavOpen && (
        <MobileSidenav open={sidenavOpen} setOpen={setSidenavOpen} />
      )}
    </header>
  );
}

function MobileSidenav({ open, setOpen }: SidenavProps) {
  // Implementation for mobile sidenav
  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      open ? "block" : "hidden"
    )}>
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background p-6 shadow-lg">
        {/* Mobile nav content */}
        <Button 
          variant="ghost" 
          className="absolute right-4 top-4" 
          onClick={() => setOpen(false)}
        >
          &times;
        </Button>
        
        <div className="mt-8">
          {/* Mobile navigation links */}
        </div>
      </div>
    </div>
  );
}

export default TopNav;
