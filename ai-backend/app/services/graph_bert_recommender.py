from sentence_transformers import SentenceTransformer
import networkx as nx
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Tuple
import torch
from transformers import AutoTokenizer, AutoModel

class GraphBERTRecommender:
    """
    Advanced recommendation system using Graph-based BERT model
    Combines knowledge graphs with BERT embeddings for intelligent course recommendations
    """
    
    def __init__(self):
        # Load BERT model for semantic understanding
        self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        self.bert_model = AutoModel.from_pretrained("bert-base-uncased")
        
        # Initialize knowledge graph
        self.knowledge_graph = nx.DiGraph()
        self._build_comprehensive_knowledge_graph()
        
        # Course domain taxonomy
        self.domain_taxonomy = self._build_domain_taxonomy()
    
    def _build_comprehensive_knowledge_graph(self):
        """Build comprehensive knowledge graph with courses, skills, technologies, and career paths"""
        
        # Core CS courses and their relationships
        cs_courses = {
            'data structures': {
                'skills': ['algorithms', 'problem solving', 'programming', 'complexity analysis'],
                'technologies': ['python', 'java', 'c++'],
                'prerequisites': ['programming fundamentals'],
                'leads_to': ['algorithms', 'system design', 'competitive programming'],
                'difficulty': 'intermediate'
            },
            'algorithms': {
                'skills': ['problem solving', 'optimization', 'complexity analysis', 'dynamic programming'],
                'technologies': ['python', 'java', 'c++'],
                'prerequisites': ['data structures'],
                'leads_to': ['machine learning', 'competitive programming', 'system design'],
                'difficulty': 'intermediate'
            },
            'machine learning': {
                'skills': ['statistics', 'linear algebra', 'python', 'data analysis', 'model training'],
                'technologies': ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'],
                'prerequisites': ['programming', 'statistics', 'linear algebra'],
                'leads_to': ['deep learning', 'nlp', 'computer vision', 'data science'],
                'difficulty': 'advanced'
            },
            'deep learning': {
                'skills': ['neural networks', 'backpropagation', 'optimization', 'model architecture'],
                'technologies': ['tensorflow', 'pytorch', 'keras', 'cuda'],
                'prerequisites': ['machine learning', 'linear algebra', 'calculus'],
                'leads_to': ['computer vision', 'nlp', 'reinforcement learning'],
                'difficulty': 'advanced'
            },
            'web development': {
                'skills': ['html', 'css', 'javascript', 'responsive design', 'api integration'],
                'technologies': ['react', 'vue', 'angular', 'node.js', 'express', 'mongodb'],
                'prerequisites': ['programming fundamentals'],
                'leads_to': ['full stack development', 'frontend development', 'backend development'],
                'difficulty': 'beginner'
            },
            'database systems': {
                'skills': ['sql', 'database design', 'normalization', 'query optimization'],
                'technologies': ['postgresql', 'mysql', 'mongodb', 'redis'],
                'prerequisites': ['programming fundamentals'],
                'leads_to': ['data engineering', 'backend development', 'data science'],
                'difficulty': 'intermediate'
            },
            'computer networks': {
                'skills': ['networking protocols', 'tcp/ip', 'routing', 'network security'],
                'technologies': ['cisco', 'wireshark', 'linux'],
                'prerequisites': ['operating systems'],
                'leads_to': ['cybersecurity', 'cloud computing', 'devops'],
                'difficulty': 'intermediate'
            },
            'operating systems': {
                'skills': ['process management', 'memory management', 'file systems', 'concurrency'],
                'technologies': ['linux', 'unix', 'c', 'assembly'],
                'prerequisites': ['computer architecture', 'programming'],
                'leads_to': ['system programming', 'embedded systems', 'devops'],
                'difficulty': 'intermediate'
            },
            'cybersecurity': {
                'skills': ['network security', 'cryptography', 'ethical hacking', 'penetration testing'],
                'technologies': ['kali linux', 'metasploit', 'wireshark', 'burp suite'],
                'prerequisites': ['computer networks', 'programming'],
                'leads_to': ['security analyst', 'penetration tester', 'security engineer'],
                'difficulty': 'advanced'
            },
            'cloud computing': {
                'skills': ['aws', 'azure', 'gcp', 'containerization', 'microservices'],
                'technologies': ['docker', 'kubernetes', 'terraform', 'jenkins'],
                'prerequisites': ['networking', 'linux', 'programming'],
                'leads_to': ['devops', 'cloud architect', 'site reliability engineer'],
                'difficulty': 'intermediate'
            },
            'mobile development': {
                'skills': ['mobile ui', 'app architecture', 'api integration', 'mobile testing'],
                'technologies': ['react native', 'flutter', 'swift', 'kotlin', 'android'],
                'prerequisites': ['programming', 'ui/ux basics'],
                'leads_to': ['mobile app developer', 'cross-platform developer'],
                'difficulty': 'intermediate'
            },
            'data science': {
                'skills': ['statistics', 'data analysis', 'visualization', 'machine learning'],
                'technologies': ['python', 'r', 'pandas', 'matplotlib', 'seaborn', 'tableau'],
                'prerequisites': ['statistics', 'programming'],
                'leads_to': ['data analyst', 'ml engineer', 'data engineer'],
                'difficulty': 'intermediate'
            },
            'artificial intelligence': {
                'skills': ['machine learning', 'neural networks', 'optimization', 'search algorithms'],
                'technologies': ['python', 'tensorflow', 'pytorch', 'opencv'],
                'prerequisites': ['machine learning', 'algorithms'],
                'leads_to': ['ai researcher', 'ml engineer', 'ai specialist'],
                'difficulty': 'advanced'
            },
            'software engineering': {
                'skills': ['design patterns', 'testing', 'version control', 'agile', 'ci/cd'],
                'technologies': ['git', 'jenkins', 'docker', 'jira'],
                'prerequisites': ['programming', 'data structures'],
                'leads_to': ['software developer', 'tech lead', 'architect'],
                'difficulty': 'intermediate'
            },
            'computer vision': {
                'skills': ['image processing', 'object detection', 'neural networks', 'opencv'],
                'technologies': ['python', 'opencv', 'tensorflow', 'pytorch', 'yolo'],
                'prerequisites': ['machine learning', 'linear algebra'],
                'leads_to': ['cv engineer', 'ai researcher', 'robotics'],
                'difficulty': 'advanced'
            },
            'natural language processing': {
                'skills': ['text processing', 'transformers', 'language models', 'sentiment analysis'],
                'technologies': ['python', 'nltk', 'spacy', 'huggingface', 'bert'],
                'prerequisites': ['machine learning', 'deep learning'],
                'leads_to': ['nlp engineer', 'ai researcher', 'chatbot developer'],
                'difficulty': 'advanced'
            },
            'blockchain': {
                'skills': ['cryptography', 'distributed systems', 'smart contracts', 'consensus'],
                'technologies': ['ethereum', 'solidity', 'web3', 'hyperledger'],
                'prerequisites': ['programming', 'cryptography'],
                'leads_to': ['blockchain developer', 'smart contract developer'],
                'difficulty': 'advanced'
            },
            'devops': {
                'skills': ['ci/cd', 'automation', 'monitoring', 'infrastructure as code'],
                'technologies': ['docker', 'kubernetes', 'jenkins', 'ansible', 'terraform'],
                'prerequisites': ['linux', 'networking', 'programming'],
                'leads_to': ['devops engineer', 'sre', 'cloud engineer'],
                'difficulty': 'intermediate'
            }
        }
        
        # Build graph nodes and edges
        for course, details in cs_courses.items():
            # Add course node
            self.knowledge_graph.add_node(course, type='course', difficulty=details['difficulty'])
            
            # Add skill nodes and edges
            for skill in details['skills']:
                self.knowledge_graph.add_node(skill, type='skill')
                self.knowledge_graph.add_edge(course, skill, relation='teaches', weight=1.0)
            
            # Add technology nodes and edges
            for tech in details['technologies']:
                self.knowledge_graph.add_node(tech, type='technology')
                self.knowledge_graph.add_edge(course, tech, relation='uses', weight=0.9)
            
            # Add prerequisite edges
            for prereq in details['prerequisites']:
                if prereq in cs_courses or prereq in self.knowledge_graph:
                    self.knowledge_graph.add_edge(prereq, course, relation='prerequisite', weight=1.2)
            
            # Add progression edges
            for next_course in details['leads_to']:
                self.knowledge_graph.add_node(next_course, type='career_path')
                self.knowledge_graph.add_edge(course, next_course, relation='leads_to', weight=0.8)
    
    def _build_domain_taxonomy(self) -> Dict[str, List[str]]:
        """Build hierarchical domain taxonomy"""
        return {
            'computer_science': ['algorithms', 'data structures', 'programming', 'software engineering'],
            'artificial_intelligence': ['machine learning', 'deep learning', 'nlp', 'computer vision'],
            'web_development': ['frontend', 'backend', 'full stack', 'web design'],
            'data_science': ['data analysis', 'statistics', 'visualization', 'big data'],
            'cybersecurity': ['network security', 'ethical hacking', 'cryptography', 'penetration testing'],
            'cloud_computing': ['aws', 'azure', 'gcp', 'devops', 'containerization'],
            'mobile_development': ['android', 'ios', 'react native', 'flutter'],
            'database': ['sql', 'nosql', 'database design', 'data modeling']
        }
    
    def extract_keywords_from_courses(self, timetable_courses: List[Dict[str, Any]]) -> List[str]:
        """
        Extract keywords from timetable courses - ONLY use course names
        """
        keywords = set()
        
        for course in timetable_courses:
            course_name = course.get('name', '').lower()
            
            # Only add the course name itself
            keywords.add(course_name)
            
            # Add individual words from course name (for better matching)
            words = course_name.split()
            for word in words:
                if len(word) > 3:  # Only meaningful words
                    keywords.add(word)
        
        return list(keywords)
    
    def _extract_bert_keywords(self, text: str) -> List[str]:
        """Extract keywords using BERT attention weights"""
        # Tokenize
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        # Get BERT outputs
        with torch.no_grad():
            outputs = self.bert_model(**inputs)
        
        # Extract tokens with high attention
        tokens = self.tokenizer.convert_ids_to_tokens(inputs['input_ids'][0])
        
        # Filter meaningful tokens (remove special tokens and short words)
        keywords = [
            token.replace('##', '') 
            for token in tokens 
            if token not in ['[CLS]', '[SEP]', '[PAD]'] and len(token) > 2
        ]
        
        return keywords
    
    def rank_courses_with_graph_bert(
        self, 
        scraped_courses: List[Dict[str, Any]], 
        timetable_courses: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Rank scraped courses using Graph-BERT algorithm
        Combines graph-based relevance with BERT semantic similarity
        """
        if not scraped_courses:
            return []
        
        # Extract keywords from timetable
        timetable_keywords = self.extract_keywords_from_courses(timetable_courses)
        
        # Get embeddings for timetable courses
        timetable_text = ' '.join([c.get('name', '') for c in timetable_courses])
        timetable_embedding = self.sentence_model.encode([timetable_text])[0]
        
        # Score each scraped course
        scored_courses = []
        
        for course in scraped_courses:
            # BERT semantic similarity
            course_text = f"{course['title']} {course.get('description', '')}"
            course_embedding = self.sentence_model.encode([course_text])[0]
            semantic_score = cosine_similarity([timetable_embedding], [course_embedding])[0][0]
            
            # Graph-based relevance score
            graph_score = self._calculate_graph_relevance(course['title'], timetable_keywords)
            
            # Keyword matching score
            keyword_score = self._calculate_keyword_match(course['title'], timetable_keywords)
            
            # User profile alignment
            profile_score = self._calculate_profile_alignment(course, user_profile)
            
            # Combined score (weighted average)
            final_score = (
                semantic_score * 0.35 +
                graph_score * 0.30 +
                keyword_score * 0.20 +
                profile_score * 0.15
            )
            
            course['relevance_score'] = float(final_score)
            course['semantic_score'] = float(semantic_score)
            course['graph_score'] = float(graph_score)
            course['keyword_score'] = float(keyword_score)
            course['profile_score'] = float(profile_score)
            
            scored_courses.append(course)
        
        # Sort by relevance score
        scored_courses.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return scored_courses
    
    def _calculate_graph_relevance(self, course_title: str, keywords: List[str]) -> float:
        """Calculate relevance using knowledge graph"""
        course_title_lower = course_title.lower()
        total_score = 0.0
        matches = 0
        
        for keyword in keywords:
            keyword_lower = keyword.lower()
            
            # Direct match
            if keyword_lower in course_title_lower:
                total_score += 1.0
                matches += 1
                continue
            
            # Graph-based similarity
            if keyword_lower in self.knowledge_graph:
                for node in self.knowledge_graph.nodes():
                    if node in course_title_lower:
                        try:
                            # Calculate shortest path
                            path_length = nx.shortest_path_length(
                                self.knowledge_graph, keyword_lower, node
                            )
                            # Shorter path = higher relevance
                            score = 1.0 / (path_length + 1)
                            total_score += score
                            matches += 1
                        except (nx.NetworkXNoPath, nx.NodeNotFound):
                            continue
        
        return total_score / max(len(keywords), 1)
    
    def _calculate_keyword_match(self, course_title: str, keywords: List[str]) -> float:
        """Calculate simple keyword matching score"""
        course_title_lower = course_title.lower()
        matches = sum(1 for keyword in keywords if keyword.lower() in course_title_lower)
        return matches / max(len(keywords), 1)
    
    def _calculate_profile_alignment(self, course: Dict[str, Any], user_profile: Dict[str, Any]) -> float:
        """Calculate how well course aligns with user profile"""
        score = 0.5  # Base score
        
        # Check user's year/level
        user_year = user_profile.get('current_year', 2)
        if user_year <= 2:
            # Prefer beginner/intermediate courses
            if 'beginner' in course['title'].lower() or 'introduction' in course['title'].lower():
                score += 0.3
        else:
            # Prefer advanced courses
            if 'advanced' in course['title'].lower() or 'expert' in course['title'].lower():
                score += 0.3
        
        # Check user's interests
        user_interests = user_profile.get('interests', [])
        for interest in user_interests:
            if interest.lower() in course['title'].lower():
                score += 0.2
                break
        
        return min(score, 1.0)
    
    def get_learning_path(self, current_courses: List[str], target_career: str) -> List[str]:
        """Generate learning path from current courses to target career"""
        learning_path = []
        
        for course in current_courses:
            course_lower = course.lower()
            if course_lower in self.knowledge_graph and target_career.lower() in self.knowledge_graph:
                try:
                    path = nx.shortest_path(
                        self.knowledge_graph, 
                        course_lower, 
                        target_career.lower()
                    )
                    learning_path.extend(path[1:])  # Exclude current course
                except (nx.NetworkXNoPath, nx.NodeNotFound):
                    continue
        
        # Remove duplicates while preserving order
        seen = set()
        unique_path = []
        for item in learning_path:
            if item not in seen:
                seen.add(item)
                unique_path.append(item)
        
        return unique_path

# Create singleton instance
graph_bert_recommender = GraphBERTRecommender()
