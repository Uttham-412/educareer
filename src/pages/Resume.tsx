import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, X, FileText, Zap, Check, Upload, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumeTemplate1 from "@/components/resume/ResumeTemplate1";
import ResumeTemplate2 from "@/components/resume/ResumeTemplate2";
import ResumeTemplate3 from "@/components/resume/ResumeTemplate3";
import ResumeTemplate4 from "@/components/resume/ResumeTemplate4";

interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  cgpa?: string;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  responsibilities: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link?: string;
}

interface Activity {
  id: string;
  title: string;
  organization: string;
  role: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  occupation?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photo?: string;
  objective?: string;
  languages?: string[];
  interests?: string[];
}

export default function Resume() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
  });

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
  });

  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
    cgpa: "",
  });

  const [newExperience, setNewExperience] = useState({
    role: "",
    company: "",
    duration: "",
    responsibilities: "",
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [newPublication, setNewPublication] = useState({
    title: "",
    publisher: "",
    date: "",
    link: "",
  });

  const [newActivity, setNewActivity] = useState({
    title: "",
    organization: "",
    role: "",
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            location: data.location,
            occupation: data.occupation,
            bio: data.bio,
            linkedin: data.linkedin,
            github: data.github,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();

    // Listen for profile updates from Student page
    const handleProfileUpdate = (event: any) => {
      const updatedProfile = event.detail;
      setUserProfile({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        location: updatedProfile.preferredWorkLocation,
        occupation: updatedProfile.preferredJobSector,
        bio: updatedProfile.bio,
        linkedin: updatedProfile.linkedinUrl,
        github: updatedProfile.githubUrl,
      });
      
      toast({
        title: "Resume Updated!",
        description: "Your resume has been automatically updated with your new profile information.",
      });
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [toast]);

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: "Beginner",
      }]);
      setNewSkill("");
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setProjects([...projects, {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies.split(",").map(t => t.trim()).filter(t => t),
      }]);
      setNewProject({ title: "", description: "", technologies: "" });
      toast({
        title: "Project Added!",
        description: "Your project has been added to your resume.",
      });
    }
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      setCertifications([...certifications, {
        id: Date.now().toString(),
        name: newCertification.name,
        issuer: newCertification.issuer,
        date: newCertification.date || new Date().toISOString().split('T')[0],
      }]);
      setNewCertification({ name: "", issuer: "", date: "" });
      toast({
        title: "Certification Added!",
        description: "Your certification has been added to your resume.",
      });
    }
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  // Education handlers
  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setEducation([...education, {
        id: Date.now().toString(),
        ...newEducation,
      }]);
      setNewEducation({ degree: "", institution: "", year: "", cgpa: "" });
      toast({ title: "Education Added!", description: "Your education has been added to your resume." });
    }
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  // Experience handlers
  const addExperience = () => {
    if (newExperience.role.trim() && newExperience.company.trim()) {
      setExperience([...experience, {
        id: Date.now().toString(),
        ...newExperience,
      }]);
      setNewExperience({ role: "", company: "", duration: "", responsibilities: "" });
      toast({ title: "Experience Added!", description: "Your work experience has been added to your resume." });
    }
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  // Achievement handlers
  const addAchievement = () => {
    if (newAchievement.title.trim()) {
      setAchievements([...achievements, {
        id: Date.now().toString(),
        ...newAchievement,
      }]);
      setNewAchievement({ title: "", description: "", date: "" });
      toast({ title: "Achievement Added!", description: "Your achievement has been added to your resume." });
    }
  };

  const removeAchievement = (id: string) => {
    setAchievements(achievements.filter(ach => ach.id !== id));
  };

  // Publication handlers
  const addPublication = () => {
    if (newPublication.title.trim() && newPublication.publisher.trim()) {
      setPublications([...publications, {
        id: Date.now().toString(),
        ...newPublication,
      }]);
      setNewPublication({ title: "", publisher: "", date: "", link: "" });
      toast({ title: "Publication Added!", description: "Your publication has been added to your resume." });
    }
  };

  const removePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
  };

  // Activity handlers
  const addActivity = () => {
    if (newActivity.title.trim() && newActivity.organization.trim()) {
      setActivities([...activities, {
        id: Date.now().toString(),
        ...newActivity,
      }]);
      setNewActivity({ title: "", organization: "", role: "" });
      toast({ title: "Activity Added!", description: "Your extracurricular activity has been added to your resume." });
    }
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
  };

  const downloadPDF = async () => {
    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Resume preview not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your resume.",
      });

      // Dynamically import html2canvas and jsPDF
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Capture the resume as canvas with higher quality
      const canvas = await html2canvas(resumeElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        windowHeight: 1697, // A4 ratio
      });

      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If content is longer than one page, add multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
      
      // Generate filename with user's name
      const fileName = `${userProfile.firstName || 'Resume'}_${userProfile.lastName || 'CV'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF Downloaded!",
        description: `Your resume has been saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadWord = async () => {
    try {
      toast({
        title: "Generating Word Document...",
        description: "Please wait while we create your resume.",
      });

      // Dynamically import docx
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header with name
            new Paragraph({
              text: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.toUpperCase(),
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            // Occupation
            new Paragraph({
              text: userProfile.occupation || '',
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            // Contact Info
            new Paragraph({
              children: [
                new TextRun({ text: `Email: ${userProfile.email || ''} | `, size: 20 }),
                new TextRun({ text: `Phone: ${userProfile.phone || ''} | `, size: 20 }),
                new TextRun({ text: `Location: ${userProfile.location || ''}`, size: 20 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            
            // Professional Summary
            ...(userProfile.objective ? [
              new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: userProfile.objective,
                spacing: { after: 300 },
              }),
            ] : []),
            
            // Education
            ...(education.length > 0 ? [
              new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...education.flatMap(edu => [
                new Paragraph({
                  children: [
                    new TextRun({ text: edu.degree, bold: true }),
                  ],
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  text: `${edu.institution} | ${edu.year}${edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}`,
                  spacing: { after: 200 },
                }),
              ]),
            ] : []),
            
            // Experience
            ...(experience.length > 0 ? [
              new Paragraph({
                text: "WORK EXPERIENCE",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...experience.flatMap(exp => [
                new Paragraph({
                  children: [
                    new TextRun({ text: exp.role, bold: true }),
                  ],
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  text: `${exp.company} | ${exp.duration}`,
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  text: exp.responsibilities,
                  spacing: { after: 200 },
                }),
              ]),
            ] : []),
            
            // Skills
            ...(skills.length > 0 ? [
              new Paragraph({
                text: "SKILLS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: skills.map(s => `${s.name} (${s.level})`).join(' • '),
                spacing: { after: 300 },
              }),
            ] : []),
            
            // Projects
            ...(projects.length > 0 ? [
              new Paragraph({
                text: "PROJECTS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...projects.flatMap(proj => [
                new Paragraph({
                  children: [
                    new TextRun({ text: proj.title, bold: true }),
                  ],
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  text: proj.description,
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  text: `Technologies: ${proj.technologies.join(', ')}`,
                  spacing: { after: 200 },
                }),
              ]),
            ] : []),
            
            // Certifications
            ...(certifications.length > 0 ? [
              new Paragraph({
                text: "CERTIFICATIONS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...certifications.map(cert => 
                new Paragraph({
                  text: `${cert.name} - ${cert.issuer} (${cert.date})`,
                  spacing: { after: 100 },
                })
              ),
            ] : []),
            
            // Achievements
            ...(achievements.length > 0 ? [
              new Paragraph({
                text: "ACHIEVEMENTS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...achievements.flatMap(ach => [
                new Paragraph({
                  children: [
                    new TextRun({ text: ach.title, bold: true }),
                  ],
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  text: `${ach.description} (${ach.date})`,
                  spacing: { after: 200 },
                }),
              ]),
            ] : []),
            
            // Publications
            ...(publications.length > 0 ? [
              new Paragraph({
                text: "PUBLICATIONS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...publications.map(pub => 
                new Paragraph({
                  text: `${pub.title} - ${pub.publisher} (${pub.date})${pub.link ? ` - ${pub.link}` : ''}`,
                  spacing: { after: 100 },
                })
              ),
            ] : []),
            
            // Activities
            ...(activities.length > 0 ? [
              new Paragraph({
                text: "EXTRACURRICULAR ACTIVITIES",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              ...activities.map(act => 
                new Paragraph({
                  text: `${act.title} - ${act.organization} (${act.role})`,
                  spacing: { after: 100 },
                })
              ),
            ] : []),
            
            // Languages
            ...(userProfile.languages && userProfile.languages.length > 0 ? [
              new Paragraph({
                text: "LANGUAGES",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: userProfile.languages.join(', '),
                spacing: { after: 200 },
              }),
            ] : []),
            
            // Interests
            ...(userProfile.interests && userProfile.interests.length > 0 ? [
              new Paragraph({
                text: "INTERESTS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: userProfile.interests.join(', '),
                spacing: { after: 200 },
              }),
            ] : []),
          ],
        }],
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const fileName = `${userProfile.firstName || 'Resume'}_${userProfile.lastName || 'CV'}_${new Date().toISOString().split('T')[0]}.docx`;
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Word Document Downloaded!",
        description: `Your resume has been saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Error downloading Word:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateResume = () => {
    setShowTemplateSelection(true);
    toast({
      title: "Templates Ready!",
      description: "Choose from 4 different resume templates below.",
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Read file and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, photo: reader.result as string });
        toast({
          title: "Photo Uploaded!",
          description: "Your profile photo has been added to your resume.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setUserProfile({ ...userProfile, photo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Photo Removed",
      description: "Your profile photo has been removed from your resume.",
    });
  };

  const templates = [
    { id: 1, name: "ATS-Friendly Professional", description: "Clean, modern, recruiter-approved design" },
    { id: 2, name: "Tech Industry Modern", description: "Bold contemporary for tech roles" },
    { id: 3, name: "Executive Premium", description: "Sophisticated for senior positions" },
    { id: 4, name: "Creative Designer", description: "Stylish for creative professionals" },
  ];

  const renderSelectedTemplate = () => {
    const templateProps = { 
      skills, 
      projects, 
      certifications, 
      education,
      experience,
      achievements,
      publications,
      activities,
      userProfile 
    };
    switch (selectedTemplate) {
      case 2:
        return <ResumeTemplate2 {...templateProps} />;
      case 3:
        return <ResumeTemplate3 {...templateProps} />;
      case 4:
        return <ResumeTemplate4 {...templateProps} />;
      default:
        return <ResumeTemplate1 {...templateProps} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">
            Build and customize your professional resume
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={generateResume} variant="outline" className="gap-2">
            <Zap className="w-4 h-4" />
            Choose Template
          </Button>
          <Button onClick={downloadPDF} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={downloadWord} variant="secondary" className="gap-2">
            <FileText className="w-4 h-4" />
            Download Word
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Section */}
        <div className="space-y-6">
          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {userProfile.photo ? (
                  <div className="relative">
                    <img
                      src={userProfile.photo}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                    <Camera className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button asChild variant="outline" className="cursor-pointer">
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {userProfile.photo ? "Change Photo" : "Upload Photo"}
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No skills added yet. Add your skills above to get started.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="gap-2">
                      {skill.name}
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Project title..."
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
                <Textarea
                  placeholder="Project description..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
                <Input
                  placeholder="Technologies used (comma separated)..."
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                />
                <Button onClick={addProject} size="sm" className="w-full">
                  Add Project
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No projects added yet. Add your first project above!
                  </p>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="p-3 border rounded-lg relative group">
                      <button
                        onClick={() => removeProject(project.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-medium pr-6">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Certification name..."
                  value={newCertification.name}
                  onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                />
                <Input
                  placeholder="Issuing organization..."
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                />
                <Input
                  type="month"
                  placeholder="Date obtained..."
                  value={newCertification.date}
                  onChange={(e) => setNewCertification({...newCertification, date: e.target.value})}
                />
                <Button onClick={addCertification} size="sm" className="w-full">
                  Add Certification
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {certifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No certifications added yet. Add your first certification above!
                  </p>
                ) : (
                  certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div className="flex-1">
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {cert.date}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Degree (e.g., B.Tech in Computer Engineering)..."
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                />
                <Input
                  placeholder="Institution name..."
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                />
                <Input
                  placeholder="Year (e.g., 2020-2024)..."
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                />
                <Input
                  placeholder="CGPA / Percentage (optional)..."
                  value={newEducation.cgpa}
                  onChange={(e) => setNewEducation({...newEducation, cgpa: e.target.value})}
                />
                <Button onClick={addEducation} size="sm" className="w-full">
                  Add Education
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {education.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No education added yet. Add your education above!
                  </p>
                ) : (
                  education.map((edu) => (
                    <div key={edu.id} className="p-3 border rounded-lg relative group">
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-medium pr-6">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{edu.year}</span>
                        {edu.cgpa && <span className="text-xs font-medium">CGPA: {edu.cgpa}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Work Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Work Experience / Internships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Role / Position..."
                  value={newExperience.role}
                  onChange={(e) => setNewExperience({...newExperience, role: e.target.value})}
                />
                <Input
                  placeholder="Company / Organization..."
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                />
                <Input
                  placeholder="Duration (e.g., June 2023 - Aug 2023)..."
                  value={newExperience.duration}
                  onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                />
                <Textarea
                  placeholder="Responsibilities and achievements..."
                  value={newExperience.responsibilities}
                  onChange={(e) => setNewExperience({...newExperience, responsibilities: e.target.value})}
                />
                <Button onClick={addExperience} size="sm" className="w-full">
                  Add Experience
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {experience.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No experience added yet. Add your work experience above!
                  </p>
                ) : (
                  experience.map((exp) => (
                    <div key={exp.id} className="p-3 border rounded-lg relative group">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-medium pr-6">{exp.role}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{exp.duration}</p>
                      <p className="text-sm mt-2">{exp.responsibilities}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements / Awards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Achievement title..."
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                />
                <Textarea
                  placeholder="Description..."
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                />
                <Input
                  type="month"
                  placeholder="Date..."
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                />
                <Button onClick={addAchievement} size="sm" className="w-full">
                  Add Achievement
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {achievements.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No achievements added yet!
                  </p>
                ) : (
                  achievements.map((ach) => (
                    <div key={ach.id} className="p-3 border rounded-lg relative group">
                      <button
                        onClick={() => removeAchievement(ach.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-medium pr-6">{ach.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{ach.description}</p>
                      <span className="text-xs text-muted-foreground">{ach.date}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Publications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publications / Research Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Publication title..."
                  value={newPublication.title}
                  onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                />
                <Input
                  placeholder="Publisher / Conference..."
                  value={newPublication.publisher}
                  onChange={(e) => setNewPublication({...newPublication, publisher: e.target.value})}
                />
                <Input
                  type="month"
                  placeholder="Date..."
                  value={newPublication.date}
                  onChange={(e) => setNewPublication({...newPublication, date: e.target.value})}
                />
                <Input
                  placeholder="Link (optional)..."
                  value={newPublication.link}
                  onChange={(e) => setNewPublication({...newPublication, link: e.target.value})}
                />
                <Button onClick={addPublication} size="sm" className="w-full">
                  Add Publication
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {publications.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No publications added yet!
                  </p>
                ) : (
                  publications.map((pub) => (
                    <div key={pub.id} className="p-3 border rounded-lg relative group">
                      <button
                        onClick={() => removePublication(pub.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-medium pr-6">{pub.title}</h4>
                      <p className="text-sm text-muted-foreground">{pub.publisher}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">{pub.date}</span>
                        {pub.link && (
                          <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                            View Link
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Extracurricular Activities Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extracurricular Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Activity / Event title..."
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                />
                <Input
                  placeholder="Club / Organization..."
                  value={newActivity.organization}
                  onChange={(e) => setNewActivity({...newActivity, organization: e.target.value})}
                />
                <Input
                  placeholder="Your role..."
                  value={newActivity.role}
                  onChange={(e) => setNewActivity({...newActivity, role: e.target.value})}
                />
                <Button onClick={addActivity} size="sm" className="w-full">
                  Add Activity
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No activities added yet!
                  </p>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="p-3 border rounded-lg relative group">
                      <button
                        onClick={() => removeActivity(act.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-medium pr-6">{act.title}</h4>
                      <p className="text-sm text-muted-foreground">{act.organization}</p>
                      <span className="text-xs text-muted-foreground">{act.role}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Languages & Interests Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Languages & Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Languages Known</Label>
                <Input
                  placeholder="e.g., English, Hindi, Kannada (comma separated)..."
                  value={userProfile.languages?.join(', ') || ''}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    languages: e.target.value.split(',').map(l => l.trim()).filter(l => l)
                  })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Interests / Hobbies</Label>
                <Input
                  placeholder="e.g., Reading, Fitness, UI Design, Blogging (comma separated)..."
                  value={userProfile.interests?.join(', ') || ''}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    interests: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                  })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Summary / Objective</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a 2-3 line professional summary or career objective..."
                value={userProfile.objective || ''}
                onChange={(e) => setUserProfile({...userProfile, objective: e.target.value})}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Example: "Enthusiastic Computer Engineering student skilled in Python, ML, and full-stack development, seeking internship roles to apply technical and problem-solving skills."
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="resume-preview">
                {renderSelectedTemplate()}
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  Resume automatically updates as you make changes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Selection Section */}
      {showTemplateSelection && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Resume Template</CardTitle>
              <p className="text-muted-foreground">
                Select from 4 professionally designed templates
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-primary"
                        : "hover:ring-1 hover:ring-muted-foreground"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {selectedTemplate === template.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] bg-muted/50 flex items-center justify-center relative">
                          <div className="scale-50 origin-top-left w-[200%] h-[200%] absolute top-0 left-0">
                            {template.id === 1 && <ResumeTemplate1 skills={skills} projects={projects} certifications={certifications} education={education} experience={experience} achievements={achievements} publications={publications} activities={activities} userProfile={userProfile} />}
                            {template.id === 2 && <ResumeTemplate2 skills={skills} projects={projects} certifications={certifications} education={education} experience={experience} achievements={achievements} publications={publications} activities={activities} userProfile={userProfile} />}
                            {template.id === 3 && <ResumeTemplate3 skills={skills} projects={projects} certifications={certifications} education={education} experience={experience} achievements={achievements} publications={publications} activities={activities} userProfile={userProfile} />}
                            {template.id === 4 && <ResumeTemplate4 skills={skills} projects={projects} certifications={certifications} education={education} experience={experience} achievements={achievements} publications={publications} activities={activities} userProfile={userProfile} />}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}