#!/usr/bin/env python3
"""
Test Twilio SMS and WhatsApp functionality
"""
from twilio.rest import Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('ai-backend/.env')

# Get credentials
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
phone_number = os.getenv('TWILIO_PHONE_NUMBER')
whatsapp_number = os.getenv('TWILIO_WHATSAPP_NUMBER')

print("=" * 60)
print("Twilio Configuration Test")
print("=" * 60)
print(f"Account SID: {account_sid}")
print(f"Auth Token: {'*' * (len(auth_token) - 4) + auth_token[-4:] if auth_token else 'Not set'}")
print(f"Phone Number: {phone_number}")
print(f"WhatsApp Number: {whatsapp_number}")
print("=" * 60)

if not account_sid or not auth_token:
    print("❌ ERROR: Twilio credentials not set!")
    exit(1)

try:
    # Initialize Twilio client
    client = Client(account_sid, auth_token)
    
    # Test 1: Verify account
    print("\n📋 Test 1: Verifying Twilio Account...")
    try:
        account = client.api.accounts(account_sid).fetch()
        print(f"✅ Account Status: {account.status}")
        print(f"   Account Name: {account.friendly_name}")
        print(f"   Account Type: {account.type}")
    except Exception as e:
        print(f"❌ Account verification failed: {str(e)}")
        print("\n🔍 Possible issues:")
        print("   1. Account SID is incorrect")
        print("   2. Auth Token is incorrect or expired")
        print("   3. Account is suspended")
        print("\n💡 Solution:")
        print("   1. Go to https://console.twilio.com/")
        print("   2. Copy your Account SID and Auth Token")
        print("   3. Update the .env file")
        exit(1)
    
    # Test 2: Check phone numbers
    print("\n📱 Test 2: Checking Available Phone Numbers...")
    try:
        incoming_phone_numbers = client.incoming_phone_numbers.list(limit=5)
        if incoming_phone_numbers:
            print(f"✅ Found {len(incoming_phone_numbers)} phone number(s):")
            for number in incoming_phone_numbers:
                print(f"   - {number.phone_number} ({number.friendly_name})")
                print(f"     SMS: {'✅' if number.capabilities['sms'] else '❌'}")
                print(f"     Voice: {'✅' if number.capabilities['voice'] else '❌'}")
        else:
            print("⚠️  No phone numbers found in your account")
            print("   You need to purchase a phone number from Twilio")
            print("   Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/search")
    except Exception as e:
        print(f"⚠️  Could not fetch phone numbers: {str(e)}")
    
    # Test 3: Check account balance
    print("\n💰 Test 3: Checking Account Balance...")
    try:
        balance = client.balance.fetch()
        print(f"✅ Balance: {balance.balance} {balance.currency}")
        if float(balance.balance) <= 0:
            print("⚠️  WARNING: Your account balance is low or zero!")
            print("   Add funds at: https://console.twilio.com/us1/billing/manage-billing/billing-overview")
    except Exception as e:
        print(f"⚠️  Could not fetch balance: {str(e)}")
    
    # Test 4: Send test SMS
    print("\n📨 Test 4: Sending Test SMS...")
    test_phone = input("Enter your phone number (with country code, e.g., +917411231249): ").strip()
    
    if test_phone:
        try:
            message = client.messages.create(
                body="Test SMS from EduCareer AI! If you receive this, SMS notifications are working! 🎉",
                from_=phone_number,
                to=test_phone
            )
            print(f"✅ SMS sent successfully!")
            print(f"   Message SID: {message.sid}")
            print(f"   Status: {message.status}")
            print(f"   To: {message.to}")
            print(f"   From: {message.from_}")
        except Exception as e:
            print(f"❌ SMS failed: {str(e)}")
            error_str = str(e)
            
            if "21608" in error_str:
                print("\n🔍 Error 21608: The 'To' phone number is not verified")
                print("💡 Solution:")
                print("   1. Go to https://console.twilio.com/us1/develop/phone-numbers/manage/verified")
                print("   2. Click 'Add a new number'")
                print("   3. Verify your phone number")
                print("   4. Trial accounts can only send to verified numbers")
            elif "21211" in error_str:
                print("\n🔍 Error 21211: Invalid 'To' phone number")
                print("💡 Solution: Make sure the phone number includes country code (e.g., +917411231249)")
            elif "20003" in error_str:
                print("\n🔍 Error 20003: Authentication failed")
                print("💡 Solution: Check your Account SID and Auth Token")
    
    # Test 5: WhatsApp Sandbox
    print("\n💬 Test 5: Checking WhatsApp Sandbox...")
    print("ℹ️  For WhatsApp, you need to join the Twilio Sandbox first:")
    print("   1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
    print("   2. Send the join code from your WhatsApp to the sandbox number")
    print("   3. Once joined, you can receive WhatsApp messages")
    
    test_whatsapp = input("\nHave you joined the WhatsApp sandbox? (y/n): ").strip().lower()
    
    if test_whatsapp == 'y':
        whatsapp_to = input("Enter your WhatsApp number (with country code, e.g., +917411231249): ").strip()
        if whatsapp_to:
            try:
                message = client.messages.create(
                    body="Test WhatsApp message from EduCareer AI! 🎉",
                    from_=whatsapp_number,
                    to=f"whatsapp:{whatsapp_to}"
                )
                print(f"✅ WhatsApp message sent successfully!")
                print(f"   Message SID: {message.sid}")
                print(f"   Status: {message.status}")
            except Exception as e:
                print(f"❌ WhatsApp failed: {str(e)}")
                if "63007" in str(e):
                    print("\n🔍 Error 63007: Recipient not in WhatsApp sandbox")
                    print("💡 Solution: Make sure you've joined the sandbox by sending the join code")

except Exception as e:
    print(f"\n❌ Fatal error: {str(e)}")
    print("\n🔍 Common issues:")
    print("   1. Invalid Account SID or Auth Token")
    print("   2. Network connectivity issues")
    print("   3. Twilio account suspended")

print("\n" + "=" * 60)
print("Test completed!")
print("=" * 60)
