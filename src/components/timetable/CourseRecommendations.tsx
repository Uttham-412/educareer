import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, Clock, TrendingUp, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { aiAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  title: string;
  platform: string;
  provider: string;
  url: string;
  rating: string;
  price: string;
  level: string;
  keyword: string;
  relevance_score: number;
  semantic_score: number;
  graph_score: number;
  keyword_score: number;
  profile_score: number;
  apply_url: string;
  apply_button_text: string;
  can_apply: boolean;
  external_link: boolean;
  opens_in_new_tab: boolean;
}

interface CourseRecommendationsProps {
  timetableCourses: any[];
}

export function CourseRecommendations({ timetableCourses }: CourseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [hasFetched, setHasFetched] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (timetableCourses && timetableCourses.length > 0 && !hasFetched && !loading) {
      fetchRecommendations();
    }
  }, [timetableCourses, hasFetched, loading]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      const userProfile = {
        current_year: 2, // Default to 2nd year
        interests: user?.skills || [],
        target_career: user?.role || '',
        experience_level: 'intermediate'
      };

      // Extract only course names for recommendations
      const courseNames = timetableCourses.map(c => ({ name: c.name }));
      console.log('Fetching recommendations for courses:', courseNames);
      
      const response = await aiAPI.getCourseRecommendations({
        courses: courseNames,
        user_profile: userProfile,
        limit: 50  // Request 50 courses
      });
      
      console.log('Received response:', response.data);

      if (response.data.success) {
        setRecommendations(response.data.data.courses);
        setPlatforms(response.data.data.platforms_searched || []);
        setKeywords(response.data.data.keywords_used || []);
        setLearningPath(response.data.data.learning_path || []);
        setHasFetched(true);
        
        toast({
          title: '✨ Recommendations Ready!',
          description: `Found ${response.data.data.total_courses} courses from ${response.data.data.platforms_searched?.length || 0} platforms`,
        });
      }
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      console.error('Error details:', error.response?.data);
      
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to fetch course recommendations. Please try again.',
        variant: 'destructive',
      });
      
      // Set empty state so component doesn't stay in loading forever
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = selectedPlatform === 'all' 
    ? recommendations 
    : recommendations.filter(c => c.platform === selectedPlatform);

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.7) return 'Highly Relevant';
    if (score >= 0.5) return 'Relevant';
    return 'Somewhat Relevant';
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Analyzing your timetable...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Searching courses from multiple platforms using AI
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-2xl">AI-Powered Course Recommendations</CardTitle>
          </div>
          <CardDescription className="text-base">
            Based on your timetable, we found <strong>{recommendations.length} courses</strong> from{' '}
            <strong>{platforms.length} platforms</strong> using Graph-BERT AI model
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Keywords Used */}
      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Keywords Extracted from Your Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Path */}
      {learningPath.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Suggested Learning Path
            </CardTitle>
            <CardDescription>
              Recommended progression based on your current courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPath.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm capitalize">
                    {index + 1}. {step}
                  </Badge>
                  {index < learningPath.length - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by Platform:</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPlatform === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('all')}
          >
            All ({recommendations.length})
          </Button>
          {platforms.map((platform) => (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform} ({recommendations.filter(c => c.platform === platform).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {course.platform}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                by {course.provider}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Relevance Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Relevance:</span>
                  <span className={`font-semibold ${getScoreColor(course.relevance_score)}`}>
                    {getScoreLabel(course.relevance_score)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${course.relevance_score * 100}%` }}
                  />
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{course.level}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {course.price}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {course.keyword}
                </Badge>
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                onClick={() => window.open(course.apply_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {course.apply_button_text || 'View Course'}
              </Button>

              {/* Score Breakdown (Expandable) */}
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">
                  View AI Score Breakdown
                </summary>
                <div className="mt-2 space-y-1 pl-2">
                  <div>Semantic: {(course.semantic_score * 100).toFixed(0)}%</div>
                  <div>Graph: {(course.graph_score * 100).toFixed(0)}%</div>
                  <div>Keyword: {(course.keyword_score * 100).toFixed(0)}%</div>
                  <div>Profile: {(course.profile_score * 100).toFixed(0)}%</div>
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setHasFetched(false);
            fetchRecommendations();
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
