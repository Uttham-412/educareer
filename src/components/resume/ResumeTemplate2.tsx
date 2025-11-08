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

export default function ResumeTemplate2({ skills, projects, certifications }: ResumeTemplateProps) {
  return (
    <div className="bg-white border p-6 rounded-lg shadow-sm min-h-[600px]">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 bg-blue-50 p-4 -m-6 mr-0">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-900">John Doe</h2>
            <p className="text-blue-700 text-sm">Frontend Developer</p>
            <div className="mt-2 text-xs text-blue-600 space-y-1">
              <p>john.doe@email.com</p>
              <p>+91 9876543210</p>
              <p>LinkedIn Profile</p>
            </div>
          </div>

          {/* Skills in sidebar */}
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">Skills</h3>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="text-xs text-blue-700">
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          {/* Projects */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              PROJECTS
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <h4 className="font-semibold text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
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
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}