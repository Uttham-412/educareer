"""
User Notification Preferences Service
Manages user notification settings and preferences
"""

from typing import Dict, List, Optional
from datetime import datetime

class UserNotificationService:
    """Service for managing user notification preferences"""
    
    def __init__(self):
        # In a real system, this would be stored in a database
        # For now, we'll use in-memory storage
        self.user_preferences = {}
    
    def register_user_for_notifications(
        self,
        user_id: str,
        email: str,
        phone: Optional[str] = None,
        name: Optional[str] = None,
        preferences: Optional[Dict] = None
    ) -> Dict:
        """
        Register a user for job opportunity notifications
        
        Args:
            user_id: Unique user identifier
            email: User's email address
            phone: User's phone number (E.164 format)
            name: User's name
            preferences: Notification preferences dict
            
        Returns:
            Dict with registration status
        """
        default_preferences = {
            'email_enabled': True,
            'whatsapp_enabled': True,
            'sms_enabled': False,
            'frequency': 'immediate',  # immediate, daily, weekly
            'categories': [],  # Empty means all categories
            'locations': [],  # Empty means all locations
            'experience_levels': [],  # Empty means all levels
            'min_salary': 0,
            'remote_only': False,
        }
        
        if preferences:
            default_preferences.update(preferences)
        
        self.user_preferences[user_id] = {
            'user_id': user_id,
            'email': email,
            'phone': phone,
            'name': name or 'User',
            'preferences': default_preferences,
            'registered_at': datetime.now().isoformat(),
            'last_notified': None
        }
        
        return {
            'success': True,
            'message': 'User registered for notifications',
            'user_id': user_id
        }
    
    def update_user_preferences(
        self,
        user_id: str,
        preferences: Dict
    ) -> Dict:
        """Update user notification preferences"""
        if user_id not in self.user_preferences:
            return {
                'success': False,
                'error': 'User not found'
            }
        
        self.user_preferences[user_id]['preferences'].update(preferences)
        
        return {
            'success': True,
            'message': 'Preferences updated',
            'preferences': self.user_preferences[user_id]['preferences']
        }
    
    def get_user_preferences(self, user_id: str) -> Optional[Dict]:
        """Get user notification preferences"""
        return self.user_preferences.get(user_id)
    
    def get_matching_users_for_job(self, job: Dict) -> List[Dict]:
        """
        Get list of users who should be notified about a job
        
        Args:
            job: Job dict with details
            
        Returns:
            List of user dicts who match the job criteria
        """
        matching_users = []
        
        for user_id, user_data in self.user_preferences.items():
            prefs = user_data['preferences']
            
            # Check if user wants immediate notifications
            if prefs.get('frequency') != 'immediate':
                continue
            
            # Check category filter
            if prefs.get('categories') and job['category'] not in prefs['categories']:
                continue
            
            # Check location filter
            if prefs.get('locations') and job['location'] not in prefs['locations']:
                continue
            
            # Check experience level filter
            if prefs.get('experience_levels') and job['experience_level'] not in prefs['experience_levels']:
                continue
            
            # Check salary filter
            if job['salary_max'] < prefs.get('min_salary', 0):
                continue
            
            # Check remote filter
            if prefs.get('remote_only') and not job['remote']:
                continue
            
            # User matches! Add to list
            matching_users.append({
                'user_id': user_id,
                'email': user_data['email'],
                'phone': user_data['phone'],
                'name': user_data['name'],
                'whatsapp_enabled': prefs.get('whatsapp_enabled', True),
                'sms_enabled': prefs.get('sms_enabled', False),
                'email_enabled': prefs.get('email_enabled', True)
            })
        
        return matching_users
    
    def unsubscribe_user(self, user_id: str) -> Dict:
        """Unsubscribe user from all notifications"""
        if user_id in self.user_preferences:
            del self.user_preferences[user_id]
            return {
                'success': True,
                'message': 'User unsubscribed from notifications'
            }
        
        return {
            'success': False,
            'error': 'User not found'
        }
    
    def get_all_users(self) -> List[Dict]:
        """Get all registered users"""
        return list(self.user_preferences.values())

# Global instance
user_notification_service = UserNotificationService()
