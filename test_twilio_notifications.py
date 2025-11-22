"""
Test script for Twilio notifications
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1/notifications"

def test_opportunity_alert():
    """Test sending opportunity alert via email and WhatsApp"""
    
    print("🧪 Testing Opportunity Alert...")
    print("-" * 50)
    
    data = {
        "user_email": "your-email@example.com",  # Replace with your email
        "user_phone": "+1234567890",  # Replace with your phone (E.164 format)
        "user_name": "Test User",
        "opportunity_title": "Software Engineer Intern",
        "company": "Tech Innovations Inc",
        "location": "Bangalore, India",
        "description": "We're looking for a talented software engineering intern to join our team. You'll work on exciting projects using React, Node.js, and Python.",
        "apply_url": "https://example.com/apply/12345",
        "salary": "₹30,000 - ₹50,000/month"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/send-opportunity-alert",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        result = response.json()
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get('success'):
            print("\n✅ SUCCESS! Notifications sent!")
            print(f"Email: {result['results'].get('email', {}).get('success', False)}")
            print(f"WhatsApp: {result['results'].get('whatsapp', {}).get('success', False)}")
        else:
            print(f"\n❌ FAILED: {result.get('message')}")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

def test_whatsapp():
    """Test WhatsApp message"""
    
    print("\n🧪 Testing WhatsApp...")
    print("-" * 50)
    
    data = {
        "phone_number": "+1234567890",  # Replace with your phone
        "type": "whatsapp"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/test-twilio",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        result = response.json()
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get('success'):
            print("\n✅ WhatsApp test message sent!")
        else:
            print(f"\n❌ FAILED: {result.get('message')}")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

def test_sms():
    """Test SMS message"""
    
    print("\n🧪 Testing SMS...")
    print("-" * 50)
    
    data = {
        "phone_number": "+1234567890",  # Replace with your phone
        "type": "sms"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/test-twilio",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        result = response.json()
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get('success'):
            print("\n✅ SMS test message sent!")
        else:
            print(f"\n❌ FAILED: {result.get('message')}")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

def test_email():
    """Test email"""
    
    print("\n🧪 Testing Email...")
    print("-" * 50)
    
    data = {
        "email": "your-email@example.com"  # Replace with your email
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/test-email",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        result = response.json()
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get('success'):
            print("\n✅ Email test message sent!")
        else:
            print(f"\n❌ FAILED: {result.get('message')}")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 EduCareer Notification System Test")
    print("=" * 50)
    print("\n⚠️  IMPORTANT: Update phone numbers and emails in this script before running!\n")
    
    # Test individual services
    test_email()
    test_whatsapp()
    # test_sms()  # Uncomment to test SMS
    
    # Test full opportunity alert
    # test_opportunity_alert()  # Uncomment to test full flow
    
    print("\n" + "=" * 50)
    print("✅ Testing Complete!")
    print("=" * 50)
