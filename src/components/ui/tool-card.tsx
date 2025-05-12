
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  isPremium?: boolean;
  className?: string;
}

export function ToolCard({
  title,
  description,
  icon,
  path,
  isPremium = false,
  className
}: ToolCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      isPremium && "border-teal-400/50",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-md flex items-center justify-center bg-muted">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="h-12">{description}</CardDescription>
      </CardContent>
      
      <CardFooter>
        <Link to={path} className="w-full">
          <Button variant="outline" className="w-full justify-between group">
            <span>Open Tool</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
      
      {isPremium && (
        <div className="absolute top-0 right-0">
          <div className="bg-teal-500 text-white text-xs px-2 py-1 rounded-bl">
            Premium
          </div>
        </div>
      )}
    </Card>
  );
}

export default ToolCard;
