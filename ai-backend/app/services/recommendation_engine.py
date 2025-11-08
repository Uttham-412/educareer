from sentence_transformers import SentenceTransformer
import networkx as nx
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from xgboost import XGBRanker
import pandas as pd
from typing import List, Dict, Any, Tuple
import json
import pickle
import os

class RecommendationEngine:
    def __init__(self):
        # Load sentence transformer model
        self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize knowledge graph
        self.knowledge_graph = nx.Graph()
        self._build_knowledge_graph()
        
        # Load certification database
        self.certifications_db = self._load_certifications_database()
        self.projects_db = self._load_projects_database()
        
        # Initialize XGBoost ranker
        self.ranker = None
        self._load_or_train_ranker()

    def _build_knowledge_graph(self):
        """Build knowledge graph connecting courses, skills, and certifications"""
        # Course-Skill mappings
        course_skills = {
            'computer science': ['programming', 'algorithms', 'data structures', 'software engineering'],
            'data structures': ['algorithms', 'programming', 'problem solving', 'optimization'],
            'machine learning': ['python', 'statistics', 'data analysis', 'ai', 'deep learning'],
            'web development': ['html', 'css', 'javascript', 'react', 'node.js', 'databases'],
            'database systems': ['sql', 'database design', 'data modeling', 'postgresql', 'mongodb'],
            'software engineering': ['programming', 'testing', 'version control', 'agile', 'design patterns'],
            'artificial intelligence': ['machine learning', 'neural networks', 'python', 'tensorflow', 'pytorch'],
            'cybersecurity': ['network security', 'cryptography', 'ethical hacking', 'risk assessment'],
            'mobile development': ['android', 'ios', 'react native', 'flutter', 'mobile ui'],
            'cloud computing': ['aws', 'azure', 'docker', 'kubernetes', 'devops']
        }
        
        # Add nodes and edges to graph
        for course, skills in course_skills.items():
            self.knowledge_graph.add_node(course, type='course')
            for skill in skills:
                self.knowledge_graph.add_node(skill, type='skill')
                self.knowledge_graph.add_edge(course, skill, weight=1.0)
        
        # Add skill-certification connections
        skill_certifications = {
            'python': ['Python Institute PCAP', 'Google Python Certification'],
            'machine learning': ['Google ML Certification', 'Coursera ML Specialization'],
            'aws': ['AWS Solutions Architect', 'AWS Developer Associate'],
            'javascript': ['JavaScript Algorithms Certification', 'React Developer Certification'],
            'cybersecurity': ['CompTIA Security+', 'Certified Ethical Hacker'],
            'data analysis': ['Google Data Analytics', 'Tableau Desktop Specialist']
        }
        
        for skill, certs in skill_certifications.items():
            for cert in certs:
                self.knowledge_graph.add_node(cert, type='certification')
                self.knowledge_graph.add_edge(skill, cert, weight=0.8)

    def _load_certifications_database(self) -> List[Dict[str, Any]]:
        """Load comprehensive certifications database"""
        return [
            {
                'id': 'cert_001',
                'name': 'Google Python Certification',
                'provider': 'Google',
                'description': 'Comprehensive Python programming certification covering fundamentals to advanced topics',
                'skills': ['python', 'programming', 'data structures', 'algorithms'],
                'difficulty': 'intermediate',
                'duration_hours': 40,
                'cost': 'free',
                'url': 'https://developers.google.com/certification/python',
                'prerequisites': ['basic programming knowledge']
            },
            {
                'id': 'cert_002',
                'name': 'AWS Solutions Architect Associate',
                'provider': 'Amazon',
                'description': 'Design and deploy scalable systems on AWS',
                'skills': ['aws', 'cloud computing', 'system design', 'networking'],
                'difficulty': 'intermediate',
                'duration_hours': 60,
                'cost': '$150',
                'url': 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
                'prerequisites': ['basic cloud knowledge', 'networking fundamentals']
            },
            {
                'id': 'cert_003',
                'name': 'Google Machine Learning Certification',
                'provider': 'Google',
                'description': 'Machine learning fundamentals and TensorFlow implementation',
                'skills': ['machine learning', 'tensorflow', 'python', 'data science'],
                'difficulty': 'advanced',
                'duration_hours': 80,
                'cost': 'free',
                'url': 'https://developers.google.com/machine-learning/crash-course',
                'prerequisites': ['python programming', 'statistics', 'linear algebra']
            },
            {
                'id': 'cert_004',
                'name': 'React Developer Certification',
                'provider': 'Meta',
                'description': 'Build modern web applications with React',
                'skills': ['react', 'javascript', 'web development', 'frontend'],
                'difficulty': 'intermediate',
                'duration_hours': 50,
                'cost': '$99',
                'url': 'https://www.coursera.org/professional-certificates/meta-react-native',
                'prerequisites': ['javascript fundamentals', 'html', 'css']
            }
        ]

    def _load_projects_database(self) -> List[Dict[str, Any]]:
        """Load project recommendations database"""
        return [
            {
                'id': 'proj_001',
                'name': 'Personal Portfolio Website',
                'description': 'Build a responsive portfolio website showcasing your projects',
                'skills': ['html', 'css', 'javascript', 'web development'],
                'difficulty': 'beginner',
                'estimated_hours': 20,
                'technologies': ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
                'github_template': 'https://github.com/templates/portfolio-website'
            },
            {
                'id': 'proj_002',
                'name': 'Machine Learning Price Predictor',
                'description': 'Build a model to predict house prices using regression',
                'skills': ['machine learning', 'python', 'data analysis', 'scikit-learn'],
                'difficulty': 'intermediate',
                'estimated_hours': 40,
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
                'github_template': 'https://github.com/templates/ml-price-predictor'
            },
            {
                'id': 'proj_003',
                'name': 'Full-Stack Todo Application',
                'description': 'Complete CRUD application with authentication',
                'skills': ['react', 'node.js', 'mongodb', 'full-stack development'],
                'difficulty': 'intermediate',
                'estimated_hours': 60,
                'technologies': ['React', 'Node.js', 'Express', 'MongoDB'],
                'github_template': 'https://github.com/templates/fullstack-todo'
            }
        ]

    def _load_or_train_ranker(self):
        """Load existing XGBoost ranker or train a new one"""
        model_path = 'models/xgb_ranker.pkl'
        
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                self.ranker = pickle.load(f)
        else:
            # Train a simple ranker with synthetic data
            self._train_initial_ranker()

    def _train_initial_ranker(self):
        """Train initial XGBoost ranker with synthetic data"""
        # Create synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        # Features: [similarity_score, difficulty_match, skill_overlap, user_level]
        X = np.random.rand(n_samples, 4)
        
        # Synthetic relevance scores
        y = (X[:, 0] * 0.4 + X[:, 1] * 0.3 + X[:, 2] * 0.2 + X[:, 3] * 0.1 + 
             np.random.normal(0, 0.1, n_samples))
        
        # Group sizes for ranking
        group_sizes = [50] * (n_samples // 50)
        
        self.ranker = XGBRanker(
            objective='rank:pairwise',
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6
        )
        
        self.ranker.fit(X, y, group=group_sizes)

    def get_course_embeddings(self, courses: List[str]) -> np.ndarray:
        """Generate embeddings for course names"""
        return self.sentence_model.encode(courses)

    def find_similar_certifications(self, courses: List[str], user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Find certifications similar to user's courses"""
        if not courses:
            return []
        
        # Get course embeddings
        course_embeddings = self.get_course_embeddings(courses)
        
        # Get certification embeddings
        cert_names = [cert['name'] + ' ' + cert['description'] for cert in self.certifications_db]
        cert_embeddings = self.sentence_model.encode(cert_names)
        
        # Calculate similarities
        similarities = cosine_similarity(course_embeddings, cert_embeddings)
        max_similarities = np.max(similarities, axis=0)
        
        # Prepare recommendations with features
        recommendations = []
        for i, cert in enumerate(self.certifications_db):
            # Calculate features for ranking
            similarity_score = max_similarities[i]
            difficulty_match = self._calculate_difficulty_match(cert, user_profile)
            skill_overlap = self._calculate_skill_overlap(cert, courses)
            user_level_match = self._calculate_user_level_match(cert, user_profile)
            
            features = [similarity_score, difficulty_match, skill_overlap, user_level_match]
            
            recommendations.append({
                'certification': cert,
                'similarity_score': similarity_score,
                'features': features,
                'graph_score': self._calculate_graph_score(cert, courses)
            })
        
        # Rank recommendations
        if self.ranker:
            feature_matrix = np.array([rec['features'] for rec in recommendations])
            ranking_scores = self.ranker.predict(feature_matrix)
            
            for i, rec in enumerate(recommendations):
                rec['ranking_score'] = ranking_scores[i]
        
        # Sort by ranking score or similarity
        sort_key = 'ranking_score' if self.ranker else 'similarity_score'
        recommendations.sort(key=lambda x: x[sort_key], reverse=True)
        
        return recommendations[:10]  # Return top 10

    def find_project_recommendations(self, courses: List[str], user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Find project recommendations based on courses"""
        if not courses:
            return []
        
        course_embeddings = self.get_course_embeddings(courses)
        
        # Get project embeddings
        project_descriptions = [proj['name'] + ' ' + proj['description'] for proj in self.projects_db]
        project_embeddings = self.sentence_model.encode(project_descriptions)
        
        # Calculate similarities
        similarities = cosine_similarity(course_embeddings, project_embeddings)
        max_similarities = np.max(similarities, axis=0)
        
        recommendations = []
        for i, project in enumerate(self.projects_db):
            similarity_score = max_similarities[i]
            skill_overlap = self._calculate_skill_overlap(project, courses)
            
            recommendations.append({
                'project': project,
                'similarity_score': similarity_score,
                'skill_overlap': skill_overlap,
                'graph_score': self._calculate_graph_score(project, courses)
            })
        
        # Sort by similarity score
        recommendations.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return recommendations[:5]  # Return top 5

    def _calculate_difficulty_match(self, item: Dict[str, Any], user_profile: Dict[str, Any]) -> float:
        """Calculate how well item difficulty matches user level"""
        user_level = user_profile.get('experience_level', 'beginner').lower()
        item_difficulty = item.get('difficulty', 'intermediate').lower()
        
        level_mapping = {'beginner': 1, 'intermediate': 2, 'advanced': 3}
        user_level_num = level_mapping.get(user_level, 1)
        item_level_num = level_mapping.get(item_difficulty, 2)
        
        # Perfect match = 1.0, one level off = 0.7, two levels off = 0.3
        diff = abs(user_level_num - item_level_num)
        if diff == 0:
            return 1.0
        elif diff == 1:
            return 0.7
        else:
            return 0.3

    def _calculate_skill_overlap(self, item: Dict[str, Any], courses: List[str]) -> float:
        """Calculate skill overlap between item and user courses"""
        item_skills = set(skill.lower() for skill in item.get('skills', []))
        course_skills = set()
        
        # Extract skills from courses using knowledge graph
        for course in courses:
            course_lower = course.lower()
            if course_lower in self.knowledge_graph:
                neighbors = self.knowledge_graph.neighbors(course_lower)
                course_skills.update(neighbor for neighbor in neighbors 
                                   if self.knowledge_graph.nodes[neighbor].get('type') == 'skill')
        
        if not item_skills or not course_skills:
            return 0.0
        
        intersection = item_skills.intersection(course_skills)
        union = item_skills.union(course_skills)
        
        return len(intersection) / len(union) if union else 0.0

    def _calculate_user_level_match(self, item: Dict[str, Any], user_profile: Dict[str, Any]) -> float:
        """Calculate how well item matches user's overall profile"""
        # Simple heuristic based on user's skills and experience
        user_skills = set(skill.lower() for skill in user_profile.get('skills', []))
        item_skills = set(skill.lower() for skill in item.get('skills', []))
        
        if not user_skills:
            return 0.5  # Neutral score if no user skills
        
        overlap = len(user_skills.intersection(item_skills))
        return min(overlap / len(item_skills) if item_skills else 0, 1.0)

    def _calculate_graph_score(self, item: Dict[str, Any], courses: List[str]) -> float:
        """Calculate recommendation score using knowledge graph"""
        item_skills = item.get('skills', [])
        total_score = 0.0
        connections = 0
        
        for course in courses:
            course_lower = course.lower()
            if course_lower in self.knowledge_graph:
                for skill in item_skills:
                    skill_lower = skill.lower()
                    if skill_lower in self.knowledge_graph:
                        try:
                            path_length = nx.shortest_path_length(
                                self.knowledge_graph, course_lower, skill_lower
                            )
                            # Shorter path = higher score
                            score = 1.0 / (path_length + 1)
                            total_score += score
                            connections += 1
                        except nx.NetworkXNoPath:
                            continue
        
        return total_score / connections if connections > 0 else 0.0

    def update_user_feedback(self, user_id: str, item_id: str, feedback: str):
        """Update recommendation model based on user feedback"""
        # Store feedback for future model retraining
        feedback_data = {
            'user_id': user_id,
            'item_id': item_id,
            'feedback': feedback,  # 'positive', 'negative', 'completed'
            'timestamp': pd.Timestamp.now()
        }
        
        # In a real implementation, store this in database
        # and periodically retrain the model
        pass