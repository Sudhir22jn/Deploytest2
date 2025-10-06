# outlook_scheduler.py
import win32com.client
import datetime

def schedule_teams_meeting(subject, date_input, start_time_input, duration, attendees_input):
    """
    Schedule a Microsoft Teams meeting via Outlook.

    Args:
        subject (str): Meeting subject/title.
        date_input (str): Meeting date in "YYYY-MM-DD" format.
        start_time_input (str): Start time in "HH:MM" 24-hour format.
        duration (int): Duration of the meeting in minutes.
        attendees_input (str): Comma-separated list of attendee emails.

    Returns:
        dict: {"success": bool, "message": str}
    """
    try:
        # Initialize Outlook
        outlook = win32com.client.Dispatch("Outlook.Application")
        meeting = outlook.CreateItem(1)  # 1 = olAppointmentItem

        # Process date and time
        start_datetime = datetime.datetime.strptime(f"{date_input} {start_time_input}", "%Y-%m-%d %H:%M")
        attendees = [email.strip() for email in attendees_input.split(",")]

        # Set meeting details
        meeting.Subject = subject
        meeting.Start = start_datetime
        meeting.Duration = duration
        meeting.Location = "Microsoft Teams Meeting"
        meeting.Body = "This meeting is scheduled via Python script using your organization email."
        meeting.MeetingStatus = 1  # olMeeting

        # Add attendees
        for email in attendees:
            meeting.Recipients.Add(email)

        # Save and send meeting
        meeting.Save()
        meeting.Send()

        return {"success": True, "message": "✅ Teams meeting scheduled successfully!"}

    except Exception as e:
        return {"success": False, "message": f"❌ Failed to schedule meeting: {e}"}

# ---------------------------
# Optional CLI Testing
# ---------------------------
if __name__ == "__main__":
    print("📅 Outlook Teams Scheduler CLI Test\n")
    subject = input("Enter meeting subject: ")
    date_input = input("Enter meeting date (YYYY-MM-DD): ")
    start_time_input = input("Enter start time (HH:MM, 24-hour format): ")
    duration = int(input("Enter duration in minutes: "))
    attendees_input = input("Enter attendee emails separated by commas: ")

    result = schedule_teams_meeting(subject, date_input, start_time_input, duration, attendees_input)
    print(result["message"])
