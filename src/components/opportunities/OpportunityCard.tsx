import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, MapPin, Star } from "lucide-react";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  type: "certification" | "internship" | "job";
  location?: string;
  duration?: string;
  skills: string[];
  rating?: number;
  featured?: boolean;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply: (id: string) => void;
}

function getCardClasses(type: string) {
  switch (type) {
    case "certification":
      return "certification-card hover:shadow-lg transition-all duration-300";
    case "internship":
      return "internship-card hover:shadow-lg transition-all duration-300";
    case "job":
      return "job-card hover:shadow-lg transition-all duration-300";
    default:
      return "hover:shadow-lg transition-all duration-300";
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "certification":
      return "bg-accent-certification text-white";
    case "internship":
      return "bg-accent-internship text-white";
    case "job":
      return "bg-accent-job text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function OpportunityCard({ opportunity, onApply }: OpportunityCardProps) {
  return (
    <Card className={`${getCardClasses(opportunity.type)} relative overflow-hidden group`}>
      {opportunity.featured && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-warning text-warning-foreground">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge className={`text-xs mb-2 ${getTypeColor(opportunity.type)}`}>
              {opportunity.type}
            </Badge>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {opportunity.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {opportunity.company}
            </p>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {opportunity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {opportunity.location}
            </div>
          )}
          {opportunity.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {opportunity.duration}
            </div>
          )}
          {opportunity.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-warning" />
              {opportunity.rating}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {opportunity.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {opportunity.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{opportunity.skills.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onApply(opportunity.id)}
          className="w-full gap-2 group/btn"
          variant="default"
        >
          Apply Now
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}