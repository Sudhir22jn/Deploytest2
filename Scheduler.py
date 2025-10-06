import win32com.client
import datetime

# Initialize Outlook
outlook = win32com.client.Dispatch("Outlook.Application")
namespace = outlook.GetNamespace("MAPI")

# Create appointment
meeting = outlook.CreateItem(1)  # 1 = olAppointmentItem

# --- User Inputs ---
subject = input("Enter meeting subject: ")
date_input = input("Enter meeting date (YYYY-MM-DD): ")
start_time_input = input("Enter start time (HH:MM, 24-hour format): ")
duration = int(input("Enter duration in minutes: "))
attendees_input = input("Enter attendee emails separated by commas: ")

# --- Process Inputs ---
start_datetime = datetime.datetime.strptime(f"{date_input} {start_time_input}", "%Y-%m-%d %H:%M")
attendees = [email.strip() for email in attendees_input.split(",")]

# --- Set Meeting Details ---
meeting.Subject = subject
meeting.Start = start_datetime
meeting.Duration = duration
meeting.Location = "Microsoft Teams Meeting"
meeting.Body = "This meeting is scheduled via Python script using your organization email."
meeting.MeetingStatus = 1  # olMeeting

# Add attendees
for email in attendees:
    meeting.Recipients.Add(email)

# Use the Teams add-in to make it online (must be installed in Outlook)
# This property is handled automatically if Teams add-in is enabled in Outlook

# Save and send meeting
meeting.Save()
meeting.Send()

print("✅ Teams meeting scheduled successfully!")
print("Check your Outlook calendar; a Teams link should be generated automatically if Teams is integrated.")
