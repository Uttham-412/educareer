import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usersAPI } from "@/lib/api";
import { X } from "lucide-react";

interface Profile {
  first_name: string;
  last_name: string;
  student_id: string;
  roll_number: string;
  gender: string;
  phone: string;
  whatsapp_number: string;
  date_of_birth: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  preferred_job_sector: string;
  preferred_work_location: string;
  languages_known: string[];
  bio: string;
  skills: string[];
  experience_level: string;
  preferred_work_type: string;
}

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    student_id: "",
    roll_number: "",
    gender: "",
    phone: "",
    whatsapp_number: "",
    date_of_birth: "",
    location: "",
    linkedin_url: "",
    github_url: "",
    preferred_job_sector: "",
    preferred_work_location: "",
    languages_known: [],
    bio: "",
    skills: [],
    experience_level: "",
    preferred_work_type: "",
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      // Fetch profile from API
      const response = await usersAPI.getProfile();
      const userData = response.data;
      
      setProfile({
        first_name: userData.firstName || "",
        last_name: userData.lastName || "",
        student_id: "",
        roll_number: "",
        gender: "",
        phone: userData.phone || "",
        whatsapp_number: "",
        date_of_birth: "",
        location: userData.location || "",
        linkedin_url: "",
        github_url: "",
        preferred_job_sector: userData.occupation || "",
        preferred_work_location: userData.location || "",
        languages_known: [],
        bio: userData.bio || "",
        skills: userData.skills || [],
        experience_level: userData.experienceLevel || "",
        preferred_work_type: userData.preferredWorkType || "",
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to user data from auth context
      setProfile({
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        student_id: "",
        roll_number: "",
        gender: "",
        phone: user.phone || "",
        whatsapp_number: "",
        date_of_birth: "",
        location: user.location || "",
        linkedin_url: "",
        github_url: "",
        preferred_job_sector: user.occupation || "",
        preferred_work_location: user.location || "",
        languages_known: [],
        bio: user.bio || "",
        skills: user.skills || [],
        experience_level: user.experienceLevel || "",
        preferred_work_type: user.preferredWorkType || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await usersAPI.updateProfile({
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        occupation: profile.preferred_job_sector,
        experienceLevel: profile.experience_level,
        preferredWorkType: profile.preferred_work_type,
        skills: profile.skills,
      });

      // Update auth context with new user data
      const updatedUserData = response.data.user;
      if (updatedUserData) {
        // Update the context
        (window as any).updateAuthUser?.(updatedUserData);
      }

      // Refresh user data from API
      await fetchProfile();

      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !profile.skills.includes(currentSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, currentSkill.trim()]
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Account Setup</h1>
            <p className="text-muted-foreground">Complete your profile information</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Tell us about yourself to personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({...profile, date_of_birth: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="City, Country"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profile.occupation}
                    onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select value={profile.experience_level} onValueChange={(value) => setProfile({...profile, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferred_work_type">Preferred Work Type</Label>
                  <Select value={profile.preferred_work_type} onValueChange={(value) => setProfile({...profile, preferred_work_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;