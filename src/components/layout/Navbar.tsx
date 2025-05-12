
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useUser, UserTier } from '@/context/UserContext';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const Navbar = () => {
  const { isAuthenticated, login, logout, userTier, upgradeTier } = useUser();
  const { toggleSidebar } = useSidebar();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const handleLogin = () => {
    login();
    setLoginDialogOpen(false);
  };

  const handleUpgrade = (tier) => {
    upgradeTier(tier);
    setUpgradeDialogOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <button
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-primary dark:text-primary">
              SaveClass
            </a>
            <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded">
              Finance Toolkit
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline-block text-sm">
                {userTier === 'silver' && 'Free User'}
                {userTier === 'gold' && 'Gold Member'}
                {userTier === 'platinum' && 'Platinum Member'}
              </span>
              <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade Your Account</DialogTitle>
                    <DialogDescription>
                      Choose a plan that works best for you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-4 border rounded-lg text-center ${userTier === 'silver' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700' : 'bg-white dark:bg-gray-900'}`}>
                        <h3 className="font-semibold">Silver</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Free</p>
                        <p className="text-xs mt-2">Basic features</p>
                      </div>
                      <div className={`p-4 border rounded-lg text-center ${userTier === 'gold' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700' : 'bg-white dark:bg-gray-900'}`}>
                        <h3 className="font-semibold">Gold</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">R99/month</p>
                        <p className="text-xs mt-2">Advanced features</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpgrade('gold')} 
                          className="mt-2"
                          disabled={userTier === 'gold'}
                        >
                          {userTier === 'gold' ? 'Current' : 'Select'}
                        </Button>
                      </div>
                      <div className={`p-4 border rounded-lg text-center ${userTier === 'platinum' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700' : 'bg-white dark:bg-gray-900'}`}>
                        <h3 className="font-semibold">Platinum</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">R199/month</p>
                        <p className="text-xs mt-2">All features</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpgrade('platinum')} 
                          className="mt-2"
                          disabled={userTier === 'platinum'}
                        >
                          {userTier === 'platinum' ? 'Current' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Welcome back!</DialogTitle>
                    <DialogDescription>
                      This is a demo login. No real authentication is performed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Button onClick={handleLogin}>
                        Sign In (Demo)
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
