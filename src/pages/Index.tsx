import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Users, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.04),transparent_50%)] pointer-events-none" />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-3 py-1 bg-secondary text-primary font-medium hover:bg-secondary">
            AI-Powered Career Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Transform Your Career with{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Discover opportunities, build stunning resumes, and plan your career journey 
            with our comprehensive AI-powered platform designed for ambitious professionals.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-base px-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200" asChild>
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 border-border hover:bg-secondary transition-all duration-200">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 relative z-10 border-t border-border/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful tools to accelerate your career growth
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-border/80 bg-card hover:shadow-md transition-all duration-200">
            <CardHeader className="pt-8">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-xl">Smart Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Track your career progress with AI-powered insights and analytics
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="border border-border/80 bg-card hover:shadow-md transition-all duration-200">
            <CardHeader className="pt-8">
              <Users className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-xl">AI Resume Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Create professional resumes with AI suggestions and industry templates
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="border border-border/80 bg-card hover:shadow-md transition-all duration-200">
            <CardHeader className="pt-8">
              <Target className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-xl">Opportunity Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Discover relevant job opportunities tailored to your skills and goals
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="border border-border/80 bg-card hover:shadow-md transition-all duration-200">
            <CardHeader className="pt-8">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-xl">Career Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Get personalized career paths and skill development recommendations
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-indigo-900 text-primary-foreground py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-lg mb-10 opacity-80 max-w-xl mx-auto">
            Join thousands of professionals who are already using our platform
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/95 text-base px-10 transition-all duration-200" asChild>
            <Link to="/auth">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
