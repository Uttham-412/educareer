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

export default function ResumeTemplate3({ skills, projects, certifications }: ResumeTemplateProps) {
  return (
    <div className="bg-white border p-6 rounded-lg shadow-sm min-h-[600px]">
      {/* Header with accent */}
      <div className="border-l-4 border-green-500 pl-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
        <p className="text-green-600 font-medium">Frontend Developer</p>
        <p className="text-sm text-gray-500 mt-1">
          john.doe@email.com • +91 9876543210 • LinkedIn
        </p>
      </div>

      {/* Skills with progress bars */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-8 h-0.5 bg-green-500 mr-2"></span>
          Skills & Technologies
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{skill.name}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      level <= (skill.level === "Advanced" ? 5 : skill.level === "Intermediate" ? 3 : 2)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-8 h-0.5 bg-green-500 mr-2"></span>
          Project Experience
        </h3>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="relative pl-6">
              <div className="absolute left-0 top-0 w-3 h-3 bg-green-500 rounded-full"></div>
              {index !== projects.length - 1 && (
                <div className="absolute left-1.5 top-3 w-0.5 h-12 bg-green-200"></div>
              )}
              <h4 className="font-semibold text-gray-900">{project.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-8 h-0.5 bg-green-500 mr-2"></span>
          Certifications
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-green-50 p-3 rounded border-l-2 border-green-500">
              <h4 className="font-semibold text-gray-900">{cert.name}</h4>
              <p className="text-sm text-green-700">{cert.issuer} • {cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}