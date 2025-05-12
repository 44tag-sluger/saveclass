
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, DollarSign, LineChart, ShieldCheck, Target } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl finance-gradient-text">SaveClass</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link to="#features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link to="#pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
            <Link to="#education" className="text-sm font-medium hover:text-primary">Education</Link>
            <Link to="/advisors" className="text-sm font-medium hover:text-primary">For Advisors</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link to="/dashboard">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Take Control of Your <span className="finance-gradient-text">Financial Future</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                SaveClass helps South Africans make smarter financial decisions with simple, 
                powerful tools designed for everyday use.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="gap-1">
                <Link to="/dashboard">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50 dark:bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                All the Tools You Need
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our suite of financial tools helps you save money, reduce debt, and plan for the future.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-8">
            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 text-finance-green" />
                <CardTitle>Debt Management</CardTitle>
                <CardDescription>
                  Tackle your debt efficiently with our snowball and avalanche calculators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/debt" className="text-primary flex items-center hover:underline">
                  Try it <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-finance-blue" />
                <CardTitle>Savings Planning</CardTitle>
                <CardDescription>
                  Set and track savings goals with inflation adjustment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/savings" className="text-primary flex items-center hover:underline">
                  Try it <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <LineChart className="h-10 w-10 text-finance-gold" />
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>
                  Create comprehensive budgets with visual breakdowns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/budget" className="text-primary flex items-center hover:underline">
                  Try it <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Education</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Financial Education for Everyone
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Learn the fundamentals of personal finance with our easy-to-understand resources.
              </p>
            </div>
          </div>
          
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 pt-8">
            <Card>
              <CardHeader>
                <CardTitle>The 50/30/20 Rule</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. 
                  This simple budget framework helps prioritize your spending and ensure you're saving for the future.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Fund Basics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Everyone needs an emergency fund - ideally 3-6 months of essential expenses saved in an 
                  easily accessible account. Start small by saving just R500 per month until you build up your safety net.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-muted/50 dark:bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Start Your Financial Journey Today
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of South Africans who are taking control of their finances with SaveClass.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
              <Button asChild size="lg" className="gap-1">
                <Link to="/dashboard">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">Compare Plans</Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="border-muted">
              <CardHeader>
                <CardTitle>Silver</CardTitle>
                <div className="text-3xl font-bold">Free</div>
                <CardDescription>Basic financial tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> Basic calculators
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> 5 exports per month
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> Watermarked reports
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-finance-green">
              <CardHeader>
                <CardTitle>Gold</CardTitle>
                <div className="text-3xl font-bold">R79<span className="text-sm font-normal">/month</span></div>
                <CardDescription>Advanced tools & features</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> All basic features
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> Unlimited exports
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> Advanced calculators
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> No advertisements
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-muted">
              <CardHeader>
                <CardTitle>Platinum</CardTitle>
                <div className="text-3xl font-bold">R129<span className="text-sm font-normal">/month</span></div>
                <CardDescription>Premium financial suite</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> All Gold features
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> PDF/CSV exports
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> Data backup
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-finance-green" /> Priority support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
              <Link to="/advisors" className="text-sm font-medium hover:text-primary">For Advisors</Link>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <p className="text-sm text-muted-foreground">
                © 2025 SaveClass. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
