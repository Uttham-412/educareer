# 📧 Email Notification Setup Guide

## Why You're Not Getting Email Notifications

Email notifications require SMTP server credentials to be configured. Currently, the system is set up but needs your email credentials to actually send emails.

---

## 🔧 Quick Setup (Gmail)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or Other)
3. Click "Generate"
4. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update Configuration
Edit the file: `educareer/ai-backend/.env`

Replace these lines:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

With your actual credentials:
```env
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Restart AI Backend
Stop and restart the AI backend service for changes to take effect.

---

## 🔄 Alternative: Use Other Email Providers

### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo Mail
```env
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### Custom SMTP Server
```env
SMTP_SERVER=smtp.yourdomain.com
SMTP_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

---

## 📱 SMS/WhatsApp Notifications (Optional)

To enable SMS and WhatsApp notifications, you need a Twilio account:

### Step 1: Create Twilio Account
1. Sign up at: https://www.twilio.com/try-twilio
2. Get $15 free credit for testing

### Step 2: Get Credentials
1. Go to Twilio Console: https://console.twilio.com/
2. Copy your Account SID and Auth Token
3. Get a phone number from Twilio

### Step 3: Update Configuration
Edit `educareer/ai-backend/.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: WhatsApp Setup (Optional)
1. Join Twilio WhatsApp Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Send the join code from your WhatsApp
3. Update the WhatsApp number in `.env`

---

## 🧪 Testing Email Notifications

### Method 1: Test via API
```bash
curl -X POST http://localhost:8000/api/v1/notifications/send-multi \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "your-email@gmail.com",
    "subject": "Test Email",
    "message": "This is a test notification from EduCareer AI",
    "channels": ["email"]
  }'
```

### Method 2: Test by Logging In
1. Register a new account with your email
2. Log in - you should receive a login notification email
3. Check your inbox (and spam folder)

---

## 🐛 Troubleshooting

### "SMTP credentials not set"
- Make sure you've updated the `.env` file with your credentials
- Restart the AI backend after making changes

### "Authentication failed"
- For Gmail: Make sure you're using an App Password, not your regular password
- Check that 2-Factor Authentication is enabled
- Verify the email and password are correct

### "Connection timeout"
- Check your firewall settings
- Verify SMTP_SERVER and SMTP_PORT are correct
- Some networks block SMTP ports (587, 465)

### Emails going to spam
- This is normal for development
- In production, you'd need to:
  - Set up SPF, DKIM, and DMARC records
  - Use a dedicated email service (SendGrid, AWS SES, etc.)
  - Verify your domain

### Still not working?
1. Check the AI backend logs for error messages
2. Try with a different email provider
3. Test with the curl command above to see detailed error messages

---

## 🚀 Production Recommendations

For production use, consider using dedicated email services instead of SMTP:

### SendGrid (Recommended)
- Free tier: 100 emails/day
- Easy setup with API key
- Better deliverability

### AWS SES
- Very cheap ($0.10 per 1000 emails)
- Requires AWS account
- Excellent for high volume

### Mailgun
- Free tier: 5,000 emails/month
- Simple API
- Good documentation

---

## 📝 Current Status

**Email Notifications**: ⚠️ Not configured (needs SMTP credentials)
**SMS Notifications**: ⚠️ Not configured (needs Twilio account)
**WhatsApp Notifications**: ⚠️ Not configured (needs Twilio account)

Once you configure the credentials and restart the AI backend, notifications will work automatically!

---

## 🎯 What Notifications You'll Get

Once configured, you'll receive notifications for:
- ✅ Welcome email when you register
- 🔐 Login alerts
- 📝 Profile completion reminders
- 📚 Timetable upload confirmations
- 🎓 New course recommendations
- 💼 Job matches
- 📅 Assignment deadlines
- 🎯 Application status updates

---

**Need Help?** Check the AI backend logs at the terminal where it's running for detailed error messages.
