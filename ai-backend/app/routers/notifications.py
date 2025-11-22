from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.services.notification_service import NotificationService
from app.database import get_db, mongo_db
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel
import pandas as pd

router = APIRouter()
notification_service = NotificationService()

class NotificationRequest(BaseModel):
    user_id: str
    type: str  # 'email', 'sms', 'whatsapp'
    subject: str
    message: str
    recipient: str = ""  # email or phone number

class BulkNotificationRequest(BaseModel):
    user_ids: List[str]
    type: str
    subject: str
    message: str
    template: str = "default"

class NotificationPreferences(BaseModel):
    user_id: str
    email_enabled: bool = True
    sms_enabled: bool = False
    whatsapp_enabled: bool = False
    frequency: str = "immediate"  # immediate, daily, weekly
    categories: List[str] = ["recommendations", "achievements", "reminders"]

class MultiChannelNotificationRequest(BaseModel):
    user_phone: str = None
    user_email: str = None
    subject: str = "EduCareer AI Notification"
    message: str
    channels: List[str] = ["sms", "email"]

@router.post("/send")
async def send_notification(
    request: NotificationRequest,
    db: Session = Depends(get_db)
):
    """Send individual notification"""
    
    try:
        # Get user preferences
        preferences = await get_user_preferences(request.user_id)
        
        # Check if notification type is enabled
        if not is_notification_enabled(preferences, request.type):
            return JSONResponse(content={
                "success": False,
                "message": f"{request.type} notifications are disabled for this user"
            })
        
        # Send notification
        result = await notification_service.send_notification(
            notification_type=request.type,
            recipient=request.recipient,
            subject=request.subject,
            message=request.message,
            user_id=request.user_id
        )
        
        # Save notification log
        await save_notification_log(request.user_id, request.type, request.subject, result)
        
        return JSONResponse(content={
            "success": result['success'],
            "message": result['message'],
            "notification_id": result.get('notification_id')
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notification sending failed: {str(e)}")

@router.post("/send-multi")
async def send_multi_channel(request: MultiChannelNotificationRequest):
    """Send notification via multiple channels (SMS, Email, WhatsApp)"""
    
    try:
        from app.services.notification_service import send_multi_channel_notification
        
        results = send_multi_channel_notification(
            user_phone=request.user_phone,
            user_email=request.user_email,
            subject=request.subject,
            message=request.message,
            channels=request.channels
        )
        
        return JSONResponse(content={
            "success": True,
            "results": results,
            "message": "Notifications sent"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-channel notification failed: {str(e)}")

@router.post("/send-bulk")
async def send_bulk_notifications(
    request: BulkNotificationRequest,
    db: Session = Depends(get_db)
):
    """Send notifications to multiple users"""
    
    try:
        results = []
        
        for user_id in request.user_ids:
            # Get user preferences and contact info
            preferences = await get_user_preferences(user_id)
            user_profile = await mongo_db.user_profiles.find_one({"userId": user_id})
            
            if not user_profile:
                results.append({
                    "user_id": user_id,
                    "success": False,
                    "message": "User profile not found"
                })
                continue
            
            # Check if notification type is enabled
            if not is_notification_enabled(preferences, request.type):
                results.append({
                    "user_id": user_id,
                    "success": False,
                    "message": f"{request.type} notifications disabled"
                })
                continue
            
            # Get recipient contact
            recipient = ""
            if request.type == "email":
                recipient = user_profile.get('personalInfo', {}).get('email', '')
            elif request.type in ["sms", "whatsapp"]:
                recipient = user_profile.get('personalInfo', {}).get('phone', '')
            
            if not recipient:
                results.append({
                    "user_id": user_id,
                    "success": False,
                    "message": f"No {request.type} contact information found"
                })
                continue
            
            # Personalize message
            personalized_message = await personalize_message(
                request.message, 
                user_profile, 
                request.template
            )
            
            # Send notification
            result = await notification_service.send_notification(
                notification_type=request.type,
                recipient=recipient,
                subject=request.subject,
                message=personalized_message,
                user_id=user_id
            )
            
            results.append({
                "user_id": user_id,
                "success": result['success'],
                "message": result['message']
            })
            
            # Save notification log
            await save_notification_log(user_id, request.type, request.subject, result)
        
        # Calculate success rate
        successful = sum(1 for r in results if r['success'])
        success_rate = (successful / len(results)) * 100 if results else 0
        
        return JSONResponse(content={
            "success": True,
            "total_sent": len(request.user_ids),
            "successful": successful,
            "success_rate": round(success_rate, 1),
            "results": results
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk notification failed: {str(e)}")

@router.post("/schedule")
async def schedule_notification(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Schedule notification for later delivery"""
    
    try:
        user_id = request.get('user_id')
        schedule_time = request.get('schedule_time')  # ISO format datetime
        notification_data = request.get('notification_data', {})
        
        if not user_id or not schedule_time:
            raise HTTPException(status_code=400, detail="User ID and schedule time are required")
        
        # Schedule with Celery (if available) or save for batch processing
        scheduled_id = await notification_service.schedule_notification(
            user_id=user_id,
            schedule_time=schedule_time,
            notification_data=notification_data
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Notification scheduled successfully",
            "scheduled_id": scheduled_id
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notification scheduling failed: {str(e)}")

@router.post("/preferences")
async def update_notification_preferences(
    preferences: NotificationPreferences,
    db: Session = Depends(get_db)
):
    """Update user notification preferences"""
    
    try:
        # Save preferences to MongoDB
        prefs_doc = {
            "userId": preferences.user_id,
            "emailEnabled": preferences.email_enabled,
            "smsEnabled": preferences.sms_enabled,
            "whatsappEnabled": preferences.whatsapp_enabled,
            "frequency": preferences.frequency,
            "categories": preferences.categories,
            "updatedAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
        }
        
        await mongo_db.notification_preferences.update_one(
            {"userId": preferences.user_id},
            {"$set": prefs_doc},
            upsert=True
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Notification preferences updated successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update preferences: {str(e)}")

@router.get("/preferences/{user_id}")
async def get_notification_preferences(user_id: str):
    """Get user notification preferences"""
    
    try:
        preferences = await mongo_db.notification_preferences.find_one({"userId": user_id})
        
        if not preferences:
            # Return default preferences
            preferences = {
                "userId": user_id,
                "emailEnabled": True,
                "smsEnabled": False,
                "whatsappEnabled": False,
                "frequency": "immediate",
                "categories": ["recommendations", "achievements", "reminders"]
            }
        else:
            preferences.pop('_id', None)
        
        return JSONResponse(content={
            "success": True,
            "preferences": preferences
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch preferences: {str(e)}")

@router.get("/history/{user_id}")
async def get_notification_history(
    user_id: str,
    limit: int = 50,
    notification_type: str = None
):
    """Get user notification history"""
    
    try:
        query = {"userId": user_id}
        if notification_type:
            query["type"] = notification_type
        
        history = await mongo_db.notification_logs.find(query).sort(
            "timestamp", -1
        ).limit(limit).to_list(length=limit)
        
        # Remove MongoDB _id fields
        for item in history:
            item.pop('_id', None)
        
        return JSONResponse(content={
            "success": True,
            "history": history,
            "total_items": len(history)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notification history: {str(e)}")

@router.post("/test")
async def test_notification_service(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Test notification service configuration"""
    
    try:
        notification_type = request.get('type', 'email')
        recipient = request.get('recipient', '')
        
        if not recipient:
            raise HTTPException(status_code=400, detail="Recipient is required for testing")
        
        # Send test notification
        result = await notification_service.test_service(notification_type, recipient)
        
        return JSONResponse(content={
            "success": result['success'],
            "message": result['message'],
            "service_status": result.get('service_status', {})
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notification test failed: {str(e)}")

@router.post("/send-recommendation-alert")
async def send_recommendation_alert(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Send alert when new recommendations are available"""
    
    try:
        user_id = request.get('user_id')
        recommendations = request.get('recommendations', [])
        
        if not user_id or not recommendations:
            raise HTTPException(status_code=400, detail="User ID and recommendations are required")
        
        # Get user profile for personalization
        user_profile = await mongo_db.user_profiles.find_one({"userId": user_id})
        
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Create personalized message
        user_name = user_profile.get('personalInfo', {}).get('firstName', 'there')
        rec_count = len(recommendations)
        
        subject = f"🎯 {rec_count} New Recommendations Available!"
        
        message = f"""
Hi {user_name}!

We've found {rec_count} new recommendations that match your profile:

"""
        
        # Add top 3 recommendations
        for i, rec in enumerate(recommendations[:3], 1):
            message += f"{i}. {rec.get('name', 'Recommendation')}\n"
            if rec.get('provider'):
                message += f"   Provider: {rec['provider']}\n"
            if rec.get('description'):
                message += f"   {rec['description'][:100]}...\n"
            message += "\n"
        
        message += """
Log in to your EduCareer AI dashboard to view all recommendations and start your learning journey!

Best regards,
EduCareer AI Team
        """
        
        # Get user email
        email = user_profile.get('personalInfo', {}).get('email', '')
        
        if email:
            result = await notification_service.send_notification(
                notification_type="email",
                recipient=email,
                subject=subject,
                message=message,
                user_id=user_id
            )
            
            # Save notification log
            await save_notification_log(user_id, "email", subject, result)
            
            return JSONResponse(content={
                "success": result['success'],
                "message": result['message']
            })
        else:
            raise HTTPException(status_code=400, detail="User email not found")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation alert failed: {str(e)}")

async def get_user_preferences(user_id: str) -> Dict[str, Any]:
    """Get user notification preferences"""
    
    preferences = await mongo_db.notification_preferences.find_one({"userId": user_id})
    
    if not preferences:
        # Return default preferences
        return {
            "emailEnabled": True,
            "smsEnabled": False,
            "whatsappEnabled": False,
            "frequency": "immediate",
            "categories": ["recommendations", "achievements", "reminders"]
        }
    
    return preferences

def is_notification_enabled(preferences: Dict[str, Any], notification_type: str) -> bool:
    """Check if notification type is enabled for user"""
    
    type_mapping = {
        "email": "emailEnabled",
        "sms": "smsEnabled",
        "whatsapp": "whatsappEnabled"
    }
    
    pref_key = type_mapping.get(notification_type, "emailEnabled")
    return preferences.get(pref_key, True)

async def personalize_message(message: str, user_profile: Dict[str, Any], template: str) -> str:
    """Personalize notification message"""
    
    personal_info = user_profile.get('personalInfo', {})
    user_name = personal_info.get('firstName', 'there')
    
    # Simple template replacement
    personalized = message.replace('{{name}}', user_name)
    personalized = personalized.replace('{{user_name}}', user_name)
    
    # Add more personalization based on template
    if template == "recommendation":
        skills = user_profile.get('skills', [])
        if skills:
            skill_text = f"Based on your skills in {', '.join(skills[:3])}, "
            personalized = skill_text + personalized
    
    return personalized

async def save_notification_log(user_id: str, notification_type: str, subject: str, result: Dict[str, Any]):
    """Save notification log to MongoDB"""
    
    try:
        log_doc = {
            "userId": user_id,
            "type": notification_type,
            "subject": subject,
            "success": result.get('success', False),
            "message": result.get('message', ''),
            "timestamp": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}},
            "notificationId": result.get('notification_id', '')
        }
        
        await mongo_db.notification_logs.insert_one(log_doc)
        
    except Exception as e:
        print(f"Error saving notification log: {str(e)}")
        # Don't raise exception to avoid breaking main flow


@router.post("/send-opportunity-alert")
async def send_opportunity_alert(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Send opportunity alert via Email, SMS, and WhatsApp when new opportunity is posted
    """
    
    try:
        from app.services.twilio_service import twilio_service
        from app.services.email_service import email_service
        
        # Extract opportunity details
        user_id = request.get('user_id')
        user_email = request.get('user_email')
        user_phone = request.get('user_phone')
        user_name = request.get('user_name', 'there')
        
        opportunity_title = request.get('opportunity_title')
        company = request.get('company')
        location = request.get('location')
        description = request.get('description', '')
        apply_url = request.get('apply_url')
        salary = request.get('salary')
        
        if not opportunity_title or not company or not apply_url:
            raise HTTPException(status_code=400, detail="Opportunity title, company, and apply URL are required")
        
        results = {}
        
        # Send Email
        if user_email:
            email_result = email_service.send_opportunity_email(
                user_email=user_email,
                user_name=user_name,
                opportunity_title=opportunity_title,
                company=company,
                location=location,
                description=description,
                apply_url=apply_url,
                salary=salary
            )
            results['email'] = email_result
        
        # Send WhatsApp
        if user_phone:
            whatsapp_result = twilio_service.send_opportunity_notification(
                user_phone=user_phone,
                opportunity_title=opportunity_title,
                company=company,
                location=location,
                apply_url=apply_url,
                via_whatsapp=True,
                via_sms=False
            )
            results['whatsapp'] = whatsapp_result.get('whatsapp', {})
        
        # Save notification log
        if user_id:
            await save_notification_log(
                user_id, 
                "opportunity_alert", 
                f"New Opportunity: {opportunity_title}", 
                {"success": True, "results": results}
            )
        
        return JSONResponse(content={
            "success": True,
            "message": "Opportunity alerts sent successfully",
            "results": results
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Opportunity alert failed: {str(e)}")

@router.post("/test-twilio")
async def test_twilio_service(request: Dict[str, Any]):
    """Test Twilio SMS and WhatsApp service"""
    
    try:
        from app.services.twilio_service import twilio_service
        
        phone_number = request.get('phone_number')
        test_type = request.get('type', 'whatsapp')  # 'sms' or 'whatsapp'
        
        if not phone_number:
            raise HTTPException(status_code=400, detail="Phone number is required")
        
        test_message = "🎉 Test message from EduCareer! Your notification system is working perfectly. You'll receive job alerts here when new opportunities match your profile."
        
        if test_type == 'sms':
            result = twilio_service.send_sms(phone_number, test_message)
        else:
            result = twilio_service.send_whatsapp(phone_number, test_message)
        
        return JSONResponse(content={
            "success": result.get('success', False),
            "message": result.get('error') if not result.get('success') else "Test message sent successfully!",
            "details": result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Twilio test failed: {str(e)}")

@router.post("/test-email")
async def test_email_service(request: Dict[str, Any]):
    """Test Email service"""
    
    try:
        from app.services.email_service import email_service
        
        email_address = request.get('email')
        
        if not email_address:
            raise HTTPException(status_code=400, detail="Email address is required")
        
        result = email_service.send_email(
            to_email=email_address,
            subject="🎉 Test Email from EduCareer",
            body="<h1>Success!</h1><p>Your email notification system is working perfectly. You'll receive job alerts here when new opportunities match your profile.</p>",
            html=True
        )
        
        return JSONResponse(content={
            "success": result.get('success', False),
            "message": result.get('error') if not result.get('success') else "Test email sent successfully!",
            "details": result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email test failed: {str(e)}")
