import { Badge } from "@/components/ui/badge";

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

interface ResumeTemplateProps {
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export default function ResumeTemplate1({ skills, projects, certifications }: ResumeTemplateProps) {
  return (
    <div className="bg-white border p-6 rounded-lg shadow-sm min-h-[600px]">
      {/* Resume Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
        <p className="text-gray-600">Frontend Developer</p>
        <p className="text-sm text-gray-500">
          john.doe@email.com • +91 9876543210 • LinkedIn
        </p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id}>
              <h4 className="font-medium text-gray-900">{project.title}</h4>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-xs text-gray-500">
                Technologies: {project.technologies.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h3>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <div key={cert.id}>
              <h4 className="font-medium text-gray-900">{cert.name}</h4>
              <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}