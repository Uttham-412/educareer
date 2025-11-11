"""
Real courses, certifications, and internship opportunities with actual application links
"""

REAL_CERTIFICATIONS = [
    {
        'id': 'google_it_support',
        'name': 'Google IT Support Professional Certificate',
        'provider': 'Google (Coursera)',
        'description': 'Prepare for a career in IT support. No experience required. Get job-ready in 3-6 months.',
        'skills': ['it support', 'troubleshooting', 'customer service', 'networking', 'operating systems'],
        'difficulty': 'beginner',
        'duration_hours': 240,
        'cost': '$49/month',
        'url': 'https://www.coursera.org/professional-certificates/google-it-support',
        'apply_url': 'https://www.coursera.org/professional-certificates/google-it-support',
        'prerequisites': ['none'],
        'job_placement_rate': '87%',
        'average_salary': '$50,000'
    },
    {
        'id': 'google_data_analytics',
        'name': 'Google Data Analytics Professional Certificate',
        'provider': 'Google (Coursera)',
        'description': 'Learn data analytics skills including data cleaning, analysis, and visualization with R and Tableau.',
        'skills': ['data analysis', 'sql', 'tableau', 'r programming', 'spreadsheets', 'data visualization'],
        'difficulty': 'beginner',
        'duration_hours': 180,
        'cost': '$49/month',
        'url': 'https://www.coursera.org/professional-certificates/google-data-analytics',
        'apply_url': 'https://www.coursera.org/professional-certificates/google-data-analytics',
        'prerequisites': ['none'],
        'job_placement_rate': '75%',
        'average_salary': '$65,000'
    },
    {
        'id': 'meta_frontend',
        'name': 'Meta Front-End Developer Professional Certificate',
        'provider': 'Meta (Coursera)',
        'description': 'Learn to create responsive websites using HTML, CSS, JavaScript and React.',
        'skills': ['html', 'css', 'javascript', 'react', 'web development', 'responsive design'],
        'difficulty': 'intermediate',
        'duration_hours': 210,
        'cost': '$49/month',
        'url': 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        'apply_url': 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        'prerequisites': ['basic computer skills'],
        'job_placement_rate': '78%',
        'average_salary': '$70,000'
    },
    {
        'id': 'ibm_data_science',
        'name': 'IBM Data Science Professional Certificate',
        'provider': 'IBM (Coursera)',
        'description': 'Master data science tools including Python, SQL, machine learning, and data visualization.',
        'skills': ['python', 'sql', 'machine learning', 'data visualization', 'jupyter', 'pandas'],
        'difficulty': 'intermediate',
        'duration_hours': 240,
        'cost': '$49/month',
        'url': 'https://www.coursera.org/professional-certificates/ibm-data-science',
        'apply_url': 'https://www.coursera.org/professional-certificates/ibm-data-science',
        'prerequisites': ['basic math and programming'],
        'job_placement_rate': '82%',
        'average_salary': '$85,000'
    },
    {
        'id': 'aws_cloud_practitioner',
        'name': 'AWS Certified Cloud Practitioner',
        'provider': 'Amazon Web Services',
        'description': 'Foundational understanding of AWS Cloud concepts, services, and terminology.',
        'skills': ['aws', 'cloud computing', 'cloud fundamentals', 'cloud security'],
        'difficulty': 'beginner',
        'duration_hours': 40,
        'cost': '$100',
        'url': 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        'apply_url': 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        'prerequisites': ['basic IT knowledge'],
        'job_placement_rate': '85%',
        'average_salary': '$75,000'
    },
    {
        'id': 'microsoft_azure_fundamentals',
        'name': 'Microsoft Azure Fundamentals (AZ-900)',
        'provider': 'Microsoft',
        'description': 'Foundational knowledge of cloud services and Microsoft Azure.',
        'skills': ['azure', 'cloud computing', 'microsoft cloud', 'cloud services'],
        'difficulty': 'beginner',
        'duration_hours': 30,
        'cost': '$99',
        'url': 'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/',
        'apply_url': 'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/',
        'prerequisites': ['basic IT knowledge'],
        'job_placement_rate': '80%',
        'average_salary': '$72,000'
    }
]

REAL_INTERNSHIPS = [
    {
        'id': 'google_step_intern',
        'name': 'Google STEP Internship Program',
        'company': 'Google',
        'description': 'Student Training in Engineering Program for first and second-year undergraduate students.',
        'skills': ['programming', 'computer science', 'software development'],
        'duration': '10-12 weeks',
        'location': 'Multiple locations',
        'stipend': '$7,500/month',
        'url': 'https://buildyourfuture.withgoogle.com/programs/step/',
        'apply_url': 'https://careers.google.com/students/',
        'requirements': ['Currently enrolled in CS or related field', 'First or second year student'],
        'application_deadline': 'December 2024',
        'type': 'internship'
    },
    {
        'id': 'microsoft_explore',
        'name': 'Microsoft Explore Program',
        'company': 'Microsoft',
        'description': '12-week internship program for first and second-year college students.',
        'skills': ['programming', 'software engineering', 'product management'],
        'duration': '12 weeks',
        'location': 'Redmond, WA',
        'stipend': '$7,000/month',
        'url': 'https://careers.microsoft.com/students/us/en/usexploremicrosoftprogram',
        'apply_url': 'https://careers.microsoft.com/students/us/en/usexploremicrosoftprogram',
        'requirements': ['First or second year student', 'CS or related major'],
        'application_deadline': 'January 2025',
        'type': 'internship'
    },
    {
        'id': 'amazon_future_engineer',
        'name': 'Amazon Future Engineer Internship',
        'company': 'Amazon',
        'description': 'Paid internship program for students from underrepresented communities.',
        'skills': ['software development', 'cloud computing', 'programming'],
        'duration': '10 weeks',
        'location': 'Seattle, WA',
        'stipend': '$6,500/month',
        'url': 'https://www.amazonfutureengineer.com/internships',
        'apply_url': 'https://www.amazonfutureengineer.com/internships',
        'requirements': ['Underrepresented in tech', 'CS or related major'],
        'application_deadline': 'February 2025',
        'type': 'internship'
    },
    {
        'id': 'meta_university',
        'name': 'Meta University Internship',
        'company': 'Meta (Facebook)',
        'description': 'Hands-on software engineering experience for underrepresented students.',
        'skills': ['software engineering', 'mobile development', 'web development'],
        'duration': '8 weeks',
        'location': 'Menlo Park, CA',
        'stipend': '$8,000/month',
        'url': 'https://www.metacareers.com/students/',
        'apply_url': 'https://www.metacareers.com/students/',
        'requirements': ['Underrepresented in tech', 'First or second year student'],
        'application_deadline': 'January 2025',
        'type': 'internship'
    },
    {
        'id': 'salesforce_futureforce',
        'name': 'Salesforce Futureforce Internship',
        'company': 'Salesforce',
        'description': 'Summer internship program across various technology roles.',
        'skills': ['software development', 'salesforce', 'cloud computing'],
        'duration': '12 weeks',
        'location': 'San Francisco, CA',
        'stipend': '$6,800/month',
        'url': 'https://salesforce.wd1.myworkdayjobs.com/Futureforce_Internships',
        'apply_url': 'https://salesforce.wd1.myworkdayjobs.com/Futureforce_Internships',
        'requirements': ['Currently enrolled student', 'CS or related field'],
        'application_deadline': 'March 2025',
        'type': 'internship'
    },
    {
        'id': 'ibm_extreme_blue',
        'name': 'IBM Extreme Blue Internship',
        'company': 'IBM',
        'description': 'Technical leadership internship program focusing on emerging technologies.',
        'skills': ['artificial intelligence', 'cloud computing', 'blockchain', 'quantum computing'],
        'duration': '12 weeks',
        'location': 'Multiple locations',
        'stipend': '$5,500/month',
        'url': 'https://www.ibm.com/employment/extremeblue/',
        'apply_url': 'https://www.ibm.com/employment/extremeblue/',
        'requirements': ['Graduate or advanced undergraduate', 'Strong technical background'],
        'application_deadline': 'February 2025',
        'type': 'internship'
    }
]

REAL_COURSES = [
    {
        'id': 'cs50_harvard',
        'name': 'CS50: Introduction to Computer Science',
        'provider': 'Harvard University (edX)',
        'description': 'Harvard University\'s introduction to computer science and programming.',
        'skills': ['programming', 'algorithms', 'data structures', 'web development'],
        'difficulty': 'beginner',
        'duration_hours': 100,
        'cost': 'Free (Certificate: $99)',
        'url': 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
        'apply_url': 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
        'prerequisites': ['none'],
        'rating': '4.8/5',
        'students_enrolled': '4M+'
    },
    {
        'id': 'machine_learning_stanford',
        'name': 'Machine Learning',
        'provider': 'Stanford University (Coursera)',
        'description': 'Andrew Ng\'s famous machine learning course covering supervised and unsupervised learning.',
        'skills': ['machine learning', 'python', 'mathematics', 'algorithms'],
        'difficulty': 'intermediate',
        'duration_hours': 60,
        'cost': 'Free (Certificate: $79)',
        'url': 'https://www.coursera.org/learn/machine-learning',
        'apply_url': 'https://www.coursera.org/learn/machine-learning',
        'prerequisites': ['basic programming', 'linear algebra'],
        'rating': '4.9/5',
        'students_enrolled': '5M+'
    },
    {
        'id': 'full_stack_open',
        'name': 'Full Stack Open',
        'provider': 'University of Helsinki',
        'description': 'Deep dive into modern web application development with React, Redux, Node.js, and MongoDB.',
        'skills': ['react', 'node.js', 'mongodb', 'javascript', 'full stack development'],
        'difficulty': 'intermediate',
        'duration_hours': 200,
        'cost': 'Free',
        'url': 'https://fullstackopen.com/en/',
        'apply_url': 'https://fullstackopen.com/en/',
        'prerequisites': ['basic programming knowledge'],
        'rating': '4.7/5',
        'students_enrolled': '500K+'
    },
    {
        'id': 'python_for_everybody',
        'name': 'Python for Everybody Specialization',
        'provider': 'University of Michigan (Coursera)',
        'description': 'Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data.',
        'skills': ['python', 'data analysis', 'web scraping', 'databases'],
        'difficulty': 'beginner',
        'duration_hours': 120,
        'cost': 'Free (Certificate: $49/month)',
        'url': 'https://www.coursera.org/specializations/python',
        'apply_url': 'https://www.coursera.org/specializations/python',
        'prerequisites': ['none'],
        'rating': '4.8/5',
        'students_enrolled': '2M+'
    }
]

def get_all_opportunities():
    """Get all opportunities (certifications, internships, courses) in a unified format"""
    all_opportunities = []
    
    # Add certifications
    for cert in REAL_CERTIFICATIONS:
        cert['type'] = 'certification'
        all_opportunities.append(cert)
    
    # Add internships
    for internship in REAL_INTERNSHIPS:
        internship['type'] = 'internship'
        all_opportunities.append(internship)
    
    # Add courses
    for course in REAL_COURSES:
        course['type'] = 'course'
        all_opportunities.append(course)
    
    return all_opportunities

def get_opportunities_by_type(opportunity_type):
    """Get opportunities filtered by type"""
    if opportunity_type == 'certification':
        return REAL_CERTIFICATIONS
    elif opportunity_type == 'internship':
        return REAL_INTERNSHIPS
    elif opportunity_type == 'course':
        return REAL_COURSES
    else:
        return get_all_opportunities()

def get_opportunity_by_id(opportunity_id):
    """Get a specific opportunity by ID"""
    all_opps = get_all_opportunities()
    for opp in all_opps:
        if opp['id'] == opportunity_id:
            return opp
    return None