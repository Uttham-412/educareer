"""
Fallback course database for when web scraping fails
These are real courses with actual URLs, organized by topic
"""

FALLBACK_COURSES = {
    'programming': [
        {'title': 'Complete Python Bootcamp', 'platform': 'Udemy', 'provider': 'Jose Portilla', 'url': 'https://www.udemy.com/course/complete-python-bootcamp/', 'rating': '4.6', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'programming'},
        {'title': 'Python for Everybody', 'platform': 'Coursera', 'provider': 'University of Michigan', 'url': 'https://www.coursera.org/specializations/python', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'programming'},
        {'title': 'Java Programming Masterclass', 'platform': 'Udemy', 'provider': 'Tim Buchalka', 'url': 'https://www.udemy.com/course/java-the-complete-java-developer-course/', 'rating': '4.6', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'programming'},
        {'title': 'CS50 Introduction to Computer Science', 'platform': 'edX', 'provider': 'Harvard University', 'url': 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', 'rating': '4.9', 'price': 'Free', 'level': 'Beginner', 'keyword': 'programming'},
    ],
    'web development': [
        {'title': 'The Complete Web Developer Bootcamp', 'platform': 'Udemy', 'provider': 'Angela Yu', 'url': 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', 'rating': '4.7', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'web development'},
        {'title': 'Full-Stack Web Development with React', 'platform': 'Coursera', 'provider': 'Hong Kong University', 'url': 'https://www.coursera.org/specializations/full-stack-react', 'rating': '4.7', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'web development'},
        {'title': 'Web Design for Everybody', 'platform': 'Coursera', 'provider': 'University of Michigan', 'url': 'https://www.coursera.org/specializations/web-design', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'web development'},
        {'title': 'HTML, CSS, and Javascript', 'platform': 'Coursera', 'provider': 'Johns Hopkins University', 'url': 'https://www.coursera.org/learn/html-css-javascript-for-web-developers', 'rating': '4.7', 'price': 'Free', 'level': 'Beginner', 'keyword': 'web development'},
    ],
    'machine learning': [
        {'title': 'Machine Learning Specialization', 'platform': 'Coursera', 'provider': 'Stanford University', 'url': 'https://www.coursera.org/specializations/machine-learning-introduction', 'rating': '4.9', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'machine learning'},
        {'title': 'Deep Learning Specialization', 'platform': 'Coursera', 'provider': 'DeepLearning.AI', 'url': 'https://www.coursera.org/specializations/deep-learning', 'rating': '4.9', 'price': 'Free', 'level': 'Advanced', 'keyword': 'machine learning'},
        {'title': 'Machine Learning A-Z', 'platform': 'Udemy', 'provider': 'Kirill Eremenko', 'url': 'https://www.udemy.com/course/machinelearning/', 'rating': '4.5', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'machine learning'},
        {'title': 'Machine Learning with Python', 'platform': 'Coursera', 'provider': 'IBM', 'url': 'https://www.coursera.org/learn/machine-learning-with-python', 'rating': '4.7', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'machine learning'},
    ],
    'data science': [
        {'title': 'Data Science Specialization', 'platform': 'Coursera', 'provider': 'Johns Hopkins University', 'url': 'https://www.coursera.org/specializations/jhu-data-science', 'rating': '4.6', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'data science'},
        {'title': 'IBM Data Science Professional', 'platform': 'Coursera', 'provider': 'IBM', 'url': 'https://www.coursera.org/professional-certificates/ibm-data-science', 'rating': '4.6', 'price': 'Free', 'level': 'Beginner', 'keyword': 'data science'},
        {'title': 'Google Data Analytics', 'platform': 'Coursera', 'provider': 'Google', 'url': 'https://www.coursera.org/professional-certificates/google-data-analytics', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'data science'},
        {'title': 'Data Science Course 2024', 'platform': 'Udemy', 'provider': '365 Careers', 'url': 'https://www.udemy.com/course/the-data-science-course-complete-data-science-bootcamp/', 'rating': '4.5', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'data science'},
    ],
    'algorithms': [
        {'title': 'Algorithms Specialization', 'platform': 'Coursera', 'provider': 'Stanford University', 'url': 'https://www.coursera.org/specializations/algorithms', 'rating': '4.8', 'price': 'Free', 'level': 'Advanced', 'keyword': 'algorithms'},
        {'title': 'Data Structures and Algorithms', 'platform': 'Coursera', 'provider': 'UC San Diego', 'url': 'https://www.coursera.org/specializations/data-structures-algorithms', 'rating': '4.6', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'algorithms'},
        {'title': 'Algorithms Part I', 'platform': 'Coursera', 'provider': 'Princeton University', 'url': 'https://www.coursera.org/learn/algorithms-part1', 'rating': '4.9', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'algorithms'},
    ],
    'cloud computing': [
        {'title': 'AWS Fundamentals', 'platform': 'Coursera', 'provider': 'Amazon Web Services', 'url': 'https://www.coursera.org/specializations/aws-fundamentals', 'rating': '4.7', 'price': 'Free', 'level': 'Beginner', 'keyword': 'cloud computing'},
        {'title': 'Google Cloud Platform Fundamentals', 'platform': 'Coursera', 'provider': 'Google Cloud', 'url': 'https://www.coursera.org/learn/gcp-fundamentals', 'rating': '4.7', 'price': 'Free', 'level': 'Beginner', 'keyword': 'cloud computing'},
        {'title': 'Microsoft Azure Fundamentals', 'platform': 'Coursera', 'provider': 'Microsoft', 'url': 'https://www.coursera.org/learn/microsoft-azure-fundamentals-az-900', 'rating': '4.7', 'price': 'Free', 'level': 'Beginner', 'keyword': 'cloud computing'},
    ],
    'cybersecurity': [
        {'title': 'Google Cybersecurity Certificate', 'platform': 'Coursera', 'provider': 'Google', 'url': 'https://www.coursera.org/professional-certificates/google-cybersecurity', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'cybersecurity'},
        {'title': 'Cybersecurity Specialization', 'platform': 'Coursera', 'provider': 'University of Maryland', 'url': 'https://www.coursera.org/specializations/cyber-security', 'rating': '4.7', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'cybersecurity'},
    ],
    'mobile development': [
        {'title': 'Android App Development', 'platform': 'Coursera', 'provider': 'Vanderbilt University', 'url': 'https://www.coursera.org/specializations/android-app-development', 'rating': '4.5', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'mobile development'},
        {'title': 'iOS App Development with Swift', 'platform': 'Coursera', 'provider': 'University of Toronto', 'url': 'https://www.coursera.org/specializations/app-development', 'rating': '4.6', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'mobile development'},
        {'title': 'React Native Specialization', 'platform': 'Coursera', 'provider': 'Meta', 'url': 'https://www.coursera.org/specializations/meta-react-native', 'rating': '4.7', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'mobile development'},
    ],
    'database': [
        {'title': 'Introduction to Databases', 'platform': 'Coursera', 'provider': 'Stanford University', 'url': 'https://www.coursera.org/learn/intro-to-databases', 'rating': '4.6', 'price': 'Free', 'level': 'Beginner', 'keyword': 'database'},
        {'title': 'SQL for Data Science', 'platform': 'Coursera', 'provider': 'UC Davis', 'url': 'https://www.coursera.org/learn/sql-for-data-science', 'rating': '4.6', 'price': 'Free', 'level': 'Beginner', 'keyword': 'database'},
    ],
    'devops': [
        {'title': 'Docker and Kubernetes', 'platform': 'Udemy', 'provider': 'Stephen Grider', 'url': 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/', 'rating': '4.6', 'price': '$19.99', 'level': 'Intermediate', 'keyword': 'devops'},
        {'title': 'DevOps Foundations', 'platform': 'LinkedIn Learning', 'provider': 'Ernest Mueller', 'url': 'https://www.linkedin.com/learning/devops-foundations', 'rating': '4.7', 'price': 'Subscription', 'level': 'Beginner', 'keyword': 'devops'},
        {'title': 'Introduction to DevOps', 'platform': 'edX', 'provider': 'Linux Foundation', 'url': 'https://www.edx.org/course/introduction-to-devops', 'rating': '4.5', 'price': 'Free', 'level': 'Beginner', 'keyword': 'devops'},
    ],
    'ui ux design': [
        {'title': 'Google UX Design Certificate', 'platform': 'Coursera', 'provider': 'Google', 'url': 'https://www.coursera.org/professional-certificates/google-ux-design', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'ui ux design'},
        {'title': 'UX Design Fundamentals', 'platform': 'LinkedIn Learning', 'provider': 'Chris Nodder', 'url': 'https://www.linkedin.com/learning/user-experience-design-fundamentals', 'rating': '4.7', 'price': 'Subscription', 'level': 'Beginner', 'keyword': 'ui ux design'},
        {'title': 'UX Design Bootcamp', 'platform': 'Udemy', 'provider': 'Vako Shvili', 'url': 'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/', 'rating': '4.5', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'ui ux design'},
    ],
    'digital marketing': [
        {'title': 'Google Digital Marketing Certificate', 'platform': 'Coursera', 'provider': 'Google', 'url': 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'digital marketing'},
        {'title': 'Digital Marketing Foundations', 'platform': 'LinkedIn Learning', 'provider': 'Brad Batesole', 'url': 'https://www.linkedin.com/learning/digital-marketing-foundations', 'rating': '4.6', 'price': 'Subscription', 'level': 'Beginner', 'keyword': 'digital marketing'},
        {'title': 'SEO Training Course', 'platform': 'Moz Academy', 'provider': 'Moz', 'url': 'https://academy.moz.com/seo-training-course', 'rating': '4.7', 'price': 'Free', 'level': 'Intermediate', 'keyword': 'digital marketing'},
    ],
    'business': [
        {'title': 'Business Foundations', 'platform': 'Coursera', 'provider': 'University of Pennsylvania', 'url': 'https://www.coursera.org/specializations/wharton-business-foundations', 'rating': '4.7', 'price': 'Free', 'level': 'Beginner', 'keyword': 'business'},
        {'title': 'Strategic Leadership', 'platform': 'LinkedIn Learning', 'provider': 'Mike Figliuolo', 'url': 'https://www.linkedin.com/learning/strategic-leadership-and-management', 'rating': '4.6', 'price': 'Subscription', 'level': 'Intermediate', 'keyword': 'business'},
    ],
    'project management': [
        {'title': 'Google Project Management', 'platform': 'Coursera', 'provider': 'Google', 'url': 'https://www.coursera.org/professional-certificates/google-project-management', 'rating': '4.8', 'price': 'Free', 'level': 'Beginner', 'keyword': 'project management'},
        {'title': 'Project Management Foundations', 'platform': 'LinkedIn Learning', 'provider': 'Bonnie Biafore', 'url': 'https://www.linkedin.com/learning/project-management-foundations', 'rating': '4.7', 'price': 'Subscription', 'level': 'Beginner', 'keyword': 'project management'},
        {'title': 'Agile Project Management', 'platform': 'Pluralsight', 'provider': 'Pluralsight', 'url': 'https://www.pluralsight.com/courses/agile-project-management', 'rating': '4.6', 'price': 'Subscription', 'level': 'Intermediate', 'keyword': 'project management'},
    ],
    'game development': [
        {'title': 'Unity Game Developer 2D', 'platform': 'Udemy', 'provider': 'GameDev.tv', 'url': 'https://www.udemy.com/course/unitycourse/', 'rating': '4.7', 'price': '$19.99', 'level': 'Beginner', 'keyword': 'game development'},
        {'title': 'Unreal Engine 5 Developer', 'platform': 'Udemy', 'provider': 'GameDev.tv', 'url': 'https://www.udemy.com/course/unrealcourse/', 'rating': '4.6', 'price': '$19.99', 'level': 'Intermediate', 'keyword': 'game development'},
    ],
}

def get_fallback_courses(keywords: list, limit: int = 30) -> list:
    """
    Get fallback courses when scraping fails
    Returns courses relevant to the provided keywords
    """
    courses = []
    
    # Match keywords to course categories
    for keyword in keywords:
        keyword_lower = keyword.lower()
        
        # Check each category
        for category, category_courses in FALLBACK_COURSES.items():
            if keyword_lower in category or category in keyword_lower:
                courses.extend(category_courses)
        
        # Also check if keyword appears in course titles
        for category_courses in FALLBACK_COURSES.values():
            for course in category_courses:
                if keyword_lower in course['title'].lower() or keyword_lower in course['keyword'].lower():
                    if course not in courses:
                        courses.append(course)
    
    # If no matches, return popular courses
    if not courses:
        for category_courses in FALLBACK_COURSES.values():
            courses.extend(category_courses[:1])  # One from each category
    
    # Remove duplicates
    seen = set()
    unique_courses = []
    for course in courses:
        course_id = course['url']
        if course_id not in seen:
            seen.add(course_id)
            unique_courses.append(course)
    
    return unique_courses[:limit]
