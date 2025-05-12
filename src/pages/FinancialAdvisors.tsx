
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout } from "@/components/layout/PageLayout";
import { CheckCircle, Users, Building, HeartHandshake, BadgeCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function FinancialAdvisors() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit to a backend
    setFormSubmitted(true);
    toast.success("Thank you for your interest! We'll be in touch soon.");
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Partner with <span className="finance-gradient-text">SaveClass</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Empower your clients with our financial tools and grow your practice
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="space-y-1">
                <Users className="h-8 w-8 text-finance-blue mb-2" />
                <CardTitle>Expand Your Reach</CardTitle>
                <CardDescription>
                  Connect with potential clients looking for financial guidance
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="space-y-1">
                <Building className="h-8 w-8 text-finance-green mb-2" />
                <CardTitle>Build Your Brand</CardTitle>
                <CardDescription>
                  Establish yourself as an authority through our advisor directory
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="space-y-1">
                <HeartHandshake className="h-8 w-8 text-finance-gold mb-2" />
                <CardTitle>Client Support</CardTitle>
                <CardDescription>
                  Provide clients with practical tools to implement your advice
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          {/* Partnership Options */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Partnership Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-finance-blue/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-finance-blue mr-2" />
                    Directory Listing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Get featured in our financial advisor directory where users can find and connect with you.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>Profile page with contact information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>Highlight your areas of expertise</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>Display your credentials and certifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-finance-green/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-finance-green mr-2" />
                    Premium Partnership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Become a featured advisor with enhanced visibility and marketing opportunities.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>All directory listing features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>Featured placement in user recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>Contribute educational content with your branding</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-finance-green mr-2 shrink-0 mt-0.5" />
                      <span>Client referral opportunities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-muted/50 dark:bg-muted/20 rounded-xl p-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">Express Your Interest</h2>
              
              {formSubmitted ? (
                <div className="text-center p-8 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium">Thank You for Your Interest!</h3>
                  <p className="text-muted-foreground">
                    We've received your information and will contact you shortly to discuss partnership opportunities.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input id="name" required placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Company
                      </label>
                      <Input id="company" placeholder="Your company name" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input id="phone" placeholder="Your phone number" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="interest" className="text-sm font-medium">
                      How would you like to partner with SaveClass?
                    </label>
                    <Textarea
                      id="interest"
                      placeholder="Tell us about your interest and how you'd like to collaborate"
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    <Mail className="mr-2 h-4 w-4" /> Submit Interest
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
