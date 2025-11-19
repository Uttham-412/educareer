# 📱 Twilio SMS/WhatsApp Setup Guide

## Current Issue

Your Twilio credentials are not authenticating. Error: **20003 - Unable to authenticate**

This typically means:
- ❌ Auth Token is incorrect or expired
- ❌ Account SID is incorrect
- ❌ Account is suspended or inactive

---

## 🔧 Step-by-Step Fix

### Step 1: Verify Your Twilio Account

1. **Go to Twilio Console**: https://console.twilio.com/
2. **Log in** with your Twilio account
3. **Check account status** - Make sure it's active

### Step 2: Get Fresh Credentials

1. On the Twilio Console homepage, you'll see:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click the eye icon to reveal it)

2. **Copy both values exactly as shown**

3. If you see a "Test Credentials" section, make sure you're using **Live Credentials**, not test ones

### Step 3: Update Configuration

Edit the file: `educareer/ai-backend/.env`

Replace these lines with your actual credentials:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
```

**Important**: 
- No spaces before or after the `=` sign
- No quotes around the values
- Replace the placeholder values with your actual Twilio credentials
- Copy the entire Auth Token (usually 32 characters)

### Step 4: Get a Twilio Phone Number

If you don't have a phone number yet:

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/search
2. Select your country (India)
3. Check "SMS" capability
4. Click "Search"
5. Buy a number (free with trial credit)
6. Update the `.env` file with your new number:

```env
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 5: Verify Your Phone Number (Trial Accounts)

**Trial accounts can only send to verified numbers!**

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click "Add a new number"
3. Enter your phone number: `+917411231249`
4. Choose verification method (SMS or Call)
5. Enter the verification code

### Step 6: Restart AI Backend

After updating credentials:
```bash
# Stop the AI backend
# Restart it to load new credentials
```

---

## 🧪 Testing SMS

After fixing credentials, run:

```bash
cd educareer
python test-twilio.py
```

This will:
- ✅ Verify your Twilio account
- ✅ Check your phone numbers
- ✅ Show your account balance
- ✅ Send a test SMS
- ✅ Test WhatsApp (if configured)

---

## 💬 WhatsApp Setup (Optional)

### Step 1: Join WhatsApp Sandbox

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. You'll see a sandbox number and a join code like: `join <word>-<word>`
3. Send this join code from your WhatsApp to the sandbox number
4. You'll receive a confirmation message

### Step 2: Update Configuration

The WhatsApp sandbox number is usually: `whatsapp:+14155238886`

Update `.env`:
```env
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Step 3: Test WhatsApp

Run the test script and choose to test WhatsApp when prompted.

---

## 💰 Account Balance

**Trial accounts get $15 free credit**

Check your balance at: https://console.twilio.com/us1/billing/manage-billing/billing-overview

**Pricing**:
- SMS: ~$0.0075 per message (India)
- WhatsApp: ~$0.005 per message

---

## 🔍 Common Errors

### Error 20003: Authentication Failed
**Solution**: Double-check your Account SID and Auth Token

### Error 21608: Phone Number Not Verified
**Solution**: Verify your phone number in the Twilio console (trial accounts only)

### Error 21211: Invalid Phone Number
**Solution**: Make sure to include country code (e.g., +917411231249)

### Error 21606: From Number Not Owned
**Solution**: Make sure you've purchased a Twilio phone number

### Error 63007: WhatsApp Recipient Not in Sandbox
**Solution**: Join the WhatsApp sandbox by sending the join code

---

## 🚀 Production Considerations

For production use:

1. **Upgrade to paid account** to remove trial restrictions
2. **Verify your business** for higher sending limits
3. **Register your brand** for better deliverability
4. **Set up a dedicated phone number** for your app

---

## 📝 Current Configuration

Example configuration format:

```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: your_auth_token_here
Phone Number: +1234567890
WhatsApp: whatsapp:+1234567890
```

**Note**: Replace with your actual Twilio credentials from the Twilio Console

---

## 🆘 Still Not Working?

1. **Check Twilio Status**: https://status.twilio.com/
2. **Review Twilio Logs**: https://console.twilio.com/us1/monitor/logs/sms
3. **Contact Twilio Support**: https://support.twilio.com/

---

## 💡 Alternative: Email-Only Notifications

If you don't need SMS/WhatsApp, you can disable them:

In `educareer/server/src/services/notificationService.ts`, change:
```typescript
channels: userPhone ? ['sms', 'email'] : ['email']
```
to:
```typescript
channels: ['email']
```

This way, all notifications will be sent via email only (which is already working).

---

**Need Help?** Run `python test-twilio.py` for detailed diagnostics!
