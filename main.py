from flask import Flask, render_template, request, jsonify
import json
import sqlite3
from command import commands          # Import the commands dictionary
from qanstest import get_qan_answer  # Import QA function
from datetime import datetime, timedelta
from outlook_scheduler import schedule_teams_meeting


# Path to JSON file
file_paths = r"C:\Users\Administrator\PycharmProjects\chatbotUI\responses.json"

def load_responses(file_paths):
    """Load responses from a JSON file."""
    try:
        with open(file_paths, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: The file '{file_paths}' was not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: The file '{file_paths}' contains invalid JSON.")
        return {}

app = Flask(__name__)

@app.route('/')  # URL path http://localhost:5000/
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])  # URL path http://localhost:5000/chat
def chat():
    user_input = request.json.get('user_input', '').lower()
    print(f"User input: {user_input}")  # Log user input

    responses = load_responses(file_paths)
    if not responses:
        return jsonify({'response': "I cannot start without responses. Please check the JSON file."})

    # 1️⃣ Check for exact matches in JSON responses
    response = responses.get(user_input)

    # 2️⃣ Check for commands if no exact match
    if response is None:
        for keyword, command in commands.items():
            if keyword in user_input:
                response = command() if callable(command) else command
                break
    # 3️⃣ Check scheduling keywords BEFORE AI
    # List of phrases (full strings or parts of sentences) to detect scheduling intent
    schedule_strings = [
        "schedule a call",
        "book a meeting",
        "connect with executive",
        "talk to representative",
        "schedule a meeting",
        "i want to schedule a call",
        "can we have a demo"
    ]

    user_input_lower = user_input.lower()

    # Check if user input contains any of the full phrases
    if any(phrase in user_input_lower for phrase in schedule_strings):
        response = "📅 Do you want me to schedule a call with our executive? Please provide name, email, phone, and preferred time."

    # 3️⃣ Fallback to QA function if still no match
    if response is None:
        response = get_qan_answer(user_input)

    # 4️⃣ Use default response if QA returns nothing
    if not response:
        response = responses.get("default", "I'm sorry, I don't understand that.")

    print(f"Bot response: {response}")  # Log bot response
    return jsonify({'response': response})

# Initialize DB
def init_db():
    conn = sqlite3.connect("scheduler.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS schedule_calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        time_from TEXT,
        time_to TEXT
    )''')
    conn.commit()
    conn.close()

init_db()

@app.route("/submit_schedule", methods=["POST"])
def submit_schedule():
    data = request.get_json()
    try:
        # Extract fields
        name = data["name"]
        email = data["email"]
        phone = data["phone"]
        date = data["date"]  # e.g., "2025-10-10"
        time = data["time"]  # e.g., "14:30"
        duration = int(data["duration"])  # in minutes

        # Combine date and time into datetime object
        time_from = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

        # Calculate end time
        time_to = time_from + timedelta(minutes=duration)

        # Store in ISO format (e.g., "2025-10-10T14:30:00")
        time_from_str = time_from.isoformat()
        time_to_str = time_to.isoformat()

        # Save to DB
        # Call Outlook scheduler
        result = schedule_teams_meeting(
            subject=f"Call with {name}",
            date_input=date,
            start_time_input=time,
            duration=duration,
            attendees_input=email
        )

        # Optionally save to DB only if meeting scheduled successfully
        if result.get("success"):
            conn = sqlite3.connect("scheduler.db")
            c = conn.cursor()
            c.execute("""
                INSERT INTO schedule_calls (name, email, phone, time_from, time_to)
                VALUES (?, ?, ?, ?, ?)
            """, (name, email, phone, time_from_str, time_to_str))
            conn.commit()
            conn.close()

        return jsonify(result)

    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render assigns this in production
    app.run(host="0.0.0.0", port=port)

