"""
Celery Worker Configuration for Background Tasks
Handles scheduled notifications and async job processing
"""

from celery import Celery
from celery.schedules import crontab
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Celery
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
celery_app = Celery(
    'educareer_tasks',
    broker=redis_url,
    backend=redis_url
)

# Celery Configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Kolkata',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    result_expires=3600,  # 1 hour
)

# Periodic task schedule
celery_app.conf.beat_schedule = {
    # Check for new opportunities every hour
    'check-new-opportunities-hourly': {
        'task': 'celery_worker.check_new_opportunities',
        'schedule': crontab(minute=0),  # Every hour at minute 0
    },
    # Send daily digest at 9 AM
    'send-daily-digest': {
        'task': 'celery_worker.send_daily_opportunity_digest',
        'schedule': crontab(hour=9, minute=0),  # 9:00 AM daily
    },
}

@celery_app.task(name='celery_worker.send_opportunity_notification')
def send_opportunity_notification(user_data: dict, job_data: dict):
    """
    Send opportunity notification via email and WhatsApp
    
    Args:
        user_data: Dict with user info (email, phone, name, preferences)
        job_data: Dict with job info (title, company, location, etc.)
    """
    from app.services.email_service import email_service
    from app.services.twilio_service import twilio_service
    
    results = {
        'email': None,
        'whatsapp': None,
        'sms': None
    }
    
    # Send Email
    if user_data.get('email'):
        try:
            results['email'] = email_service.send_opportunity_email(
                user_email=user_data['email'],
                user_name=user_data.get('name', 'User'),
                opportunity_title=job_data['title'],
                company=job_data['company'],
                location=job_data['location'],
                description=job_data['description'],
                apply_url=job_data.get('apply_url', 'http://localhost:5173/opportunities'),
                salary=job_data.get('salary')
            )
        except Exception as e:
            results['email'] = {'success': False, 'error': str(e)}
    
    # Send WhatsApp
    if user_data.get('phone') and user_data.get('whatsapp_enabled', True):
        try:
            results['whatsapp'] = twilio_service.send_whatsapp(
                to_number=user_data['phone'],
                message=f"""🎯 New Opportunity Alert!

📋 {job_data['title']}
🏢 {job_data['company']}
📍 {job_data['location']}
{f"💰 {job_data['salary']}" if job_data.get('salary') else ''}

Apply: {job_data.get('apply_url', 'http://localhost:5173/opportunities')}

Good luck! 🚀"""
            )
        except Exception as e:
            results['whatsapp'] = {'success': False, 'error': str(e)}
    
    # Send SMS (optional, if user prefers)
    if user_data.get('phone') and user_data.get('sms_enabled', False):
        try:
            results['sms'] = twilio_service.send_sms(
                to_number=user_data['phone'],
                message=f"New Job: {job_data['title']} at {job_data['company']}. Apply: {job_data.get('apply_url', 'http://localhost:5173/opportunities')}"
            )
        except Exception as e:
            results['sms'] = {'success': False, 'error': str(e)}
    
    return results

@celery_app.task(name='celery_worker.check_new_opportunities')
def check_new_opportunities():
    """
    Periodic task to check for new opportunities and notify users
    Runs every hour
    """
    from app.services.job_opportunities_service import job_service
    from datetime import datetime, timedelta
    
    # Get jobs posted in the last hour
    one_hour_ago = datetime.now() - timedelta(hours=1)
    
    # In a real system, you would:
    # 1. Query database for jobs posted after one_hour_ago
    # 2. Get list of users with matching preferences
    # 3. Send notifications to matching users
    
    # For now, we'll return a status
    return {
        'status': 'completed',
        'checked_at': datetime.now().isoformat(),
        'message': 'Checked for new opportunities'
    }

@celery_app.task(name='celery_worker.send_daily_opportunity_digest')
def send_daily_opportunity_digest():
    """
    Send daily digest of opportunities to users
    Runs at 9 AM daily
    """
    from app.services.job_opportunities_service import job_service
    from datetime import datetime, timedelta
    
    # Get jobs posted in the last 24 hours
    yesterday = datetime.now() - timedelta(days=1)
    
    # In a real system, you would:
    # 1. Get all jobs from last 24 hours
    # 2. Group by user preferences
    # 3. Send digest emails
    
    return {
        'status': 'completed',
        'sent_at': datetime.now().isoformat(),
        'message': 'Daily digest sent'
    }

@celery_app.task(name='celery_worker.notify_users_of_new_job')
def notify_users_of_new_job(job_id: str):
    """
    Notify all matching users when a new job is posted
    
    Args:
        job_id: ID of the newly posted job
    """
    from app.services.job_opportunities_service import job_service
    
    # Get job details
    job = job_service.get_job_by_id(job_id)
    
    if not job:
        return {'success': False, 'error': 'Job not found'}
    
    # In a real system, you would:
    # 1. Query database for users with matching preferences
    # 2. Filter by location, category, experience level, etc.
    # 3. Send notifications to each matching user
    
    # Example: Notify sample users
    sample_users = [
        {
            'email': 'user@example.com',
            'phone': '+919876543210',
            'name': 'John Doe',
            'whatsapp_enabled': True,
            'sms_enabled': False
        }
    ]
    
    results = []
    for user in sample_users:
        job_data = {
            'title': job['title'],
            'company': job['company'],
            'location': job['location'],
            'description': job['description'],
            'salary': f"{job['salary_currency']} {job['salary_min']:,} - {job['salary_max']:,}",
            'apply_url': f"http://localhost:5173/opportunities?job={job_id}"
        }
        
        # Send notification asynchronously
        result = send_opportunity_notification.delay(user, job_data)
        results.append({
            'user_email': user['email'],
            'task_id': result.id
        })
    
    return {
        'success': True,
        'job_id': job_id,
        'notifications_sent': len(results),
        'results': results
    }

@celery_app.task(name='celery_worker.send_bulk_notifications')
def send_bulk_notifications(user_list: list, job_data: dict):
    """
    Send notifications to multiple users at once
    
    Args:
        user_list: List of user dicts
        job_data: Job information dict
    """
    results = []
    
    for user in user_list:
        try:
            result = send_opportunity_notification.delay(user, job_data)
            results.append({
                'user_email': user.get('email'),
                'task_id': result.id,
                'status': 'queued'
            })
        except Exception as e:
            results.append({
                'user_email': user.get('email'),
                'status': 'failed',
                'error': str(e)
            })
    
    return {
        'success': True,
        'total_users': len(user_list),
        'results': results
    }

if __name__ == '__main__':
    # Run worker
    celery_app.start()
