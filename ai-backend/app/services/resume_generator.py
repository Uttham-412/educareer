from jinja2 import Environment, FileSystemLoader, Template
from weasyprint import HTML, CSS
import spacy
from transformers import pipeline
import os
import tempfile
from typing import Dict, Any, List
import re
from datetime import datetime
import pandas as pd

class ResumeGenerator:
    def __init__(self):
        # Initialize NLP models
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Warning: spaCy English model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        # Initialize summarization pipeline
        try:
            self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        except Exception as e:
            print(f"Warning: Could not load summarization model: {e}")
            self.summarizer = None
        
        # Setup Jinja2 environment
        template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates', 'resume')
        os.makedirs(template_dir, exist_ok=True)
        
        self.jinja_env = Environment(loader=FileSystemLoader(template_dir))
        
        # Create default templates if they don't exist
        self._create_default_templates()
        
        # Resume output directory
        self.output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'resumes')
        os.makedirs(self.output_dir, exist_ok=True)

    def _create_default_templates(self):
        """Create default resume templates"""
        
        template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates', 'resume')
        
        # Modern template
        modern_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ personal_info.name or 'Resume' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; }
        .header h1 { font-size: 2.5em; color: #2c3e50; margin-bottom: 10px; }
        .header .contact { font-size: 1.1em; color: #7f8c8d; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #2c3e50; font-size: 1.4em; margin-bottom: 15px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        .experience-item, .education-item, .project-item { margin-bottom: 20px; }
        .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .item-title { font-weight: bold; font-size: 1.1em; color: #2c3e50; }
        .item-company { color: #3498db; font-weight: 500; }
        .item-date { color: #7f8c8d; font-style: italic; }
        .item-description { margin-left: 20px; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .skill-category h3 { color: #2c3e50; margin-bottom: 8px; }
        .skill-list { list-style: none; }
        .skill-list li { background: #ecf0f1; padding: 5px 10px; margin: 3px 0; border-radius: 3px; }
        ul { list-style-type: disc; margin-left: 20px; }
        .summary { font-style: italic; color: #555; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #3498db; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ personal_info.name or 'Your Name' }}</h1>
            <div class="contact">
                {% if personal_info.email %}{{ personal_info.email }}{% endif %}
                {% if personal_info.phone %} | {{ personal_info.phone }}{% endif %}
                {% if personal_info.location %} | {{ personal_info.location }}{% endif %}
                {% if personal_info.linkedin %} | LinkedIn: {{ personal_info.linkedin }}{% endif %}
                {% if personal_info.github %} | GitHub: {{ personal_info.github }}{% endif %}
            </div>
        </div>

        <!-- Summary -->
        {% if summary %}
        <div class="section">
            <h2>Professional Summary</h2>
            <div class="summary">{{ summary }}</div>
        </div>
        {% endif %}

        <!-- Education -->
        {% if education %}
        <div class="section">
            <h2>Education</h2>
            {% for edu in education %}
            <div class="education-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">{{ edu.degree or 'Degree' }}</div>
                        <div class="item-company">{{ edu.institution or 'Institution' }}</div>
                    </div>
                    <div class="item-date">{{ edu.graduation_date or 'Date' }}</div>
                </div>
                {% if edu.gpa %}<div class="item-description">GPA: {{ edu.gpa }}</div>{% endif %}
                {% if edu.relevant_courses %}
                <div class="item-description">
                    <strong>Relevant Courses:</strong> {{ edu.relevant_courses | join(', ') }}
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        <!-- Experience -->
        {% if experience %}
        <div class="section">
            <h2>Experience</h2>
            {% for exp in experience %}
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">{{ exp.title or 'Position' }}</div>
                        <div class="item-company">{{ exp.company or 'Company' }}</div>
                    </div>
                    <div class="item-date">{{ exp.start_date or 'Start' }} - {{ exp.end_date or 'End' }}</div>
                </div>
                {% if exp.description %}
                <div class="item-description">
                    {% if exp.description is string %}
                        <p>{{ exp.description }}</p>
                    {% else %}
                        <ul>
                        {% for item in exp.description %}
                            <li>{{ item }}</li>
                        {% endfor %}
                        </ul>
                    {% endif %}
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        <!-- Projects -->
        {% if projects %}
        <div class="section">
            <h2>Projects</h2>
            {% for project in projects %}
            <div class="project-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">{{ project.name or project.title or 'Project Name' }}</div>
                        {% if project.technologies %}
                        <div style="color: #7f8c8d; font-size: 0.9em;">{{ project.technologies | join(', ') }}</div>
                        {% endif %}
                    </div>
                    {% if project.date %}<div class="item-date">{{ project.date }}</div>{% endif %}
                </div>
                {% if project.description %}
                <div class="item-description">{{ project.description }}</div>
                {% endif %}
                {% if project.url or project.github_url %}
                <div class="item-description">
                    <strong>Link:</strong> 
                    <a href="{{ project.url or project.github_url }}">{{ project.url or project.github_url }}</a>
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        <!-- Skills -->
        {% if skills %}
        <div class="section">
            <h2>Skills</h2>
            {% if skills is mapping %}
            <div class="skills-grid">
                {% for category, skill_list in skills.items() %}
                <div class="skill-category">
                    <h3>{{ category }}</h3>
                    <ul class="skill-list">
                        {% for skill in skill_list %}
                        <li>{{ skill }}</li>
                        {% endfor %}
                    </ul>
                </div>
                {% endfor %}
            </div>
            {% else %}
            <div class="item-description">
                {% for skill in skills %}
                <span style="background: #ecf0f1; padding: 5px 10px; margin: 3px; border-radius: 3px; display: inline-block;">{{ skill }}</span>
                {% endfor %}
            </div>
            {% endif %}
        </div>
        {% endif %}

        <!-- Certifications -->
        {% if certifications %}
        <div class="section">
            <h2>Certifications</h2>
            {% for cert in certifications %}
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">{{ cert.name or cert.title }}</div>
                        {% if cert.provider or cert.issuer %}
                        <div class="item-company">{{ cert.provider or cert.issuer }}</div>
                        {% endif %}
                    </div>
                    {% if cert.date or cert.completion_date %}
                    <div class="item-date">{{ cert.date or cert.completion_date }}</div>
                    {% endif %}
                </div>
                {% if cert.credential_id %}
                <div class="item-description"><strong>Credential ID:</strong> {{ cert.credential_id }}</div>
                {% endif %}
                {% if cert.url %}
                <div class="item-description"><strong>Verify:</strong> <a href="{{ cert.url }}">{{ cert.url }}</a></div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </div>
</body>
</html>
        """
        
        # Save modern template
        with open(os.path.join(template_dir, 'modern.html'), 'w', encoding='utf-8') as f:
            f.write(modern_template)
        
        # Classic template (simpler version)
        classic_template = modern_template.replace('2c3e50', '333333').replace('3498db', '666666')
        
        with open(os.path.join(template_dir, 'classic.html'), 'w', encoding='utf-8') as f:
            f.write(classic_template)

    async def generate_resume(self, user_data: Dict[str, Any], template: str = "modern", 
                            sections: List[str] = None, user_id: str = None) -> str:
        """Generate complete resume PDF"""
        
        # Process user data
        processed_data = await self._process_user_data(user_data, sections)
        
        # Generate HTML
        html_content = await self.generate_html_preview(processed_data, template, sections)
        
        # Convert to PDF
        pdf_path = await self._html_to_pdf(html_content, user_id, template)
        
        return pdf_path

    async def generate_html_preview(self, user_data: Dict[str, Any], template: str = "modern", 
                                  sections: List[str] = None) -> str:
        """Generate HTML preview of resume"""
        
        # Process user data if not already processed
        if 'processed' not in user_data:
            processed_data = await self._process_user_data(user_data, sections)
        else:
            processed_data = user_data
        
        # Load template
        try:
            template_obj = self.jinja_env.get_template(f'{template}.html')
        except:
            template_obj = self.jinja_env.get_template('modern.html')  # Fallback
        
        # Render HTML
        html_content = template_obj.render(**processed_data)
        
        return html_content

    async def _process_user_data(self, user_data: Dict[str, Any], sections: List[str] = None) -> Dict[str, Any]:
        """Process and structure user data for resume generation"""
        
        processed = {
            'processed': True,
            'personal_info': {},
            'summary': '',
            'education': [],
            'experience': [],
            'projects': [],
            'skills': [],
            'certifications': []
        }
        
        # Extract personal information
        profile = user_data.get('profile', {})
        personal_info = profile.get('personalInfo', {})
        
        processed['personal_info'] = {
            'name': personal_info.get('name', f"{personal_info.get('firstName', '')} {personal_info.get('lastName', '')}").strip(),
            'email': personal_info.get('email', ''),
            'phone': personal_info.get('phone', ''),
            'location': personal_info.get('location', ''),
            'linkedin': personal_info.get('linkedin', ''),
            'github': personal_info.get('github', '')
        }
        
        # Generate AI summary
        if self.summarizer and profile.get('bio'):
            try:
                summary_result = self.summarizer(profile['bio'], max_length=100, min_length=30, do_sample=False)
                processed['summary'] = summary_result[0]['summary_text']
            except:
                processed['summary'] = profile.get('bio', '')
        else:
            processed['summary'] = profile.get('bio', '')
        
        # Process education
        academic_info = profile.get('academicInfo', {})
        if academic_info:
            education_item = {
                'degree': academic_info.get('degree', ''),
                'institution': academic_info.get('institution', ''),
                'graduation_date': academic_info.get('graduationDate', ''),
                'gpa': academic_info.get('gpa', ''),
                'relevant_courses': []
            }
            
            # Add courses from timetable extraction
            courses = user_data.get('courses', [])
            if courses:
                education_item['relevant_courses'] = [course.get('name', '') for course in courses[:8]]
            
            processed['education'] = [education_item]
        
        # Process portfolio projects
        portfolio = user_data.get('portfolio', [])
        for item in portfolio:
            if item.get('type') == 'project' or 'project' in item.get('title', '').lower():
                project = {
                    'name': item.get('title', ''),
                    'description': item.get('description', ''),
                    'technologies': item.get('skills', []),
                    'url': item.get('url', ''),
                    'date': item.get('completion_date', '')
                }
                processed['projects'].append(project)
        
        # Process skills
        skills = profile.get('skills', [])
        if skills:
            # Categorize skills if possible
            if self.nlp:
                processed['skills'] = self._categorize_skills(skills)
            else:
                processed['skills'] = skills
        
        # Process certifications from portfolio
        for item in portfolio:
            if item.get('type') == 'certification' or 'certificate' in item.get('title', '').lower():
                cert = {
                    'name': item.get('title', ''),
                    'provider': item.get('provider', ''),
                    'date': item.get('completion_date', ''),
                    'url': item.get('url', ''),
                    'credential_id': item.get('credential_id', '')
                }
                processed['certifications'].append(cert)
        
        return processed

    def _categorize_skills(self, skills: List[str]) -> Dict[str, List[str]]:
        """Categorize skills using NLP"""
        
        categories = {
            'Programming Languages': [],
            'Web Technologies': [],
            'Databases': [],
            'Tools & Frameworks': [],
            'Other': []
        }
        
        # Simple keyword-based categorization
        programming_keywords = ['python', 'java', 'javascript', 'c++', 'c#', 'go', 'rust', 'php', 'ruby']
        web_keywords = ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask']
        database_keywords = ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite']
        tool_keywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'webpack']
        
        for skill in skills:
            skill_lower = skill.lower()
            categorized = False
            
            if any(keyword in skill_lower for keyword in programming_keywords):
                categories['Programming Languages'].append(skill)
                categorized = True
            elif any(keyword in skill_lower for keyword in web_keywords):
                categories['Web Technologies'].append(skill)
                categorized = True
            elif any(keyword in skill_lower for keyword in database_keywords):
                categories['Databases'].append(skill)
                categorized = True
            elif any(keyword in skill_lower for keyword in tool_keywords):
                categories['Tools & Frameworks'].append(skill)
                categorized = True
            
            if not categorized:
                categories['Other'].append(skill)
        
        # Remove empty categories
        return {k: v for k, v in categories.items() if v}

    async def _html_to_pdf(self, html_content: str, user_id: str = None, template: str = "modern") -> str:
        """Convert HTML to PDF using WeasyPrint"""
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"resume_{user_id or 'user'}_{template}_{timestamp}.pdf"
        pdf_path = os.path.join(self.output_dir, filename)
        
        try:
            # Create PDF
            HTML(string=html_content).write_pdf(pdf_path)
            return pdf_path
        except Exception as e:
            # Fallback: save as HTML if PDF generation fails
            html_path = pdf_path.replace('.pdf', '.html')
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            raise Exception(f"PDF generation failed, saved as HTML: {str(e)}")

    async def optimize_for_job(self, user_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        """Optimize resume content for specific job description"""
        
        optimization_tips = []
        optimized_content = {}
        
        if not job_description:
            return {
                'tips': ['Provide a job description for better optimization'],
                'optimized_content': {}
            }
        
        # Extract keywords from job description
        job_keywords = self._extract_keywords(job_description)
        
        # Analyze user skills vs job requirements
        user_skills = user_data.get('profile', {}).get('skills', [])
        skill_matches = []
        missing_skills = []
        
        for keyword in job_keywords:
            if any(keyword.lower() in skill.lower() for skill in user_skills):
                skill_matches.append(keyword)
            else:
                missing_skills.append(keyword)
        
        # Generate optimization tips
        if skill_matches:
            optimization_tips.append(f"Highlight these matching skills: {', '.join(skill_matches[:5])}")
        
        if missing_skills:
            optimization_tips.append(f"Consider adding these skills if you have them: {', '.join(missing_skills[:3])}")
        
        # Suggest summary optimization
        if 'summary' in user_data:
            optimization_tips.append("Tailor your summary to include job-specific keywords")
        
        # Suggest project highlighting
        portfolio = user_data.get('portfolio', [])
        relevant_projects = []
        for item in portfolio:
            if any(keyword.lower() in item.get('description', '').lower() for keyword in job_keywords):
                relevant_projects.append(item.get('title', ''))
        
        if relevant_projects:
            optimization_tips.append(f"Emphasize these relevant projects: {', '.join(relevant_projects[:3])}")
        
        optimized_content = {
            'skill_matches': skill_matches,
            'missing_skills': missing_skills[:5],
            'relevant_projects': relevant_projects,
            'job_keywords': job_keywords[:10],
            'tips': optimization_tips
        }
        
        return optimized_content

    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from job description"""
        
        # Simple keyword extraction
        # In a real implementation, you'd use more sophisticated NLP
        
        # Common technical keywords
        tech_keywords = [
            'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 'docker',
            'machine learning', 'data analysis', 'web development', 'api', 'database',
            'git', 'agile', 'scrum', 'testing', 'ci/cd', 'cloud', 'microservices'
        ]
        
        text_lower = text.lower()
        found_keywords = []
        
        for keyword in tech_keywords:
            if keyword in text_lower:
                found_keywords.append(keyword)
        
        # Extract other potential keywords (simple approach)
        words = re.findall(r'\b[A-Za-z]{3,}\b', text)
        word_freq = {}
        for word in words:
            word_lower = word.lower()
            if word_lower not in ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'her', 'way', 'many', 'then', 'them', 'well', 'were']:
                word_freq[word_lower] = word_freq.get(word_lower, 0) + 1
        
        # Get most frequent words
        frequent_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
        found_keywords.extend([word for word, freq in frequent_words if freq > 1])
        
        return list(set(found_keywords))

    async def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume content and provide improvement suggestions"""
        
        analysis = {
            'word_count': len(resume_text.split()),
            'sections_found': [],
            'suggestions': [],
            'score': 0
        }
        
        # Check for common resume sections
        sections = {
            'contact': ['email', 'phone', 'address'],
            'summary': ['summary', 'objective', 'profile'],
            'experience': ['experience', 'work', 'employment'],
            'education': ['education', 'degree', 'university'],
            'skills': ['skills', 'technical', 'proficient'],
            'projects': ['projects', 'portfolio']
        }
        
        resume_lower = resume_text.lower()
        
        for section, keywords in sections.items():
            if any(keyword in resume_lower for keyword in keywords):
                analysis['sections_found'].append(section)
        
        # Calculate score based on sections found
        analysis['score'] = (len(analysis['sections_found']) / len(sections)) * 100
        
        # Generate suggestions
        missing_sections = set(sections.keys()) - set(analysis['sections_found'])
        
        if 'contact' in missing_sections:
            analysis['suggestions'].append("Add contact information (email, phone)")
        
        if 'summary' in missing_sections:
            analysis['suggestions'].append("Include a professional summary or objective")
        
        if 'skills' in missing_sections:
            analysis['suggestions'].append("Add a skills section highlighting your technical abilities")
        
        if analysis['word_count'] < 200:
            analysis['suggestions'].append("Resume seems too short - consider adding more details")
        elif analysis['word_count'] > 800:
            analysis['suggestions'].append("Resume might be too long - consider condensing content")
        
        # Check for action verbs
        action_verbs = ['developed', 'created', 'managed', 'led', 'implemented', 'designed', 'built', 'achieved']
        action_verb_count = sum(1 for verb in action_verbs if verb in resume_lower)
        
        if action_verb_count < 3:
            analysis['suggestions'].append("Use more action verbs to describe your accomplishments")
        
        return analysis

    def get_available_templates(self) -> List[Dict[str, Any]]:
        """Get list of available resume templates"""
        
        return [
            {
                'id': 'modern',
                'name': 'Modern',
                'description': 'Clean, professional design with blue accents',
                'preview_url': '/api/v1/resume/preview/modern'
            },
            {
                'id': 'classic',
                'name': 'Classic',
                'description': 'Traditional resume format with conservative styling',
                'preview_url': '/api/v1/resume/preview/classic'
            }
        ]