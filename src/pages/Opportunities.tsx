import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityCard, Opportunity } from "@/components/opportunities/OpportunityCard";
import { Search, Filter, MapPin, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const allOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "React.js Complete Course",
    company: "Coursera",
    description: "Master React.js with hands-on projects and industry best practices. Build real-world applications and learn from industry experts.",
    type: "certification",
    duration: "6 weeks",
    skills: ["React", "JavaScript", "Frontend", "HTML", "CSS"],
    rating: 4.8,
    featured: true,
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    company: "NPTEL",
    description: "Comprehensive course covering fundamental data structures and algorithms essential for technical interviews.",
    type: "certification",
    duration: "12 weeks",
    skills: ["Python", "Algorithms", "Data Structures", "Problem Solving"],
    rating: 4.7,
  },
  {
    id: "3",
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    description: "Join our dynamic team to work on cutting-edge web applications using React and TypeScript. Mentorship provided.",
    type: "internship",
    location: "Remote",
    duration: "3 months",
    skills: ["React", "TypeScript", "CSS", "Git"],
    rating: 4.5,
    featured: true,
  },
  {
    id: "4",
    title: "Backend Developer Intern",
    company: "StartupXYZ",
    description: "Work on scalable backend systems using Node.js and cloud technologies. Great learning opportunity.",
    type: "internship",
    location: "Bangalore",
    duration: "6 months",
    skills: ["Node.js", "MongoDB", "AWS", "API Design"],
    rating: 4.6,
  },
  {
    id: "5",
    title: "Full Stack Developer",
    company: "Tech Innovations Ltd",
    description: "Be part of an innovative team building the next generation of SaaS products. Competitive salary and benefits.",
    type: "job",
    location: "Mumbai",
    duration: "Full-time",
    skills: ["React", "Node.js", "MongoDB", "Docker", "Kubernetes"],
    rating: 4.7,
  },
  {
    id: "6",
    title: "Cloud Computing Fundamentals",
    company: "Udemy",
    description: "Learn cloud computing concepts with hands-on experience in AWS, Azure, and Google Cloud Platform.",
    type: "certification",
    duration: "8 weeks",
    skills: ["AWS", "Azure", "Cloud Computing", "DevOps"],
    rating: 4.5,
  },
  {
    id: "7",
    title: "Software Engineer",
    company: "MegaCorp",
    description: "Join a leading technology company working on products used by millions. Excellent growth opportunities.",
    type: "job",
    location: "Delhi",
    duration: "Full-time",
    skills: ["Java", "Spring Boot", "Microservices", "Kafka"],
    rating: 4.8,
    featured: true,
  },
  {
    id: "8",
    title: "UI/UX Intern",
    company: "Design Studio Pro",
    description: "Learn design thinking and create beautiful user interfaces. Work with experienced designers on real projects.",
    type: "internship",
    location: "Remote",
    duration: "4 months",
    skills: ["Figma", "Design Thinking", "Prototyping", "User Research"],
    rating: 4.4,
  },
];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState(allOpportunities);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const { toast } = useToast();

  const handleApply = (opportunityId: string) => {
    const opportunity = opportunities.find(op => op.id === opportunityId);
    toast({
      title: "Application Started!",
      description: `Applying for ${opportunity?.title} at ${opportunity?.company}`,
    });
  };

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || opportunity.type === typeFilter;
    const matchesLocation = locationFilter === "all" || opportunity.location === locationFilter;
    const matchesSkill = skillFilter === "all" || opportunity.skills.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );

    return matchesSearch && matchesType && matchesLocation && matchesSkill;
  });

  const getUniqueValues = (key: keyof Opportunity) => {
    const values = opportunities
      .map(op => op[key])
      .filter(Boolean)
      .filter((value, index, arr) => arr.indexOf(value) === index);
    return values as string[];
  };

  const locations = getUniqueValues("location");
  const allSkills = opportunities.flatMap(op => op.skills).filter((skill, index, arr) => arr.indexOf(skill) === index);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Discover certifications, internships, and jobs tailored for you
          </p>
        </div>

        <Badge variant="secondary" className="text-sm">
          {filteredOpportunities.length} opportunities found
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="certification">Certifications</SelectItem>
                <SelectItem value="internship">Internships</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Skill Filter */}
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {allSkills.slice(0, 10).map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(typeFilter !== "all" || locationFilter !== "all" || skillFilter !== "all" || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>
                    <Filter className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {typeFilter}
                  <button onClick={() => setTypeFilter("all")}>
                    <Filter className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {locationFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Location: {locationFilter}
                  <button onClick={() => setLocationFilter("all")}>
                    <Filter className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {skillFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Skill: {skillFilter}
                  <button onClick={() => setSkillFilter("all")}>
                    <Filter className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Opportunities */}
      {filteredOpportunities.some(op => op.featured) && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-warning fill-current" />
            Featured Opportunities
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities
              .filter(op => op.featured)
              .map((opportunity) => (
                <div key={opportunity.id} className="animate-slide-up">
                  <OpportunityCard
                    opportunity={opportunity}
                    onApply={handleApply}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Opportunities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Opportunities</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="animate-slide-up">
              <OpportunityCard
                opportunity={opportunity}
                onApply={handleApply}
              />
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setLocationFilter("all");
                  setSkillFilter("all");
                }}
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}