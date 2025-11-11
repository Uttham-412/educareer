import { useState } from "react";
import { Calendar, Clock, BookOpen, Upload, Award, TrendingUp, FileText, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ClassSlot {
  id: string;
  subject: string;
  professor: string;
  room: string;
  time: string;
  duration: number;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DaySchedule {
  day: string;
  date: string;
  classes: ClassSlot[];
}

interface CertificationRecommendation {
  id: string;
  title: string;
  description: string;
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relevantSubjects: string[];
  priority: 'high' | 'medium' | 'low';
}


type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function Timetable() {
  const [uploadedTimetable, setUploadedTimetable] = useState<DaySchedule[] | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      setUploadStatus('uploading');
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        await parseCSVFile(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        await parseExcelFile(file);
      } else if (fileExtension === 'pdf') {
        await parsePDFFile(file);
      } else if (['jpg', 'jpeg', 'png', 'bmp', 'tiff'].includes(fileExtension || '')) {
        await parseImageFile(file);
      } else {
        throw new Error('Unsupported file format. Please upload CSV, Excel, PDF, or Image files (JPG, PNG).');
      }
      
      setUploadStatus('success');
    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('error');
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    }
  };

  const parseImageFile = async (file: File) => {
    try {
      // Use AI backend for image OCR processing
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        formData.append('user_id', userId);
      }

      const response = await fetch('http://localhost:8000/api/v1/timetable/upload', {
        method: 'POST',
        body: formData,
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to process image');
      }

      const result = await response.json();
      
      if (result.success && result.data.courses) {
        // Convert AI-extracted courses to timetable format
        const schedule = convertAICoursesToSchedule(result.data.courses);
        setUploadedTimetable(schedule);
        await saveTimetableToDatabase(schedule);
      } else {
        throw new Error('No courses found in the timetable image');
      }
    } catch (error) {
      console.error('Image parsing error:', error);
      throw error;
    }
  };

  const parseCSVFile = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const schedule: DaySchedule[] = [];
    
    // Expected CSV format: Day,Subject,Professor,Room,Time,Duration,Type
    const requiredHeaders = ['day', 'subject', 'time'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    
    const dayMap = new Map<string, ClassSlot[]>();
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) continue;
      
      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
      
      const classSlot: ClassSlot = {
        id: `${i}`,
        subject: rowData.subject || 'Unknown Subject',
        professor: rowData.professor || 'TBA',
        room: rowData.room || 'TBA',
        time: rowData.time || '00:00',
        duration: parseInt(rowData.duration) || 60,
        type: (rowData.type?.toLowerCase() as ClassSlot['type']) || 'lecture',
        difficulty: (rowData.difficulty?.toLowerCase() as ClassSlot['difficulty']) || 'medium'
      };
      
      const day = rowData.day;
      if (!dayMap.has(day)) {
        dayMap.set(day, []);
      }
      dayMap.get(day)!.push(classSlot);
    }
    
    // Convert map to schedule array
    dayMap.forEach((classes, day) => {
      schedule.push({
        day,
        date: getDateForDay(day),
        classes: classes.sort((a, b) => a.time.localeCompare(b.time))
      });
    });
    
    setUploadedTimetable(schedule);
    await saveTimetableToDatabase(schedule);
  };

  const parseExcelFile = async (file: File) => {
    // For Excel files, we'll provide instructions for now
    // In a real implementation, you'd use a library like xlsx
    throw new Error(`Excel file parsing is not yet implemented. 
    
To use your Excel file:
1. Open your Excel file
2. Save As → CSV (Comma delimited)
3. Upload the CSV file instead

Or use the manual entry option to add classes one by one.`);
  };

  const parsePDFFile = async (file: File) => {
    try {
      // Use AI backend for PDF processing with OCR and NLP
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        formData.append('user_id', userId);
      }

      const response = await fetch('http://localhost:8000/api/v1/timetable/upload', {
        method: 'POST',
        body: formData,
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to process PDF');
      }

      const result = await response.json();
      
      if (result.success && result.data.courses) {
        // Convert AI-extracted courses to timetable format
        const schedule = convertAICoursesToSchedule(result.data.courses);
        setUploadedTimetable(schedule);
        await saveTimetableToDatabase(schedule);
      } else {
        throw new Error('No courses found in the timetable');
      }
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw error;
    }
  };

  const convertAICoursesToSchedule = (courses: any[]): DaySchedule[] => {
    const dayMap = new Map<string, ClassSlot[]>();
    
    courses.forEach((course, index) => {
      const days = course.days || ['Monday'];
      const times = course.times || ['09:00'];
      
      days.forEach((day: string, dayIndex: number) => {
        const classSlot: ClassSlot = {
          id: `ai-${index}-${dayIndex}`,
          subject: course.name || 'Unknown Subject',
          professor: 'TBA',
          room: 'TBA',
          time: times[dayIndex] || times[0] || '09:00',
          duration: 60,
          type: 'lecture',
          difficulty: course.confidence > 0.7 ? 'medium' : 'easy'
        };
        
        if (!dayMap.has(day)) {
          dayMap.set(day, []);
        }
        dayMap.get(day)!.push(classSlot);
      });
    });
    
    const schedule: DaySchedule[] = [];
    dayMap.forEach((classes, day) => {
      schedule.push({
        day,
        date: getDateForDay(day),
        classes: classes.sort((a, b) => a.time.localeCompare(b.time))
      });
    });
    
    return schedule;
  };

  const getDateForDay = (dayName: string): string => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const dayMap: Record<string, number> = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    const targetDay = dayMap[dayName.toLowerCase()] ?? 1;
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    return targetDate.toISOString().split('T')[0];
  };

  const saveTimetableToDatabase = async (schedule: DaySchedule[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Extract course names from schedule
      const courses = schedule.flatMap(day => 
        day.classes.map(c => c.subject)
      ).filter((course, index, arr) => arr.indexOf(course) === index);

      // Save to backend
      const response = await fetch('http://localhost:5000/api/users/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          timetable: schedule,
          courses
        })
      });

      if (response.ok) {
        console.log('Timetable saved successfully');
        
        toast({
          title: "Timetable Saved!",
          description: "Your timetable has been saved and we're finding relevant courses for you.",
        });
        
        // Trigger course recommendations from AI backend
        await fetchCourseRecommendations(courses);
      } else {
        console.error('Failed to save timetable');
        toast({
          title: "Save Failed",
          description: "Failed to save your timetable. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to save timetable to database:', error);
    }
  };

  const fetchCourseRecommendations = async (courses: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!userId) return;

      // Call AI backend to get personalized recommendations based on courses
      const response = await fetch('http://localhost:8000/api/v1/recommendations/personalized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          user_id: userId,
          courses: courses,
          include_courses: true,
          include_jobs: false,
          limit: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Course recommendations fetched:', data);
        
        // Create notification for new recommendations
        if (data.data && data.data.courses && data.data.courses.length > 0) {
          await createNotification({
            title: 'New Course Recommendations Available!',
            description: `Based on your timetable, we found ${data.data.courses.length} relevant courses for you`,
            type: 'certification'
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch course recommendations:', error);
    }
  };

  const createNotification = async (notification: { title: string; description: string; type: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notification)
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const loadSampleTimetable = () => {
    const sampleSchedule: DaySchedule[] = [
      {
        day: 'Monday',
        date: '2024-01-15',
        classes: [
          { id: '1', subject: 'Data Structures & Algorithms', professor: 'Dr. Sarah Smith', room: 'CS-101', time: '09:00', duration: 90, type: 'lecture', difficulty: 'hard' },
          { id: '2', subject: 'Machine Learning Fundamentals', professor: 'Dr. Michael Johnson', room: 'AI-203', time: '11:00', duration: 90, type: 'lecture', difficulty: 'hard' },
          { id: '3', subject: 'Web Development Lab', professor: 'Prof. Emily Brown', room: 'Lab-1', time: '14:00', duration: 120, type: 'lab', difficulty: 'medium' },
        ]
      },
      {
        day: 'Tuesday',
        date: '2024-01-16',
        classes: [
          { id: '4', subject: 'Database Management Systems', professor: 'Dr. Robert Wilson', room: 'CS-301', time: '09:00', duration: 90, type: 'lecture', difficulty: 'medium' },
          { id: '5', subject: 'Software Engineering', professor: 'Prof. Lisa Davis', room: 'CS-401', time: '11:00', duration: 90, type: 'lecture', difficulty: 'medium' },
          { id: '6', subject: 'Computer Networks', professor: 'Dr. James Miller', room: 'CS-201', time: '14:00', duration: 90, type: 'lecture', difficulty: 'medium' },
        ]
      },
      {
        day: 'Wednesday',
        date: '2024-01-17',
        classes: [
          { id: '7', subject: 'Operating Systems', professor: 'Dr. Anna Garcia', room: 'CS-302', time: '09:00', duration: 90, type: 'lecture', difficulty: 'hard' },
          { id: '8', subject: 'Mobile App Development', professor: 'Prof. David Lee', room: 'Lab-2', time: '11:00', duration: 120, type: 'lab', difficulty: 'medium' },
        ]
      },
      {
        day: 'Thursday',
        date: '2024-01-18',
        classes: [
          { id: '9', subject: 'Artificial Intelligence', professor: 'Dr. Jennifer Taylor', room: 'AI-101', time: '09:00', duration: 90, type: 'lecture', difficulty: 'hard' },
          { id: '10', subject: 'Cybersecurity Fundamentals', professor: 'Prof. Mark Anderson', room: 'SEC-201', time: '11:00', duration: 90, type: 'lecture', difficulty: 'medium' },
          { id: '11', subject: 'Project Management', professor: 'Dr. Susan White', room: 'BUS-101', time: '14:00', duration: 60, type: 'seminar', difficulty: 'easy' },
        ]
      },
      {
        day: 'Friday',
        date: '2024-01-19',
        classes: [
          { id: '12', subject: 'Cloud Computing', professor: 'Dr. Kevin Brown', room: 'CLOUD-101', time: '09:00', duration: 90, type: 'lecture', difficulty: 'medium' },
          { id: '13', subject: 'Data Science Workshop', professor: 'Prof. Rachel Green', room: 'DS-Lab', time: '11:00', duration: 180, type: 'lab', difficulty: 'hard' },
        ]
      }
    ];
    
    setUploadedTimetable(sampleSchedule);
    setUploadStatus('success');
  };

  const exportTimetableAsCSV = () => {
    if (!uploadedTimetable) return;

    const csvHeader = 'Day,Subject,Professor,Room,Time,Duration,Type,Difficulty\n';
    const csvRows = uploadedTimetable.flatMap(day => 
      day.classes.map(classItem => 
        `${day.day},${classItem.subject},${classItem.professor},${classItem.room},${classItem.time},${classItem.duration},${classItem.type},${classItem.difficulty}`
      )
    ).join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'my-timetable.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const generateCertificationRecommendations = (): CertificationRecommendation[] => {
    if (!uploadedTimetable) return [];

    const allSubjects = uploadedTimetable.flatMap(day => day.classes.map(c => c.subject));
    const recommendations: CertificationRecommendation[] = [];

    // Analyze subjects and suggest relevant certifications
    if (allSubjects.some(s => s.toLowerCase().includes('data') || s.toLowerCase().includes('machine learning'))) {
      recommendations.push({
        id: '1',
        title: 'Google Data Analytics Professional Certificate',
        description: 'Perfect complement to your data-focused curriculum. Learn industry-standard tools like Tableau, R, and SQL.',
        provider: 'Google via Coursera',
        duration: '3-6 months',
        difficulty: 'beginner',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('data') || s.toLowerCase().includes('machine')),
        priority: 'high'
      });
    }

    if (allSubjects.some(s => s.toLowerCase().includes('web') || s.toLowerCase().includes('programming'))) {
      recommendations.push({
        id: '2',
        title: 'AWS Certified Developer Associate',
        description: 'Enhance your web development skills with cloud computing expertise. High demand in the job market.',
        provider: 'Amazon Web Services',
        duration: '2-3 months',
        difficulty: 'intermediate',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('web') || s.toLowerCase().includes('programming')),
        priority: 'high'
      });
    }

    if (allSubjects.some(s => s.toLowerCase().includes('software') || s.toLowerCase().includes('engineering'))) {
      recommendations.push({
        id: '3',
        title: 'Certified ScrumMaster (CSM)',
        description: 'Learn agile project management methodologies that complement your software engineering studies.',
        provider: 'Scrum Alliance',
        duration: '2-4 weeks',
        difficulty: 'beginner',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('software') || s.toLowerCase().includes('engineering')),
        priority: 'medium'
      });
    }

    if (allSubjects.some(s => s.toLowerCase().includes('database') || s.toLowerCase().includes('sql'))) {
      recommendations.push({
        id: '4',
        title: 'Microsoft Azure Database Administrator',
        description: 'Specialize in database management with cloud technologies, perfect for your database coursework.',
        provider: 'Microsoft',
        duration: '3-4 months',
        difficulty: 'intermediate',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('database')),
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'seminar': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-4 border-l-warning bg-warning/5';
      case 'low': return 'border-l-4 border-l-success bg-success/5';
      default: return 'border-l-4 border-l-muted';
    }
  };

  const certificationRecommendations = generateCertificationRecommendations();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Smart Timetable
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload your timetable to get personalized certification recommendations
            </p>
          </div>
        </div>
      </div>

      {/* File Upload */}
      {!uploadedTimetable ? (
        <Card className="glass-card">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : uploadStatus === 'error'
                  ? 'border-destructive bg-destructive/5'
                  : uploadStatus === 'success'
                  ? 'border-success bg-success/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadStatus === 'uploading' ? (
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              ) : uploadStatus === 'success' ? (
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
              ) : uploadStatus === 'error' ? (
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              ) : (
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              )}
              
              <h3 className="text-lg font-semibold mb-2">
                {uploadStatus === 'uploading' ? 'Processing Your Timetable...' :
                 uploadStatus === 'success' ? 'Timetable Uploaded Successfully!' :
                 uploadStatus === 'error' ? 'Upload Failed' :
                 'Upload Your Timetable'}
              </h3>
              
              {uploadStatus === 'error' && uploadError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{uploadError}</p>
                </div>
              )}
              
              {uploadStatus !== 'uploading' && (
                <>
                  <p className="text-muted-foreground mb-4">
                    {uploadStatus === 'error' ? 'Please try again with a different file' :
                     'Drag and drop your timetable file here, or click to browse'}
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png,.bmp,.tiff"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadError(null);
                        setUploadStatus('idle');
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                    disabled={uploadStatus === 'uploading'}
                    ref={(input) => {
                      if (input) {
                        (window as any).fileInput = input;
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    disabled={uploadStatus === 'uploading'}
                    onClick={() => {
                      const input = document.getElementById('file-upload') as HTMLInputElement;
                      if (input) input.click();
                    }}
                    type="button"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </>
              )}
              
              {uploadStatus !== 'error' && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Supported formats: CSV, Excel (.xlsx, .xls), PDF, Images (JPG, PNG)
                  </p>
                  <p className="text-xs text-primary font-medium">
                    ✨ AI-Powered: PDF and Image files use OCR + NLP for automatic course extraction!
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">CSV Format Example:</p>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      Day,Subject,Professor,Room,Time,Duration,Type,Difficulty
                    </code>
                    <div className="mt-2">
                      <a 
                        href="/sample-timetable.csv" 
                        download="sample-timetable.csv"
                        className="text-primary hover:text-primary/80 underline text-xs"
                      >
                        Download Sample CSV Template
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Alternative Options */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowManualEntry(true)}
                className="text-primary hover:text-primary/80"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
              <Button 
                variant="ghost" 
                onClick={loadSampleTimetable}
                className="text-primary hover:text-primary/80"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Try Sample Timetable
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
        {/* Timetable Display */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Your Uploaded Timetable
                </CardTitle>
                <CardDescription>
                  Analyzed timetable with certification recommendations
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedTimetable(null);
                    setUploadStatus('idle');
                    setUploadError(null);
                  }}
                >
                  Upload New
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportTimetableAsCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedTimetable.map((day) => (
                <div key={day.day} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-foreground">
                      {day.day}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {day.date}
                    </span>
                  </div>
                  
                  {day.classes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No classes scheduled</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {day.classes.map((classItem) => (
                        <div
                          key={classItem.id}
                          className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground text-sm">
                              {classItem.subject}
                            </h4>
                            <Badge className={getDifficultyColor(classItem.difficulty)} variant="secondary">
                              {classItem.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>👨‍🏫 {classItem.professor}</p>
                            <p>📍 {classItem.room}</p>
                            <p>🕐 {classItem.time} ({classItem.duration}min)</p>
                          </div>
                          
                          <div className="mt-2">
                            <Badge className={getClassTypeColor(classItem.type)} variant="outline">
                              {classItem.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </>
      )}

      {/* Certification Recommendations */}
      {uploadedTimetable && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Recommended Certifications
            </CardTitle>
            <CardDescription>
              AI-powered certification suggestions based on your subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {certificationRecommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No specific recommendations available for your current subjects</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {certificationRecommendations.map((cert) => (
                  <div
                    key={cert.id}
                    className={`rounded-lg p-4 ${getPriorityColor(cert.priority)} hover-lift`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">
                            {cert.title}
                          </h4>
                          <Badge className={getDifficultyBadgeColor(cert.difficulty)} variant="secondary">
                            {cert.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {cert.description}
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-muted-foreground">Provider: {cert.provider}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span className="text-muted-foreground">Duration: {cert.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            <span className="text-muted-foreground">
                              Relevant subjects: {cert.relevantSubjects.join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            {cert.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Entry Dialog */}
      <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Timetable Manually</DialogTitle>
            <DialogDescription>
              Add your classes one by one to build your timetable
            </DialogDescription>
          </DialogHeader>
          <ManualEntryForm 
            onSave={(schedule) => {
              setUploadedTimetable(schedule);
              setShowManualEntry(false);
              setUploadStatus('success');
            }}
            onCancel={() => setShowManualEntry(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Manual Entry Form Component
interface ManualEntryFormProps {
  onSave: (schedule: DaySchedule[]) => void;
  onCancel: () => void;
}

function ManualEntryForm({ onSave, onCancel }: ManualEntryFormProps) {
  const [classes, setClasses] = useState<(ClassSlot & { day: string })[]>([]);
  const [currentClass, setCurrentClass] = useState<Partial<ClassSlot>>({
    subject: '',
    professor: '',
    room: '',
    time: '',
    duration: 60,
    type: 'lecture',
    difficulty: 'medium'
  });
  const [selectedDay, setSelectedDay] = useState('Monday');

  const addClassToSchedule = () => {
    if (!currentClass.subject || !currentClass.time) {
      return;
    }

    const newClass: ClassSlot & { day: string } = {
      id: Date.now().toString(),
      subject: currentClass.subject,
      professor: currentClass.professor || 'TBA',
      room: currentClass.room || 'TBA',
      time: currentClass.time,
      duration: currentClass.duration || 60,
      type: currentClass.type || 'lecture',
      difficulty: currentClass.difficulty || 'medium',
      day: selectedDay
    };

    setClasses([...classes, newClass]);
    
    // Reset form
    setCurrentClass({
      subject: '',
      professor: '',
      room: '',
      time: '',
      duration: 60,
      type: 'lecture',
      difficulty: 'medium'
    });
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const saveSchedule = () => {
    // Group classes by day
    const dayMap = new Map<string, ClassSlot[]>();
    
    classes.forEach(classItem => {
      const { day, ...classWithoutDay } = classItem;
      if (!dayMap.has(day)) {
        dayMap.set(day, []);
      }
      dayMap.get(day)!.push(classWithoutDay);
    });

    const schedule: DaySchedule[] = [];
    dayMap.forEach((dayClasses, day) => {
      schedule.push({
        day,
        date: getDateForDay(day),
        classes: dayClasses.sort((a, b) => a.time.localeCompare(b.time))
      });
    });

    onSave(schedule);
  };

  const getDateForDay = (dayName: string): string => {
    const today = new Date();
    const currentDay = today.getDay();
    
    const dayMap: Record<string, number> = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    const targetDay = dayMap[dayName] ?? 1;
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    return targetDate.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Add Class Form */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="day">Day</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={currentClass.subject || ''}
            onChange={(e) => setCurrentClass({...currentClass, subject: e.target.value})}
            placeholder="e.g., Data Structures"
          />
        </div>
        
        <div>
          <Label htmlFor="professor">Professor</Label>
          <Input
            id="professor"
            value={currentClass.professor || ''}
            onChange={(e) => setCurrentClass({...currentClass, professor: e.target.value})}
            placeholder="e.g., Dr. Smith"
          />
        </div>
        
        <div>
          <Label htmlFor="room">Room</Label>
          <Input
            id="room"
            value={currentClass.room || ''}
            onChange={(e) => setCurrentClass({...currentClass, room: e.target.value})}
            placeholder="e.g., CS-101"
          />
        </div>
        
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={currentClass.time || ''}
            onChange={(e) => setCurrentClass({...currentClass, time: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={currentClass.duration || 60}
            onChange={(e) => setCurrentClass({...currentClass, duration: parseInt(e.target.value)})}
            min="30"
            max="300"
          />
        </div>
        
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={currentClass.type} onValueChange={(value) => setCurrentClass({...currentClass, type: value as ClassSlot['type']})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecture">Lecture</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={currentClass.difficulty} onValueChange={(value) => setCurrentClass({...currentClass, difficulty: value as ClassSlot['difficulty']})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={addClassToSchedule} 
        disabled={!currentClass.subject || !currentClass.time}
        className="w-full"
      >
        Add Class
      </Button>
      
      {/* Added Classes */}
      {classes.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Added Classes ({classes.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {classes.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="text-sm">
                  <span className="font-medium">{classItem.subject}</span>
                  <span className="text-muted-foreground ml-2">
                    {classItem.day} at {classItem.time}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClass(classItem.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={saveSchedule} 
          disabled={classes.length === 0}
          className="flex-1"
        >
          Save Timetable ({classes.length} classes)
        </Button>
      </div>
    </div>
  );
}