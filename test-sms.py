#!/usr/bin/env python3
"""
Test SMS notification functionality with Twilio
"""

import requests
import json

# Configuration
AI_BACKEND_URL = "http://localhost:8000"
PHONE_NUMBER = "+917411231249"  # Your phone number
EMAIL = "uttham188@gmail.com"  # Your email

def test_sms_notification():
    """Test sending SMS notification"""
    
    print("🧪 Testing SMS Notification...")
    print(f"📱 Phone: {PHONE_NUMBER}")
    print(f"📧 Email: {EMAIL}")
    print("-" * 50)
    
    # Test data
    payload = {
        "user_phone": PHONE_NUMBER,
        "user_email": EMAIL,
        "subject": "🎉 Test Notification from EduCareer AI",
        "message": "Hello! This is a test SMS from EduCareer AI. If you received this, SMS notifications are working perfectly! 🚀",
        "channels": ["sms"]  # Test SMS only
    }
    
    try:
        # Send request
        print("\n📤 Sending SMS notification...")
        response = requests.post(
            f"{AI_BACKEND_URL}/api/v1/notifications/send-multi",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        # Check response
        if response.status_code == 200:
            result = response.json()
            print("\n✅ SUCCESS!")
            print(f"Response: {json.dumps(result, indent=2)}")
            
            if result.get("results", {}).get("sms"):
                print("\n🎉 SMS sent successfully!")
                print(f"📱 Check your phone ({PHONE_NUMBER}) for the message")
            else:
                print("\n⚠️ SMS sending failed")
                print("Check Twilio credentials and phone number format")
        else:
            print(f"\n❌ FAILED! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Make sure AI backend is running (python main.py)")
        print("2. Check Twilio credentials in .env file")
        print("3. Verify phone number format (+country_code + number)")

def test_multi_channel():
    """Test sending notification via multiple channels"""
    
    print("\n" + "="*50)
    print("🧪 Testing Multi-Channel Notification...")
    print("="*50)
    
    payload = {
        "user_phone": PHONE_NUMBER,
        "user_email": EMAIL,
        "subject": "🎓 Multi-Channel Test - EduCareer AI",
        "message": "Testing multi-channel notifications! You should receive this via both SMS and Email.",
        "channels": ["sms", "email"]
    }
    
    try:
        print("\n📤 Sending multi-channel notification...")
        response = requests.post(
            f"{AI_BACKEND_URL}/api/v1/notifications/send-multi",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ SUCCESS!")
            print(f"Response: {json.dumps(result, indent=2)}")
            
            results = result.get("results", {})
            if results.get("sms"):
                print("✅ SMS sent")
            if results.get("email"):
                print("✅ Email sent")
                
            print("\n📱 Check your phone and email!")
        else:
            print(f"\n❌ FAILED! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

if __name__ == "__main__":
    print("="*50)
    print("📱 EduCareer AI - SMS Notification Test")
    print("="*50)
    
    # Test 1: SMS only
    test_sms_notification()
    
    # Test 2: Multi-channel
    input("\n\nPress Enter to test multi-channel notifications...")
    test_multi_channel()
    
    print("\n" + "="*50)
    print("✅ Testing complete!")
    print("="*50)
