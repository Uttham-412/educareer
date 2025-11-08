import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface ProfileData {
  // Personal Details
  first_name: string;
  last_name: string;
  student_id: string;
  roll_number: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  whatsapp_number: string;
  profile_photo_url: string;
  linkedin_url: string;
  github_url: string;
  preferred_job_sector: string;
  preferred_work_location: string;
  languages_known: string[];
  bio: string;
}

interface AcademicData {
  institution_name: string;
  university_registration_number: string;
  department: string;
  branch: string;
  current_year: number;
  current_semester: number;
  cgpa: number;
  current_percentage: number;
  completed_courses: string[];
  technical_skills: string[];
  extracurricular_activities: string[];
}

export const StudentProfileOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    student_id: '',
    roll_number: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    whatsapp_number: '',
    profile_photo_url: '',
    linkedin_url: '',
    github_url: '',
    preferred_job_sector: '',
    preferred_work_location: '',
    languages_known: [],
    bio: ''
  });

  const [academicData, setAcademicData] = useState<AcademicData>({
    institution_name: '',
    university_registration_number: '',
    department: '',
    branch: '',
    current_year: 1,
    current_semester: 1,
    cgpa: 0,
    current_percentage: 0,
    completed_courses: [],
    technical_skills: [],
    extracurricular_activities: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const jobSectors = [
    'Software Development', 'Data Science', 'AI/Machine Learning', 'Web Development',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'UI/UX Design', 'Product Management',
    'Digital Marketing', 'Business Analysis', 'Consulting', 'Finance', 'Other'
  ];

  const departments = [
    'Computer Science Engineering', 'Information Technology', 'Electronics & Communication',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
    'Biotechnology', 'Business Administration', 'Commerce', 'Arts', 'Science', 'Other'
  ];

  const addToArray = (value: string, array: string[], setter: (arr: string[]) => void) => {
    if (value.trim() && !array.includes(value.trim())) {
      setter([...array, value.trim()]);
    }
  };

  const removeFromArray = (value: string, array: string[], setter: (arr: string[]) => void) => {
    setter(array.filter(item => item !== value));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Update profile using the API
      await usersAPI.updateProfile({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        phone: profileData.phone,
        bio: profileData.bio,
        location: profileData.preferred_work_location,
        occupation: profileData.preferred_job_sector,
        skills: academicData.technical_skills,
      });

      toast({
        title: "Profile Complete!",
        description: "Your student profile has been set up successfully.",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={profileData.first_name}
            onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={profileData.last_name}
            onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="student_id">Student ID</Label>
          <Input
            id="student_id"
            value={profileData.student_id}
            onChange={(e) => setProfileData({...profileData, student_id: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="roll_number">Roll Number</Label>
          <Input
            id="roll_number"
            value={profileData.roll_number}
            onChange={(e) => setProfileData({...profileData, roll_number: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={profileData.date_of_birth}
            onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
          <Input
            id="whatsapp_number"
            value={profileData.whatsapp_number}
            onChange={(e) => setProfileData({...profileData, whatsapp_number: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
          <Input
            id="linkedin_url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={profileData.linkedin_url}
            onChange={(e) => setProfileData({...profileData, linkedin_url: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="github_url">GitHub Profile</Label>
          <Input
            id="github_url"
            placeholder="https://github.com/yourusername"
            value={profileData.github_url}
            onChange={(e) => setProfileData({...profileData, github_url: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferred_job_sector">Preferred Job Sector *</Label>
          <Select value={profileData.preferred_job_sector} onValueChange={(value) => setProfileData({...profileData, preferred_job_sector: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select job sector" />
            </SelectTrigger>
            <SelectContent>
              {jobSectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="preferred_work_location">Preferred Work Location</Label>
          <Input
            id="preferred_work_location"
            placeholder="e.g., Bangalore, Remote, Anywhere"
            value={profileData.preferred_work_location}
            onChange={(e) => setProfileData({...profileData, preferred_work_location: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="languages">Languages Known</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a language"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray(newLanguage, profileData.languages_known, (arr) => setProfileData({...profileData, languages_known: arr}));
                setNewLanguage('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray(newLanguage, profileData.languages_known, (arr) => setProfileData({...profileData, languages_known: arr}));
              setNewLanguage('');
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profileData.languages_known.map(lang => (
            <Badge key={lang} variant="secondary" className="flex items-center gap-1">
              {lang}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFromArray(lang, profileData.languages_known, (arr) => setProfileData({...profileData, languages_known: arr}))}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="institution_name">Institution Name *</Label>
          <Input
            id="institution_name"
            value={academicData.institution_name}
            onChange={(e) => setAcademicData({...academicData, institution_name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="university_registration_number">University Registration Number</Label>
          <Input
            id="university_registration_number"
            value={academicData.university_registration_number}
            onChange={(e) => setAcademicData({...academicData, university_registration_number: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department *</Label>
          <Select value={academicData.department} onValueChange={(value) => setAcademicData({...academicData, department: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="branch">Branch/Specialization</Label>
          <Input
            id="branch"
            placeholder="e.g., AI & ML, Software Engineering"
            value={academicData.branch}
            onChange={(e) => setAcademicData({...academicData, branch: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="current_year">Current Year *</Label>
          <Select value={academicData.current_year.toString()} onValueChange={(value) => setAcademicData({...academicData, current_year: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="current_semester">Semester</Label>
          <Select value={academicData.current_semester.toString()} onValueChange={(value) => setAcademicData({...academicData, current_semester: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(sem => (
                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cgpa">CGPA</Label>
          <Input
            id="cgpa"
            type="number"
            step="0.01"
            max="10"
            value={academicData.cgpa}
            onChange={(e) => setAcademicData({...academicData, cgpa: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="current_percentage">Percentage</Label>
          <Input
            id="current_percentage"
            type="number"
            step="0.01"
            max="100"
            value={academicData.current_percentage}
            onChange={(e) => setAcademicData({...academicData, current_percentage: parseFloat(e.target.value)})}
          />
        </div>
      </div>

      <div>
        <Label>Completed Courses</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a completed course"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray(newCourse, academicData.completed_courses, (arr) => setAcademicData({...academicData, completed_courses: arr}));
                setNewCourse('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray(newCourse, academicData.completed_courses, (arr) => setAcademicData({...academicData, completed_courses: arr}));
              setNewCourse('');
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {academicData.completed_courses.map(course => (
            <Badge key={course} variant="secondary" className="flex items-center gap-1">
              {course}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFromArray(course, academicData.completed_courses, (arr) => setAcademicData({...academicData, completed_courses: arr}))}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Technical Skills</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a technical skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray(newSkill, academicData.technical_skills, (arr) => setAcademicData({...academicData, technical_skills: arr}));
                setNewSkill('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray(newSkill, academicData.technical_skills, (arr) => setAcademicData({...academicData, technical_skills: arr}));
              setNewSkill('');
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {academicData.technical_skills.map(skill => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFromArray(skill, academicData.technical_skills, (arr) => setAcademicData({...academicData, technical_skills: arr}))}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Extracurricular Activities</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add an activity"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray(newActivity, academicData.extracurricular_activities, (arr) => setAcademicData({...academicData, extracurricular_activities: arr}));
                setNewActivity('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray(newActivity, academicData.extracurricular_activities, (arr) => setAcademicData({...academicData, extracurricular_activities: arr}));
              setNewActivity('');
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {academicData.extracurricular_activities.map(activity => (
            <Badge key={activity} variant="secondary" className="flex items-center gap-1">
              {activity}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFromArray(activity, academicData.extracurricular_activities, (arr) => setAcademicData({...academicData, extracurricular_activities: arr}))}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio/About Yourself</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself, your interests, and career goals..."
          value={profileData.bio}
          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Student Profile</CardTitle>
            <CardDescription>
              Help us personalize your experience with AI-powered recommendations
            </CardDescription>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                {renderStep1()}
              </>
            )}
            {currentStep === 2 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Academic Details</h3>
                {renderStep2()}
              </>
            )}
            {currentStep === 3 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Skills & Activities</h3>
                {renderStep3()}
              </>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};