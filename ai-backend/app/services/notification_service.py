from ai_backend.app.core.config import settings # <-- Uses settings
import smtplib
from twilio.rest import Client
from email.mime.text import MIMEText
from email.utils import formataddr

# Initialize Twilio client using settings
client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

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