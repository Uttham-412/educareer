import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, X, FileText, Zap, Check } from "lucide-react";
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
}

export default function Resume() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  
  const [skills, setSkills] = useState<Skill[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);

  const [certifications, setCertifications] = useState<Certification[]>([]);

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

  const downloadResume = async () => {
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

      // Dynamically import html2canvas and jsPDF
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Capture the resume as canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Generate filename with user's name
      const fileName = `${userProfile.firstName || 'Resume'}_${userProfile.lastName || 'CV'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Resume Downloaded!",
        description: `Your resume has been saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
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

  const templates = [
    { id: 1, name: "Classic", description: "Traditional and professional" },
    { id: 2, name: "Modern Sidebar", description: "Clean with sidebar layout" },
    { id: 3, name: "Timeline", description: "Timeline style with accent colors" },
    { id: 4, name: "Creative", description: "Modern gradient design" },
  ];

  const renderSelectedTemplate = () => {
    const templateProps = { skills, projects, certifications, userProfile };
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
          <Button onClick={downloadResume} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Section */}
        <div className="space-y-6">
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
                            {template.id === 1 && <ResumeTemplate1 skills={skills} projects={projects} certifications={certifications} userProfile={userProfile} />}
                            {template.id === 2 && <ResumeTemplate2 skills={skills} projects={projects} certifications={certifications} userProfile={userProfile} />}
                            {template.id === 3 && <ResumeTemplate3 skills={skills} projects={projects} certifications={certifications} userProfile={userProfile} />}
                            {template.id === 4 && <ResumeTemplate4 skills={skills} projects={projects} certifications={certifications} userProfile={userProfile} />}
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