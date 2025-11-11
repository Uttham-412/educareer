# 📱 SMS Notifications with Twilio - Implementation Guide

## ✅ What's Implemented

I've added comprehensive SMS notification support using Twilio for the following events:

### **Automatic Notifications**

1. **🔐 Login Notification**
   - Sent when user logs in
   - Channels: SMS + Email
   - Purpose: Security alert

2. **🎉 Welcome Notification**
   - Sent when user registers
   - Channels: Email (SMS if phone provided)
   - Purpose: Onboarding

3. **📝 Profile Incomplete Notification**
   - Sent when user logs in with incomplete profile
   - Channels: SMS (if phone provided)
   - Purpose: Encourage profile completion

4. **✅ Timetable Upload Notification**
   - Sent after timetable is processed
   - Channels: SMS or Email
   - Purpose: Confirmation

5. **🎓 New Recommendations Notification**
   - Sent when new course recommendations are available
   - Channels: SMS or Email
   - Purpose: Engagement

6. **🎯 Job Match Notification**
   - Sent when a job matches user profile
   - Channels: SMS + Email
   - Purpose: Opportunity alert

---

## 🔧 Configuration

### **1. Twilio Setup**

1. **Sign up for Twilio**: https://www.twilio.com/try-twilio
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Phone Number

3. **Add to `.env` file**:

```env
# AI Backend (.env)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### **2. User Phone Number**

Users need to add their phone number in their profile:
- Go to Account page
- Add phone number with country code (e.g., +1234567890)
- Save profile

---

## 📊 How It Works

### **Flow Diagram**

```
User Action (Login/Register/Upload)
         ↓
Backend detects event
         ↓
Calls notification service
         ↓
AI Backend sends SMS via Twilio
         ↓
User receives SMS
```

### **Code Flow**

1. **User logs in** → `auth.ts`
2. **Backend calls** → `notificationService.ts`
3. **Service calls** → AI Backend `/api/v1/notifications/send-multi`
4. **AI Backend uses** → `notification_service.py`
5. **Twilio sends** → SMS to user's phone

---

## 🧪 Testing

### **Test SMS Notification**

```bash
# Test via API
curl -X POST http://localhost:8000/api/v1/notifications/send-multi \
  -H "Content-Type: application/json" \
  -d '{
    "user_phone": "+1234567890",
    "user_email": "test@example.com",
    "subject": "Test Notification",
    "message": "This is a test SMS from EduCareer AI!",
    "channels": ["sms"]
  }'
```

### **Test Login Notification**

1. Add your phone number to your profile
2. Logout
3. Login again
4. Check your phone for SMS

### **Test Profile Incomplete Notification**

1. Create account without completing profile
2. Login
3. Check your phone for SMS reminder

---

## 📝 Notification Messages

### **Login Alert**
```
Hello [Name]! You've successfully logged into EduCareer AI. 
If this wasn't you, please secure your account immediately.
```

### **Welcome Message**
```
Welcome to EduCareer AI, [Name]! 🎉 We're excited to help you 
bridge the gap between education and career. Start by uploading 
your timetable to get personalized recommendations!
```

### **Profile Incomplete**
```
Hi [Name]! Your EduCareer AI profile is incomplete. Complete 
your profile to get personalized course and job recommendations. 
Visit your account page to update your information.
```

### **Timetable Processed**
```
Great! Your timetable has been processed successfully. We found 
[X] courses and are now finding the best recommendations for you. 
Check your Opportunities page!
```

### **New Recommendations**
```
🎓 We found [X] new course recommendations based on your profile! 
Check them out in the Opportunities section.
```

### **Job Match**
```
🎯 New job match! [Job Title] at [Company] matches your profile. 
Apply now before the deadline!
```

---

## 🎯 API Endpoints

### **Send Multi-Channel Notification**

```http
POST /api/v1/notifications/send-multi
Content-Type: application/json

{
  "user_phone": "+1234567890",
  "user_email": "user@example.com",
  "subject": "Notification Subject",
  "message": "Your message here",
  "channels": ["sms", "email", "whatsapp"]
}
```

**Response**:
```json
{
  "success": true,
  "results": {
    "sms": true,
    "email": true,
    "whatsapp": false
  },
  "message": "Notifications sent"
}
```

---

## 💰 Twilio Pricing

### **Free Trial**
- $15.50 credit
- ~500 SMS messages
- Perfect for testing

### **Pay-as-you-go**
- SMS: $0.0075 per message (US)
- WhatsApp: $0.005 per message
- No monthly fees

### **Cost Optimization**
- Use SMS only for critical notifications
- Use email for non-urgent notifications
- Batch notifications when possible
- Set user preferences

---

## 🔒 Security & Privacy

### **Best Practices**

1. **Phone Number Validation**
   - Validate format before sending
   - Use international format (+country code)

2. **Rate Limiting**
   - Limit SMS per user per day
   - Prevent spam

3. **User Preferences**
   - Allow users to opt-out
   - Respect notification preferences

4. **Data Protection**
   - Don't log phone numbers in plain text
   - Encrypt sensitive data
   - Comply with GDPR/privacy laws

---

## 🛠️ Troubleshooting

### **Issue: SMS not sending**

**Check**:
1. Twilio credentials are correct
2. Phone number has country code (+1234567890)
3. Twilio account has credit
4. Phone number is verified (trial accounts)

**Solution**:
```bash
# Test Twilio connection
curl -X GET "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json" \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
```

### **Issue: "Unverified number" error**

**For Trial Accounts**:
- Verify recipient phone numbers in Twilio console
- Or upgrade to paid account

### **Issue: SMS delayed**

**Possible Causes**:
- Network congestion
- Carrier delays
- Twilio queue

**Solution**:
- Check Twilio logs
- Retry after a few minutes

---

## 📊 Monitoring

### **Check Notification Logs**

```bash
# View notification history
curl http://localhost:8000/api/v1/notifications/history/USER_ID
```

### **Twilio Dashboard**

- View sent messages
- Check delivery status
- Monitor costs
- View error logs

---

## 🚀 Production Checklist

- [ ] Add Twilio credentials to production `.env`
- [ ] Upgrade Twilio account (remove trial limitations)
- [ ] Set up phone number verification
- [ ] Configure rate limiting
- [ ] Add user notification preferences
- [ ] Set up monitoring and alerts
- [ ] Test all notification types
- [ ] Add unsubscribe functionality
- [ ] Comply with SMS regulations (TCPA, GDPR)
- [ ] Set up error handling and retries

---

## 📚 Additional Features

### **Coming Soon**

1. **Notification Preferences**
   - User can choose channels
   - Set quiet hours
   - Frequency settings

2. **Scheduled Notifications**
   - Daily digest
   - Weekly summary
   - Custom schedules

3. **Rich Notifications**
   - MMS with images
   - Interactive buttons
   - Deep links to app

4. **Analytics**
   - Delivery rates
   - Open rates
   - User engagement

---

## 🔗 Resources

- **Twilio Docs**: https://www.twilio.com/docs/sms
- **Twilio Console**: https://console.twilio.com
- **SMS Best Practices**: https://www.twilio.com/docs/sms/best-practices
- **Pricing**: https://www.twilio.com/sms/pricing

---

**Status**: ✅ Fully implemented and ready to use!

**Note**: Remember to add your phone number to your profile to receive SMS notifications.
