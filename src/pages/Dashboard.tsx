import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CareerRoadmap } from "@/components/dashboard/CareerRoadmap";
import { OpportunityCard, Opportunity } from "@/components/opportunities/OpportunityCard";
import { NewUserWelcome } from "@/components/dashboard/NewUserWelcome";
import { GraduationCap, TrendingUp, Zap, Award, Github } from "lucide-react";
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
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [certLink, setCertLink] = useState("");
  const [certTitle, setCertTitle] = useState("");
  const [certifyingVerifying, setCertifyingVerifying] = useState(false);

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
            console.log('Profile data from backend:', profileData);
            console.log('Current Year from backend:', profileData.currentYear);
            
            setUserProfile({
              first_name: profileData.firstName || user.email?.split('@')[0] || 'Student',
              last_name: profileData.lastName || '',
              preferred_job_sector: profileData.occupation || 'Technology',
              current_year: profileData.currentYear,
              currentYear: profileData.currentYear,
              profile_completed: !!(profileData.firstName && profileData.lastName),
              department: profileData.department,
              institutionName: profileData.institutionName
            });


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
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleApply = (_opportunityId: string) => {
    toast({
      title: "Application Started!",
      description: "Redirecting to application page...",
    });
  };

  const handleGithubVerification = async () => {
    if (!githubLink.trim()) {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    // Validate GitHub URL format
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubRegex.test(githubLink.trim())) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);

    try {
      // Call Python backend for verification
      const response = await fetch(`${import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'}/api/v1/portfolio/verify-github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ github_url: githubLink.trim() })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Verification Complete! ✅",
          description: result.message || "Your GitHub project has been verified successfully",
        });
        setGithubDialogOpen(false);
        setGithubLink("");
      } else {
        const error = await response.json();
        toast({
          title: "Verification Failed",
          description: error.detail || "Unable to verify GitHub repository",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('GitHub verification error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to verification service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleCertificationVerification = async () => {
    if (!certLink.trim() || !certTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both certification title and URL",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+\..+/;
    if (!urlRegex.test(certLink.trim())) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid certification URL",
        variant: "destructive",
      });
      return;
    }

    setCertifyingVerifying(true);

    try {
      // Call Python backend for verification
      const response = await fetch(`${import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'}/api/v1/portfolio/verify-certification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ 
          certification_url: certLink.trim(),
          title: certTitle.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Verification Complete! ✅",
          description: result.message || "Your certification has been verified successfully",
        });
        setCertDialogOpen(false);
        setCertLink("");
        setCertTitle("");
      } else {
        const error = await response.json();
        toast({
          title: "Verification Failed",
          description: error.detail || "Unable to verify certification",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Certification verification error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to verification service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setCertifyingVerifying(false);
    }
  };

  const getYearContent = () => {
    const currentYear = userProfile?.currentYear || userProfile?.current_year || 4;
    
    // Final year students (4th year and above) focus on jobs
    if (currentYear >= 4) {
      return {
        title: "Final Year Focus",
        subtitle: "Time to land your dream job! 🎯",
        description: "AI-matched opportunities based on your profile",
        recommendations: sampleOpportunities.filter(op => op.type === "job" || op.type === "internship"),
      };
    } else {
      // 1st, 2nd, 3rd year students focus on learning
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

            <div className="flex flex-col items-start gap-4">
              {userProfile?.currentYear && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-base">
                  {userProfile.currentYear === 1 ? '1st Year' :
                   userProfile.currentYear === 2 ? '2nd Year' :
                   userProfile.currentYear === 3 ? '3rd Year' :
                   userProfile.currentYear === 4 ? '4th Year' :
                   `${userProfile.currentYear}th Year`}
                </Badge>
              )}
              
              <div className="flex flex-wrap gap-2">
                {/* GitHub Verification Dialog */}
                <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-purple-600/90 hover:bg-purple-700 text-white border-0"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Upload GitHub Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        Upload GitHub Project Link
                      </DialogTitle>
                      <DialogDescription>
                        Submit your GitHub repository URL for verification. We'll analyze your project and add it to your profile.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="github-link">GitHub Repository URL</Label>
                        <Input
                          id="github-link"
                          placeholder="https://github.com/username/repository"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          Example: https://github.com/username/my-awesome-project
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900 font-medium mb-1">What we verify:</p>
                        <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                          <li>Repository exists and is accessible</li>
                          <li>Code quality and structure</li>
                          <li>Documentation (README)</li>
                          <li>Commit history and activity</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setGithubDialogOpen(false);
                          setGithubLink("");
                        }}
                        disabled={verifying}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={handleGithubVerification}
                        disabled={verifying}
                      >
                        {verifying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Github className="w-4 h-4 mr-2" />
                            Verify Project
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Certification Verification Dialog */}
                <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-blue-600/90 hover:bg-blue-700 text-white border-0"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Upload Certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Upload Certification Link
                      </DialogTitle>
                      <DialogDescription>
                        Submit your certification URL for verification. We support Coursera, edX, Udemy, LinkedIn Learning, and more.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cert-title">Certification Title</Label>
                        <Input
                          id="cert-title"
                          placeholder="e.g., AWS Certified Solutions Architect"
                          value={certTitle}
                          onChange={(e) => setCertTitle(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cert-link">Certification URL</Label>
                        <Input
                          id="cert-link"
                          placeholder="https://coursera.org/verify/..."
                          value={certLink}
                          onChange={(e) => setCertLink(e.target.value)}
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          Paste the verification link from your certification provider
                        </p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-900 font-medium mb-1">Supported platforms:</p>
                        <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
                          <li>Coursera, edX, Udemy</li>
                          <li>LinkedIn Learning</li>
                          <li>Credly, Badgr (Digital Badges)</li>
                          <li>Other certification providers</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setCertDialogOpen(false);
                          setCertLink("");
                          setCertTitle("");
                        }}
                        disabled={certifyingVerifying}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        onClick={handleCertificationVerification}
                        disabled={certifyingVerifying}
                      >
                        {certifyingVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Verify Certification
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

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