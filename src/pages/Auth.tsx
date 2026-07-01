import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Mail, Eye, EyeOff, Sparkles, Building2, BookOpen, User, Lock, ArrowRight } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { userAPI } from "@/lib/api";
import "./auth-animations.css";

const Auth = () => {
  const { user, loading, login, register } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Academic Details
  
  // Basic Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Academic Details
  const [studentId, setStudentId] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      // Register user
      await register(email, password, firstName, lastName);

      // Update profile with academic details
      const academicData = {
        studentId,
        institutionName,
        department,
        branch,
        currentYear: currentYear ? parseInt(currentYear) : undefined,
        currentSemester: currentSemester ? parseInt(currentSemester) : undefined,
      };
      
      console.log('Sending academic data:', academicData);
      
      if (studentId || institutionName || department || currentYear || currentSemester) {
        const response = await userAPI.updateProfile(academicData);
        console.log('Profile update response:', response.data);
      }

      toast({
        title: "Welcome to CareerPath!",
        description: "Your account has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      await login(email, password);

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.04),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-black text-primary">
                  CareerPath
                </h1>
              </div>
              
              <h2 className="text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Your Career Journey Starts Here
              </h2>
              
              <p className="text-base text-muted-foreground leading-relaxed">
                Bridge the gap between education and career with personalized recommendations, 
                smart timetable management, and AI-driven insights.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Personalized Recommendations</h3>
                  <p className="text-sm text-muted-foreground">Get personalized course and job suggestions based on your profile</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Smart Timetable Management</h3>
                  <p className="text-sm text-muted-foreground">Upload and manage your academic schedule effortlessly</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Career Opportunities</h3>
                  <p className="text-sm text-muted-foreground">Discover internships and jobs matched to your skills</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="border border-border shadow-lg bg-card/80 backdrop-blur-md">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center justify-center lg:hidden mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-foreground">
                  {isSignUp ? (
                    step === 1 ? "Create Your Account" : "Academic Details"
                  ) : (
                    "Welcome Back"
                  )}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  {isSignUp ? (
                    step === 1 
                      ? "Start your career journey today" 
                      : "Help us personalize your experience"
                  ) : (
                    "Sign in to continue to your dashboard"
                  )}
                </CardDescription>
                
                {isSignUp && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className={`w-8 h-1 rounded-full ${step === 1 ? 'bg-primary' : 'bg-secondary'}`}></div>
                    <div className={`w-8 h-1 rounded-full ${step === 2 ? 'bg-primary' : 'bg-secondary'}`}></div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sign In Form */}
                {!isSignUp && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold" 
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Sign Up Form - Step 1: Basic Info */}
                {isSignUp && step === 1 && (
                  <form onSubmit={handleNextStep} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2 text-foreground">
                          <User className="w-4 h-4" />
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                    >
                      Continue to Academic Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}

                {/* Sign Up Form - Step 2: Academic Details */}
                {isSignUp && step === 2 && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-foreground">Student ID (Optional)</Label>
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="e.g., 2021CS001"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institutionName" className="flex items-center gap-2 text-foreground">
                        <Building2 className="w-4 h-4" />
                        Institution Name
                      </Label>
                      <Input
                        id="institutionName"
                        type="text"
                        placeholder="e.g., MIT, Stanford University"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-foreground">Department</Label>
                        <Input
                          id="department"
                          type="text"
                          placeholder="e.g., Computer Science"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch" className="text-foreground">Branch/Major</Label>
                        <Input
                          id="branch"
                          type="text"
                          placeholder="e.g., AI & ML"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentYear" className="text-foreground">Current Year</Label>
                        <Select value={currentYear} onValueChange={setCurrentYear}>
                           <SelectTrigger className="h-11">
                             <SelectValue placeholder="Select year" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="1">1st Year</SelectItem>
                             <SelectItem value="2">2nd Year</SelectItem>
                             <SelectItem value="3">3rd Year</SelectItem>
                             <SelectItem value="4">4th Year</SelectItem>
                             <SelectItem value="5">5th Year</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentSemester" className="text-foreground">Current Semester</Label>
                        <Select value={currentSemester} onValueChange={setCurrentSemester}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-1 h-11 border-border text-foreground hover:bg-secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold" 
                        disabled={authLoading}
                      >
                        {authLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            Create Account
                            <Sparkles className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Toggle Sign Up/Sign In */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {isSignUp ? "Already have an account?" : "New to CareerPath?"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-border text-foreground hover:bg-secondary"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setStep(1);
                  }}
                >
                  {isSignUp ? "Sign In Instead" : "Create an Account"}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground pt-2">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;