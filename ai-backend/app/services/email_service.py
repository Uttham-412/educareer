"""
Email Service for sending email notifications
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending email notifications"""
    
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_user = os.getenv('EMAIL_USER')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        
        if self.email_user and self.email_password:
            self.enabled = True
            logger.info("Email service initialized successfully")
        else:
            logger.warning("Email credentials not found. Email notifications disabled.")
            self.enabled = False
    
    def send_email(
        self, 
        to_email: str, 
        subject: str, 
        body: str, 
        html: bool = False
    ) -> Dict[str, Any]:
        """
        Send email
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Email body (plain text or HTML)
            html: Whether body is HTML
            
        Returns:
            Dict with success status
        """
        if not self.enabled:
            return {
                "success": False,
                "error": "Email service not enabled"
            }
        
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.email_user
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Attach body
            if html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            
            return {
                "success": True,
                "message": "Email sent successfully"
            }
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_opportunity_email(
        self,
        user_email: str,
        user_name: str,
        opportunity_title: str,
        company: str,
        location: str,
        description: str,
        apply_url: str,
        salary: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send opportunity notification email with HTML formatting
        
        Args:
            user_email: User's email address
            user_name: User's name
            opportunity_title: Job/opportunity title
            company: Company name
            location: Job location
            description: Job description
            apply_url: Application URL
            salary: Salary range (optional)
            
        Returns:
            Dict with success status
        """
        subject = f"🎯 New Opportunity: {opportunity_title} at {company}"
        
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }}
        .content {{
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }}
        .job-title {{
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }}
        .company {{
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
        }}
        .details {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .detail-item {{
            margin: 10px 0;
            padding: 10px;
            border-left: 3px solid #667eea;
            background: #f0f4ff;
        }}
        .button {{
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }}
        .footer {{
            text-align: center;
            color: #999;
            margin-top: 30px;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Opportunity Alert!</h1>
            <p>We found a great opportunity that matches your profile</p>
        </div>
        
        <div class="content">
            <p>Hi {user_name},</p>
            
            <div class="job-title">{opportunity_title}</div>
            <div class="company">🏢 {company}</div>
            
            <div class="details">
                <div class="detail-item">
                    <strong>📍 Location:</strong> {location}
                </div>
                {f'<div class="detail-item"><strong>💰 Salary:</strong> {salary}</div>' if salary else ''}
                <div class="detail-item">
                    <strong>📋 Description:</strong><br>
                    {description[:300]}{'...' if len(description) > 300 else ''}
                </div>
            </div>
            
            <center>
                <a href="{apply_url}" class="button">Apply Now 🚀</a>
            </center>
            
            <p>Don't miss this opportunity! Click the button above to apply.</p>
            
            <p>Good luck with your application!</p>
            
            <p>Best regards,<br>
            <strong>EduCareer Team</strong></p>
        </div>
        
        <div class="footer">
            <p>You're receiving this email because you signed up for job alerts on EduCareer.</p>
            <p>© 2025 EduCareer. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        """
        
        return self.send_email(user_email, subject, html_body, html=True)

# Create singleton instance
email_service = EmailService()
