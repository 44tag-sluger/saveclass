
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsCardProps {
  title: string;
  description?: string;
  tabs: TabItem[];
  footer?: ReactNode;
  className?: string;
}

export function TabsCard({
  title,
  description,
  tabs,
  footer,
  className
}: TabsCardProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
      
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export default TabsCard;
