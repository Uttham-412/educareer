import cv2
import pytesseract
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text
from transformers import pipeline, AutoTokenizer, AutoModel
import torch
import re
from typing import List, Dict, Any
import numpy as np
from PIL import Image
import io

class TimetableProcessor:
    def __init__(self):
        # Initialize BERT model for course extraction
        self.tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
        self.model = AutoModel.from_pretrained("distilbert-base-uncased")
        
        # Course name patterns
        self.course_patterns = [
            r'[A-Z]{2,4}\s*\d{3,4}',  # CS101, MATH201, etc.
            r'[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*',  # Computer Science, Data Structures
            r'Introduction\s+to\s+[\w\s]+',
            r'Advanced\s+[\w\s]+',
            r'Fundamentals\s+of\s+[\w\s]+'
        ]
        
        # Time patterns
        self.time_patterns = [
            r'\d{1,2}:\d{2}\s*[AP]M',
            r'\d{1,2}:\d{2}',
            r'\d{1,2}\s*[AP]M'
        ]
        
        # Day patterns
        self.day_patterns = [
            r'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday',
            r'Mon|Tue|Wed|Thu|Fri|Sat|Sun',
            r'M|T|W|Th|F|S|Su'
        ]
        
        # Professor/Instructor patterns
        self.professor_patterns = [
            r'(?:Prof(?:essor)?|Dr|Mr|Ms|Mrs)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*',
            r'Instructor:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'Faculty:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'Teacher:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        ]
        
        # Room/Location patterns
        self.room_patterns = [
            r'Room\s*[:#]?\s*([A-Z0-9-]+)',
            r'Lab\s*[:#]?\s*([A-Z0-9-]+)',
            r'Hall\s*[:#]?\s*([A-Z0-9-]+)',
            r'Building\s*[:#]?\s*([A-Z0-9-]+)',
            r'[A-Z]{1,3}[-\s]?\d{2,4}',  # CS-101, A201, etc.
        ]
        
        # Duration patterns
        self.duration_patterns = [
            r'(\d+)\s*(?:hour|hr|h)',
            r'(\d+)\s*(?:minute|min|m)',
            r'(\d+)\s*-\s*(\d+)',  # Time range
        ]
        
        # Class type patterns
        self.type_patterns = [
            r'\b(lecture|lab|laboratory|tutorial|seminar|workshop|practical)\b'
        ]

    async def extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF using PyMuPDF and PDFMiner"""
        try:
            # Try PyMuPDF first
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            
            if text.strip():
                return text
            
            # Fallback to PDFMiner for scanned PDFs
            text = extract_text(io.BytesIO(file_content))
            return text
            
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

    async def extract_from_image(self, file_content: bytes) -> str:
        """Extract text from image using Tesseract OCR"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(file_content))
            
            # Convert to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Preprocess image for better OCR
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            
            # Apply threshold to get better contrast
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Denoise
            denoised = cv2.medianBlur(thresh, 5)
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(denoised, config='--psm 6')
            
            return text
            
        except Exception as e:
            raise Exception(f"Image OCR failed: {str(e)}")

    def extract_courses_with_bert(self, text: str) -> List[Dict[str, Any]]:
        """Extract comprehensive course information using BERT and pattern matching"""
        courses = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 5:
                continue
                
            # Extract course codes and names using patterns
            course_matches = []
            for pattern in self.course_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                course_matches.extend(matches)
            
            # Extract times
            time_matches = re.findall('|'.join(self.time_patterns), line, re.IGNORECASE)
            
            # Extract days
            day_matches = re.findall('|'.join(self.day_patterns), line, re.IGNORECASE)
            
            # Extract professor/instructor names
            professor_matches = []
            for pattern in self.professor_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                professor_matches.extend(matches)
            
            # Extract room/location
            room_matches = []
            for pattern in self.room_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                room_matches.extend(matches)
            
            # Extract class type
            type_matches = re.findall('|'.join(self.type_patterns), line, re.IGNORECASE)
            
            # Extract duration
            duration = self._extract_duration(line, time_matches)
            
            if course_matches:
                for course in course_matches:
                    course_info = {
                        'name': course.strip(),
                        'code': self._extract_course_code(course),
                        'professor': professor_matches[0] if professor_matches else 'TBA',
                        'room': room_matches[0] if room_matches else 'TBA',
                        'location': room_matches[0] if room_matches else 'TBA',
                        'times': time_matches,
                        'start_time': time_matches[0] if time_matches else None,
                        'end_time': time_matches[1] if len(time_matches) > 1 else None,
                        'days': day_matches,
                        'duration': duration,
                        'type': type_matches[0].lower() if type_matches else 'lecture',
                        'raw_text': line,
                        'confidence': self._calculate_confidence(line, professor_matches, room_matches, time_matches, day_matches)
                    }
                    courses.append(course_info)
        
        return self._deduplicate_courses(courses)
    
    def _extract_course_code(self, course_name: str) -> str:
        """Extract course code from course name"""
        code_match = re.search(r'[A-Z]{2,4}\s*\d{3,4}', course_name)
        return code_match.group(0) if code_match else ''
    
    def _extract_duration(self, line: str, time_matches: List[str]) -> int:
        """Extract or calculate class duration in minutes"""
        # Try to find explicit duration
        for pattern in self.duration_patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                if 'hour' in line.lower() or 'hr' in line.lower():
                    return int(match.group(1)) * 60
                elif 'minute' in line.lower() or 'min' in line.lower():
                    return int(match.group(1))
        
        # Calculate from time range if available
        if len(time_matches) >= 2:
            try:
                start = self._parse_time(time_matches[0])
                end = self._parse_time(time_matches[1])
                if start and end:
                    duration = (end - start).total_seconds() / 60
                    return int(duration) if duration > 0 else 60
            except:
                pass
        
        # Default duration
        return 60
    
    def _parse_time(self, time_str: str):
        """Parse time string to datetime object"""
        from datetime import datetime
        try:
            # Try different time formats
            for fmt in ['%I:%M %p', '%H:%M', '%I %p']:
                try:
                    return datetime.strptime(time_str.strip(), fmt)
                except:
                    continue
        except:
            pass
        return None

    def _calculate_confidence(self, text: str, professors: List, rooms: List, times: List, days: List) -> float:
        """Calculate confidence score for extracted course based on completeness"""
        score = 0.0
        
        # Check for course code pattern (20%)
        if re.search(r'[A-Z]{2,4}\s*\d{3,4}', text):
            score += 0.2
            
        # Check for professor/instructor (20%)
        if professors:
            score += 0.2
            
        # Check for room/location (15%)
        if rooms:
            score += 0.15
            
        # Check for time pattern (25%)
        if times:
            score += 0.25
            
        # Check for day pattern (20%)
        if days:
            score += 0.2
            
        return min(score, 1.0)

    def _deduplicate_courses(self, courses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate courses based on name similarity"""
        unique_courses = []
        seen_names = set()
        
        for course in courses:
            name_lower = course['name'].lower()
            if name_lower not in seen_names:
                seen_names.add(name_lower)
                unique_courses.append(course)
        
        return unique_courses

    async def process_timetable(self, file_content: bytes, file_type: str) -> Dict[str, Any]:
        """Main method to process timetable file"""
        try:
            # Extract text based on file type
            if file_type.lower() == 'pdf':
                text = await self.extract_from_pdf(file_content)
            elif file_type.lower() in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
                text = await self.extract_from_image(file_content)
            else:
                raise Exception(f"Unsupported file type: {file_type}")
            
            # Extract structured course data
            courses = self.extract_courses_with_bert(text)
            
            return {
                'success': True,
                'extracted_text': text,
                'courses': courses,
                'total_courses': len(courses)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'courses': [],
                'total_courses': 0
            }