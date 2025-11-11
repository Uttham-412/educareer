#!/usr/bin/env node

/**
 * Quick Setup Script for EduCareer AI
 * This script helps you configure the basic environment variables
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 EduCareer AI Quick Setup');
console.log('============================\n');

const config = {};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setup() {
  try {
    console.log('📋 Let\'s configure your EduCareer AI platform!\n');

    // Basic configuration
    console.log('🔧 Basic Configuration (Required):\n');

    config.mongoUri = await askQuestion('MongoDB URI (press Enter for local): ') || 'mongodb://localhost:27017/edu-career-ai';
    
    const generateJWT = await askQuestion('Generate JWT secret automatically? (y/n): ');
    if (generateJWT.toLowerCase() === 'y' || generateJWT === '') {
      config.jwtSecret = crypto.randomBytes(64).toString('hex');
      console.log('✅ JWT secret generated automatically\n');
    } else {
      config.jwtSecret = await askQuestion('Enter JWT secret (64+ characters): ');
    }

    config.emailUser = await askQuestion('Gmail address for notifications: ');
    config.emailPassword = await askQuestion('Gmail App Password (16 characters): ');

    // Optional configuration
    console.log('\n🌟 Optional Configuration (press Enter to skip):\n');

    config.githubToken = await askQuestion('GitHub Personal Access Token: ');
    config.twilioSid = await askQuestion('Twilio Account SID: ');
    config.twilioToken = await askQuestion('Twilio Auth Token: ');

    // Create environment files
    console.log('\n📝 Creating environment files...\n');

    // Frontend .env
    const frontendEnv = `VITE_API_URL=http://localhost:5000/api
VITE_AI_API_URL=http://localhost:8000/api/v1`;

    fs.writeFileSync('.env', frontendEnv);
    console.log('✅ Created frontend .env');

    // Server .env
    const serverEnv = `MONGODB_URI=${config.mongoUri}
JWT_SECRET=${config.jwtSecret}
PORT=5000
NODE_ENV=development`;

    fs.writeFileSync('server/.env', serverEnv);
    console.log('✅ Created server/.env');

    // AI Backend .env
    const aiBackendEnv = `# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/educareer_ai
MONGODB_URI=${config.mongoUri}

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=${config.emailUser}
EMAIL_PASSWORD=${config.emailPassword}

# Optional Services
TWILIO_ACCOUNT_SID=${config.twilioSid}
TWILIO_AUTH_TOKEN=${config.twilioToken}
REDIS_URL=redis://localhost:6379
GITHUB_TOKEN=${config.githubToken}

# AI Model Configuration
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
BERT_MODEL=distilbert-base-uncased

# File Storage
UPLOAD_DIR=uploads
RESUME_OUTPUT_DIR=resumes`;

    fs.writeFileSync('ai-backend/.env', aiBackendEnv);
    console.log('✅ Created ai-backend/.env');

    console.log('\n🎉 Setup Complete!\n');
    console.log('Next steps:');
    console.log('1. Start MongoDB: mongod (or start MongoDB service)');
    console.log('2. Install dependencies:');
    console.log('   - Frontend: npm install');
    console.log('   - Server: cd server && npm install');
    console.log('   - AI Backend: cd ai-backend && pip install -r requirements.txt');
    console.log('3. Start the services:');
    console.log('   - Frontend: npm run dev');
    console.log('   - Server: cd server && npm run dev');
    console.log('   - AI Backend: cd ai-backend && python main.py');
    console.log('\n📚 For detailed configuration, see CONFIGURATION_GUIDE.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setup();