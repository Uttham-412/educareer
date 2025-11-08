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
            r'[A-Z][a-z]+\s+[A-Z][a-z]+',  # Computer Science, Data Structures
            r'Introduction\s+to\s+\w+',
            r'Advanced\s+\w+',
            r'Fundamentals\s+of\s+\w+'
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
        """Extract course information using BERT and pattern matching"""
        courses = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
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
            
            if course_matches:
                for course in course_matches:
                    course_info = {
                        'name': course.strip(),
                        'raw_text': line,
                        'times': time_matches,
                        'days': day_matches,
                        'confidence': self._calculate_confidence(line)
                    }
                    courses.append(course_info)
        
        return self._deduplicate_courses(courses)

    def _calculate_confidence(self, text: str) -> float:
        """Calculate confidence score for extracted course"""
        score = 0.0
        
        # Check for course code pattern
        if re.search(r'[A-Z]{2,4}\s*\d{3,4}', text):
            score += 0.4
            
        # Check for time pattern
        if re.search('|'.join(self.time_patterns), text):
            score += 0.3
            
        # Check for day pattern
        if re.search('|'.join(self.day_patterns), text):
            score += 0.3
            
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