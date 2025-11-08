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
      action: () => navigate('/test-backend'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to your AI Career Platform, {userName}! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                You're just getting started on your career journey. Let's set up your profile to unlock personalized recommendations and opportunities.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Profile {profileStrength}% Complete
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  New User
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
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
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-900'}`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
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
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">💡 Quick Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <p className="text-sm font-medium text-amber-800">🎯 Set Clear Goals</p>
              <p className="text-xs text-amber-700 mt-1">
                Define your career objectives to get better AI recommendations
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <p className="text-sm font-medium text-amber-800">📚 Keep Learning</p>
              <p className="text-xs text-amber-700 mt-1">
                Add new skills and certifications to boost your profile
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <p className="text-sm font-medium text-amber-800">🔄 Stay Active</p>
              <p className="text-xs text-amber-700 mt-1">
                Regular activity helps our AI provide better matches
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <p className="text-sm font-medium text-amber-800">🤝 Network</p>
              <p className="text-xs text-amber-700 mt-1">
                Connect with professionals in your field of interest
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}