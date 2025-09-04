from flask import Flask, render_template, request, jsonify
import json
from command import commands  # Import the commands dictionary

# Path to JSON file
file_paths = r"D:\Git Projects\AI Chatbot\AIChatbot\responses.json"


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


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('user_input', '').lower()
    print(f"User input: {user_input}")  # Log user input
    responses = load_responses(file_paths)

    if not responses:
        return jsonify({'response': "I cannot start without responses. Please check the JSON file."})

    # Check for exact matches in conversational responses
    response = responses.get(user_input, None)

    # If no conversational match, check for commands
    if response is None:  # No match found
        for keyword, command in commands.items():
            if keyword in user_input:
                response = command() if callable(command) else command
                break

    if response is None:  # If still no match, use default response
        response = responses.get("default", "I'm sorry, I don't understand that.")

    print(f"Bot response: {response}")  # Log bot response
    return jsonify({'response': response})


if __name__ == "__main__":
    app.run(debug=True)
