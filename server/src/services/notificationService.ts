import axios from 'axios';

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';

interface NotificationOptions {
  userPhone?: string;
  userEmail?: string;
  subject?: string;
  message: string;
  channels?: ('sms' | 'email' | 'whatsapp')[];
}

export async function sendNotification(options: NotificationOptions): Promise<boolean> {
  try {
    const response = await axios.post(`${AI_BACKEND_URL}/api/v1/notifications/send-multi`, {
      user_phone: options.userPhone,
      user_email: options.userEmail,
      subject: options.subject || 'EduCareer AI Notification',
      message: options.message,
      channels: options.channels || ['sms', 'email']
    });

    console.log('Notification sent:', response.data);
    return response.data.success || false;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

export async function sendLoginNotification(userEmail: string, userName?: string, userPhone?: string): Promise<void> {
  const message = `Hello ${userName || 'there'}! You've successfully logged into EduCareer AI. If this wasn't you, please secure your account immediately.`;
  
  await sendNotification({
    userEmail,
    userPhone,
    subject: '🔐 Login Alert - EduCareer AI',
    message,
    channels: userPhone ? ['sms', 'email'] : ['email']
  });
}

export async function sendProfileIncompleteNotification(userEmail: string, userName?: string, userPhone?: string): Promise<void> {
  const message = `Hi ${userName || 'there'}! Your EduCareer AI profile is incomplete. Complete your profile to get personalized course and job recommendations. Visit your account page to update your information.`;
  
  await sendNotification({
    userEmail,
    userPhone,
    subject: '📝 Complete Your Profile - EduCareer AI',
    message,
    channels: userPhone ? ['sms'] : ['email']
  });
}

export async function sendWelcomeNotification(userEmail: string, userName?: string, userPhone?: string): Promise<void> {
  const message = `Welcome to EduCareer AI, ${userName || 'there'}! 🎉 We're excited to help you bridge the gap between education and career. Start by uploading your timetable to get personalized recommendations!`;
  
  await sendNotification({
    userEmail,
    userPhone,
    subject: '🎉 Welcome to EduCareer AI!',
    message,
    channels: userPhone ? ['sms', 'email'] : ['email']
  });
}

export async function sendTimetableUploadNotification(userEmail: string, coursesCount: number, userPhone?: string): Promise<void> {
  const message = `Great! Your timetable has been processed successfully. We found ${coursesCount} courses and are now finding the best recommendations for you. Check your Opportunities page!`;
  
  await sendNotification({
    userEmail,
    userPhone,
    subject: '✅ Timetable Processed - EduCareer AI',
    message,
    channels: userPhone ? ['sms'] : ['email']
  });
}

export async function sendNewRecommendationsNotification(userEmail: string, count: number, userPhone?: string): Promise<void> {
  const message = `🎓 We found ${count} new course recommendations based on your profile! Check them out in the Opportunities section.`;
  
  await sendNotification({
    userEmail,
    userPhone,
    subject: '🎓 New Recommendations Available!',
    message,
    channels: userPhone ? ['sms'] : ['email']
  });
}

export async function sendJobMatchNotification(userEmail: string, jobTitle: string, company: string, userPhone?: string): Promise<void> {
  const message = `🎯 New job match! ${jobTitle} at ${company} matches your profile. Apply now before the deadline!`;
  
  await sendNotification({
    userEmail,
    userPhone,
    subject: '🎯 New Job Match - EduCareer AI',
    message,
    channels: userPhone ? ['sms', 'email'] : ['email']
  });
}

export function checkProfileCompleteness(user: any): { complete: boolean; missingFields: string[] } {
  const requiredFields = ['firstName', 'lastName', 'bio', 'skills', 'experienceLevel', 'occupation'];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!user[field] || (Array.isArray(user[field]) && user[field].length === 0)) {
      missingFields.push(field);
    }
  }

  return {
    complete: missingFields.length === 0,
    missingFields
  };
}
