// Template 4: Creative Designer (Inspired by Behance/Dribbble)
import { Mail, Phone, MapPin, Linkedin, Github, Sparkles, Palette, Zap } from "lucide-react";

interface ResumeTemplate4Props {
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

export default function ResumeTemplate4({
  skills,
  projects,
  certifications,
  education,
  experience,
  achievements,
  publications,
  activities,
  userProfile,
}: ResumeTemplate4Props) {
  return (
    <div className="bg-white relative overflow-hidden" style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 -ml-48 -mb-48" />
      
      <div className="relative z-10">
        {/* Creative Header */}
        <div className="px-12 py-10">
          <div className="flex items-start gap-8">
            {/* Photo with Creative Frame */}
            {userProfile.photo && (
              <div className="flex-shrink-0">
                <div className="relative group">
                  {/* Animated gradient border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  <div className="relative">
                    <img
                      src={userProfile.photo}
                      alt="Profile"
                      className="w-40 h-40 rounded-2xl object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Header Content */}
            <div className="flex-1">
              <div className="inline-block mb-3">
                <span className="px-4 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold">
                  ✨ CREATIVE PROFESSIONAL
                </span>
              </div>
              
              <h1 className="text-6xl font-black mb-3 leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                  {userProfile.firstName || "Your"}
                </span>
                <br />
                <span className="text-gray-900">{userProfile.lastName || "Name"}</span>
              </h1>
              
              <p className="text-2xl text-gray-700 font-bold mb-6">
                {userProfile.occupation || "Your Professional Title"}
              </p>
              
              {/* Contact Pills */}
              <div className="flex flex-wrap gap-3">
                {userProfile.email && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{userProfile.email}</span>
                  </div>
                )}
                {userProfile.phone && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-blue-50 rounded-full border-2 border-pink-200">
                    <Phone className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-medium text-gray-700">{userProfile.phone}</span>
                  </div>
                )}
                {userProfile.location && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border-2 border-blue-200">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{userProfile.location}</span>
                  </div>
                )}
              </div>
              
              {/* Social Links */}
              {(userProfile.linkedin || userProfile.github) && (
                <div className="flex gap-3 mt-3">
                  {userProfile.linkedin && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-full border-2 border-cyan-200">
                      <Linkedin className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {userProfile.linkedin.replace('https://', '')}
                      </span>
                    </div>
                  )}
                  {userProfile.github && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200">
                      <Github className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {userProfile.github.replace('https://', '')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-12 pb-10">
          {/* About Me */}
          {userProfile.bio && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">About Me</h2>
              </div>
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
                <p className="text-gray-700 leading-relaxed text-lg">{userProfile.bio}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Skills & Expertise</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {skills.map((skill, index) => {
                  const gradients = [
                    'from-purple-500 to-pink-500',
                    'from-pink-500 to-blue-500',
                    'from-blue-500 to-cyan-500',
                    'from-cyan-500 to-purple-500',
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <div key={skill.id} className="group">
                      <div className={`bg-gradient-to-br ${gradient} p-0.5 rounded-xl transform group-hover:scale-105 transition-transform`}>
                        <div className="bg-white rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-900">{skill.name}</span>
                            <span className={`text-xs font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                              {skill.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${gradient} h-2 rounded-full`}
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Featured Work</h2>
              </div>
              <div className="space-y-4">
                {projects.map((project, index) => {
                  const gradients = [
                    'from-purple-500 to-pink-500',
                    'from-pink-500 to-blue-500',
                    'from-blue-500 to-cyan-500',
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <div key={project.id} className="group">
                      <div className={`bg-gradient-to-r ${gradient} p-0.5 rounded-2xl transform group-hover:scale-[1.02] transition-transform`}>
                        <div className="bg-white rounded-2xl p-6">
                          <h3 className="text-2xl font-black text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
                          
                          {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-full text-sm font-bold`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Certifications</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert, index) => {
                  const gradients = [
                    'from-purple-500 to-pink-500',
                    'from-pink-500 to-blue-500',
                    'from-blue-500 to-cyan-500',
                    'from-cyan-500 to-purple-500',
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <div key={cert.id} className={`bg-gradient-to-br ${gradient} p-0.5 rounded-xl`}>
                      <div className="bg-white rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <p className={`text-xs font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                          {cert.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
