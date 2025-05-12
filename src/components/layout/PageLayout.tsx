
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full md:pl-64">
        <TopNav />
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-8", className)}>
          {children}
        </main>
        
        {/* Ad placeholder for free users */}
        <div className="border-t border-border p-4 bg-muted/30 text-center text-sm text-muted-foreground">
          <p>Advertisement Space - Upgrade to remove ads</p>
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
