#!/usr/bin/env python3
"""
Setup script for EduCareer AI Backend
This script installs required dependencies and sets up the environment
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def main():
    print("🚀 Setting up EduCareer AI Backend...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {sys.version} detected")
    
    # Create virtual environment
    if not os.path.exists("venv"):
        if not run_command("python -m venv venv", "Creating virtual environment"):
            sys.exit(1)
    
    # Activate virtual environment and install dependencies
    if sys.platform == "win32":
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    # Upgrade pip
    run_command(f"{pip_cmd} install --upgrade pip", "Upgrading pip")
    
    # Install Python dependencies
    if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing Python dependencies"):
        print("⚠️  Some dependencies failed to install. Trying individual installation...")
        
        # Core dependencies that must work
        core_deps = [
            "fastapi==0.104.1",
            "uvicorn==0.24.0",
            "python-multipart==0.0.6",
            "sqlalchemy==2.0.23",
            "alembic==1.12.1",
            "pydantic==2.5.0",
            "python-dotenv==1.0.0",
            "requests==2.31.0",
            "numpy==1.25.2",
            "pandas==2.1.3"
        ]
        
        for dep in core_deps:
            run_command(f"{pip_cmd} install {dep}", f"Installing {dep}")
    
    # Download spaCy model
    run_command(f"{python_cmd} -m spacy download en_core_web_sm", "Downloading spaCy English model")
    
    # Create necessary directories
    directories = ["uploads", "resumes", "models", "app/templates/resume"]
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")
    
    # Copy environment file
    if not os.path.exists(".env"):
        if os.path.exists(".env.example"):
            import shutil
            shutil.copy(".env.example", ".env")
            print("📄 Created .env file from .env.example")
            print("⚠️  Please edit .env file with your configuration")
        else:
            print("⚠️  No .env.example found. Please create .env file manually")
    
    print("\n🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your configuration")
    print("2. Set up PostgreSQL database (optional, MongoDB is primary)")
    print("3. Configure email/SMS services in .env")
    print("4. Run: python main.py")
    print("\n🔗 The API will be available at: http://localhost:8000")
    print("📚 API documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()