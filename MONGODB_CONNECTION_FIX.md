# 🔧 MongoDB Connection Fix

## ❌ Problem: Cannot Connect to MongoDB

MongoDB service is **stopped** and needs administrator privileges to start.

---

## ✅ Quick Fix (Choose One Method)

### Method 1: Use Batch File (Easiest)
1. **Right-click** on `start-mongodb.bat`
2. Select **"Run as administrator"**
3. Click "Yes" when prompted
4. MongoDB will start!

### Method 2: PowerShell (Administrator)
1. **Right-click** PowerShell
2. Select **"Run as administrator"**
3. Run this command:
   ```powershell
   Start-Service -Name MongoDB
   ```

### Method 3: Services App
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find **"MongoDB Server (MongoDB)"**
4. Right-click → **Start**

### Method 4: Command Prompt (Administrator)
1. **Right-click** Command Prompt
2. Select **"Run as administrator"**
3. Run:
   ```cmd
   net start MongoDB
   ```

---

## 🔍 Verify MongoDB is Running

After starting, verify with:
```powershell
Get-Service -Name MongoDB
```

Should show:
```
Status   Name      DisplayName
------   ----      -----------
Running  MongoDB   MongoDB Server (MongoDB)
```

---

## 🧪 Test Connection

### Test 1: Check if MongoDB is listening
```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```

Should show: `TcpTestSucceeded : True`

### Test 2: Connect with MongoDB Shell
```bash
mongosh
# or
mongo
```

Should connect to: `mongodb://localhost:27017`

---

## 🚨 Common Issues & Solutions

### Issue 1: "Access Denied" or "Cannot open MongoDB service"
**Problem**: Need administrator privileges

**Solution**:
- Run PowerShell/CMD as Administrator
- Or use the batch file with "Run as administrator"

### Issue 2: MongoDB Service Not Found
**Problem**: MongoDB not installed

**Solution**:
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install as Windows Service
3. Restart computer

### Issue 3: Port 27017 Already in Use
**Problem**: Another process using the port

**Solution**:
```powershell
# Find what's using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Start MongoDB again
Start-Service -Name MongoDB
```

### Issue 4: MongoDB Crashes on Start
**Problem**: Corrupted data or config

**Solution**:
1. Check MongoDB logs:
   - Location: `C:\Program Files\MongoDB\Server\<version>\log\`
2. Look for error messages
3. May need to repair database:
   ```cmd
   mongod --repair
   ```

### Issue 5: "Connection Refused" Error
**Problem**: MongoDB not listening on correct port

**Solution**:
1. Check MongoDB config file:
   - Location: `C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg`
2. Verify `port: 27017` is set
3. Restart MongoDB service

---

## 🔄 Auto-Start MongoDB on Boot

To make MongoDB start automatically:

### Method 1: Services
1. Open `services.msc`
2. Find "MongoDB Server"
3. Right-click → Properties
4. Set "Startup type" to **"Automatic"**
5. Click Apply

### Method 2: PowerShell (Admin)
```powershell
Set-Service -Name MongoDB -StartupType Automatic
```

---

## 📊 Check MongoDB Status

### Current Status:
```powershell
Get-Service -Name MongoDB | Select-Object Status, StartType
```

### Detailed Info:
```powershell
Get-Service -Name MongoDB | Format-List *
```

---

## 🔌 Connection String

Your application uses:
```
mongodb://localhost:27017/educareer
```

**Components**:
- Host: `localhost`
- Port: `27017`
- Database: `educareer`

---

## 🛠️ MongoDB Installation Check

### Check if MongoDB is installed:
```powershell
# Check MongoDB version
mongod --version

# Check if service exists
Get-Service -Name MongoDB
```

### If not installed:
1. Download: https://www.mongodb.com/try/download/community
2. Choose: Windows x64
3. Install with "Install MongoDB as a Service" checked
4. Complete setup wizard

---

## 📝 After Starting MongoDB

Once MongoDB is running, restart your backend:

1. **Stop backend** (if running)
2. **Start MongoDB** (using methods above)
3. **Start backend**:
   ```bash
   cd educareer/server
   npm run dev
   ```

You should see:
```
Server running on port 5000
Connected to MongoDB ✅
```

---

## 🎯 Quick Checklist

- [ ] MongoDB service is installed
- [ ] Run start command as Administrator
- [ ] MongoDB service shows "Running" status
- [ ] Port 27017 is accessible
- [ ] Backend connects successfully
- [ ] No error messages in logs

---

## 💡 Pro Tips

1. **Always run as Administrator** when starting MongoDB
2. **Set to auto-start** to avoid this issue
3. **Check logs** if connection fails
4. **Restart computer** if service won't start
5. **Check firewall** if remote connections fail

---

## 🆘 Still Not Working?

If MongoDB still won't start:

1. **Check Event Viewer**:
   - Press `Win + X` → Event Viewer
   - Windows Logs → Application
   - Look for MongoDB errors

2. **Reinstall MongoDB**:
   - Uninstall current version
   - Download latest version
   - Install with "Service" option

3. **Check System Requirements**:
   - Windows 10/11 or Server 2016+
   - 64-bit system
   - Sufficient disk space

---

## 📞 Need More Help?

Check these logs:
- MongoDB logs: `C:\Program Files\MongoDB\Server\<version>\log\mongod.log`
- Backend logs: Check terminal where backend is running
- Windows Event Viewer: Application logs

---

**TL;DR**: Right-click `start-mongodb.bat` → Run as administrator → MongoDB starts! 🚀
