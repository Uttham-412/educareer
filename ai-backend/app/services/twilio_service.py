"""
Twilio Service for sending SMS and WhatsApp notifications
"""
import os
from twilio.rest import Client
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class TwilioService:
    """Service for sending notifications via Twilio (SMS and WhatsApp)"""
    
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.phone_number = os.getenv('TWILIO_PHONE_NUMBER', '+1234567890')
        self.whatsapp_number = os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')
        
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                self.enabled = True
                logger.info("Twilio service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {str(e)}")
                self.enabled = False
        else:
            logger.warning("Twilio credentials not found. SMS/WhatsApp notifications disabled.")
            self.enabled = False
    
    def send_sms(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Send SMS message
        
        Args:
            to_number: Recipient phone number (E.164 format: +1234567890)
            message: Message content
            
        Returns:
            Dict with success status and message SID or error
        """
        if not self.enabled:
            return {
                "success": False,
                "error": "Twilio service not enabled"
            }
        
        try:
            # Ensure phone number is in E.164 format
            if not to_number.startswith('+'):
                to_number = f'+{to_number}'
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number
            )
            
            logger.info(f"SMS sent successfully to {to_number}. SID: {message_obj.sid}")
            
            return {
                "success": True,
                "message_sid": message_obj.sid,
                "status": message_obj.status
            }
            
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_number}: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_whatsapp(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Send WhatsApp message
        
        Args:
            to_number: Recipient phone number (E.164 format: +1234567890)
            message: Message content
            
        Returns:
            Dict with success status and message SID or error
        """
        if not self.enabled:
            return {
                "success": False,
                "error": "Twilio service not enabled"
            }
        
        try:
            # Format WhatsApp number
            if not to_number.startswith('whatsapp:'):
                if not to_number.startswith('+'):
                    to_number = f'+{to_number}'
                to_number = f'whatsapp:{to_number}'
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.whatsapp_number,
                to=to_number
            )
            
            logger.info(f"WhatsApp sent successfully to {to_number}. SID: {message_obj.sid}")
            
            return {
                "success": True,
                "message_sid": message_obj.sid,
                "status": message_obj.status
            }
            
        except Exception as e:
            logger.error(f"Failed to send WhatsApp to {to_number}: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_opportunity_notification(
        self, 
        user_phone: str, 
        opportunity_title: str, 
        company: str,
        location: str,
        apply_url: str,
        via_whatsapp: bool = True,
        via_sms: bool = False
    ) -> Dict[str, Any]:
        """
        Send opportunity notification via WhatsApp and/or SMS
        
        Args:
            user_phone: User's phone number
            opportunity_title: Job/opportunity title
            company: Company name
            location: Job location
            apply_url: Application URL
            via_whatsapp: Send via WhatsApp
            via_sms: Send via SMS
            
        Returns:
            Dict with results for each channel
        """
        message = f"""🎯 New Opportunity Alert!

📋 Position: {opportunity_title}
🏢 Company: {company}
📍 Location: {location}

Apply now: {apply_url}

Good luck! 🚀
- EduCareer Team"""
        
        results = {}
        
        if via_whatsapp:
            results['whatsapp'] = self.send_whatsapp(user_phone, message)
        
        if via_sms:
            # SMS has character limit, so send shorter version
            sms_message = f"New Job: {opportunity_title} at {company}. Apply: {apply_url}"
            results['sms'] = self.send_sms(user_phone, sms_message)
        
        return results

# Create singleton instance
twilio_service = TwilioService()
