#!/usr/bin/env python3
"""
Setup script for Ollama and Llama3 model
This script helps users install and configure Ollama with the Llama3 model
"""

import subprocess
import sys
import platform
import requests
import time
import os

def run_command(command, shell=False):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=shell, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_ollama_installed():
    """Check if Ollama is already installed"""
    success, stdout, stderr = run_command(["ollama", "--version"])
    return success

def install_ollama():
    """Install Ollama based on the operating system"""
    system = platform.system().lower()
    
    print(f"Detected operating system: {system}")
    
    if system == "windows":
        print("For Windows, please download and install Ollama from:")
        print("https://ollama.ai/download")
        print("After installation, restart your terminal and run this script again.")
        return False
    
    elif system == "darwin":  # macOS
        print("Installing Ollama for macOS...")
        success, stdout, stderr = run_command([
            "curl", "-fsSL", "https://ollama.ai/install.sh", "|", "sh"
        ], shell=True)
        return success
    
    elif system == "linux":
        print("Installing Ollama for Linux...")
        success, stdout, stderr = run_command([
            "curl", "-fsSL", "https://ollama.ai/install.sh", "|", "sh"
        ], shell=True)
        return success
    
    else:
        print(f"Unsupported operating system: {system}")
        return False

def check_ollama_running():
    """Check if Ollama service is running"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False

def start_ollama():
    """Start the Ollama service"""
    print("Starting Ollama service...")
    system = platform.system().lower()
    
    if system == "windows":
        print("Please start Ollama manually from the Start menu or run 'ollama serve' in a new terminal.")
        return False
    else:
        # Try to start ollama in the background
        success, stdout, stderr = run_command(["ollama", "serve"], shell=False)
        if not success:
            print("Failed to start Ollama service. Please run 'ollama serve' manually.")
            return False
        
        # Wait a bit for the service to start
        time.sleep(3)
        return check_ollama_running()

def install_llama3():
    """Install the Llama3 model"""
    print("Installing Llama3 model (this may take several minutes)...")
    print("Model size: ~4.7GB - make sure you have sufficient disk space and internet connection.")
    
    success, stdout, stderr = run_command(["ollama", "pull", "llama3"])
    
    if success:
        print("✅ Llama3 model installed successfully!")
        return True
    else:
        print(f"❌ Failed to install Llama3 model: {stderr}")
        return False

def verify_installation():
    """Verify that everything is working correctly"""
    print("\n🔍 Verifying installation...")
    
    # Check if Ollama is running
    if not check_ollama_running():
        print("❌ Ollama service is not running")
        return False
    
    # Check if Llama3 model is available
    success, stdout, stderr = run_command(["ollama", "list"])
    if success and "llama3" in stdout:
        print("✅ Llama3 model is available")
        return True
    else:
        print("❌ Llama3 model not found")
        return False

def main():
    """Main setup function"""
    print("🚀 Mirah Voice - Ollama Setup Script")
    print("=" * 50)
    
    # Step 1: Check if Ollama is installed
    print("\n1. Checking Ollama installation...")
    if not check_ollama_installed():
        print("❌ Ollama is not installed")
        install_choice = input("Would you like to install Ollama? (y/n): ").lower().strip()
        
        if install_choice == 'y':
            if not install_ollama():
                print("❌ Failed to install Ollama. Please install it manually.")
                return False
            print("✅ Ollama installed successfully!")
        else:
            print("Please install Ollama manually and run this script again.")
            return False
    else:
        print("✅ Ollama is already installed")
    
    # Step 2: Check if Ollama service is running
    print("\n2. Checking Ollama service...")
    if not check_ollama_running():
        print("❌ Ollama service is not running")
        if not start_ollama():
            print("❌ Failed to start Ollama service")
            return False
    else:
        print("✅ Ollama service is running")
    
    # Step 3: Install Llama3 model
    print("\n3. Checking Llama3 model...")
    success, stdout, stderr = run_command(["ollama", "list"])
    if success and "llama3" in stdout:
        print("✅ Llama3 model is already installed")
    else:
        print("❌ Llama3 model not found")
        install_choice = input("Would you like to install Llama3 model? (y/n): ").lower().strip()
        
        if install_choice == 'y':
            if not install_llama3():
                print("❌ Failed to install Llama3 model")
                return False
        else:
            print("Please install Llama3 model manually: ollama pull llama3")
            return False
    
    # Step 4: Verify installation
    if verify_installation():
        print("\n🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Start the backend server: cd backend && python main.py")
        print("2. Start the frontend: cd frontend && npm run dev")
        print("3. Open http://localhost:3000 in your browser")
        return True
    else:
        print("\n❌ Setup verification failed")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nSetup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
