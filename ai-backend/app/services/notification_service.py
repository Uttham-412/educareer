from app.core.config import settings
import smtplib
from twilio.rest import Client
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import Dict, Any

# Initialize Twilio client using settings
client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

class NotificationService:
    """Service class for sending notifications"""
    
    async def send_notification(
        self,
        notification_type: str,
        recipient: str,
        subject: str,
        message: str,
        user_id: str = None
    ) -> Dict[str, Any]:
        """Send notification via specified channel"""
        
        try:
            if notification_type == "email":
                success = send_email_notification(recipient, subject, message)
            elif notification_type == "sms":
                success = send_sms_notification(recipient, message)
            elif notification_type == "whatsapp":
                success = send_whatsapp_notification(recipient, message)
            else:
                return {
                    "success": False,
                    "message": f"Unknown notification type: {notification_type}"
                }
            
            return {
                "success": success,
                "message": "Notification sent successfully" if success else "Failed to send notification",
                "notification_id": f"{notification_type}_{user_id}_{hash(message)}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error sending notification: {str(e)}"
            }
    
    async def schedule_notification(
        self,
        user_id: str,
        schedule_time: str,
        notification_data: Dict[str, Any]
    ) -> str:
        """Schedule a notification for later delivery"""
        # Placeholder for scheduling logic
        return f"scheduled_{user_id}_{schedule_time}"
    
    async def test_service(
        self,
        notification_type: str,
        recipient: str
    ) -> Dict[str, Any]:
        """Test notification service"""
        
        test_message = "This is a test notification from EduCareer AI"
        test_subject = "Test Notification"
        
        try:
            if notification_type == "email":
                success = send_email_notification(recipient, test_subject, test_message)
            elif notification_type == "sms":
                success = send_sms_notification(recipient, test_message)
            elif notification_type == "whatsapp":
                success = send_whatsapp_notification(recipient, test_message)
            else:
                return {
                    "success": False,
                    "message": f"Unknown notification type: {notification_type}",
                    "service_status": {}
                }
            
            return {
                "success": success,
                "message": "Test notification sent successfully" if success else "Test failed",
                "service_status": {
                    "configured": True,
                    "operational": success
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Test failed: {str(e)}",
                "service_status": {
                    "configured": False,
                    "operational": False
                }
            }

def send_whatsapp_notification(to_number: str, message_body: str) -> bool:
    """Sends a WhatsApp message via the Twilio Sandbox."""
    if not settings.TWILIO_ACCOUNT_SID:
        print("Twilio credentials not set. Skipping WhatsApp.")
        return False
    try:
        # Twilio number format must be 'whatsapp:+14155238886'
        message = client.messages.create(
            from_=settings.TWILIO_WHATSAPP_NUMBER,
            body=message_body,
            to=f"whatsapp:{to_number}"
        )
        print(f"Twilio message sent successfully: {message.sid}")
        return True
    except Exception as e:
        print(f"Twilio Error: {e}")
        return False

def send_sms_notification(to_number: str, message_body: str) -> bool:
    """Sends an SMS notification via Twilio."""
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        print("Twilio credentials not set. Skipping SMS.")
        return False
    try:
        message = client.messages.create(
            from_=settings.TWILIO_PHONE_NUMBER,
            body=message_body,
            to=to_number
        )
        print(f"SMS sent successfully: {message.sid}")
        return True
    except Exception as e:
        print(f"Twilio SMS Error: {e}")
        return False

def send_email_notification(to_email: str, subject: str, body: str) -> bool:
    """Sends an email notification via SMTP (Gmail API compatible)."""
    if not settings.EMAIL_USER or not settings.EMAIL_PASSWORD:
        print("SMTP credentials not set. Skipping Email.")
        return False
        
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = formataddr(('EduCareer AI', settings.EMAIL_USER))
        msg['To'] = to_email
        
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
            server.sendmail(settings.EMAIL_USER, to_email, msg.as_string())
            
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False

def send_multi_channel_notification(
    user_phone: str = None,
    user_email: str = None,
    subject: str = "",
    message: str = "",
    channels: list = ["sms", "email"]
) -> dict:
    """
    Send notification via multiple channels.
    
    Args:
        user_phone: User's phone number (with country code, e.g., +1234567890)
        user_email: User's email address
        subject: Email subject
        message: Notification message
        channels: List of channels to use ["sms", "email", "whatsapp"]
    
    Returns:
        dict with status of each channel
    """
    results = {}
    
    if "sms" in channels and user_phone:
        results["sms"] = send_sms_notification(user_phone, message)
    
    if "email" in channels and user_email:
        results["email"] = send_email_notification(user_email, subject, message)
    
    if "whatsapp" in channels and user_phone:
        results["whatsapp"] = send_whatsapp_notification(user_phone, message)
    
    return results