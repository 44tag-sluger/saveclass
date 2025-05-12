
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, DollarSign, LineChart, ShieldCheck, Target, Sparkles, BarChart4 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect } from "react";

export default function LandingPage() {
  // Animate elements as they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen animated-bg">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl finance-gradient-text">SaveClass</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
            <Link to="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link to="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            <Link to="#education" className="text-sm font-medium hover:text-primary transition-colors">Education</Link>
            <Link to="/advisors" className="text-sm font-medium hover:text-primary transition-colors">For Advisors</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="outline" className="hover:bg-secondary/50 transition-colors">
              <Link to="/dashboard">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6 relative">
          {/* Background decoration */}
          <div className="absolute -top-20 -right-10 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute top-40 -left-10 w-72 h-72 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl" aria-hidden="true"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col space-y-4 text-left md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter animate-fade-in">
                Take Control of Your <br className="hidden md:inline" />
                <span className="finance-gradient-text">Financial Future</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-[600px] animate-fade-in animate-delay-100">
                SaveClass helps South Africans make smarter financial decisions with simple, 
                powerful tools designed for everyday use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in animate-delay-200">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white gap-1 group">
                  <Link to="/dashboard">
                    Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover:bg-secondary/50 transition-colors">
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
            
            {/* Hero image/illustration */}
            <div className="md:w-1/2 mt-8 md:mt-0 animate-fade-in animate-delay-300">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-30 blur-xl animate-pulse-glow"></div>
                <div className="relative overflow-hidden rounded-xl border border-border shadow-md bg-gradient-to-br from-background to-secondary/20 dark:from-secondary/10 dark:to-background p-1">
                  <img 
                    src="https://placehold.co/600x400/dedcff/333333?text=Finance+Dashboard" 
                    alt="Finance Dashboard Preview"
                    className="rounded-lg object-cover w-full h-full" 
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-accent/20 rounded-full h-24 w-24 flex items-center justify-center animate-float">
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-on-scroll opacity-0">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                All the Tools You Need
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our suite of financial tools helps you save money, reduce debt, and plan for the future.
              </p>
            </div>
          </div>
          
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-12">
            <Card className="card-hover border border-border animate-on-scroll opacity-0">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Debt Management</CardTitle>
                <CardDescription>
                  Tackle your debt efficiently with our snowball or avalanche methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/debt" className="text-primary flex items-center hover:underline">
                  Try it <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="card-hover border border-border animate-on-scroll opacity-0" style={{animationDelay: "0.1s"}}>
              <CardHeader>
                <div className="p-3 rounded-full bg-accent/10 w-fit mb-2">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Savings Planning</CardTitle>
                <CardDescription>
                  Set and track savings goals with inflation adjustment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/savings" className="text-primary flex items-center hover:underline">
                  Try it <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="card-hover border border-border animate-on-scroll opacity-0" style={{animationDelay: "0.2s"}}>
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-2">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>
                  Create comprehensive budgets with visual breakdowns
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
      <section id="education" className="py-20 relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 animate-on-scroll opacity-0">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-primary font-medium mb-4">Education</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Financial Education for Everyone
              </h2>
              <p className="text-muted-foreground md:text-lg mb-6">
                Learn the fundamentals of personal finance with our easy-to-understand resources.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Beginner-friendly content</h3>
                    <p className="text-muted-foreground text-sm">No confusing jargon, just clear explanations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">South African focused</h3>
                    <p className="text-muted-foreground text-sm">Relevant to local market conditions and regulations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Practical advice</h3>
                    <p className="text-muted-foreground text-sm">Tips you can apply to your finances today</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-on-scroll opacity-0">
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">The 50/30/20 Rule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. 
                    This simple budget framework helps prioritize your spending.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Emergency Fund Basics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Everyone needs an emergency fund - ideally 3-6 months of essential expenses saved in an 
                    easily accessible account.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Debt Management Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare the debt snowball (paying smallest debts first) and debt avalanche (paying highest interest first) 
                    methods to find what works best for your situation and motivation style.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/20 to-transparent dark:from-secondary/5 -z-10"></div>
      </section>
      
      {/* CTA/Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-secondary/20 to-background dark:from-secondary/5 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-on-scroll opacity-0">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Start Your Financial Journey Today
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Join thousands of South Africans who are taking control of their finances with SaveClass.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="border-border relative animate-on-scroll opacity-0 card-hover">
              <CardHeader>
                <CardTitle>Silver</CardTitle>
                <div className="text-3xl font-bold">Free</div>
                <CardDescription>Basic financial tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Basic calculators
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> 5 exports per month
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Watermarked reports
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary relative animate-on-scroll opacity-0 card-hover" style={{animationDelay: "0.1s"}}>
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              <CardHeader>
                <CardTitle>Gold</CardTitle>
                <div className="text-3xl font-bold">R79<span className="text-sm font-normal">/month</span></div>
                <CardDescription>Advanced tools & features</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> All basic features
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Unlimited exports
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Advanced calculators
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> No advertisements
                  </li>
                </ul>
                <Button asChild variant="default" className="w-full mt-6 bg-primary hover:bg-primary/90">
                  <Link to="/dashboard">Choose Plan</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-border relative animate-on-scroll opacity-0 card-hover" style={{animationDelay: "0.2s"}}>
              <CardHeader>
                <CardTitle>Platinum</CardTitle>
                <div className="text-3xl font-bold">R129<span className="text-sm font-normal">/month</span></div>
                <CardDescription>Premium financial suite</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> All Gold features
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> PDF/CSV exports
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Data backup
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Priority support
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-6">
                  <Link to="/dashboard">Choose Plan</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Advisors Section */}
      <section id="advisors" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 animate-on-scroll opacity-0">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-30 blur-lg"></div>
                <img 
                  src="https://placehold.co/600x400/dedcff/333333?text=Financial+Advisor" 
                  alt="Financial Advisor" 
                  className="rounded-lg relative z-10 w-full"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 animate-on-scroll opacity-0">
              <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm text-accent font-medium mb-4">
                For Financial Advisors
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Partner With Us
              </h2>
              <p className="text-muted-foreground md:text-lg mb-6">
                Expand your practice and help more clients achieve financial wellness through our partnership program.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Client referral program</h3>
                    <p className="text-muted-foreground text-sm">Connect with users looking for professional guidance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Co-branded tools</h3>
                    <p className="text-muted-foreground text-sm">Offer our calculators with your branding to clients</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enhanced analytics</h3>
                    <p className="text-muted-foreground text-sm">Get insights to better serve your clients' needs</p>
                  </div>
                </div>
              </div>
              
              <Link to="/advisors">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Learn More About Partnerships
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20 dark:bg-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-bold text-xl finance-gradient-text">SaveClass</span>
              <p className="text-sm text-muted-foreground">
                Financial tools to help South Africans succeed.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#education" className="text-muted-foreground hover:text-foreground transition-colors">Education</Link></li>
                <li><Link to="/advisors" className="text-muted-foreground hover:text-foreground transition-colors">For Advisors</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 SaveClass. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
