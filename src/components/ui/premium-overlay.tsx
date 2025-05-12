
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumOverlayProps {
  title?: string;
  message?: string;
  className?: string;
}

export function PremiumOverlay({
  title = "Premium Feature",
  message = "Upgrade to Gold or Platinum to unlock this feature.",
  className
}: PremiumOverlayProps) {
  return (
    <div className={cn(
      "absolute inset-0 z-50 flex flex-col items-center justify-center",
      "bg-background/95 backdrop-blur-sm rounded-md",
      className
    )}>
      <div className="text-center p-6 max-w-md">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        
        <div className="mt-6">
          <Link to="/pricing">
            <Button variant="default" className="bg-teal-500 hover:bg-teal-600">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PremiumOverlay;
