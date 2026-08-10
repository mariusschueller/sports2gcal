# sports2gcal

A small Google Apps Script that fetches schedules for selected sports teams from ESPN and creates upcoming game events in your default Google Calendar.

## What it does

- Looks up team metadata using ESPN search API
- Fetches the current season schedule for each configured team
- Creates calendar events for future games only
- Skips duplicates when an event with the same title already exists in the game time window

## Repository contents

- `/home/runner/work/sports2gcal/sports2gcal/main.gs`: Main Google Apps Script source

## Prerequisites

- A Google account with access to Google Calendar
- Google Apps Script project
- Permissions for:
  - `UrlFetchApp` (external HTTP requests)
  - `CalendarApp` (calendar event creation)

## Setup

1. Open [Google Apps Script](https://script.google.com/) and create a new project.
2. Copy the contents of `/home/runner/work/sports2gcal/sports2gcal/main.gs` into the script editor.
3. In the `teams` array, set the teams you want to track.
4. Save the project.

## Usage

1. Run the `main()` function.
2. Authorize required permissions when prompted.
3. Check logs (`View -> Logs`) for progress and errors.

Optional: Create a time-driven trigger for `main()` to keep your calendar synced.

## Notes and limitations

- Events are created in your **default** Google Calendar.
- Event duration is fixed at 2.5 hours.
- Team matching depends on ESPN search results.
- Duplicate detection uses event title and overlapping start/end window.
