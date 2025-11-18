import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CareerRoadmap } from "@/components/dashboard/CareerRoadmap";
import { OpportunityCard, Opportunity } from "@/components/opportunities/OpportunityCard";
import { NewUserWelcome } from "@/components/dashboard/NewUserWelcome";
import { GraduationCap, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Sample opportunities will be loaded from the API
const sampleOpportunities: Opportunity[] = [];

interface UserProfile {
  first_name: string;
  last_name: string;
  preferred_job_sector: string;
  current_year?: number;
  currentYear?: number;
  profile_completed: boolean;
  department?: string;
  institutionName?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("final");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          // Fetch full profile from backend
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (response.ok) {
            const profileData = await response.json();
            
            setUserProfile({
              first_name: profileData.firstName || user.email?.split('@')[0] || 'Student',
              last_name: profileData.lastName || '',
              preferred_job_sector: profileData.occupation || 'Technology',
              current_year: profileData.currentYear || 4,
              currentYear: profileData.currentYear || 4,
              profile_completed: !!(profileData.firstName && profileData.lastName),
              department: profileData.department,
              institutionName: profileData.institutionName
            });

            // Set year based on user's actual year
            const yearMap: { [key: number]: string } = {
              1: 'first',
              2: 'second',
              3: 'third',
              4: 'final'
            };
            setSelectedYear(yearMap[profileData.currentYear || 4] || 'final');
          } else {
            // Fallback to user data from auth context
            setUserProfile({
              first_name: user.firstName || user.email?.split('@')[0] || 'Student',
              last_name: user.lastName || '',
              preferred_job_sector: user.occupation || 'Technology',
              current_year: 4,
              currentYear: 4,
              profile_completed: !!(user.firstName && user.lastName)
            });
            setSelectedYear("final");
          }

        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to user data from auth context
          setUserProfile({
            first_name: user.firstName || user.email?.split('@')[0] || 'Student',
            last_name: user.lastName || '',
            preferred_job_sector: user.occupation || 'Technology',
            current_year: 4,
            currentYear: 4,
            profile_completed: !!(user.firstName && user.lastName)
          });
          setSelectedYear("final");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleApply = (opportunityId: string) => {
    toast({
      title: "Application Started!",
      description: "Redirecting to application page...",
    });
  };

  const getYearContent = () => {
    if (selectedYear === "final") {
      return {
        title: "Final Year Focus",
        subtitle: "Time to land your dream job! 🎯",
        description: "AI-matched opportunities based on your profile",
        recommendations: sampleOpportunities.filter(op => op.type === "job" || op.type === "internship"),
      };
    } else {
      return {
        title: "Learning & Building Phase",
        subtitle: "Focus on skills and certifications 📚",
        description: "Build a strong foundation for your career",
        recommendations: sampleOpportunities.filter(op => op.type === "certification"),
      };
    }
  };

  const yearContent = getYearContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userName = userProfile?.first_name 
    ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Student';

  const isNewUser = !userProfile?.profile_completed;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header Section */}
      <div className="hero-gradient rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold animate-slide-up">
                Welcome {userName}! 👋
              </h1>
              <p className="text-white/80 text-lg">
                {isNewUser 
                  ? "Let's start building your career journey together" 
                  : "Let's accelerate your career journey today"
                }
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {yearContent.subtitle}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">1st Year</SelectItem>
                  <SelectItem value="second">2nd Year</SelectItem>
                  <SelectItem value="third">3rd Year</SelectItem>
                  <SelectItem value="final">Final Year</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => window.location.href = '/student'}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <DashboardStats />
      </div>

      {/* New User Welcome or Main Dashboard */}
      {isNewUser ? (
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <NewUserWelcome 
            userName={userName} 
            profileStrength={userProfile?.profile_completed ? 100 : 25} 
          />
        </div>
      ) : (
        /* Main Dashboard Grid */
        <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column - Career Path & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Career Roadmap */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CareerRoadmap />
          </div>

          {/* Quick Actions Card */}
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 hover-glow"
                onClick={() => window.location.href = '/student'}
              >
                <GraduationCap className="w-4 h-4" />
                Update Skills Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 hover-glow"
                onClick={() => window.location.href = '/account'}
              >
                <TrendingUp className="w-4 h-4" />
                View Career Analytics
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 hover-glow"
                onClick={() => window.location.href = '/resume'}
              >
                📄 Download Resume
              </Button>
              <Button 
                className="w-full gap-2 bg-gradient-primary"
                onClick={() => window.location.href = '/opportunities'}
              >
                🚀 Explore New Opportunities
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Dynamic Content & Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Personalized Recommendations */}
          <Card className="glass-card hover-lift animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Zap className="w-6 h-6 text-primary animate-pulse-glow" />
                    {yearContent.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {yearContent.description}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {yearContent.recommendations.map((opportunity, index) => (
                  <div 
                    key={opportunity.id} 
                    className="animate-slide-up" 
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <OpportunityCard
                      opportunity={opportunity}
                      onApply={handleApply}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Enhanced */}
          <Card className="bg-gradient-soft border-primary/20 hover-lift animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center animate-float">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    🤖 AI Career Insights
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Based on your profile and current market trends, here are personalized recommendations:
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="bg-white/50 rounded-lg p-3 border border-primary/10">
                      <p className="text-sm font-medium text-foreground">📈 Skill Boost</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add <strong>TypeScript</strong> certification to boost profile by 25%
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-primary/10">
                      <p className="text-sm font-medium text-foreground">🎯 Market Trend</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        High demand for <strong>React developers</strong> in your area
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-primary/10">
                      <p className="text-sm font-medium text-foreground">📊 Progress</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Resume score improved by <strong>15%</strong> this month!
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-primary/10">
                      <p className="text-sm font-medium text-foreground">💡 Next Step</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete 2 more projects to reach <strong>Expert</strong> level
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
        </div>
      )}
    </div>
  );
}