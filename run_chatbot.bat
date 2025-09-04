@echo off

REM ================================

REM Universal Flask App Runner

REM (Python check + auto-venv + auto-install)

REM ================================
 
cd /d "%~dp0"
 
echo ----------------------------------------

echo 🚀 Starting Chatbot Flask Application...

echo ----------------------------------------
 
REM Step 0: Check if Python is installed

python --version >nul 2>&1

if errorlevel 1 (

    echo ❌ Python is not installed or not added to PATH.

    echo 🔗 Please download and install Python from:

    echo    https://www.python.org/downloads/

    echo ⚠️ Make sure to check "Add Python to PATH" during installation.

    pause

    exit /b

) else (

    for /f "tokens=2 delims= " %%v in ('python --version 2^>^&1') do set PY_VER=%%v

    echo ✅ Python %PY_VER% found.

)
 
REM Step 1: Check if venv exists

if exist "venv\Scripts\activate.bat" (

    echo 🔹 Virtual environment found. Activating...

    call venv\Scripts\activate

) else (

    echo ⚠️ No virtual environment found. Creating one...

    python -m venv venv

    if exist "venv\Scripts\activate.bat" (

        echo 🔹 Virtual environment created. Activating...

        call venv\Scripts\activate

    ) else (

        echo ❌ Failed to create virtual environment. Using system Python...

    )

)
 
REM Step 2: Upgrade pip & setuptools

echo 🔄 Upgrading pip, setuptools, and wheel...

python -m pip install --upgrade pip setuptools wheel
 
REM Step 3: Install dependencies

if exist requirements.txt (

    echo 📦 Installing dependencies from requirements.txt...

    python -m pip install -r requirements.txt

) else (

    echo ⚠️ requirements.txt not found. Installing Flask only...

    python -m pip install flask

)
 
REM Step 4: Run the Flask app

echo ----------------------------------------

echo ▶️ Launching Flask application...

echo ----------------------------------------

python main.py
 
echo ----------------------------------------

echo ✅ Chatbot stopped or exited with error.

echo ----------------------------------------

pause

Download Python | Python.org
The official home of the Python Programming Language
 