-- Apply AI features manually to remote database
-- Run this in Supabase SQL Editor

-- First, check if certifications table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'certifications') THEN
        -- Create certifications table
        CREATE TABLE public.certifications (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          provider TEXT NOT NULL,
          description TEXT,
          category TEXT,
          difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
          duration_hours INTEGER,
          cost DECIMAL(10,2),
          certification_url TEXT,
          skills_gained TEXT[],
          prerequisites TEXT[],
          industry_relevance TEXT[],
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view active certifications" ON public.certifications FOR SELECT USING (is_active = true);
        
        CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Insert sample certifications
INSERT INTO public.certifications (name, provider, description, category, difficulty_level, duration_hours, cost, certification_url, skills_gained, prerequisites, industry_relevance) VALUES
('AWS Cloud Practitioner', 'Amazon Web Services', 'Foundational understanding of AWS Cloud concepts, services, and terminology', 'technical', 'beginner', 40, 100.00, 'https://aws.amazon.com/certification/certified-cloud-practitioner/', ARRAY['AWS', 'Cloud Computing', 'Infrastructure'], ARRAY[], ARRAY['Technology', 'Software Development']),
('Google Data Analytics Certificate', 'Google', 'Comprehensive data analytics program covering data cleaning, analysis, and visualization', 'technical', 'beginner', 180, 49.00, 'https://www.coursera.org/professional-certificates/google-data-analytics', ARRAY['Data Analysis', 'SQL', 'Tableau', 'R Programming', 'Data Visualization'], ARRAY[], ARRAY['Data Science', 'Business Intelligence', 'Marketing']),
('Certified Scrum Master (CSM)', 'Scrum Alliance', 'Learn the fundamentals of Scrum framework and agile project management', 'business', 'intermediate', 16, 1395.00, 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster', ARRAY['Scrum', 'Agile', 'Project Management', 'Team Leadership'], ARRAY['Basic project management knowledge'], ARRAY['Software Development', 'Technology', 'Consulting'])
ON CONFLICT DO NOTHING;