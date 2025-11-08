import { useState } from "react";
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

export default function Resume() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "React.js", level: "Advanced" },
    { id: "2", name: "JavaScript", level: "Advanced" },
    { id: "3", name: "TypeScript", level: "Intermediate" },
    { id: "4", name: "Node.js", level: "Intermediate" },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      id: "2",
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates",
      technologies: ["React", "Firebase", "Material-UI"],
    },
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: "1", name: "React Developer Certification", issuer: "Meta", date: "2024-01" },
    { id: "2", name: "JavaScript Algorithms", issuer: "freeCodeCamp", date: "2023-12" },
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
  });

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
        technologies: newProject.technologies.split(",").map(t => t.trim()),
      }]);
      setNewProject({ title: "", description: "", technologies: "" });
    }
  };

  const downloadResume = () => {
    toast({
      title: "Resume Downloaded!",
      description: "Your resume has been downloaded as PDF.",
    });
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
    const templateProps = { skills, projects, certifications };
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
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-2">
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
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
                {projects.map((project) => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer} • {cert.date}
                      </p>
                    </div>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                ))}
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
              {renderSelectedTemplate()}

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
                            {template.id === 1 && <ResumeTemplate1 skills={skills} projects={projects} certifications={certifications} />}
                            {template.id === 2 && <ResumeTemplate2 skills={skills} projects={projects} certifications={certifications} />}
                            {template.id === 3 && <ResumeTemplate3 skills={skills} projects={projects} certifications={certifications} />}
                            {template.id === 4 && <ResumeTemplate4 skills={skills} projects={projects} certifications={certifications} />}
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