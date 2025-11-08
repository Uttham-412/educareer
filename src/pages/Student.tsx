import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StudentProfile {
  firstName: string;
  lastName: string;
  studentId: string;
  rollNumber: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  dateOfBirth: string;
  gender: string;
  linkedinUrl: string;
  githubUrl: string;
  preferredJobSector: string;
  preferredWorkLocation: string;
  languagesKnown: string[];
  bio: string;
  // Academic details
  institutionName: string;
  department: string;
  branch: string;
  currentYear: number;
  currentSemester: number;
  cgpa: number;
  currentPercentage: number;
  profileImage: string;
}

const Student = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: '',
    lastName: '',
    studentId: '',
    rollNumber: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: '',
    linkedinUrl: '',
    githubUrl: '',
    preferredJobSector: '',
    preferredWorkLocation: '',
    languagesKnown: [],
    bio: '',
    institutionName: '',
    department: '',
    branch: '',
    currentYear: 1,
    currentSemester: 1,
    cgpa: 0,
    currentPercentage: 0,
    profileImage: ''
  });
  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      // Use user data from auth context
      const combinedProfile: StudentProfile = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        studentId: '',
        rollNumber: '',
        email: user.email || '',
        phone: user.phone || '',
        whatsappNumber: '',
        dateOfBirth: '',
        gender: '',
        linkedinUrl: '',
        githubUrl: '',
        preferredJobSector: user.occupation || '',
        preferredWorkLocation: user.location || '',
        languagesKnown: [],
        bio: user.bio || '',
        institutionName: '',
        department: '',
        branch: '',
        currentYear: 1,
        currentSemester: 1,
        cgpa: 0,
        currentPercentage: 0,
        profileImage: ''
      };

      setProfile(combinedProfile);
      setEditedProfile(combinedProfile);
    } catch (error) {
      console.error('Error setting user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Update profile using the API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          phone: editedProfile.phone,
          bio: editedProfile.bio,
          location: editedProfile.preferredWorkLocation,
          occupation: editedProfile.preferredJobSector,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof StudentProfile, value: string | number) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = () => {
    const first = profile.firstName?.charAt(0) || '';
    const last = profile.lastName?.charAt(0) || '';
    return first + last || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getYearText = (year: number) => {
    const yearMap = {
      1: 'First Year',
      2: 'Second Year', 
      3: 'Third Year',
      4: 'Final Year'
    };
    return yearMap[year as keyof typeof yearMap] || `Year ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const courseOptions = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Data Science',
    'Cybersecurity',
    'Business Administration',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics'
  ];

  const yearOptions = [
    'First Year',
    'Second Year',
    'Third Year',
    'Final Year',
    'Graduate'
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and academic details</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                    onClick={() => toast({ title: "Coming Soon", description: "Profile photo upload will be available soon." })}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {profile.firstName || profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}`.trim()
                    : user?.email?.split('@')[0] || 'Student'
                  }
                </CardTitle>
                <CardDescription className="text-base">
                  {profile.department || 'Department'} • {getYearText(profile.currentYear)}
                  {profile.institutionName && ` • ${profile.institutionName}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={editedProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.firstName || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={editedProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.lastName || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                {isEditing ? (
                  <Input
                    id="studentId"
                    value={editedProfile.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    placeholder="Enter student ID"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.studentId || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                {isEditing ? (
                  <Input
                    id="rollNumber"
                    value={editedProfile.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    placeholder="Enter roll number"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.rollNumber || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="p-3 bg-muted rounded-md">{profile.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                {isEditing ? (
                  <Input
                    id="whatsappNumber"
                    value={editedProfile.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    placeholder="Enter WhatsApp number"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.whatsappNumber || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">
                    {profile.dateOfBirth 
                      ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not provided'
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                {isEditing ? (
                  <Input
                    id="linkedinUrl"
                    value={editedProfile.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">
                    {profile.linkedinUrl ? (
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.linkedinUrl}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Profile</Label>
                {isEditing ? (
                  <Input
                    id="githubUrl"
                    value={editedProfile.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">
                    {profile.githubUrl ? (
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.githubUrl}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your course and academic year details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                {isEditing ? (
                  <Input
                    id="institutionName"
                    value={editedProfile.institutionName}
                    onChange={(e) => handleInputChange('institutionName', e.target.value)}
                    placeholder="Enter institution name"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.institutionName || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.department} 
                    onValueChange={(value) => handleInputChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.department || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentYear">Current Year</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.currentYear.toString()} 
                    onValueChange={(value) => handleInputChange('currentYear', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-3 bg-muted rounded-md">{getYearText(profile.currentYear)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSemester">Semester</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.currentSemester.toString()} 
                    onValueChange={(value) => handleInputChange('currentSemester', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.currentSemester || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                {isEditing ? (
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    max="10"
                    value={editedProfile.cgpa}
                    onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.cgpa ? profile.cgpa.toFixed(2) : 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch/Specialization</Label>
                {isEditing ? (
                  <Input
                    id="branch"
                    value={editedProfile.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    placeholder="e.g., AI & ML, Software Engineering"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.branch || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPercentage">Current Percentage</Label>
                {isEditing ? (
                  <Input
                    id="currentPercentage"
                    type="number"
                    step="0.01"
                    max="100"
                    value={editedProfile.currentPercentage}
                    onChange={(e) => handleInputChange('currentPercentage', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.currentPercentage ? `${profile.currentPercentage.toFixed(2)}%` : 'Not provided'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Preferences */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Career Preferences</CardTitle>
            <CardDescription>Your career goals and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredJobSector">Preferred Job Sector</Label>
                {isEditing ? (
                  <Input
                    id="preferredJobSector"
                    value={editedProfile.preferredJobSector}
                    onChange={(e) => handleInputChange('preferredJobSector', e.target.value)}
                    placeholder="e.g., Software Development, Data Science"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.preferredJobSector || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredWorkLocation">Preferred Work Location</Label>
                {isEditing ? (
                  <Input
                    id="preferredWorkLocation"
                    value={editedProfile.preferredWorkLocation}
                    onChange={(e) => handleInputChange('preferredWorkLocation', e.target.value)}
                    placeholder="e.g., Bangalore, Remote, Anywhere"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.preferredWorkLocation || 'Not provided'}</p>
                )}
              </div>
            </div>

            {profile.bio && (
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <p className="p-3 bg-muted rounded-md">{profile.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Student;