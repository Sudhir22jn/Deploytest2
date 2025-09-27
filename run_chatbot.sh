#!/bin/bash

# ================================
# Universal Flask App Runner (Linux)
# ================================

# Move to the script's directory
cd "$(dirname "$0")"

echo "----------------------------------------"
echo "🚀 Starting Chatbot Flask Application..."
echo "----------------------------------------"

# Step 0: Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed or not in PATH."
    echo "🔗 Please install it with your package manager, e.g.:"
    echo "    sudo apt install python3 python3-venv python3-pip"
    exit 1
else
    PY_VER=$(python3 --version 2>&1)
    echo "✅ $PY_VER found."
fi

# Step 1: Check if venv exists
if [ -d "venv" ]; then
    echo "🔹 Virtual environment found. Activating..."
else
    echo "⚠️ No virtual environment found. Creating..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Step 2: Install requirements if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
else
    echo "⚠️ No requirements.txt found. Skipping dependency installation."
fi

# Step 3: Run Flask app
echo "🚀 Running Flask app..."
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5000
