import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewUserWelcomeProps {
  userName: string;
  profileStrength: number;
}

export function NewUserWelcome({ userName, profileStrength }: NewUserWelcomeProps) {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Complete Your Profile",
      description: "Add your personal and academic details",
      completed: profileStrength > 50,
      action: () => navigate('/account'),
    },
    {
      title: "Explore Opportunities",
      description: "Browse jobs, internships, and certifications",
      completed: false,
      action: () => navigate('/opportunities'),
    },
    {
      title: "Build Your Resume",
      description: "Create a professional resume with AI assistance",
      completed: false,
      action: () => navigate('/resume'),
    },
    {
      title: "Get AI Recommendations",
      description: "Receive personalized career guidance",
      completed: false,
      action: () => navigate('/timetable'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-soft border border-border">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                Welcome to your Career Platform, {userName}
              </h3>
              <p className="text-muted-foreground mb-4">
                You're just getting started on your career journey. Let's set up your profile to unlock personalized recommendations and opportunities.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground border border-border">
                  Profile {profileStrength}% Complete
                </Badge>
                <Badge variant="outline" className="text-primary border-primary/20">
                  New User
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5 text-success" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  step.completed 
                    ? 'bg-secondary/40 border-success/30' 
                    : 'bg-card border-border hover:bg-secondary/50'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${step.completed ? 'text-success' : 'text-foreground'}`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${step.completed ? 'text-success/80' : 'text-muted-foreground'}`}>
                    {step.description}
                  </p>
                </div>
                <Button
                  variant={step.completed ? "outline" : "default"}
                  size="sm"
                  onClick={step.action}
                  className="flex items-center gap-2"
                >
                  {step.completed ? 'View' : 'Start'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border border-border bg-gradient-soft">
        <CardHeader>
          <CardTitle className="text-lg text-foreground font-semibold">Quick Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold text-foreground">Set Clear Goals</p>
              <p className="text-xs text-muted-foreground mt-1">
                Define your career objectives to get better AI recommendations
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold text-foreground">Keep Learning</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add new skills and certifications to boost your profile
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold text-foreground">Stay Active</p>
              <p className="text-xs text-muted-foreground mt-1">
                Regular activity helps our AI provide better matches
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold text-foreground">Network</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect with professionals in your field of interest
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}