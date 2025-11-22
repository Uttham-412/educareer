// Template 1: ATS-Friendly Professional (Inspired by Novoresume)
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar } from "lucide-react";

interface ResumeTemplate1Props {
  skills: Array<{ id: string; name: string; level: string }>;
  projects: Array<{ id: string; title: string; description: string; technologies: string[] }>;
  certifications: Array<{ id: string; name: string; issuer: string; date: string }>;
  education: Array<{ id: string; degree: string; institution: string; year: string; cgpa?: string }>;
  experience: Array<{ id: string; role: string; company: string; duration: string; responsibilities: string }>;
  achievements: Array<{ id: string; title: string; description: string; date: string }>;
  publications: Array<{ id: string; title: string; publisher: string; date: string; link?: string }>;
  activities: Array<{ id: string; title: string; organization: string; role: string }>;
  userProfile: {
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
  };
}

export default function ResumeTemplate1({
  skills,
  projects,
  certifications,
  education,
  experience,
  achievements,
  publications,
  activities,
  userProfile,
}: ResumeTemplate1Props) {
  return (
    <div className="bg-white" style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-8">
        <div className="flex items-start gap-6">
          {/* Photo */}
          {userProfile.photo && (
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white/30 shadow-xl">
                <img
                  src={userProfile.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Header Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-1 tracking-tight">
              {userProfile.firstName || "Your"} {userProfile.lastName || "Name"}
            </h1>
            <p className="text-xl text-blue-100 font-medium mb-4">
              {userProfile.occupation || "Your Professional Title"}
            </p>
            
            {/* Contact Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-blue-50">
              {userProfile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{userProfile.email}</span>
                </div>
              )}
              {userProfile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              {userProfile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{userProfile.location}</span>
                </div>
              )}
              {userProfile.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{userProfile.linkedin.replace('https://', '')}</span>
                </div>
              )}
              {userProfile.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{userProfile.github.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-8">
        {/* Professional Summary */}
        {userProfile.bio && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600 inline-block">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed mt-3">{userProfile.bio}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Skills & Certifications */}
          <div className="space-y-8">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  SKILLS
                </h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width:
                              skill.level === "Advanced"
                                ? "95%"
                                : skill.level === "Intermediate"
                                ? "75%"
                                : "55%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  CERTIFICATIONS
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="border-l-4 border-blue-600 pl-3">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {cert.name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">{cert.issuer}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 text-xs">{cert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Projects */}
          <div className="col-span-2">
            {projects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  PROFESSIONAL EXPERIENCE & PROJECTS
                </h2>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className="relative pl-6 border-l-2 border-gray-300">
                      {/* Timeline Dot */}
                      <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                      
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                        <p className="text-gray-700 mt-2 leading-relaxed text-sm">
                          {project.description}
                        </p>
                        
                        {project.technologies.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Technologies Used:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-blue-700" />
    </div>
  );
}
