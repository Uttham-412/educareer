import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client
import requests
from typing import Dict, Any
import uuid
from datetime import datetime, timedelta
import asyncio
from app.core.config import settings
from app.database import mongo_db
import pandas as pd

class NotificationService:
    def __init__(self):
        # Email configuration
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.email_user = settings.EMAIL_USER
        self.email_password = settings.EMAIL_PASSWORD
        
        # Twilio configuration
        self.twilio_client = None
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                self.twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            except Exception as e:
                print(f"Twilio initialization failed: {e}")
        
        # WhatsApp configuration (using Twilio)
        self.whatsapp_enabled = bool(self.twilio_client)

    async def send_notification(self, notification_type: str, recipient: str, 
                              subject: str, message: str, user_id: str = None) -> Dict[str, Any]:
        """Send notification based on type"""
        
        notification_id = str(uuid.uuid4())
        
        try:
            if notification_type == "email":
                result = await self._send_email(recipient, subject, message)
            elif notification_type == "sms":
                result = await self._send_sms(recipient, message)
            elif notification_type == "whatsapp":
                result = await self._send_whatsapp(recipient, message)
            else:
                return {
                    "success": False,
                    "message": f"Unsupported notification type: {notification_type}",
                    "notification_id": notification_id
                }
            
            result["notification_id"] = notification_id
            return result
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Notification failed: {str(e)}",
                "notification_id": notification_id
            }

    async def _send_email(self, recipient: str, subject: str, message: str) -> Dict[str, Any]:
        """Send email notification"""
        
        if not self.email_user or not self.email_password:
            return {
                "success": False,
                "message": "Email service not configured"
            }
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = recipient
            msg['Subject'] = subject
            
            # Add body
            msg.attach(MIMEText(message, 'plain'))
            
            # Create secure connection and send email
            context = ssl.create_default_context()
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
            
            return {
                "success": True,
                "message": "Email sent successfully"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Email sending failed: {str(e)}"
            }

    async def _send_sms(self, recipient: str, message: str) -> Dict[str, Any]:
        """Send SMS notification"""
        
        if not self.twilio_client:
            return {
                "success": False,
                "message": "SMS service not configured"
            }
        
        try:
            # Format phone number
            if not recipient.startswith('+'):
                recipient = '+1' + recipient.replace('-', '').replace(' ', '')
            
            # Send SMS
            message_obj = self.twilio_client.messages.create(
                body=message,
                from_='+1234567890',  # Replace with your Twilio phone number
                to=recipient
            )
            
            return {
                "success": True,
                "message": "SMS sent successfully",
                "message_sid": message_obj.sid
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"SMS sending failed: {str(e)}"
            }

    async def _send_whatsapp(self, recipient: str, message: str) -> Dict[str, Any]:
        """Send WhatsApp notification"""
        
        if not self.twilio_client:
            return {
                "success": False,
                "message": "WhatsApp service not configured"
            }
        
        try:
            # Format phone number
            if not recipient.startswith('+'):
                recipient = '+1' + recipient.replace('-', '').replace(' ', '')
            
            # Send WhatsApp message
            message_obj = self.twilio_client.messages.create(
                body=message,
                from_='whatsapp:+14155238886',  # Twilio Sandbox number
                to=f'whatsapp:{recipient}'
            )
            
            return {
                "success": True,
                "message": "WhatsApp message sent successfully",
                "message_sid": message_obj.sid
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"WhatsApp sending failed: {str(e)}"
            }

    async def schedule_notification(self, user_id: str, schedule_time: str, 
                                  notification_data: Dict[str, Any]) -> str:
        """Schedule notification for later delivery"""
        
        scheduled_id = str(uuid.uuid4())
        
        try:
            # Parse schedule time
            schedule_datetime = pd.to_datetime(schedule_time)
            
            # Save scheduled notification to MongoDB
            scheduled_doc = {
                "scheduledId": scheduled_id,
                "userId": user_id,
                "scheduleTime": {"$date": {"$numberLong": str(int(schedule_datetime.timestamp() * 1000))}},
                "notificationData": notification_data,
                "status": "scheduled",
                "createdAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
            }
            
            await mongo_db.scheduled_notifications.insert_one(scheduled_doc)
            
            return scheduled_id
            
        except Exception as e:
            raise Exception(f"Scheduling failed: {str(e)}")

    async def process_scheduled_notifications(self):
        """Process scheduled notifications (to be called by background task)"""
        
        try:
            # Get notifications scheduled for now or earlier
            current_time = pd.Timestamp.now()
            
            scheduled_notifications = await mongo_db.scheduled_notifications.find({
                "status": "scheduled",
                "scheduleTime": {"$lte": {"$date": {"$numberLong": str(int(current_time.timestamp() * 1000))}}}
            }).to_list(length=100)
            
            for notification in scheduled_notifications:
                try:
                    # Send notification
                    notification_data = notification['notificationData']
                    
                    result = await self.send_notification(
                        notification_type=notification_data.get('type', 'email'),
                        recipient=notification_data.get('recipient', ''),
                        subject=notification_data.get('subject', ''),
                        message=notification_data.get('message', ''),
                        user_id=notification['userId']
                    )
                    
                    # Update status
                    status = "sent" if result['success'] else "failed"
                    
                    await mongo_db.scheduled_notifications.update_one(
                        {"scheduledId": notification['scheduledId']},
                        {
                            "$set": {
                                "status": status,
                                "sentAt": {"$date": {"$numberLong": str(int(current_time.timestamp() * 1000))}},
                                "result": result
                            }
                        }
                    )
                    
                except Exception as e:
                    # Mark as failed
                    await mongo_db.scheduled_notifications.update_one(
                        {"scheduledId": notification['scheduledId']},
                        {
                            "$set": {
                                "status": "failed",
                                "error": str(e),
                                "failedAt": {"$date": {"$numberLong": str(int(current_time.timestamp() * 1000))}}
                            }
                        }
                    )
            
            return len(scheduled_notifications)
            
        except Exception as e:
            print(f"Error processing scheduled notifications: {str(e)}")
            return 0

    async def send_recommendation_digest(self, user_id: str, frequency: str = "daily"):
        """Send digest of new recommendations"""
        
        try:
            # Get user profile
            user_profile = await mongo_db.user_profiles.find_one({"userId": user_id})
            
            if not user_profile:
                return {"success": False, "message": "User profile not found"}
            
            # Calculate time range based on frequency
            now = pd.Timestamp.now()
            if frequency == "daily":
                since = now - timedelta(days=1)
            elif frequency == "weekly":
                since = now - timedelta(weeks=1)
            else:
                since = now - timedelta(hours=1)  # immediate
            
            # Get recent recommendations
            recent_recommendations = await mongo_db.user_recommendations.find({
                "userId": user_id,
                "timestamp": {"$gte": {"$date": {"$numberLong": str(int(since.timestamp() * 1000))}}}
            }).to_list(length=50)
            
            if not recent_recommendations:
                return {"success": True, "message": "No new recommendations"}
            
            # Create digest message
            user_name = user_profile.get('personalInfo', {}).get('firstName', 'there')
            
            subject = f"🎯 Your {frequency.title()} Learning Digest"
            
            message = f"""
Hi {user_name}!

Here's your {frequency} digest of new learning opportunities:

📚 NEW RECOMMENDATIONS ({len(recent_recommendations)} items)

"""
            
            # Add recommendations summary
            cert_count = 0
            project_count = 0
            
            for rec_doc in recent_recommendations:
                recommendations = rec_doc.get('recommendations', [])
                if rec_doc.get('type') == 'certifications':
                    cert_count += len(recommendations)
                elif rec_doc.get('type') == 'projects':
                    project_count += len(recommendations)
            
            if cert_count > 0:
                message += f"• {cert_count} new certifications matched your profile\n"
            
            if project_count > 0:
                message += f"• {project_count} new projects to build your portfolio\n"
            
            message += f"""

🚀 QUICK STATS
• Total recommendations: {cert_count + project_count}
• Based on your courses and skills
• Personalized for your experience level

Log in to your dashboard to explore all recommendations and start learning!

Best regards,
EduCareer AI Team

---
Manage your notification preferences: [Dashboard Settings]
            """
            
            # Send email
            email = user_profile.get('personalInfo', {}).get('email', '')
            
            if email:
                result = await self._send_email(email, subject, message)
                return result
            else:
                return {"success": False, "message": "User email not found"}
            
        except Exception as e:
            return {"success": False, "message": f"Digest sending failed: {str(e)}"}

    async def send_achievement_notification(self, user_id: str, achievement: Dict[str, Any]):
        """Send notification when user completes an achievement"""
        
        try:
            # Get user profile
            user_profile = await mongo_db.user_profiles.find_one({"userId": user_id})
            
            if not user_profile:
                return {"success": False, "message": "User profile not found"}
            
            user_name = user_profile.get('personalInfo', {}).get('firstName', 'there')
            achievement_name = achievement.get('name', 'Achievement')
            
            subject = f"🎉 Congratulations! Achievement Unlocked"
            
            message = f"""
Hi {user_name}!

Congratulations! You've just unlocked a new achievement:

🏆 {achievement_name}

{achievement.get('description', 'Great job on your learning journey!')}

This achievement has been added to your portfolio and will be included in your auto-generated resume.

Keep up the excellent work!

Best regards,
EduCareer AI Team
            """
            
            # Send notification
            email = user_profile.get('personalInfo', {}).get('email', '')
            
            if email:
                result = await self._send_email(email, subject, message)
                return result
            else:
                return {"success": False, "message": "User email not found"}
            
        except Exception as e:
            return {"success": False, "message": f"Achievement notification failed: {str(e)}"}

    async def test_service(self, notification_type: str, recipient: str) -> Dict[str, Any]:
        """Test notification service configuration"""
        
        test_subject = "EduCareer AI - Test Notification"
        test_message = "This is a test notification from EduCareer AI. If you receive this, the service is working correctly!"
        
        try:
            result = await self.send_notification(
                notification_type=notification_type,
                recipient=recipient,
                subject=test_subject,
                message=test_message
            )
            
            # Add service status information
            service_status = await self._get_service_status()
            result["service_status"] = service_status
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Test failed: {str(e)}",
                "service_status": await self._get_service_status()
            }

    async def _get_service_status(self) -> Dict[str, Any]:
        """Get status of notification services"""
        
        status = {
            "email": {
                "configured": bool(self.email_user and self.email_password),
                "smtp_server": self.smtp_server,
                "smtp_port": self.smtp_port
            },
            "sms": {
                "configured": bool(self.twilio_client),
                "service": "Twilio"
            },
            "whatsapp": {
                "configured": self.whatsapp_enabled,
                "service": "Twilio"
            }
        }
        
        return status

    async def cleanup_old_notifications(self, days_to_keep: int = 30):
        """Clean up old notification logs"""
        
        try:
            cutoff_date = pd.Timestamp.now() - timedelta(days=days_to_keep)
            
            # Delete old notification logs
            result = await mongo_db.notification_logs.delete_many({
                "timestamp": {"$lt": {"$date": {"$numberLong": str(int(cutoff_date.timestamp() * 1000))}}}
            })
            
            # Delete old scheduled notifications
            scheduled_result = await mongo_db.scheduled_notifications.delete_many({
                "createdAt": {"$lt": {"$date": {"$numberLong": str(int(cutoff_date.timestamp() * 1000))}}},
                "status": {"$in": ["sent", "failed"]}
            })
            
            return {
                "logs_deleted": result.deleted_count,
                "scheduled_deleted": scheduled_result.deleted_count
            }
            
        except Exception as e:
            print(f"Error cleaning up notifications: {str(e)}")
            return {"logs_deleted": 0, "scheduled_deleted": 0}